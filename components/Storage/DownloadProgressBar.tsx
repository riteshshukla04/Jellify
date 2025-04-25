// DownloadProgressBar.tsx
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'

export const DownloadProgressBar = () => {
	const { data: downloads } = useQuery({
		queryKey: ['downloads'],
		initialData: {},
	})

	return (
		<View style={styles.container}>
			{/* eslint-disable @typescript-eslint/no-explicit-any */}
			{Object.entries(downloads || {}).map(([url, item]: any) => {
				const animatedWidth = useSharedValue(item.progress)
				animatedWidth.value = withTiming(item.progress, { duration: 200 })

				const animatedStyle = useAnimatedStyle(() => ({
					width: `${animatedWidth.value * 100}%`,
				}))

				return (
					<View key={url} style={styles.item}>
						<Text style={styles.label}>{item.name}</Text>
						<View style={styles.bar}>
							<Animated.View style={[styles.fill, animatedStyle]} />
						</View>
					</View>
				)
			})}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		padding: 12,
		backgroundColor: '#111',
	},
	item: {
		marginBottom: 12,
	},
	label: {
		color: '#fff',
		marginBottom: 4,
		fontSize: 14,
	},
	bar: {
		height: 8,
		backgroundColor: '#333',
		borderRadius: 4,
		overflow: 'hidden',
	},
	fill: {
		height: 8,
		backgroundColor: '#00bcd4',
		borderRadius: 4,
	},
})
