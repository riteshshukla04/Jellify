import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'

import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'

type Props = {
	reloader: number
	onRetry: () => void
	onError?: (error: Error, info: React.ErrorInfo) => void
	children: React.ReactNode
}

export default function ErrorBoundary({
	reloader,
	onRetry,
	onError,
	children,
}: Props): React.JSX.Element {
	const [hasError, setHasError] = useState(false)
	const [error, setError] = useState<Error | null>(null)

	// Reset error state if the `reloader` prop changes
	useEffect(() => {
		setHasError(false)
		setError(null)
	}, [reloader])

	// Handle retry button press
	const handleRetry = () => {
		if (onRetry) onRetry()
	}

	// Custom fallback UI for errors
	if (hasError) {
		console.log('hasError', hasError)
		return (
			<View style={styles.container}>
				<Text style={styles.emoji}>🎵😵‍💫</Text>
				<Text style={styles.title}>Oops! That was a wrong note.</Text>
				<Text style={styles.subtitle}>
					Jellify stopped unexpectedly. Let’s tune things up and try again!
				</Text>
				<TouchableOpacity style={styles.button} onPress={handleRetry}>
					<Text style={styles.buttonText}>Retry</Text>
				</TouchableOpacity>
				{/* {__DEV__ && error && (
                    <Text style={styles.devError}>{error.toString()}</Text>
                )} */}
			</View>
		)
	}

	// Wrap children in React's ErrorBoundary
	return <ReactErrorBoundary fallback={<View></View>}>{children}</ReactErrorBoundary>
}

const { width, height } = Dimensions.get('window')
const styles = StyleSheet.create({
	container: {
		flex: 1,
		width,
		height,
		backgroundColor: '#18181b',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 32,
	},
	emoji: { fontSize: 60, marginBottom: 16 },
	title: {
		color: '#fff',
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 12,
		textAlign: 'center',
	},
	subtitle: {
		color: '#a1a1aa',
		fontSize: 16,
		marginBottom: 32,
		textAlign: 'center',
		lineHeight: 22,
	},
	button: {
		backgroundColor: '#2563eb',
		borderRadius: 25,
		paddingVertical: 12,
		paddingHorizontal: 32,
		marginTop: 8,
	},
	buttonText: {
		color: '#fff',
		fontSize: 17,
		fontWeight: '600',
		letterSpacing: 1,
	},
	devError: {
		marginTop: 24,
		color: '#f87171',
		fontSize: 12,
		textAlign: 'center',
	},
})
