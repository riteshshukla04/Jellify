import Client from "../../client";
import { BaseItemDto, BaseItemKind, ItemSortBy, SortOrder, UserItemDataDto } from "@jellyfin/sdk/lib/generated-client/models";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api";

export function fetchFavoriteArtists(): Promise<BaseItemDto[]> {
    console.debug(`Fetching user's favorite artists`);

    return new Promise(async (resolve, reject) => {
        getItemsApi(Client.api!)
            .getItems({
                includeItemTypes: [
                    BaseItemKind.MusicArtist
                ],
                isFavorite: true,
                parentId: Client.library!.musicLibraryId,
                recursive: true,
                sortBy: [
                    ItemSortBy.SortName
                ],
                sortOrder: [
                    SortOrder.Ascending
                ]
            })
            .then((response) => {
                console.debug(`Received favorite artist response`, response);

                if (response.data.Items)
                    resolve(response.data.Items)
                else
                    resolve([]);
            }).catch((error) => {
                console.error(error);
                reject(error);
            })
    })
}

export function fetchFavoriteAlbums(): Promise<BaseItemDto[]> {
    console.debug(`Fetching user's favorite albums`);

    return new Promise(async (resolve, reject) => {
        getItemsApi(Client.api!)
            .getItems({
                includeItemTypes: [
                    BaseItemKind.MusicAlbum
                ],
                isFavorite: true,
                parentId: Client.library!.musicLibraryId!,
                recursive: true,
                sortBy: [
                    ItemSortBy.DatePlayed,
                    ItemSortBy.SortName
                ],
                sortOrder: [
                    SortOrder.Descending,
                    SortOrder.Ascending,
                ]
            })
            .then((response) => {
                console.debug(`Received favorite album response`, response);

                if (response.data.Items)
                    resolve(response.data.Items)
                else
                    resolve([]);
            }).catch((error) => {
                console.error(error);
                reject(error);
            })
    })
}

export function fetchFavoritePlaylists(): Promise<BaseItemDto[]> {
    console.debug(`Fetching user's favorite playlists`);

    return new Promise(async (resolve, reject) => {
        getItemsApi(Client.api!)
            .getItems({
                userId: Client.user!.id,
                parentId: Client.library!.playlistLibraryId,
                fields: [
                    "Path"
                ],
                sortBy: [
                    ItemSortBy.SortName
                ],
                sortOrder: [
                    SortOrder.Ascending
                ]
            })
            .then((response) => {

                console.log(response);

                if (response.data.Items)
                    resolve(response.data.Items.filter(item =>
                        item.UserData?.IsFavorite ||
                        item.Path?.includes("/data/playlists")
                    ))
                else
                    resolve([])
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}

export function fetchFavoriteTracks(): Promise<BaseItemDto[]> {
    console.debug(`Fetching user's favorite tracks`);

    return new Promise(async (resolve, reject) => {
        getItemsApi(Client.api!)
            .getItems({
                includeItemTypes: [
                    BaseItemKind.Audio
                ],
                isFavorite: true,
                parentId: Client.library!.musicLibraryId,
                recursive: true,
                sortBy: [
                    ItemSortBy.SortName
                ],
                sortOrder: [
                    SortOrder.Ascending
                ]
            })
            .then((response) => {
                console.debug(`Received favorite artist response`, response);

                if (response.data.Items)
                    resolve(response.data.Items)
                else
                    resolve([]);
            }).catch((error) => {
                console.error(error);
                reject(error);
            })
    })
}

export function fetchUserData(itemId: string): Promise<UserItemDataDto> {
    return new Promise(async (resolve, reject) => {
        getItemsApi(Client.api!)
            .getItemUserData({
                itemId
            }).then((response) => {
                resolve(response.data)
            }).catch((error) => {
                console.error(error);
                reject(error);
            })
    });
}