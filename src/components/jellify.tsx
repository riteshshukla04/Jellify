import _ from 'lodash'
import React from 'react'
import Navigation from './navigation'
import Login from './Login/component'
import { PlayerProvider } from '../player/player-provider'
import { useColorScheme } from 'react-native'
import { JellifyProvider, useJellifyContext } from './provider'
import { JellifyUserDataProvider } from './user-data-provider'
import { NetworkContextProvider } from './Network/provider'
import { QueueProvider } from '../player/queue-provider'

/**
 * The main component for the Jellify app. Children are wrapped in the {@link JellifyProvider}
 * @returns The {@link Jellify} component
 */
export default function Jellify(): React.JSX.Element {
	const isDarkMode = useColorScheme() === 'dark'

	return (
		<JellifyProvider>
			<App />
		</JellifyProvider>
	)
}
/**
 * The main component for the Jellify app. Depends on {@link useJellifyContext} hook to determine if the user is logged in
 * @returns The {@link App} component
 */
function App(): React.JSX.Element {
	return (
		<JellifyUserDataProvider>
			<NetworkContextProvider>
				<QueueProvider>
					<PlayerProvider>
						<Navigation />
					</PlayerProvider>
				</QueueProvider>
			</NetworkContextProvider>
		</JellifyUserDataProvider>
	)
}
