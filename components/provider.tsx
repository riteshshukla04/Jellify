import { isUndefined } from 'lodash'
import { createContext, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react'
import { CarPlay } from 'react-native-carplay'
import Client from '../api/client'
import CarPlayNavigation from './CarPlay/Navigation'
import CarPlayNowPlaying from './CarPlay/NowPlaying'
import { Platform } from 'react-native'

interface JellifyContext {
	loggedIn: boolean
	setLoggedIn: React.Dispatch<SetStateAction<boolean>>
	carPlayConnected: boolean
}

const JellifyContextInitializer = () => {
	const [loggedIn, setLoggedIn] = useState<boolean>(
		!isUndefined(Client) &&
			!isUndefined(Client.api) &&
			!isUndefined(Client.user) &&
			!isUndefined(Client.server) &&
			!isUndefined(Client.library),
	)

	const [carPlayConnected, setCarPlayConnected] = useState(CarPlay ? CarPlay.connected : false)

	useEffect(() => {
		CarPlay.bridge.reload()
		function onConnect() {
			setCarPlayConnected(true)

			if (loggedIn) {
				if (Platform.OS === 'ios') {
					CarPlay.setRootTemplate(CarPlayNavigation)
					CarPlay.pushTemplate(CarPlayNowPlaying)
					CarPlay.enableNowPlaying(true) // https://github.com/birkir/react-native-carplay/issues/185
				}
			}
		}

		function onDisconnect() {
			setCarPlayConnected(false)
		}

		if (CarPlay) {
			CarPlay.registerOnConnect(onConnect)
			CarPlay.registerOnDisconnect(onDisconnect)
			return () => {
				CarPlay.unregisterOnConnect(onConnect)
				CarPlay.unregisterOnDisconnect(onDisconnect)
			}
		}
	})

	return {
		loggedIn,
		setLoggedIn,
		carPlayConnected,
	}
}

const JellifyContext = createContext<JellifyContext>({
	loggedIn: false,
	setLoggedIn: () => {},
	carPlayConnected: false,
})

export const JellifyProvider: ({ children }: { children: ReactNode }) => React.JSX.Element = ({
	children,
}: {
	children: ReactNode
}) => {
	const { loggedIn, setLoggedIn, carPlayConnected } = JellifyContextInitializer()

	return (
		<JellifyContext.Provider
			value={{
				loggedIn,
				setLoggedIn,
				carPlayConnected,
			}}
		>
			{children}
		</JellifyContext.Provider>
	)
}

export const useJellifyContext = () => useContext(JellifyContext)
