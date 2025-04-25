import React, { createContext, ReactNode, SetStateAction, useContext, useState } from 'react'
import _ from 'lodash'
import { JellifyServer } from '../../types/JellifyServer'
import Client from '../../api/client'
import { JellifyUser } from '../../types/JellifyUser'
import { JellifyLibrary } from '../../types/JellifyLibrary'

interface JellyfinAuthenticationContext {
	server: JellifyServer | undefined
	setServer: React.Dispatch<React.SetStateAction<JellifyServer | undefined>>
	user: JellifyUser | undefined
	setUser: React.Dispatch<React.SetStateAction<JellifyUser | undefined>>
	library: JellifyLibrary | undefined
	setLibrary: React.Dispatch<React.SetStateAction<JellifyLibrary | undefined>>
	triggerAuth: boolean
	setTriggerAuth: React.Dispatch<React.SetStateAction<boolean>>
}

const JellyfinAuthenticationContextInitializer = () => {
	const [server, setServer] = useState<JellifyServer | undefined>(Client.server)
	const [user, setUser] = useState<JellifyUser | undefined>(Client.user)
	const [library, setLibrary] = useState<JellifyLibrary | undefined>(Client.library)

	const [triggerAuth, setTriggerAuth] = useState<boolean>(true)

	return {
		user,
		setUser,
		server,
		setServer,
		library,
		setLibrary,
		triggerAuth,
		setTriggerAuth,
	}
}

const JellyfinAuthenticationContext = createContext<JellyfinAuthenticationContext>({
	user: undefined,
	setUser: () => {},
	server: undefined,
	setServer: () => {},
	library: undefined,
	setLibrary: () => {},
	triggerAuth: true,
	setTriggerAuth: () => {},
})

export const JellyfinAuthenticationProvider: ({
	children,
}: {
	children: ReactNode
}) => React.JSX.Element = ({ children }: { children: ReactNode }) => {
	const { user, setUser, server, setServer, library, setLibrary, triggerAuth, setTriggerAuth } =
		JellyfinAuthenticationContextInitializer()

	return (
		<JellyfinAuthenticationContext.Provider
			value={{
				user,
				setUser,
				server,
				setServer,
				library,
				setLibrary,
				triggerAuth,
				setTriggerAuth,
			}}
		>
			{children}
		</JellyfinAuthenticationContext.Provider>
	)
}

export const useAuthenticationContext = () => useContext(JellyfinAuthenticationContext)
