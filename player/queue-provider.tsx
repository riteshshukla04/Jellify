import React, { ReactNode } from 'react'
import { createContext } from 'react'

interface QueueContext {}

const QueueContextInitailizer = () => {
	return {}
}

export const QueueContext = createContext<QueueContext>({})

export const QueueProvider: ({ children }: { children: ReactNode }) => React.JSX.Element = ({
	children,
}: {
	children: ReactNode
}) => {
	const urmo = QueueContextInitailizer()

	return <QueueContext.Provider value={{}}>{children}</QueueContext.Provider>
}
