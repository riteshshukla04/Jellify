import {
	BaseItemDto,
	BaseItemKind,
	ItemFields,
	ItemSortBy,
	SortOrder,
} from '@jellyfin/sdk/lib/generated-client/models'
import { getItemsApi } from '@jellyfin/sdk/lib/utils/api/items-api'
import QueryConfig from './query.config'
import { getUserLibraryApi } from '@jellyfin/sdk/lib/utils/api'
import { Api } from '@jellyfin/sdk'
import { isUndefined } from 'lodash'
import { JellifyLibrary } from '../../../src/types/JellifyLibrary'

export async function fetchRecentlyAdded(
	api: Api | undefined,
	library: JellifyLibrary | undefined,
	limit: number = QueryConfig.limits.recents,
	offset?: number | undefined,
): Promise<BaseItemDto[]> {
	if (isUndefined(api)) {
		console.error('Client not set')
		return []
	}
	if (isUndefined(library)) return []
	return await getUserLibraryApi(api)
		.getLatestMedia({
			parentId: library.musicLibraryId,
			limit,
		})
		.then(({ data }) => {
			return offset ? data.slice(offset, data.length - 1) : data
		})
}

/**
 * Fetches recently played tracks for a user from the Jellyfin server.
 * @param limit The number of items to fetch. Defaults to 50
 * @param offset The offset of the items to fetch.
 * @returns The recently played items.
 */
export async function fetchRecentlyPlayed(
	api: Api | undefined,
	library: JellifyLibrary | undefined,
	limit: number = QueryConfig.limits.recents,
	offset?: number | undefined,
): Promise<BaseItemDto[]> {
	console.debug('Fetching recently played items')

	return new Promise((resolve, reject) => {
		if (isUndefined(api)) return reject(new Error('API client not set'))
		else if (isUndefined(library)) return reject(new Error('Library not set'))

		getItemsApi(api)
			.getItems({
				includeItemTypes: [BaseItemKind.Audio],
				startIndex: offset,
				limit,
				parentId: library!.musicLibraryId,
				recursive: true,
				sortBy: [ItemSortBy.DatePlayed],
				sortOrder: [SortOrder.Descending],
				fields: [ItemFields.ParentId],
			})
			.then((response) => {
				console.debug('Received recently played items response')

				if (response.data.Items) return resolve(response.data.Items)
				return resolve([])
			})
			.catch((error) => {
				console.error(error)
				return reject(error)
			})
	})
}

/**
 * Fetches recently played artists for a user from the Jellyfin server,
 * referencing the recently played tracks.
 * @param limit The number of items to fetch. Defaults to 50
 * @param offset The offset of the items to fetch.
 * @returns The recently played artists.
 */
export function fetchRecentlyPlayedArtists(
	api: Api | undefined,
	library: JellifyLibrary | undefined,
	limit: number = QueryConfig.limits.recents,
	offset?: number | undefined,
): Promise<BaseItemDto[]> {
	return fetchRecentlyPlayed(api, library, limit, offset ? offset + 10 : undefined).then(
		(tracks) => {
			return getItemsApi(api!)
				.getItems({
					ids: tracks.map((track) => track.ArtistItems![0].Id!),
				})
				.then((recentArtists) => {
					return recentArtists.data.Items!
				})
		},
	)
}
