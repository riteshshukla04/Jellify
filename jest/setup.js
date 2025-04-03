// https://github.com/doublesymmetry/react-native-track-player/issues/501
jest.mock('react-native-track-player', () => {
  return {
    __esModule: true,
    default: {
      addEventListener: () => ({
        remove: jest.fn(),
      }),
      registerEventHandler: jest.fn(),
      registerPlaybackService: jest.fn(),
      setupPlayer: jest.fn(),
      destroy: jest.fn(),
      updateOptions: jest.fn(),
      reset: jest.fn(),
      add: jest.fn(),
      remove: jest.fn(),
      skip: jest.fn(),
      skipToNext: jest.fn(),
      skipToPrevious: jest.fn(),
      removeUpcomingTracks: jest.fn(),
      // playback commands
      play: jest.fn(),
      pause: jest.fn(),
      stop: jest.fn(),
      seekTo: jest.fn(),
      setVolume: jest.fn(),
      setRate: jest.fn(),
      // player getters
      getQueue: jest.fn(),
      getTrack: jest.fn(),
      getActiveTrackIndex: jest.fn(),
      getCurrentTrack: jest.fn(),
      getVolume: jest.fn(),
      getDuration: jest.fn(),
      getPosition: jest.fn(),
      getBufferedPosition: jest.fn(),
      getState: jest.fn(),
      getRate: jest.fn(),
      // constants
      Capability: {
          PLAY: 1,
          PLAY_FROM_ID: 2,
          PLAY_FROM_SEARCH: 4,
          PAUSE: 8,
          STOP: 16,
          SEEK_TO: 32,
          SKIP: 64,
          SKIP_TO_NEXT: 128,
          SKIP_TO_PREVIOUS: 256,
      },
        IOSCategoryOptions: {
          MixWithOthers: 'mixWithOthers',
          DuckOthers: 'duckOthers',
          InterruptSpokenAudioAndMixWithOthers:
            'interruptSpokenAudioAndMixWithOthers',
          AllowBluetooth: 'allowBluetooth',
          AllowBluetoothA2DP: 'allowBluetoothA2DP',
          AllowAirPlay: 'allowAirPlay',
          DefaultToSpeaker: 'defaultToSpeaker',
        },
        IOSCategoryMode: {
          Default: 'default',
          GameChat: 'gameChat',
          Measurement: 'measurement',
          MoviePlayback: 'moviePlayback',
          SpokenAudio: 'spokenAudio',
          VideoChat: 'videoChat',
          VideoRecording: 'videoRecording',
          VoiceChat: 'voiceChat',
          VoicePrompt: 'voicePrompt',
        },
        IOSCategory: {
          Playback: 'playback',
          PlaybackAndRecord: 'playbackAndRecord',
          MultiRoute: 'multiRoute',
          Ambient: 'ambient',
          SoloAmbient: 'soloAmbient',
          Record: 'record',
          PlayAndRecord: 'playAndRecord',
        },
      },
    },
    useProgress: () => ({
      position: 100,
      buffered: 150,
      duration: 200,
    }),
  }
});