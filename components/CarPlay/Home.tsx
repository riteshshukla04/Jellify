import { QueryKeys } from '../../enums/query-keys'
import Client from '../../api/client'
import { CarPlay, ListTemplate } from 'react-native-carplay'
import { queryClient } from '../../constants/query-client'
import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models'
import RecentTracksTemplate from './RecentTracks'
import RecentArtistsTemplate from './RecentArtists'
import uuid from 'react-native-uuid'

const CarPlayHome = new ListTemplate({
	id: uuid.v4(),
	title: 'Home',
	tabTitle: 'Home',
	tabSystemImageName: 'music.house.fill',
	sections: [
		{
			header: `Hi ${Client.user?.name ?? 'there'}`,
			items: [
				{ id: QueryKeys.RecentlyPlayedArtists, text: 'Recent Artists' },
				{ id: QueryKeys.RecentlyPlayed, text: 'Recently Played' },
				{ id: QueryKeys.UserPlaylists, text: 'Your Playlists' },
			],
		},
	],
	onItemSelect: async ({ index }) => {
		console.debug(`Home item selected`)

		switch (index) {
			case 0: {
				const artists =
					queryClient.getQueryData<BaseItemDto[]>([QueryKeys.RecentlyPlayedArtists]) ?? []
				CarPlay.pushTemplate(RecentArtistsTemplate(artists))
				break
			}
			case 1: {
				const items =
					queryClient.getQueryData<BaseItemDto[]>([QueryKeys.RecentlyPlayed]) ?? []
				CarPlay.pushTemplate(RecentTracksTemplate(items))
				break
			}
			case 2: {
				break
			}
		}
	},
})

export default CarPlayHome
