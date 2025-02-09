import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { StackParamList } from "../types";
import FavoritesScreen from "./component";
import { ArtistScreen } from "../Artist/screens";
import { AlbumScreen } from "../Album/screens";
import { PlaylistScreen } from "../Playlist/screens";
import ArtistsScreen from "../Artists/screen";
import AlbumsScreen from "../Albums/screen";
import TracksScreen from "../Tracks/screen";
import DetailsScreen from "../ItemDetail/screen";
import PlaylistsScreen from "../Playlists/screen";

const LibraryStack = createNativeStackNavigator<StackParamList>();

export default function Library(): React.JSX.Element {
    return (
        <LibraryStack.Navigator
            initialRouteName="Favorites"
        >
            <LibraryStack.Screen
                name="Favorites"
                component={FavoritesScreen}
                options={{
                    headerLargeTitle: true,
                    headerLargeTitleStyle: {
                        fontFamily: 'Aileron-Bold'
                    }
                }}
            />

            <LibraryStack.Screen 
                name="Artist" 
                component={ArtistScreen} 
                options={({ route }) => ({
                    title: route.params.artist.Name ?? "Unknown Artist",
                    headerLargeTitle: true,
                    headerLargeTitleStyle: {
                        fontFamily: 'Aileron-Bold'
                    }
                })}
            />

            <LibraryStack.Screen 
                name="Artists" 
                component={ArtistsScreen} 
                options={({ route }) => ({
                    headerLargeTitle: true,
                    headerLargeTitleStyle: {
                        fontFamily: 'Aileron-Bold'
                    }
                })}
            />

            <LibraryStack.Screen
                name="Album"
                component={AlbumScreen}
                options={({ route }) => ({
                    headerShown: true,
                    headerTitle: ""
                })}
            />

            <LibraryStack.Screen
                name="Albums"
                component={AlbumsScreen}
                options={{
                    headerLargeTitle: true,
                    headerLargeTitleStyle: {
                        fontFamily: 'Aileron-Bold'
                    }
                }}
            />

            <LibraryStack.Screen
                name="Tracks"
                component={TracksScreen}
                options={{
                    headerLargeTitle: true,
                    headerLargeTitleStyle: {
                        fontFamily: 'Aileron-Bold'
                    }
                }}
            />

            <LibraryStack.Screen
                name="Playlists"
                component={PlaylistsScreen}
                options={{
                    headerLargeTitle: true,
                    headerLargeTitleStyle: {
                        fontFamily: 'Aileron-Bold'
                    }
                }}
            />

            <LibraryStack.Screen
                name="Playlist"
                component={PlaylistScreen}
                options={({ route }) => ({
                    headerShown: true,
                    headerTitle: ""
                })}
            />

            <LibraryStack.Screen
                name="Details"
                component={DetailsScreen}
                options={{
                    headerShown: false,
                    presentation: "modal"
                }}
            />
        </LibraryStack.Navigator>
    )
}