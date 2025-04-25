import Client from '../../../api/client'
import { Text } from '../../../components/Global/helpers/text'
import React from 'react'
import { View } from 'tamagui'

export default function LibraryDetails(): React.JSX.Element {
	return (
		<View>
			<Text>{`LibraryID: ${Client.library!.musicLibraryId}`}</Text>
			<Text>{`Playlist LibraryID: ${Client.library!.playlistLibraryId}`}</Text>
		</View>
	)
}
