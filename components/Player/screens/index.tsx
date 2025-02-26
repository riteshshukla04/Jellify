import { StackParamList } from "../../../components/types";
import { usePlayerContext } from "../../../player/provider";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState, useMemo } from "react";
import { SafeAreaView, useSafeAreaFrame } from "react-native-safe-area-context";
import { YStack, XStack, Spacer, getTokens } from "tamagui";
import PlayPauseButton from "../helpers/buttons";
import { Text } from "../../../components/Global/helpers/text";
import Icon from "../../../components/Global/helpers/icon";
import FavoriteButton from "../../Global/components/favorite-button";
import BlurhashedImage from "../../Global/components/blurhashed-image";
import TextTicker from "react-native-text-ticker";
import { ProgressMultiplier, TextTickerConfig } from "../component.config";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { useProgress } from "react-native-track-player";
import { UPDATE_INTERVAL } from "../../../player/config";
import Scrubber from "../helpers/scrubber";

export default function PlayerScreen({ 
    navigation 
} : { 
    navigation: NativeStackNavigationProp<StackParamList>
}) : React.JSX.Element {

    const { 
        nowPlayingIsFavorite,
        setNowPlayingIsFavorite,
        nowPlaying, 
        useSeekTo, 
        useSkip, 
        usePrevious, 
        playbackState,
        queue
    } = usePlayerContext();
    
    const progress = useProgress(UPDATE_INTERVAL);

    /**
     * TrackPlayer.getProgress() returns a high sig-fig number. We're going to apply
     * a multiplier so that the scrubber bar can take advantage of those extra numbers
     */
    const [progressState, setProgressState] = useState<number>(
        progress && progress.position 
        ? Math.ceil(progress.position * ProgressMultiplier)
        : 0
    );

    const { width } = useSafeAreaFrame();

    return (
        <SafeAreaView edges={["right", "left"]}>
            { nowPlaying && (
                <>
                <YStack>

                    { useMemo(() => {
                        return (
                        <>
                            <XStack 
                                marginBottom={"$2"}
                                marginHorizontal={"$2"}
                                >

                                <YStack 
                                    alignContent="flex-end"
                                    flex={1}
                                    justifyContent="center"
                                    >
                                    <Icon
                                        name="chevron-down"
                                        onPress={() => {
                                            navigation.goBack();
                                        }}
                                        small
                                        />
                                </YStack>

                                <YStack 
                                alignItems="center"
                                alignContent="center"
                                flex={6}
                                >

                                    <Text>Playing from</Text>
                                    <Text 
                                        bold 
                                        numberOfLines={1} 
                                        lineBreakStrategyIOS="standard"
                                    >
                                        { 
                                            // If the Queue is a BaseItemDto, display the name of it
                                            typeof(queue) === 'object' 
                                            ? (queue as BaseItemDto).Name ?? "Untitled"
                                            : queue
                                        }
                                    </Text>
                                </YStack>

                                <Spacer flex={1} />
                            </XStack>

                            <XStack 
                                justifyContent="center"
                                alignContent="center"
                                minHeight={width / 1.1}
                                    >
                                    <BlurhashedImage
                                        borderRadius={2}
                                        item={nowPlaying!.item}
                                        width={width / 1.1}
                                        />
                            </XStack>
                        </>
                        )
                    }, [
                        nowPlaying,
                        queue
                    ])}

                    <XStack marginHorizontal={20} paddingVertical={5}>

                        {/** Memoize TextTickers otherwise they won't animate due to the progress being updated in the PlayerContext */}
                        { useMemo(() => {
                            return (
                                <YStack justifyContent="flex-start" flex={5}>
                                    <TextTicker {...TextTickerConfig}>
                                        <Text 
                                            bold 
                                            fontSize={"$6"}
                                            >
                                            {nowPlaying!.title ?? "Untitled Track"}
                                        </Text>
                                    </TextTicker>

                                    <TextTicker {...TextTickerConfig}>
                                        <Text 
                                            fontSize={"$6"}
                                            color={getTokens().color.telemagenta}
                                            onPress={() => {
                                                if (nowPlaying!.item.ArtistItems) {
                                                    navigation.goBack(); // Dismiss player modal
                                                    navigation.navigate('Tabs', {
                                                        screen: 'Home', 
                                                        params: {
                                                            screen: 'Artist',
                                                            params: {
                                                                artist: nowPlaying!.item.ArtistItems![0],
                                                            }
                                                        }
                                                    });
                                                }
                                            }}
                                            >
                                            {nowPlaying.artist ?? "Unknown Artist"}
                                        </Text>
                                    </TextTicker>

                                    <TextTicker {...TextTickerConfig}>
                                        <Text 
                                            fontSize={"$6"} 
                                            color={"$borderColor"}
                                            >
                                            { nowPlaying!.album ?? "" }
                                        </Text>
                                    </TextTicker>
                                </YStack>
                        )}, [
                            nowPlaying
                        ])}

                        <XStack 
                            justifyContent="flex-end" 
                            alignItems="center" 
                            flex={2}
                            >
                            {/* Buttons for favorites, song menu go here */}

                            <Icon
                                name="dots-horizontal-circle-outline"
                                onPress={() => {
                                    navigation.navigate("Details", {
                                        item: nowPlaying!.item,
                                        isNested: true
                                    });
                                }}
                            />

                            <Spacer />

                            <FavoriteButton 
                                item={nowPlaying!.item} 
                                onToggle={() => setNowPlayingIsFavorite(!nowPlayingIsFavorite)}
                                />
                        </XStack>
                    </XStack>

                    <XStack justifyContent="center" marginTop={"$3"}>
                        {/* playback progress goes here */}
                        <Scrubber />
                    </XStack>

                    { useMemo(() => {
                        return (
                            <XStack 
                                alignItems="center" 
                                justifyContent="space-evenly" 
                                marginVertical={"$2"}
                                >
                                <Icon
                                    color={getTokens().color.amethyst.val}
                                    name="rewind-15"
                                    onPress={() => {
                                        useSeekTo.mutate(progress!.position - 15);
                                    }}
                                    />
                                
                                <Icon
                                    color={getTokens().color.amethyst.val}
                                    name="skip-previous"
                                    onPress={() => {

                                        console.debug(`Skipping at ${progressState}`)
                                        if (progressState / ProgressMultiplier < 3)
                                            usePrevious.mutate()
                                        else {
                                            useSeekTo.mutate(0);
                                        }
                                    }}
                                    large
                                    />

                                {/* I really wanted a big clunky play button */}
                                <PlayPauseButton size={width / 5} />

                                <Icon
                                    color={getTokens().color.amethyst.val}
                                    name="skip-next" 
                                    onPress={() => useSkip.mutate(undefined)}
                                    large
                                    />    

                                <Icon
                                    color={getTokens().color.amethyst.val}
                                    name="fast-forward-15"
                                    onPress={() => { 
                                        useSeekTo.mutate(progress!.position + 15);
                                    }}  
                                    />              
                            </XStack>
                            )
                    }, [
                        playbackState,
                        progressState
                    ])}
                    
                    <XStack justifyContent="space-evenly" marginVertical={"$7"}>
                        <Icon name="speaker-multiple"
                        />

                        <Spacer />

                        <Icon
                            name="playlist-music"
                            onPress={() => {
                                navigation.navigate("Queue");
                            }}
                        />
                    </XStack>
                </YStack>
            </>
            )}
        </SafeAreaView>
    );
}