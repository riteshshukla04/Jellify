import { useQuery } from '@tanstack/react-query'
import { fetchRecentlyAdded, fetchRecentlyPlayed } from '../../api/queries/recents'
import { QueryKeys } from '../../enums/query-keys'
import { createContext, ReactNode, useContext, useState } from 'react'
import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models'
import { useJellifyContext } from '../provider'
interface DiscoverContext {
	refreshing: boolean
	refresh: () => void
	recentlyAdded: BaseItemDto[] | undefined
	recentlyPlayed: BaseItemDto[] | undefined
}

const DiscoverContextInitializer = () => {
	const { api, library } = useJellifyContext()
	const [refreshing, setRefreshing] = useState<boolean>(false)

	const { data: recentlyAdded, refetch } = useQuery({
		queryKey: [QueryKeys.RecentlyAdded],
		queryFn: () => fetchRecentlyAdded(api, library),
	})

	const { data: recentlyPlayed, refetch: refetchRecentlyPlayed } = useQuery({
		queryKey: [QueryKeys.RecentlyPlayed],
		queryFn: () => fetchRecentlyPlayed(api, library),
	})

	const refresh = async () => {
		setRefreshing(true)

		await Promise.all([refetch(), refetchRecentlyPlayed()])
		setRefreshing(false)
	}

	return {
		refreshing,
		refresh,
		recentlyAdded,
		recentlyPlayed,
	}
}

const DiscoverContext = createContext<DiscoverContext>({
	refreshing: false,
	refresh: () => {},
	recentlyAdded: undefined,
	recentlyPlayed: undefined,
})

export const DiscoverProvider: ({ children }: { children: ReactNode }) => React.JSX.Element = ({
	children,
}: {
	children: ReactNode
}) => {
	const context = DiscoverContextInitializer()

	return <DiscoverContext.Provider value={context}>{children}</DiscoverContext.Provider>
}

export const useDiscoverContext = () => useContext(DiscoverContext)
