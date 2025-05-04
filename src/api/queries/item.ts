import { BaseItemDto, ItemSortBy } from '@jellyfin/sdk/lib/generated-client/models'
import { getItemsApi } from '@jellyfin/sdk/lib/utils/api'
import { groupBy, isEmpty, isEqual, isUndefined } from 'lodash'
import { SectionList } from 'react-native'
import { Api } from '@jellyfin/sdk/lib/api'

/**
 * Fetches a single Jellyfin item by it's ID
 * @param itemId The ID of the item to fetch
 * @returns The item - a {@link BaseItemDto}
 */
export async function fetchItem(api: Api | undefined, itemId: string): Promise<BaseItemDto> {
	return new Promise((resolve, reject) => {
		if (isEmpty(itemId)) return reject('No item ID proviced')
		if (isUndefined(api)) return reject('Client not initialized')

		getItemsApi(api)
			.getItems({
				ids: [itemId],
			})
			.then((response) => {
				if (response.data.Items && response.data.TotalRecordCount == 1)
					resolve(response.data.Items[0])
				else reject(`${response.data.TotalRecordCount} items returned for ID`)
			})
			.catch((error) => {
				reject(error)
			})
	})
}

/**
 * Fetches tracks for an album, sectioned into discs for display in a {@link SectionList}
 * @param album The album to fetch tracks for
 * @returns An array of {@link Section}s, where each section title is the disc number,
 * and the data is the disc tracks - an array of {@link BaseItemDto}s
 */
export async function fetchAlbumDiscs(
	api: Api | undefined,
	album: BaseItemDto,
): Promise<{ title: string; data: BaseItemDto[] }[]> {
	return new Promise<{ title: string; data: BaseItemDto[] }[]>((resolve, reject) => {
		if (isEmpty(album.Id)) return reject('No album ID provided')
		if (isUndefined(api)) return reject('Client not initialized')

		let sortBy: ItemSortBy[] = []

		sortBy = [ItemSortBy.ParentIndexNumber, ItemSortBy.IndexNumber, ItemSortBy.SortName]

		getItemsApi(api)
			.getItems({
				parentId: album.Id!,
				sortBy,
			})
			.then(({ data }) => {
				const discs = data.Items
					? Object.keys(groupBy(data.Items, (track) => track.ParentIndexNumber)).map(
							(discNumber) => {
								console.debug(discNumber)
								return {
									title: discNumber,
									data: data.Items!.filter((track: BaseItemDto) =>
										track.ParentIndexNumber
											? isEqual(
													discNumber,
													(track.ParentIndexNumber ?? 0).toString(),
												)
											: track,
									),
								}
							},
						)
					: [{ title: '1', data: [] }]

				resolve(discs)
			})
			.catch((error) => {
				reject(error)
			})
	})
}
