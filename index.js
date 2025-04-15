import 'react-native-gesture-handler'
import { AppRegistry, Platform } from 'react-native'
import App from './App'
import { name as appName } from './app.json'
import { PlaybackService } from './player/service'
import TrackPlayer from 'react-native-track-player'
import Client from './api/client'
import { AndroidAutoModule } from './components/AndroidAuto'

// Initialize API client instance
/* eslint-disable @typescript-eslint/no-unused-expressions */
Client.instance

// Enable React Navigation freeze for detaching inactive screens
// enableFreeze();

AppRegistry.registerComponent(appName, () => App)
if (Platform.OS === 'ios') {
	AppRegistry.registerComponent('RNCarPlayScene', () => App)
} else {
	AppRegistry.registerRunnable('AndroidAuto', AndroidAutoModule)
}

// Register RNTP playback service for remote controls
TrackPlayer.registerPlaybackService(() => PlaybackService)
