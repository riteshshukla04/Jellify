import React, { createContext, ReactNode, useContext, useState } from 'react'
import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models'
import { useQuery } from '@tanstack/react-query'
import { QueryKeys } from '../../enums/query-keys'
import { fetchRecentlyPlayed, fetchRecentlyPlayedArtists } from '../../api/queries/recents'
import { queryClient } from '../../constants/query-client'
import QueryConfig from '../../api/queries/query.config'
import { fetchFrequentlyPlayed, fetchFrequentlyPlayedArtists } from '../../api/queries/frequents'
import { useJellifyContext } from '../provider'
interface HomeContext {
	refreshing: boolean
	onRefresh: () => void
	recentArtists: BaseItemDto[] | undefined
	recentTracks: BaseItemDto[] | undefined
	frequentArtists: BaseItemDto[] | undefined
	frequentlyPlayed: BaseItemDto[] | undefined
}

const HomeContextInitializer = () => {
	const { api, library, user } = useJellifyContext()
	const [refreshing, setRefreshing] = useState<boolean>(false)

	const { data: recentTracks, refetch: refetchRecentTracks } = useQuery({
		queryKey: [QueryKeys.RecentlyPlayed],
		queryFn: () => fetchRecentlyPlayed(api, library),
	})
	const { data: recentArtists, refetch: refetchRecentArtists } = useQuery({
		queryKey: [QueryKeys.RecentlyPlayedArtists],
		queryFn: () => fetchRecentlyPlayedArtists(api, library),
	})

	const { data: frequentlyPlayed, refetch: refetchFrequentlyPlayed } = useQuery({
		queryKey: [QueryKeys.FrequentlyPlayed],
		queryFn: () => fetchFrequentlyPlayed(api, library),
	})

	const { data: frequentArtists, refetch: refetchFrequentArtists } = useQuery({
		queryKey: [QueryKeys.FrequentArtists],
		queryFn: () => fetchFrequentlyPlayedArtists(api, library),
	})

	const onRefresh = async () => {
		setRefreshing(true)

		queryClient.invalidateQueries({
			queryKey: [
				QueryKeys.RecentlyPlayedArtists,
				QueryConfig.limits.recents * 4,
				QueryConfig.limits.recents,
			],
		})

		queryClient.invalidateQueries({
			queryKey: [
				QueryKeys.RecentlyPlayed,
				QueryConfig.limits.recents * 4,
				QueryConfig.limits.recents,
			],
		})

		await Promise.all([
			refetchRecentTracks(),
			refetchRecentArtists(),
			refetchFrequentArtists(),
			refetchFrequentlyPlayed(),
		])

		setRefreshing(false)
	}

	return {
		refreshing,
		onRefresh,
		recentArtists,
		recentTracks,
		frequentArtists,
		frequentlyPlayed,
	}
}

const HomeContext = createContext<HomeContext>({
	refreshing: false,
	onRefresh: () => {},
	recentArtists: undefined,
	recentTracks: undefined,
	frequentArtists: undefined,
	frequentlyPlayed: undefined,
})

export const HomeProvider: ({ children }: { children: ReactNode }) => React.JSX.Element = ({
	children,
}: {
	children: ReactNode
}) => {
	const {
		refreshing,
		onRefresh,
		recentTracks,
		recentArtists,
		frequentArtists,
		frequentlyPlayed,
	} = HomeContextInitializer()

	return (
		<HomeContext.Provider
			value={{
				refreshing,
				onRefresh,
				recentTracks,
				recentArtists,
				frequentArtists,
				frequentlyPlayed,
			}}
		>
			{children}
		</HomeContext.Provider>
	)
}

export const useHomeContext = () => useContext(HomeContext)
