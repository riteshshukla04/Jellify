import React, { useEffect, useState } from "react";
import { useProgress } from "react-native-track-player";
import { ProgressMultiplier } from "../component.config";
import { HorizontalSlider } from "@/components/Global/helpers/slider";
import navigation from "@/components/navigation";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { trigger } from "react-native-haptic-feedback";
import { XStack, YStack } from "tamagui";
import { useSafeAreaFrame } from "react-native-safe-area-context";
import { usePlayerContext } from "../../../player/provider";
import { RunTimeSeconds } from "@/components/Global/helpers/time-codes";

const scrubGesture = Gesture.Pan();

export default function Scrubber() : React.JSX.Element {

    const { 
        useSeekTo, 
    } = usePlayerContext();
    

    const { width } = useSafeAreaFrame();

    const progress = useProgress();

    const [seeking, setSeeking] = useState<boolean>(false);
    

    
    const [position, setPosition] = useState<number>(progress && progress.position ? 
        Math.floor(progress.position * ProgressMultiplier)
        : 0
    );

    useEffect(() => {
        if (!seeking)
            progress && progress.position
            ? setPosition(
                Math.floor(
                    progress.position * ProgressMultiplier
                )
            ) : 0;
    }, [
        progress
    ]);

    return (
        <YStack>

            <GestureDetector gesture={scrubGesture}>
                <HorizontalSlider 
                    value={position}
                    max={
                        progress && progress.duration > 0 
                        ? progress.duration * ProgressMultiplier 
                        : 1
                    }
                    width={width / 1.1}
                    props={{
                        // If user swipes off of the slider we should seek to the spot
                        onPressOut: (event) => {
                            trigger("notificationSuccess")
                            setSeeking(false);
                            useSeekTo.mutate(Math.floor(position / ProgressMultiplier));
                        },
                        onSlideStart: (event, value) => {
                            trigger("impactLight");
                            setSeeking(true);
                            setPosition(value)
                        },
                        onSlideMove: (event, value) => {
                            trigger("clockTick")
                            setSeeking(true);
                            setPosition(value);
                        },
                        onSlideEnd: (event, value) => {
                            trigger("notificationSuccess")
                            setSeeking(false);
                            setPosition(value)
                            useSeekTo.mutate(Math.floor(value / ProgressMultiplier));
                        }
                    }}
                    />
            </GestureDetector>

            <XStack marginHorizontal={20} marginTop={"$3"} marginBottom={"$2"}>
                <XStack flex={1} justifyContent="flex-start">
                    <RunTimeSeconds>{Math.floor(position / ProgressMultiplier)}</RunTimeSeconds>
                </XStack>

                <XStack flex={1} justifyContent="space-between">
                    { /** Track metadata can go here */}
                </XStack>

                <XStack flex={1} justifyContent="flex-end">
                    <RunTimeSeconds>
                        {
                            progress && progress.duration
                            ? Math.ceil(progress.duration) 
                            : 0
                        }
                    </RunTimeSeconds>
                </XStack>
            </XStack>
        </YStack>
    )
}