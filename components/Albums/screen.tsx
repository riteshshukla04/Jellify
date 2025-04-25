import React from 'react'
import { StackParamList } from '../types'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import Albums from './component'

export default function AlbumsScreen(
	props: NativeStackScreenProps<StackParamList, 'Albums'>,
): React.JSX.Element {
	return <Albums {...props} />
}
