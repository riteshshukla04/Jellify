import { TracksProps } from '../types'
import React from 'react'
import Track from '../Global/components/track'
import { FlatList } from 'react-native'
import { Separator } from 'tamagui'

export default function TracksScreen({ route, navigation }: TracksProps): React.JSX.Element {
	return (
		<FlatList
			contentInsetAdjustmentBehavior='automatic'
			ItemSeparatorComponent={() => <Separator />}
			numColumns={1}
			data={route.params.tracks}
			renderItem={({ index, item: track }) => (
				<Track
					navigation={navigation}
					showArtwork
					track={track}
					tracklist={route.params.tracks?.slice(index, index + 50) ?? []}
					queue={route.params.queue}
				/>
			)}
		/>
	)
}
