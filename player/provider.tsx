import { createContext, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react'
import { JellifyTrack } from '../types/JellifyTrack'
import { storage } from '../constants/storage'
import { MMKVStorageKeys } from '../enums/mmkv-storage-keys'
import { findPlayNextIndexStart, findPlayQueueIndexStart } from './helpers/index'
import TrackPlayer, {
	Event,
	State,
	usePlaybackState,
	useTrackPlayerEvents,
} from 'react-native-track-player'
import { isEqual, isUndefined } from 'lodash'
import { handlePlaybackProgressUpdated, handlePlaybackState } from './handlers'
import { useUpdateOptions } from '../player/hooks'
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { mapDtoToTrack } from '../helpers/mappings'
import { QueuingType } from '../enums/queuing-type'
import { trigger } from 'react-native-haptic-feedback'
import {
	getActiveTrackIndex,
	getQueue,
	pause,
	seekTo,
	skip,
	skipToNext,
	skipToPrevious,
} from 'react-native-track-player/lib/src/trackPlayer'
import { convertRunTimeTicksToSeconds } from '../helpers/runtimeticks'
import Client from '../api/client'
import { AddToQueueMutation, QueueMutation, QueueOrderMutation } from './interfaces'
import { Section } from '../components/Player/types'
import { Queue } from './types/queue-item'

import * as Burnt from 'burnt'
import { markItemPlayed } from '../api/mutations/functions/item'
import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models'
import { getPlaystateApi } from '@jellyfin/sdk/lib/utils/api'
import { SKIP_TO_PREVIOUS_THRESHOLD } from './config'
import { useNetworkContext } from '../components/Network/provider'

interface PlayerContext {
	initialized: boolean
	nowPlayingIsFavorite: boolean
	setNowPlayingIsFavorite: React.Dispatch<SetStateAction<boolean>>
	nowPlaying: JellifyTrack | undefined
	playQueue: JellifyTrack[]
	queue: Queue
	getQueueSectionData: () => Section[]
	useAddToQueue: UseMutationResult<void, Error, AddToQueueMutation, unknown>
	useClearQueue: UseMutationResult<void, Error, void, unknown>
	useRemoveFromQueue: UseMutationResult<void, Error, number, unknown>
	useReorderQueue: UseMutationResult<void, Error, QueueOrderMutation, unknown>
	useTogglePlayback: UseMutationResult<void, Error, number | undefined, unknown>
	useSeekTo: UseMutationResult<void, Error, number, unknown>
	useSkip: UseMutationResult<void, Error, number | undefined, unknown>
	usePrevious: UseMutationResult<void, Error, void, unknown>
	usePlayNewQueue: UseMutationResult<void, Error, QueueMutation, unknown>
	usePlayNewQueueOffline: UseMutationResult<void, Error, QueueMutation, unknown>
	playbackState: State | undefined
	setNowPlaying: (track: JellifyTrack) => void
}

const PlayerContextInitializer = () => {
	const nowPlayingJson = storage.getString(MMKVStorageKeys.NowPlaying)
	const playQueueJson = storage.getString(MMKVStorageKeys.PlayQueue)
	const queueJson = storage.getString(MMKVStorageKeys.Queue)

	const playStateApi = getPlaystateApi(Client.api!)

	//#region State
	const [initialized, setInitialized] = useState<boolean>(false)

	const [nowPlayingIsFavorite, setNowPlayingIsFavorite] = useState<boolean>(false)
	const [nowPlaying, setNowPlaying] = useState<JellifyTrack | undefined>(
		nowPlayingJson ? JSON.parse(nowPlayingJson) : undefined,
	)

	const [isSkipping, setIsSkipping] = useState<boolean>(false)

	const [playQueue, setPlayQueue] = useState<JellifyTrack[]>(
		playQueueJson ? JSON.parse(playQueueJson) : [],
	)

	const [queue, setQueue] = useState<Queue>(queueJson ? JSON.parse(queueJson) : 'Queue')
	//#endregion State

	//#region Functions
	const play = async (index?: number | undefined) => {
		if (index && index > 0) {
			TrackPlayer.skip(index)
		}

		TrackPlayer.play()
	}

	const getQueueSectionData: () => Section[] = () => {
		return Object.keys(QueuingType).map((type) => {
			return {
				title: type,
				data: playQueue.filter((track) => track.QueuingType === type),
			} as Section
		})
	}

	/**
	 * Takes a {@link BaseItemDto} of a track on Jellyfin, and updates it's
	 * position in the {@link queue}
	 *
	 *
	 * @param track The Jellyfin track object to update and replace in the queue
	 */
	const replaceQueueItem: (track: BaseItemDto) => Promise<void> = async (track: BaseItemDto) => {
		const queue = (await TrackPlayer.getQueue()) as JellifyTrack[]

		const queueItemIndex = queue.findIndex((queuedTrack) => queuedTrack.item.Id === track.Id!)

		// Update queued item at index if found, else silently do nothing
		if (queueItemIndex !== -1) {
			const queueItem = queue[queueItemIndex]

			TrackPlayer.remove([queueItemIndex]).then(() => {
				TrackPlayer.add(mapDtoToTrack(track, queueItem.QueuingType), queueItemIndex)
			})
		}
	}

	const resetQueue = async (hideMiniplayer?: boolean | undefined) => {
		console.debug('Clearing queue')
		await TrackPlayer.setQueue([])
		setPlayQueue([])
	}

	const addToQueue = async (tracks: JellifyTrack[]) => {
		const insertIndex = await findPlayQueueIndexStart(playQueue)
		console.debug(`Adding ${tracks.length} to queue at index ${insertIndex}`)

		await TrackPlayer.add(tracks, insertIndex)

		setPlayQueue((await getQueue()) as JellifyTrack[])
	}

	const addToNext = async (tracks: JellifyTrack[]) => {
		const insertIndex = await findPlayNextIndexStart(playQueue)

		console.debug(`Adding ${tracks.length} to queue at index ${insertIndex}`)

		await TrackPlayer.add(tracks, insertIndex)

		setPlayQueue((await getQueue()) as JellifyTrack[])
	}
	//#endregion Functions

	//#region Hooks
	const useAddToQueue = useMutation({
		mutationFn: async (mutation: AddToQueueMutation) => {
			trigger('impactLight')

			if (mutation.queuingType === QueuingType.PlayingNext)
				return addToNext([mapDtoToTrack(mutation.track, mutation.queuingType)])
			else return addToQueue([mapDtoToTrack(mutation.track, mutation.queuingType)])
		},
		onSuccess: (data, { queuingType }) => {
			trigger('notificationSuccess')

			Burnt.alert({
				title: queuingType === QueuingType.PlayingNext ? 'Playing next' : 'Added to queue',
				duration: 1,
				preset: 'done',
			})
		},
		onError: () => {
			trigger('notificationError')
		},
	})

	const useRemoveFromQueue = useMutation({
		mutationFn: async (index: number) => {
			trigger('impactMedium')

			await TrackPlayer.remove([index])

			setPlayQueue((await TrackPlayer.getQueue()) as JellifyTrack[])
		},
	})

	const useClearQueue = useMutation({
		mutationFn: async () => {
			trigger('effectDoubleClick')

			await TrackPlayer.removeUpcomingTracks()

			setPlayQueue((await getQueue()) as JellifyTrack[])
		},
	})

	const useReorderQueue = useMutation({
		mutationFn: async (mutation: QueueOrderMutation) => {
			setPlayQueue(mutation.newOrder)
			await TrackPlayer.move(mutation.from, mutation.to)
		},
	})

	const useTogglePlayback = useMutation({
		mutationFn: (index?: number | undefined) => {
			trigger('impactMedium')
			if (playbackState === State.Playing) return pause()
			else return play(index)
		},
	})

	const useSeekTo = useMutation({
		mutationFn: async (position: number) => {
			trigger('impactLight')
			await seekTo(position)

			handlePlaybackProgressUpdated(Client.sessionId, playStateApi, nowPlaying!, {
				buffered: 0,
				position,
				duration: convertRunTimeTicksToSeconds(nowPlaying!.duration!),
			})
		},
	})

	const useSkip = useMutation({
		mutationFn: async (index?: number | undefined) => {
			trigger('impactMedium')

			// Handle if this is the last track in the queue
			if (playQueue.length - 1 === (await getActiveTrackIndex())) return
			else {
				if (!isUndefined(index)) {
					setIsSkipping(true)
					setNowPlaying(playQueue[index])
					await skip(index)
					setIsSkipping(false)
				} else {
					const nowPlayingIndex = playQueue.findIndex(
						(track) => track.item.Id === nowPlaying!.item.Id,
					)
					setNowPlaying(playQueue[nowPlayingIndex + 1])
					await skipToNext()
				}
			}
		},
	})

	const usePrevious = useMutation({
		mutationFn: async () => {
			trigger('impactMedium')

			const nowPlayingIndex = playQueue.findIndex(
				(track) => track.item.Id === nowPlaying!.item.Id,
			)

			const { position } = await TrackPlayer.getProgress()

			if (nowPlayingIndex > 0 && position < SKIP_TO_PREVIOUS_THRESHOLD) {
				setNowPlaying(playQueue[nowPlayingIndex - 1])
				await skipToPrevious()
			} else await seekTo(0)
		},
	})

	const usePlayNewQueue = useMutation({
		mutationFn: async (mutation: QueueMutation) => {
			trigger('effectDoubleClick')

			setIsSkipping(true)

			// Optimistically set now playing

			setNowPlaying(
				mapDtoToTrack(mutation.tracklist[mutation.index ?? 0], QueuingType.FromSelection),
			)

			await resetQueue(false)

			await addToQueue(
				mutation.tracklist.map((track) => {
					return mapDtoToTrack(track, QueuingType.FromSelection)
				}),
			)

			setQueue(mutation.queue)
		},
		onSuccess: async (data, mutation: QueueMutation) => {
			setIsSkipping(false)
			await play(mutation.index)

			if (typeof mutation.queue === 'object') await markItemPlayed(queue as BaseItemDto)
		},
		onError: async () => {
			setIsSkipping(false)
			setNowPlaying((await TrackPlayer.getActiveTrack()) as JellifyTrack)
		},
	})

	const usePlayNewQueueOffline = useMutation({
		mutationFn: async (mutation: QueueMutation) => {
			trigger('effectDoubleClick')

			setIsSkipping(true)

			// Optimistically set now playing

			setNowPlaying(mutation.trackListOffline)

			await resetQueue(false)

			await addToQueue([mutation.trackListOffline as JellifyTrack])

			setQueue('Recently Played')
		},
		onSuccess: async (data, mutation: QueueMutation) => {
			setIsSkipping(false)
			await play(0)

			if (typeof mutation.queue === 'object') await markItemPlayed(queue as BaseItemDto)
		},
		onError: async () => {
			setIsSkipping(false)
			setNowPlaying((await TrackPlayer.getActiveTrack()) as JellifyTrack)
		},
	})

	//#endregion

	//#region RNTP Setup

	const { state: playbackState } = usePlaybackState()
	const { useDownload, downloadedTracks } = useNetworkContext()

	useTrackPlayerEvents(
		[
			Event.RemoteLike,
			Event.RemoteDislike,
			Event.PlaybackProgressUpdated,
			Event.PlaybackState,
			Event.PlaybackActiveTrackChanged,
		],
		async (event) => {
			switch (event.type) {
				case Event.RemoteLike: {
					setNowPlayingIsFavorite(true)
					break
				}

				case Event.RemoteDislike: {
					setNowPlayingIsFavorite(false)
					break
				}

				case Event.PlaybackState: {
					handlePlaybackState(
						Client.sessionId,
						playStateApi,
						(await TrackPlayer.getActiveTrack()) as JellifyTrack,
						event.state,
					)
					break
				}
				case Event.PlaybackProgressUpdated: {
					handlePlaybackProgressUpdated(
						Client.sessionId,
						playStateApi,
						nowPlaying!,
						event,
					)

					// Cache playing track at 20 seconds if it's not already downloaded
					if (
						Math.floor(event.position) === 20 &&
						downloadedTracks?.filter(
							(download) => download.item.Id === nowPlaying!.item.Id,
						).length === 0
					)
						useDownload.mutate(nowPlaying!.item)

					break
				}

				case Event.PlaybackActiveTrackChanged: {
					if (initialized && !isSkipping) {
						const activeTrack = (await TrackPlayer.getActiveTrack()) as
							| JellifyTrack
							| undefined
						if (activeTrack && !isEqual(activeTrack, nowPlaying)) {
							setNowPlaying(activeTrack)

							// Set player favorite state to user data IsFavorite
							// This is super nullish so we need to do a lot of
							// checks on the fields
							// TODO: Turn this check into a helper function
							setNowPlayingIsFavorite(
								isUndefined(activeTrack)
									? false
									: isUndefined(activeTrack!.item.UserData)
									? false
									: activeTrack.item.UserData.IsFavorite ?? false,
							)

							await useUpdateOptions(nowPlayingIsFavorite)
						} else if (!activeTrack) {
							setNowPlaying(undefined)
							setNowPlayingIsFavorite(false)
						} else {
							// Do nothing
						}
					}
				}
			}
		},
	)

	//#endregion RNTP Setup

	//#region useEffects
	useEffect(() => {
		storage.set(MMKVStorageKeys.Queue, JSON.stringify(queue))
	}, [queue])

	useEffect(() => {
		if (initialized && playQueue)
			storage.set(MMKVStorageKeys.PlayQueue, JSON.stringify(playQueue))
	}, [playQueue])

	useEffect(() => {
		if (initialized && nowPlaying)
			storage.set(MMKVStorageKeys.NowPlaying, JSON.stringify(nowPlaying))
	}, [nowPlaying])

	useEffect(() => {
		if (!initialized && playQueue.length > 0 && nowPlaying) {
			TrackPlayer.setQueue(playQueue).then(() => {
				TrackPlayer.skip(
					playQueue.findIndex((track) => track.item.Id! === nowPlaying.item.Id!),
				)
			})
		}

		setInitialized(true)
	}, [playQueue, nowPlaying])
	//#endregion useEffects

	//#region return
	return {
		initialized,
		nowPlayingIsFavorite,
		setNowPlayingIsFavorite,
		nowPlaying,
		playQueue,
		queue,
		getQueueSectionData,
		useAddToQueue,
		useClearQueue,
		setNowPlaying,
		useReorderQueue,
		useRemoveFromQueue,
		useTogglePlayback,
		useSeekTo,
		useSkip,
		usePrevious,
		usePlayNewQueue,
		playbackState,
		usePlayNewQueueOffline,
	}
	//#endregion return
}

//#region Create PlayerContext
export const PlayerContext = createContext<PlayerContext>({
	initialized: false,
	nowPlayingIsFavorite: false,
	setNowPlayingIsFavorite: () => {},
	nowPlaying: undefined,
	setNowPlaying: () => {},
	playQueue: [],
	queue: 'Recently Played',
	getQueueSectionData: () => [],
	useAddToQueue: {
		mutate: () => {},
		mutateAsync: async () => {},
		data: undefined,
		error: null,
		variables: undefined,
		isError: false,
		isIdle: true,
		isPaused: false,
		isPending: false,
		isSuccess: false,
		status: 'idle',
		reset: () => {},
		context: {},
		failureCount: 0,
		failureReason: null,
		submittedAt: 0,
	},
	useClearQueue: {
		mutate: () => {},
		mutateAsync: async () => {},
		data: undefined,
		error: null,
		variables: undefined,
		isError: false,
		isIdle: true,
		isPaused: false,
		isPending: false,
		isSuccess: false,
		status: 'idle',
		reset: () => {},
		context: {},
		failureCount: 0,
		failureReason: null,
		submittedAt: 0,
	},
	useRemoveFromQueue: {
		mutate: () => {},
		mutateAsync: async () => {},
		data: undefined,
		error: null,
		variables: undefined,
		isError: false,
		isIdle: true,
		isPaused: false,
		isPending: false,
		isSuccess: false,
		status: 'idle',
		reset: () => {},
		context: {},
		failureCount: 0,
		failureReason: null,
		submittedAt: 0,
	},
	useReorderQueue: {
		mutate: () => {},
		mutateAsync: async () => {},
		data: undefined,
		error: null,
		variables: undefined,
		isError: false,
		isIdle: true,
		isPaused: false,
		isPending: false,
		isSuccess: false,
		status: 'idle',
		reset: () => {},
		context: {},
		failureCount: 0,
		failureReason: null,
		submittedAt: 0,
	},
	useTogglePlayback: {
		mutate: () => {},
		mutateAsync: async () => {},
		data: undefined,
		error: null,
		variables: undefined,
		isError: false,
		isIdle: true,
		isPaused: false,
		isPending: false,
		isSuccess: false,
		status: 'idle',
		reset: () => {},
		context: {},
		failureCount: 0,
		failureReason: null,
		submittedAt: 0,
	},
	useSeekTo: {
		mutate: () => {},
		mutateAsync: async () => {},
		data: undefined,
		error: null,
		variables: undefined,
		isError: false,
		isIdle: true,
		isPaused: false,
		isPending: false,
		isSuccess: false,
		status: 'idle',
		reset: () => {},
		context: {},
		failureCount: 0,
		failureReason: null,
		submittedAt: 0,
	},
	useSkip: {
		mutate: () => {},
		mutateAsync: async () => {},
		data: undefined,
		error: null,
		variables: undefined,
		isError: false,
		isIdle: true,
		isPaused: false,
		isPending: false,
		isSuccess: false,
		status: 'idle',
		reset: () => {},
		context: {},
		failureCount: 0,
		failureReason: null,
		submittedAt: 0,
	},
	usePrevious: {
		mutate: () => {},
		mutateAsync: async () => {},
		data: undefined,
		error: null,
		variables: undefined,
		isError: false,
		isIdle: true,
		isPaused: false,
		isPending: false,
		isSuccess: false,
		status: 'idle',
		reset: () => {},
		context: {},
		failureCount: 0,
		failureReason: null,
		submittedAt: 0,
	},
	usePlayNewQueue: {
		mutate: () => {},
		mutateAsync: async () => {},
		data: undefined,
		error: null,
		variables: undefined,
		isError: false,
		isIdle: true,
		isPaused: false,
		isPending: false,
		isSuccess: false,
		status: 'idle',
		reset: () => {},
		context: {},
		failureCount: 0,
		failureReason: null,
		submittedAt: 0,
	},
	usePlayNewQueueOffline: {
		mutate: () => {},
		mutateAsync: async () => {},
		data: undefined,
		error: null,
		variables: undefined,
		isError: false,
		isIdle: true,
		isPaused: false,
		isPending: false,
		isSuccess: false,
		status: 'idle',
		reset: () => {},
		context: {},
		failureCount: 0,
		failureReason: null,
		submittedAt: 0,
	},
	playbackState: undefined,
})
//#endregion Create PlayerContext

export const PlayerProvider: ({ children }: { children: ReactNode }) => React.JSX.Element = ({
	children,
}: {
	children: ReactNode
}) => {
	const {
		initialized,
		nowPlayingIsFavorite,
		setNowPlayingIsFavorite,
		nowPlaying,
		playQueue,
		queue,
		getQueueSectionData,
		useAddToQueue,
		useClearQueue,
		useRemoveFromQueue,
		useReorderQueue,
		useTogglePlayback,
		useSeekTo,
		useSkip,
		usePrevious,
		usePlayNewQueueOffline,
		setNowPlaying,
		usePlayNewQueue,
		playbackState,
	} = PlayerContextInitializer()

	return (
		<PlayerContext.Provider
			value={{
				initialized,
				nowPlayingIsFavorite,
				setNowPlayingIsFavorite,
				nowPlaying,
				usePlayNewQueueOffline,
				playQueue,
				queue,
				getQueueSectionData,
				useAddToQueue,
				useClearQueue,
				useRemoveFromQueue,
				useReorderQueue,
				useTogglePlayback,
				useSeekTo,
				useSkip,
				usePrevious,
				setNowPlaying,
				usePlayNewQueue,
				playbackState,
			}}
		>
			{children}
		</PlayerContext.Provider>
	)
}

export const usePlayerContext = () => useContext(PlayerContext)
