module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-boost/plugin',
    // react-native-reanimated/plugin has to be listed last
    'react-native-reanimated/plugin',
  ]
};