import { QueryKeys } from "../../enums/query-keys";

interface CategoryRoute {
    name: any; // ¯\_(ツ)_/¯
    iconName: string;
    params?: {
        query: QueryKeys
    };
};

const Categories : CategoryRoute[] = [
    { name: "Artists", iconName: "microphone-variant", params: { query: QueryKeys.FavoriteArtists } },
    { name: "Albums", iconName: "music-box-multiple" },
    { name: "Tracks", iconName: "music-note"},
    { name: "Playlists", iconName: "playlist-music", params: { query: QueryKeys.FavoriteTracks } },
];

export default Categories;