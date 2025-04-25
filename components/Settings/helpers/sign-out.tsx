import React from 'react'
import Button from '../../Global/helpers/button'
import Client from '../../../api/client'
import { useJellifyContext } from '../../../components/provider'
import TrackPlayer from 'react-native-track-player'
import { StackParamList } from '@/components/types'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'

export default function SignOut(): React.JSX.Element {
	const { setLoggedIn } = useJellifyContext()
	const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>()

	return (
		<Button
			onPress={() => {
				setLoggedIn(false)
				Client.signOut()
				TrackPlayer.reset()
				// navigation.navigate('Offline')
			}}
		>
			Sign Out
		</Button>
	)
}
