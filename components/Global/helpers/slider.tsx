import React from "react";
import { SliderProps as TamaguiSliderProps, Slider as TamaguiSlider, styled, Slider, getTokens, getToken } from "tamagui";

interface SliderProps {
    value?: number | undefined;
    max: number;
    width?: number | undefined
    props: TamaguiSliderProps
}

const JellifyActiveSliderTrack = styled(Slider.TrackActive, {
    backgroundColor: getTokens().color.$telemagenta
})

const JellifySliderThumb = styled(Slider.Thumb, {
    backgroundColor: getToken("$color.purpleDark"),
    borderColor: getToken("$color.amethyst"),
})

const JellifySliderTrack = styled(Slider.Track, {
    backgroundColor: getToken("$color.amethyst")
});
export function HorizontalSlider({ 
    value, 
    max,
    width, 
    props 
}: SliderProps) : React.JSX.Element {
    
    return (
        <TamaguiSlider 
            width={width} 
            value={value ? [value] : []}
            max={max} 
            step={1}
            orientation="horizontal"
            marginHorizontal={10}
            { ...props }
            >
                <JellifySliderTrack size="$4">
                    <JellifyActiveSliderTrack size={"$4"} />
                </JellifySliderTrack>
                <JellifySliderThumb 
                    circular
                    index={0}
                    size={"$1"}
                    hitSlop={{
                        top: 35,
                        right: 70,
                        bottom: 70,
                        left: 70
                    }}
                />
        </TamaguiSlider>
    )
}