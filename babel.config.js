module.exports = {
  presets: [
    'module:@react-native/babel-preset',
    'babel-preset-expo'
  ],
  plugins: [
    // react-native-reanimated/plugin has to be listed last
    'react-native-reanimated/plugin',
  ]
};