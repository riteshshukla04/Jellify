import { StackParamList } from '../../../components/types'
import { RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React from 'react'
import Playlist from '..'

export function PlaylistScreen({
	route,
	navigation,
}: {
	route: RouteProp<StackParamList, 'Playlist'>
	navigation: NativeStackNavigationProp<StackParamList>
}): React.JSX.Element {
	return <Playlist playlist={route.params.playlist} navigation={navigation} />
}
