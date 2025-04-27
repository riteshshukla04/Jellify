import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Player from './Player/stack'
import { Tabs } from './tabs'
import { StackParamList } from './types'
import { useTheme } from 'tamagui'

export default function Navigation(): React.JSX.Element {
	const RootStack = createNativeStackNavigator<StackParamList>()

	const theme = useTheme()

	return (
		<RootStack.Navigator>
			<RootStack.Screen
				name='Tabs'
				component={Tabs}
				options={{
					headerShown: false,
					navigationBarColor: theme.background.val,
				}}
			/>
			<RootStack.Screen
				name='Player'
				component={Player}
				options={{
					headerShown: false,
					presentation: 'modal',
				}}
			/>
		</RootStack.Navigator>
	)
}
