import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models/base-item-dto'
import React from 'react'
import { FlatList, FlatListProps, ListRenderItem } from 'react-native'
import IconCard from '../helpers/icon-card'

interface HorizontalCardListProps extends FlatListProps<BaseItemDto> {
	squared?: boolean | undefined
	/**
	 * The number of items that will be displayed before
	 * we cut it off and display a "Show More" card
	 */
	cutoff?: number | undefined
	onSeeMore?: () => void | undefined
}

/**
 * Displays a Horizontal FlatList of 20 ItemCards
 * then shows a "See More" button
 * @param param0
 * @returns
 */
export default function HorizontalCardList({
	onSeeMore,
	squared = false,
	...props
}: HorizontalCardListProps): React.JSX.Element {
	return (
		<FlatList
			horizontal
			data={props.data}
			renderItem={props.renderItem}
			ListFooterComponent={() => {
				return props.data && onSeeMore ? (
					<IconCard
						name={squared ? 'arrow-right-box' : 'arrow-right-circle'}
						circular={!squared}
						caption='See More'
						onPress={onSeeMore}
					/>
				) : undefined
			}}
			removeClippedSubviews
			style={{
				overflow: 'hidden',
			}}
		/>
	)
}
