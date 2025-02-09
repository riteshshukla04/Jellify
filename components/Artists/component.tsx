import { useFavoriteArtists } from "../../api/queries/favorites";
import { useSafeAreaFrame } from "react-native-safe-area-context";
import React from "react";
import { FlatList, RefreshControl } from "react-native";
import { ItemCard } from "../Global/components/item-card";
import { ArtistsProps } from "../types";

export default function Artists({ navigation }: ArtistsProps): React.JSX.Element {

    const { data: artists, refetch, isPending } = useFavoriteArtists();

    const { width } = useSafeAreaFrame();

    return (
        <FlatList
            contentInsetAdjustmentBehavior="automatic"
            numColumns={2}
            data={artists}
            refreshControl={
                <RefreshControl
                    refreshing={isPending}
                    onRefresh={refetch}
                />
            }
            renderItem={({ index, item: artist}) => {
                return (
                    <ItemCard
                        item={artist}
                        caption={artist.Name ?? "Unknown Artist"}
                        onPress={() => {
                            navigation.navigate("Artist", { artist })
                        }}
                        width={width / 2.1}
                    />
                )
            }}
        />
    )
}