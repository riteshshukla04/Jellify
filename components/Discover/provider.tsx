import { useQuery } from '@tanstack/react-query'
import { fetchRecentlyAdded } from '../../api/queries/functions/recents'
import { QueryKeys } from '../../enums/query-keys'
import { createContext, ReactNode, useContext, useState } from 'react'
import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models'

interface DiscoverContext {
	refreshing: boolean
	refresh: () => void
	recentlyAdded: BaseItemDto[] | undefined
}

const DiscoverContextInitializer = () => {
	const [refreshing, setRefreshing] = useState<boolean>(false)

	const { data: recentlyAdded, refetch } = useQuery({
		queryKey: [QueryKeys.RecentlyAdded],
		queryFn: () => fetchRecentlyAdded(),
		staleTime: 1000 * 60 * 5, // 5 minutes
	})

	const refresh = async () => {
		setRefreshing(true)

		await Promise.all([refetch()])
		setRefreshing(false)
	}

	return {
		refreshing,
		refresh,
		recentlyAdded,
	}
}

const DiscoverContext = createContext<DiscoverContext>({
	refreshing: false,
	refresh: () => {},
	recentlyAdded: undefined,
})

export const DiscoverProvider: ({ children }: { children: ReactNode }) => React.JSX.Element = ({
	children,
}: {
	children: ReactNode
}) => {
	const { refreshing, refresh, recentlyAdded } = DiscoverContextInitializer()

	return (
		<DiscoverContext.Provider
			value={{
				refreshing,
				refresh,
				recentlyAdded,
			}}
		>
			{children}
		</DiscoverContext.Provider>
	)
}

export const useDiscoverContext = () => useContext(DiscoverContext)
