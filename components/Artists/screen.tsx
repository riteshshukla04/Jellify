import React from 'react'
import { StackParamList } from '../types'
import { RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import Artists from './component'

export default function ArtistsScreen({
	route,
	navigation,
}: {
	route: RouteProp<StackParamList, 'Artists'>
	navigation: NativeStackNavigationProp<StackParamList, 'Artists', undefined>
}): React.JSX.Element {
	return <Artists route={route} navigation={navigation} />
}
