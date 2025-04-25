import { mapDtoToTrack } from '../..//helpers/mappings'
import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models'
import { CarPlay, ListTemplate } from 'react-native-carplay'
import TrackPlayer from 'react-native-track-player'
import uuid from 'react-native-uuid'
import CarPlayNowPlaying from './NowPlaying'

const RecentTracksTemplate = (items: BaseItemDto[]) =>
	new ListTemplate({
		id: uuid.v4(),
		sections: [
			{
				items:
					items?.map((item) => {
						return {
							id: item.Id!,
							text: item.Name ?? 'Untitled',
						}
					}) ?? [],
			},
		],
		onItemSelect: async (item) => {
			await TrackPlayer.setQueue(items.map((item) => mapDtoToTrack(item)))

			await TrackPlayer.skip(item.index)

			await TrackPlayer.play()

			CarPlay.pushTemplate(CarPlayNowPlaying())
		},
	})

export default RecentTracksTemplate
