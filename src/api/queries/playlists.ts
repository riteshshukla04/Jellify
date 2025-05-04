import { BaseItemDto, ItemSortBy, SortOrder } from '@jellyfin/sdk/lib/generated-client/models'
import { getItemsApi } from '@jellyfin/sdk/lib/utils/api'
import { JellifyUser } from '../../types/JellifyUser'
import { Api } from '@jellyfin/sdk'
import { isUndefined } from 'lodash'
import { JellifyLibrary } from '../../types/JellifyLibrary'

export async function fetchUserPlaylists(
	api: Api | undefined,
	user: JellifyUser | undefined,
	library: JellifyLibrary | undefined,
	sortBy: ItemSortBy[] = [],
): Promise<BaseItemDto[] | void> {
	console.debug(
		`Fetching user playlists ${sortBy.length > 0 ? 'sorting by ' + sortBy.toString() : ''}`,
	)

	const defaultSorting: ItemSortBy[] = [ItemSortBy.IsFolder, ItemSortBy.SortName]

	return new Promise((resolve, reject) => {
		if (isUndefined(api)) return reject('Client instance not set')
		if (isUndefined(user)) return reject('User instance not set')
		if (isUndefined(library)) return reject('Library instance not set')

		getItemsApi(api)
			.getItems({
				userId: user.id,
				parentId: library.playlistLibraryId!,
				fields: ['Path'],
				sortBy: sortBy.concat(defaultSorting),
				sortOrder: [SortOrder.Ascending],
			})
			.then((response) => {
				console.log(response)

				if (response.data.Items)
					return resolve(
						response.data.Items.filter((playlist) =>
							playlist.Path?.includes('/data/playlists'),
						),
					)
				else return resolve([])
			})
			.catch((error) => {
				console.error(error)
				return reject(error)
			})
	})
}

export async function fetchPublicPlaylists(
	api: Api | undefined,
	library: JellifyLibrary | undefined,
): Promise<BaseItemDto[]> {
	console.debug('Fetching public playlists')

	return new Promise((resolve, reject) => {
		if (isUndefined(api)) return reject('Client instance not set')
		if (isUndefined(library)) return reject('Library instance not set')

		getItemsApi(api)
			.getItems({
				parentId: library.playlistLibraryId!,
				sortBy: [ItemSortBy.IsFolder, ItemSortBy.SortName],
				sortOrder: [SortOrder.Ascending],
			})
			.then((response) => {
				console.log(response)

				if (response.data.Items)
					return resolve(
						response.data.Items.filter(
							(playlist) => !playlist.Path?.includes('/data/playlists'),
						),
					)
				else return resolve([])
			})
			.catch((error) => {
				console.error(error)
				return reject(error)
			})
	})
}
