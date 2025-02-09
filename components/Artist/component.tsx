import { ScrollView, YStack } from "tamagui";
import { useArtistAlbums } from "../../api/queries/artist";
import { FlatList } from "react-native";
import { ItemCard } from "../Global/components/item-card";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../types";
import { H2 } from "../Global/helpers/text";
import { useState } from "react";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { useSafeAreaFrame } from "react-native-safe-area-context";
import FavoriteButton from "../Global/components/favorite-button";
import BlurhashedImage from "../Global/components/blurhashed-image";

interface ArtistProps {
    artist: BaseItemDto
    navigation: NativeStackNavigationProp<StackParamList>
}

export default function Artist({
    artist,
    navigation
}: ArtistProps): React.JSX.Element {

    navigation.setOptions({
        headerRight: () => { 
            return (
                <FavoriteButton item={artist} />
            )
        }
    });

    const [columns, setColumns] = useState<number>(2);

    const { height, width } = useSafeAreaFrame();

    const bannerHeight = height / 6;

    const { data: albums } = useArtistAlbums(artist.Id!);

    return (
        <ScrollView 
            contentInsetAdjustmentBehavior="automatic"
            alignContent="center">
            <YStack alignContent="center" justifyContent="center" minHeight={bannerHeight}>
                <BlurhashedImage
                    item={artist}
                    width={width}
                />
            </YStack>

            <H2>Albums</H2>
                <FlatList
                    contentContainerStyle={{
                        flexGrow: 1,
                        alignContent: 'center'
                    }}
                    data={albums}
                    numColumns={columns} // TODO: Make this adjustable
                    renderItem={({ item: album }) => {
                        return (
                            <ItemCard
                                caption={album.Name}
                                subCaption={album.ProductionYear?.toString()}
                                width={(width / 1.1) / columns}
                                cornered 
                                item={album}
                                onPress={() => {
                                    navigation.navigate('Album', {
                                        album
                                    })
                                }}
                            />
                        )
                    }}
                />
        </ScrollView>
    )
}