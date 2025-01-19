import { createContext, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import { JellifyTrack } from "../types/JellifyTrack";
import { storage } from "../constants/storage";
import { MMKVStorageKeys } from "../enums/mmkv-storage-keys";
import { findPlayQueueIndexStart } from "./helpers/index";
import TrackPlayer, { Event, Progress, State, usePlaybackState, useProgress, useTrackPlayerEvents } from "react-native-track-player";
import _, { isEqual, isUndefined } from "lodash";
import { useApiClientContext } from "../components/jellyfin-api-provider";
import { getPlaystateApi } from "@jellyfin/sdk/lib/utils/api";
import { handlePlaybackProgressUpdated, handlePlaybackState } from "./handlers";
import { useSetupPlayer } from "@/player/hooks";
import { UPDATE_INTERVAL } from "./config";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { QueueMutation } from "./interfaces";
import { mapDtoToTrack } from "@/helpers/mappings";
import { QueuingType } from "@/enums/queuing-type";
import { trigger } from "react-native-haptic-feedback";
import { getQueue, pause, seekTo, skip, skipToNext, skipToPrevious } from "react-native-track-player/lib/src/trackPlayer";
import { convertRunTimeTicksToSeconds } from "@/helpers/runtimeticks";

interface PlayerContext {
    showPlayer: boolean;
    setShowPlayer: React.Dispatch<SetStateAction<boolean>>;
    showMiniplayer: boolean;
    setShowMiniplayer: React.Dispatch<SetStateAction<boolean>>;
    nowPlayingIsFavorite: boolean;
    setNowPlayingIsFavorite: React.Dispatch<SetStateAction<boolean>>;
    nowPlaying: JellifyTrack | undefined;
    queue: JellifyTrack[];
    queueName: string | undefined;
    useTogglePlayback: UseMutationResult<void, Error, number | undefined, unknown>;
    useSeekTo: UseMutationResult<void, Error, number, unknown>;
    useSkip: UseMutationResult<void, Error, number | undefined, unknown>;
    usePrevious: UseMutationResult<void, Error, void, unknown>;
    usePlayNewQueue: UseMutationResult<void, Error, QueueMutation, unknown>;
    playbackState: State | undefined;
    progress: Progress | undefined;
}

const PlayerContextInitializer = () => {

    const queueJson = storage.getString(MMKVStorageKeys.PlayQueue);

    const { apiClient, sessionId } = useApiClientContext();
    const playStateApi = getPlaystateApi(apiClient!)
    
    //#region State
    const [showPlayer, setShowPlayer] = useState<boolean>(false);
    const [showMiniplayer, setShowMiniplayer] = useState<boolean>(false);

    const [nowPlayingIsFavorite, setNowPlayingIsFavorite] = useState<boolean>(false);
    const [nowPlaying, setNowPlaying] = useState<JellifyTrack | undefined>(undefined);
    const [isSkipping, setIsSkipping] = useState<boolean>(false);
    const [queue, setQueue] = useState<JellifyTrack[]>(queueJson ? JSON.parse(queueJson) : []);
    const [queueName, setQueueName] = useState<string | undefined>(undefined);
    //#endregion State

    
    //#region Functions
    const play = async (index?: number | undefined) => {

        if (index && index > 0) {
            TrackPlayer.skip(index);
        }

        TrackPlayer.play();
    }
    
    const resetQueue = async (hideMiniplayer?: boolean | undefined) => {
        console.debug("Clearing queue")
        await TrackPlayer.reset();
        setQueue([]);
        
        setShowMiniplayer(!hideMiniplayer)
    }
    
    const addToQueue = async (tracks: JellifyTrack[]) => {
        let insertIndex = findPlayQueueIndexStart(queue);
        console.debug(`Adding ${tracks.length} to queue at index ${insertIndex}`)
        
        await TrackPlayer.add(tracks, insertIndex);
        
        setQueue(await getQueue() as JellifyTrack[])
        
        setShowMiniplayer(true);
    }
    //#endregion Functions
    
    //#region Hooks
    const useTogglePlayback = useMutation({
        mutationFn: async (index?: number | undefined) => {
            trigger("impactLight");
            if (playbackState === State.Playing)
                await pause();
            else 
                await play(index);
        }
    });

    const useSeekTo = useMutation({
        mutationFn: async (position: number) => {
            trigger('impactLight');
            await seekTo(position);

            handlePlaybackProgressUpdated(sessionId, playStateApi, nowPlaying!, { 
                buffered: 0, 
                position, 
                duration: convertRunTimeTicksToSeconds(nowPlaying!.duration!) 
            });
        }
    });

    const useSkip = useMutation({
        mutationFn: async (index?: number | undefined) => {
            trigger("impactLight")
            if (!isUndefined(index)) {
                setIsSkipping(true);
                setNowPlaying(queue[index]);
                await skip(index);
                setIsSkipping(false);
            }
            else {
                const nowPlayingIndex = queue.findIndex((track) => track.item.Id === nowPlaying!.item.Id);
                setNowPlaying(queue[nowPlayingIndex + 1])
                await skipToNext();
            }
        }
    });

    const usePrevious = useMutation({
        mutationFn: async () => {
            trigger("impactLight");

            const nowPlayingIndex = queue.findIndex((track) => track.item.Id === nowPlaying!.item.Id);

            if (nowPlayingIndex > 0) {
                setNowPlaying(queue[nowPlayingIndex - 1])
                await skipToPrevious();
            }
        }
    })

    const usePlayNewQueue = useMutation({
        mutationFn: async (mutation: QueueMutation) => {
            trigger("impactLight");

            setIsSkipping(true);

            // Optimistically set now playing
            setNowPlaying(mapDtoToTrack(apiClient!, sessionId, mutation.tracklist[mutation.index ?? 0], QueuingType.FromSelection));

            await resetQueue(false);
            await addToQueue(mutation.tracklist.map((track) => {
                return mapDtoToTrack(apiClient!, sessionId, track, QueuingType.FromSelection)
            }));
            
            setQueueName(mutation.queueName);
        },
        onSuccess: async (data, mutation: QueueMutation) => {
            setIsSkipping(false);
            await play(mutation.index)
        },
        onError: async () => {
            setIsSkipping(false);
            setNowPlaying(await TrackPlayer.getActiveTrack() as JellifyTrack)
        }
    });

    //#endregion

    //#region RNTP Setup
    const isPlayerReady = useSetupPlayer().isSuccess;
    const { state: playbackState } = usePlaybackState();
    const progress = useProgress(UPDATE_INTERVAL);

    useTrackPlayerEvents([
        Event.PlaybackProgressUpdated,
        Event.PlaybackState,
        Event.PlaybackActiveTrackChanged,
    ], async (event) => {
        switch (event.type) {

            case (Event.PlaybackState) : {
                handlePlaybackState(sessionId, playStateApi, await TrackPlayer.getActiveTrack() as JellifyTrack, event.state, progress);
                break;
            }
            case (Event.PlaybackProgressUpdated) : {
                handlePlaybackProgressUpdated(sessionId, playStateApi, nowPlaying!, event);
                break;
            }

            case (Event.PlaybackActiveTrackChanged) : {

                if (!isSkipping) {
                    const activeTrack = await TrackPlayer.getActiveTrack() as JellifyTrack | undefined;
                    if (activeTrack && !isEqual(activeTrack, nowPlaying)) {    
                        setNowPlaying(activeTrack);

                        // Set player favorite state to user data IsFavorite
                        // This is super nullish so we need to do a lot of 
                        // checks on the fields
                        // TODO: Turn this check into a helper function
                        setNowPlayingIsFavorite(
                            isUndefined(activeTrack) ? false 
                            : isUndefined(activeTrack!.item.UserData) ? false 
                            : activeTrack.item.UserData.IsFavorite ?? false
                        );
                    } else if (!!!activeTrack) {
                        setNowPlaying(undefined)
                        setNowPlayingIsFavorite(false);
                    } else {
                        // Do nothing
                    }
                }
            }
        }
    })


    useEffect(() => {
        if (!showMiniplayer)
            setNowPlaying(undefined);
    }, [
        showMiniplayer
    ])

    useEffect(() => {
        if (isPlayerReady)
          console.debug("Player is ready")
        else
          console.warn("Player could not be setup")
      }, [
        isPlayerReady
      ])
    //#endregion RNTP Setup

    //#region return
    return {
        showPlayer,
        setShowPlayer,
        showMiniplayer,
        setShowMiniplayer,
        nowPlayingIsFavorite,
        setNowPlayingIsFavorite,
        nowPlaying,
        queue,
        queueName,
        useTogglePlayback,
        useSeekTo,
        useSkip,
        usePrevious,
        usePlayNewQueue,
        playbackState,
        progress,
    }
    //#endregion return
}

//#region Create PlayerContext
export const PlayerContext = createContext<PlayerContext>({
    showPlayer: false,
    setShowPlayer: () => {},
    showMiniplayer: false,
    setShowMiniplayer: () => {},
    nowPlayingIsFavorite: false,
    setNowPlayingIsFavorite: () => {},
    nowPlaying: undefined,
    queue: [],
    queueName: undefined,
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
        status: "idle",
        reset: () => {},
        context: {},
        failureCount: 0,
        failureReason: null,
        submittedAt: 0
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
        status: "idle",
        reset: () => {},
        context: {},
        failureCount: 0,
        failureReason: null,
        submittedAt: 0
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
        status: "idle",
        reset: () => {},
        context: {},
        failureCount: 0,
        failureReason: null,
        submittedAt: 0
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
        status: "idle",
        reset: () => {},
        context: {},
        failureCount: 0,
        failureReason: null,
        submittedAt: 0
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
        status: "idle",
        reset: () => {},
        context: {},
        failureCount: 0,
        failureReason: null,
        submittedAt: 0
    },
    playbackState: undefined,
    progress: undefined,
});
//#endregion Create PlayerContext

export const PlayerProvider: ({ children }: { children: ReactNode }) => React.JSX.Element = ({ children }: { children: ReactNode }) => {
    const { 
        showPlayer, 
        setShowPlayer, 
        showMiniplayer, 
        setShowMiniplayer, 
        nowPlayingIsFavorite,
        setNowPlayingIsFavorite,
        nowPlaying,
        queue, 
        queueName,
        useTogglePlayback,
        useSeekTo,
        useSkip,
        usePrevious,
        usePlayNewQueue,
        playbackState,
        progress
    } = PlayerContextInitializer();

    return <PlayerContext.Provider value={{
        showPlayer,
        setShowPlayer,
        showMiniplayer,
        setShowMiniplayer,
        nowPlayingIsFavorite,
        setNowPlayingIsFavorite,
        nowPlaying,
        queue,
        queueName,
        useTogglePlayback,
        useSeekTo,
        useSkip,
        usePrevious,
        usePlayNewQueue,
        playbackState,
        progress
    }}>
        { children }
    </PlayerContext.Provider>
}

export const usePlayerContext = () => useContext(PlayerContext);