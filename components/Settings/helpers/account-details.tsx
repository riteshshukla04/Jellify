import { XStack } from '@tamagui/stacks'
import React from 'react'
import { Text } from '../../../components/Global/helpers/text'
import Icon from '../../../components/Global/helpers/icon'
import Client from '../../../api/client'

export default function AccountDetails(): React.JSX.Element {
	return (
		<XStack alignItems='center'>
			<Icon name='account-music-outline' />
			<Text>{Client.user!.name}</Text>
		</XStack>
	)
}
