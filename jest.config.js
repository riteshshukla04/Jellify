// https://docs.swmansion.com/react-native-gesture-handler/docs/guides/testing
module.exports = {
	preset: 'jest-expo',
	setupFiles: ['./node_modules/react-native-gesture-handler/jestSetup.js'],
	setupFilesAfterEnv: [
		'./jest/setup.js',
		'./jest/setup-carplay.js',
		'./jest/setup-blurhash.js',
		'./jest/setup-reanimated.js',
		'./jest/setup-rnfs.js',
		'./tamagui.config.ts',
	],
	extensionsToTreatAsEsm: ['.ts', '.tsx'],
	transformIgnorePatterns: [
		'node_modules/(?!(@)?(react-native|react-native-.*|react-navigation|jellyfin|burnt|expo|expo-.*)/)',
	],
}
