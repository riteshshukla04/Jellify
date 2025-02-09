import React from "react";
import { View } from "tamagui";
import { useHomeContext } from "../provider";
import { H2 } from "../../Global/helpers/text";
import { StackParamList } from "../../types";
import { FlatList } from "react-native";
import { ItemCard } from "../../Global/components/item-card";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export default function RecentArtists({ navigation }: { navigation: NativeStackNavigationProp<StackParamList>}): React.JSX.Element {

    const { recentArtists } = useHomeContext();

    return (
        <View>
            <H2 marginLeft={"$2"}>Recent Artists</H2>
            <FlatList horizontal
                data={recentArtists}   
                renderItem={({ item: recentArtist}) => {
                    return (
                        <ItemCard 
                            item={recentArtist}
                            caption={recentArtist.Name ?? "Unknown Artist"}
                            onPress={() => {
                                navigation.navigate('Artist', 
                                    { 
                                        artist: recentArtist, 
                                    }
                                )}
                            }>
                        </ItemCard>
                    )
                }}
            />
        </View>
    )
}