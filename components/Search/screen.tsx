import { RouteProp } from '@react-navigation/native'
import { StackParamList } from '../types'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React from 'react'
import Search from './component'

export default function SearchScreen({
	route,
	navigation,
}: {
	route: RouteProp<StackParamList>
	navigation: NativeStackNavigationProp<StackParamList>
}): React.JSX.Element {
	return <Search navigation={navigation} />
}
