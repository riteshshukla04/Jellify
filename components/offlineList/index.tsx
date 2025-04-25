import { JellifyTrack } from '@/types/JellifyTrack'
import React from 'react'
import { FlatList, Pressable } from 'react-native'
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated'
import { Image, Text, View, XStack, YStack } from 'tamagui'
import { getAudioCache } from '../Network/offlineModeUtils'
import { usePlayerContext } from '../../player/provider'
import { useNavigation } from '@react-navigation/native'

interface Props {
	tracks: JellifyTrack[]
	onPress: (track: JellifyTrack) => void
}

export function OfflineList() {
	const tracks = getAudioCache()
	const navigation = useNavigation()
	const { usePlayNewQueueOffline } = usePlayerContext()
	const onPress = (track: JellifyTrack) => {
		console.log('onPress', track)
		usePlayNewQueueOffline.mutate({ trackListOffline: track })
		navigation.navigate('Player')
	}

	const renderItem = ({ item }: { item: JellifyTrack }) => (
		<Animated.View
			entering={FadeIn.duration(300)}
			exiting={FadeOut}
			layout={Layout.springify()}
			style={{
				overflow: 'hidden',
				marginVertical: 6,
				borderRadius: 16,
				backgroundColor: '#1c1c1e',
			}}
		>
			<Pressable onPress={() => onPress(item)}>
				<XStack padding={12} gap={12} alignItems='center'>
					<Image
						source={{ uri: item.artwork }}
						style={{ width: 64, height: 64, borderRadius: 12 }}
					/>
					<YStack flex={1}>
						<Text fontWeight='700' color='#fff' numberOfLines={1}>
							{item.title || 'Unknown Title'}
						</Text>
						<Text color='#bbb' numberOfLines={1}>
							{item.artist || 'Unknown Artist'}
						</Text>
					</YStack>
				</XStack>
			</Pressable>
		</Animated.View>
	)

	return (
		<FlatList
			data={tracks}
			keyExtractor={(item) => item.item.Id as string}
			renderItem={renderItem}
			contentContainerStyle={{
				padding: 16,
				paddingBottom: 100,
			}}
			showsVerticalScrollIndicator={false}
		/>
	)
}
