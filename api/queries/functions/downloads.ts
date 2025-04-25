import { Dirs, FileSystem } from 'react-native-file-access'
import Client from '../../../api/client'
import { getLibraryApi } from '@jellyfin/sdk/lib/utils/api'

export async function downloadTrack(itemId: string): Promise<void> {
	// Make sure downloads folder exists, create if it doesn't
	if (!(await FileSystem.exists(`${Dirs.DocumentDir}/downloads`)))
		await FileSystem.mkdir(`${Dirs.DocumentDir}/downloads`)

	getLibraryApi(Client.api!)
		.getDownload(
			{
				itemId,
			},
			{
				responseType: 'blob',
			},
		)
		.then(async (response) => {
			if (response.status < 300) {
				await FileSystem.writeFile(getTrackFilePath(itemId), response.data)
			}
		})
}

export function getTrackFilePath(itemId: string) {
	return `${Dirs.DocumentDir}/downloads/${itemId}`
}
