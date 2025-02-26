import { StackParamList } from "../../../components/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { QueryKeys } from "../../../enums/query-keys";
import HorizontalCardList from "../../../components/Global/components/horizontal-list";
import { ItemCard } from "../../../components/Global/components/item-card";
import { useDiscoverContext } from "../provider";

export default function RecentlyAdded({ 
    navigation
} : { 
    navigation: NativeStackNavigationProp<StackParamList>
}) : React.JSX.Element {

    const { recentlyAdded } = useDiscoverContext();

    return (
        <HorizontalCardList
            squared
            data={recentlyAdded}
            onSeeMore={() => {
                navigation.navigate("Albums", {
                    query: QueryKeys.RecentlyAdded
                })
            }}
            renderItem={({ item }) => 
                <ItemCard
                    caption={item.Name}
                    subCaption={`${item.Artists?.join(", ")}`}
                    squared
                    width={150}
                    item={item}
                    onPress={() => {
                        navigation.navigate("Album", {
                            album: item
                        })
                    }}
                />
            }
        />
    )
}