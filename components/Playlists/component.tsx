import { useFavoritePlaylists } from "../../api/queries/favorites";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import { useSafeAreaFrame } from "react-native-safe-area-context";
import { ItemCard } from "../Global/components/item-card";
import { PlaylistsProps } from "../types";

export default function Playlists({ navigation }: PlaylistsProps) : React.JSX.Element {

    const { data: playlists, isPending, refetch } = useFavoritePlaylists();

    const { width } = useSafeAreaFrame();

    return (
        <FlatList
            contentInsetAdjustmentBehavior="automatic"
            numColumns={2}
            data={playlists}
            refreshControl={
                <RefreshControl
                    refreshing={isPending}
                    onRefresh={refetch}
                />
            }
            renderItem={({ index, item: playlist }) => {
                return (
                    <ItemCard
                        item={playlist}
                        caption={playlist.Name ?? "Untitled Playlist"}
                        onPress={() => {
                            navigation.navigate("Playlist", { playlist })
                        }}
                        width={width / 2.1}
                    />
                )
            }}
        />
    )
}