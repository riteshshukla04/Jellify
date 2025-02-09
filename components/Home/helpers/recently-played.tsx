import React from "react";
import { ScrollView, View } from "tamagui";
import { useHomeContext } from "../provider";
import { H2 } from "../../Global/helpers/text";
import { ItemCard } from "../../Global/components/item-card";
import { usePlayerContext } from "../../../player/provider";
import { StackParamList } from "../../../components/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { trigger } from "react-native-haptic-feedback";
import { QueuingType } from "../../../enums/queuing-type";

export default function RecentlyPlayed({ 
    navigation 
} : { 
    navigation: NativeStackNavigationProp<StackParamList>
}): React.JSX.Element {

    const { usePlayNewQueue } = usePlayerContext();
    const { recentTracks } = useHomeContext();

    return (
        <View>
            <H2 marginLeft={"$2"}>Play it again</H2>
            <ScrollView horizontal>
                { recentTracks && recentTracks.map((recentlyPlayedTrack, index) => {
                    return (
                        <ItemCard
                            caption={recentlyPlayedTrack.Name}
                            subCaption={`${recentlyPlayedTrack.Artists?.join(", ")}`}
                            cornered
                            width={150}
                            item={recentlyPlayedTrack}
                            onPress={() => {
                                usePlayNewQueue.mutate({ 
                                    track: recentlyPlayedTrack, 
                                    index: index,
                                    tracklist: recentTracks,
                                    queueName: "Recently Played",
                                    queuingType: QueuingType.FromSelection
                                });
                            }}
                            onLongPress={() => {
                                trigger("impactMedium");
                                navigation.navigate("Details", {
                                    item: recentlyPlayedTrack,
                                    isNested: false
                                })
                            }}
                        />                                
                    )
                })}
            </ScrollView>
        </View>
    )
}