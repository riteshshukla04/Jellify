
interface CategoryRoute {
    name: any; // ¯\_(ツ)_/¯
    iconName: string;
};

const Categories : CategoryRoute[] = [
    { name: "Artists", iconName: "microphone-variant" },
    { name: "Albums", iconName: "music-box-multiple" },
    { name: "Tracks", iconName: "music-note"},
    { name: "Playlists", iconName: "playlist-music"},
];

export default Categories;