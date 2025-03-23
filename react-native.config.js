module.exports = {
    project: {
        ios: {},
        android: {},
    },
    assets: ['./assets/fonts/'],
    dependencies: {
        'react-native-carplay': {
          platforms: {
            android: null, // Disable autolinking for Android
          },
        },
      },
};  