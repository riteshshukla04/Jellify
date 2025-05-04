import { getItemsApi } from '@jellyfin/sdk/lib/utils/api'
import { BaseItemDto, BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models'
import { Api } from '@jellyfin/sdk'
import { isUndefined } from 'lodash'

/**
 * Fetches search suggestions from the Jellyfin server
 * @param api The Jellyfin {@link Api} client
 * @returns A promise of a {@link BaseItemDto} array, be it empty or not
 */
export async function fetchSearchSuggestions(api: Api | undefined): Promise<BaseItemDto[]> {
	return new Promise((resolve, reject) => {
		if (isUndefined(api)) return reject('Client instance not set')

		getItemsApi(api)
			.getItems({
				recursive: true,
				limit: 10,
				includeItemTypes: [
					BaseItemKind.MusicArtist,
					BaseItemKind.Playlist,
					BaseItemKind.Audio,
					BaseItemKind.MusicAlbum,
				],
				sortBy: ['IsFavoriteOrLiked', 'Random'],
			})
			.then(({ data }) => {
				if (data.Items) resolve(data.Items)
				else resolve([])
			})
			.catch((error) => {
				reject(error)
			})
	})
}
