import { useSafeAreaFrame } from 'react-native-safe-area-context'
import React from 'react'
import { FlatList, RefreshControl } from 'react-native'
import { ItemCard } from '../Global/components/item-card'
import { ArtistsProps } from '../types'
import { QueryKeys } from '../../enums/query-keys'
import { useQuery } from '@tanstack/react-query'
import { fetchRecentlyPlayedArtists } from '../../api/queries/functions/recents'
import { fetchFavoriteArtists } from '../../api/queries/functions/favorites'
import { QueryConfig } from '../../api/queries/query.config'
import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models'
import { YStack } from 'tamagui'
import { Text } from '../Global/helpers/text'

interface ArtistsComponentProps extends ArtistsProps {
	artists: BaseItemDto[]
}

export default function Artists({ navigation, route }: ArtistsProps): React.JSX.Element {
	return (
		<FlatList
			contentContainerStyle={{
				flexGrow: 1,
				alignItems: 'center',
			}}
			contentInsetAdjustmentBehavior='automatic'
			numColumns={2}
			data={route.params.artists}
			renderItem={({ index, item: artist }) => (
				<ItemCard
					item={artist}
					caption={artist.Name ?? 'Unknown Artist'}
					onPress={() => {
						navigation.navigate('Artist', { artist })
					}}
					size={'$14'}
				/>
			)}
			ListEmptyComponent={
				<YStack justifyContent='center'>
					<Text>No artists</Text>
				</YStack>
			}
		/>
	)
}
