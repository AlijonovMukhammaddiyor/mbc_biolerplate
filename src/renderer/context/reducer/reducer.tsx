/* eslint-disable react/destructuring-assignment */
import { STATE } from '../utils/types';

const Reducer = (state: STATE, action: any): STATE => {
  switch (action.type) {
    case 'PAUSE_SET':
      return {
        ...state,
        main_state: {
          ...state.main_state,
          player: {
            ...state.main_state.player,
            pause: action.pause,
          },
        },
      };
    case 'AUTOPLAY_SET':
      return {
        ...state,
        main_state: {
          ...state.main_state,
          general: {
            ...state.main_state.general,
            autoplay: action.autoplay,
          },
        },
      };
    case 'TOGGLE_MINI_MESSAGE':
      return {
        ...state,
        main_state: {
          ...state.main_state,
          mini: {
            ...state.main_state.mini,
            isMessageOpen: !state.main_state.mini.isMessageOpen,
          },
        },
      };
    case 'MINIMIZE_ON':
      return {
        ...state,
        main_state: {
          ...state.main_state,
          mini: {
            ...state.main_state.mini,
            isMini: true,
          },
        },
      };
    case 'MINIMIZE_OFF':
      return {
        ...state,
        main_state: {
          ...state.main_state,
          mini: {
            ...state.main_state.mini,
            isMini: false,
          },
        },
      };
    case 'USER_COOKIE_STATE_YES':
      return {
        ...state,
        user: {
          ...state.user,
          cookieAvailable: true,
        },
      };
    case 'USER_COOKIE_STATE_NO':
      return {
        ...state,
        user: {
          mainUser: null,
          cookieAvailable: false,
        },
      };
    case 'CHANGE_SETTINGS':
      return {
        ...state,
        main_state: {
          ...state.main_state,
          settings: {
            ...state.main_state.settings,
            autostart: action.autostart,
            onTop: action.onTop,
            videoNotice: action.videoNotice,
          },
        },
      };
    case 'REFRESH_LIKED_EPISODES':
      return {
        ...state,
        main_state: {
          ...state.main_state,
          general: {
            ...state.main_state.general,
            refreshLikedEpisodes:
              !state.main_state.general.refreshLikedEpisodes,
          },
        },
      };
    case 'OPEN_MY_MINI':
      return {
        ...state,
        main_state: {
          ...state.main_state,
          general: {
            ...state.main_state.general,
            myMiniOpen: true,
          },
        },
      };
    case 'OPEN_SETTINGS':
      return {
        ...state,
        main_state: {
          ...state.main_state,
          general: {
            ...state.main_state.general,
            settingsOpen: true,
          },
        },
      };
    case 'CLOSE_MY_MINI':
      return {
        ...state,
        main_state: {
          ...state.main_state,
          general: {
            ...state.main_state.general,
            myMiniOpen: false,
          },
        },
      };
    case 'CLOSE_SETTINGS':
      return {
        ...state,
        main_state: {
          ...state.main_state,
          general: {
            ...state.main_state.general,
            settingsOpen: false,
          },
        },
      };
    case 'PODCAST_SHARE_ON':
      return {
        ...state,
        main_state: {
          ...state.main_state,
          podcast: {
            ...state.main_state.podcast,
            shareScreenOn: true,
            shareUrl: action.url,
          },
        },
      };
    case 'PODCAST_SHARE_OFF':
      return {
        ...state,
        main_state: {
          ...state.main_state,
          podcast: {
            ...state.main_state.podcast,
            shareScreenOn: false,
            shareUrl: '',
          },
        },
      };
    case 'CHANGE_PODCAST_CHANNEL':
      return {
        main_state: {
          ...state.main_state,
          podcast: {
            ...state.main_state.podcast,
            channel: action.channel,
          },
        },
        error: null,
        user: state.user,
      };
    case 'CHANGE_SCHEDULE_DAY':
      return {
        main_state: {
          ...state.main_state,
          schedule: {
            ...state.main_state.schedule,
            weekday: action.weekday,
          },
        },
        error: null,
        user: state.user,
      };
    case 'CHANGE_SCHEDULE_CHANNEL':
      return {
        main_state: {
          ...state.main_state,
          schedule: {
            ...state.main_state.schedule,
            scheduleChannel: action.scheduleChannel,
          },
        },
        error: null,
        user: state.user,
      };
    case 'HIDE_SCHEDULE':
      return {
        main_state: {
          ...state.main_state,
          schedule: {
            ...state.main_state.schedule,
            isScheduleScreen: false,
          },
        },
        error: null,
        user: state.user,
      };
    case 'SHOW_SCHEDULE':
      return {
        main_state: {
          ...state.main_state,
          schedule: {
            ...state.main_state.schedule,
            isScheduleScreen: true,
            scheduleChannel: state.main_state.general.channel,
          },
        },
        error: null,
        user: state.user,
      };
    case 'SHOW_LOGIN_SCREEN':
      return {
        main_state: {
          ...state.main_state,
          general: {
            ...state.main_state.general,
            isLogInScreen: true,
          },
        },
        error: null,
        user: state.user,
      };
    case 'HIDE_LOGIN_SCREEN':
      return {
        main_state: {
          ...state.main_state,
          general: {
            ...state.main_state.general,
            isLogInScreen: false,
          },
        },
        error: null,
        user: state.user,
      };
    case 'LOGIN':
      return {
        ...state,
        user: {
          mainUser: action.mainUser,
          cookieAvailable: true,
        },
      };
    case 'LOGOUT':
      return {
        ...state,
        user: { cookieAvailable: false, mainUser: null },
      };
    case 'AUDIO_LIST_ON':
      return {
        main_state: {
          ...state.main_state,
          messages: {
            isMessageTab: false,
          },
        },
        error: null,
        user: state.user,
      };
    case 'MESSAGES_ON':
      return {
        main_state: {
          ...state.main_state,
          messages: {
            isMessageTab: true,
          },
        },
        error: null,
        user: state.user,
      };
    case 'CHANGE_CHANNEL': // only for 3 channels not for podcast
      return {
        main_state: {
          ...state.main_state,
          general: {
            ...state.main_state.general,
            channel: action.channel,
            ImageOpen: action.imageOpen,
            autoplay: true,
          },
          podcast: {
            ...state.main_state.podcast,
            currentPodcast: null,
            isPodcastTab: false,
            PodcastIn: { isIn: false, channel: null },
            subpodcast: {
              ...state.main_state.podcast.subpodcast,
              currentSubpodcast: null,
              isSubpodcastPlaying: false,
              episodePlaylist: [],
              currentIndex: 0,
              parent: {
                podcast: null,
                channel: null,
              },
            },
          },
        },
        error: null,
        user: state.user,
      };
    case 'PODCAST_TAB':
      return {
        main_state: {
          ...state.main_state,
          general: {
            ...state.main_state.general,
            ImageOpen: false,
          },
          podcast: {
            ...state.main_state.podcast,
            isPodcastTab: true,
          },
        },
        error: null,
        user: state.user,
      };
    case 'PODCAST_IN':
      return {
        main_state: {
          ...state.main_state,
          podcast: {
            ...state.main_state.podcast,
            PodcastIn: { isIn: true, channel: action.channel },
            currentPodcast: action.payload,
          },
        },
        error: null,
        user: state.user,
      };
    case 'PODCAST_OUT':
      return {
        main_state: {
          ...state.main_state,
          podcast: {
            ...state.main_state.podcast,
            currentPodcast: null,
            PodcastIn: { isIn: false, channel: null },
          },
        },
        error: null,
        user: state.user,
      };
    case 'SUBPODCAST_ON':
      return {
        main_state: {
          ...state.main_state,
          general: {
            ...state.main_state.general,
            autoplay: true,
          },
          podcast: {
            ...state.main_state.podcast,
            subpodcast: {
              ...state.main_state.podcast.subpodcast,
              currentSubpodcast: action.subpodcast,
              isSubpodcastPlaying: true,
              resetSubpodcast:
                !state.main_state.podcast.subpodcast.resetSubpodcast,
              episodePlaylist: action.playlist,
              currentIndex: action.currentindex,
              parent: {
                podcast: action.podcast,
                channel: action.channel,
              },
            },
          },
        },
        error: null,
        user: state.user,
      };
    case 'SUBPODCAST_SPEED':
      return {
        main_state: {
          ...state.main_state,
          podcast: {
            ...state.main_state.podcast,
            subpodcast: {
              ...state.main_state.podcast.subpodcast,
              speed: action.speed,
            },
          },
        },
        error: null,
        user: state.user,
      };
    case 'CURRENT_VOD_AVAILABLE':
      return {
        main_state: {
          ...state.main_state,
          vod: {
            ...state.main_state.vod,
            isVod: true,
            currentVod: action.payload,
          },
        },
        error: null,
        user: state.user,
      };
    case 'CURRENT_VOD_NOT_AVAILABLE':
      return {
        main_state: {
          ...state.main_state,
          vod: {
            ...state.main_state.vod,
            isVod: false,
            currentVod: null,
          },
        },
        error: null,
        user: state.user,
      };
    case 'CURRENT_PROGRAMS':
      return {
        main_state: {
          ...state.main_state,
          general: {
            ...state.main_state.general,
            currentPrograms: action.payload,
          },
        },
        error: null,
        user: state.user,
      };
    case 'VOD_FETCH_ERROR':
      return {
        ...state,
        error: action.error,
      };
    case 'TOGGLE_IMAGE':
      return {
        main_state: {
          ...state.main_state,
          general: {
            ...state.main_state.general,
            ImageOpen: !state.main_state.general.ImageOpen,
          },
        },
        error: null,
        user: state.user,
      };
    case 'TOGGLE_IMAGE_COND':
      return {
        main_state: {
          ...state.main_state,
          general: {
            ...state.main_state.general,
            ImageOpenMedia: action.imageOpenMedia,
          },
        },
        error: null,
        user: state.user,
      };
    case 'VIDEO_DISCLOSE':
      return {
        main_state: {
          ...state.main_state,
          vod: {
            ...state.main_state.vod,
            videoClosed: false,
          },
        },
        error: null,
        user: state.user,
      };
    case 'VIDEO_CLOSE':
      return {
        main_state: {
          ...state.main_state,
          vod: {
            ...state.main_state.vod,
            videoClosed: true,
          },
        },
        error: null,
        user: state.user,
      };
    case 'SET_CURRENT_SONGS':
      return {
        main_state: {
          ...state.main_state,
          general: {
            ...state.main_state.general,
            currentSongs: action.songs,
          },
        },
        error: null,
        user: state.user,
      };
    case 'VOLUME_CHANGE':
      return {
        main_state: {
          ...state.main_state,
          player: {
            ...state.main_state.player,
            volume: action.volume,
          },
        },
        error: null,
        user: state.user,
      };
    case 'TOGGLE_VOLUME':
      return {
        main_state: {
          ...state.main_state,
          player: {
            ...state.main_state.player,
            volume: action.volume,
            prevVolume: action.prevVolume,
          },
        },
        error: null,
        user: state.user,
      };
    case 'TOGGLE_VOLUME_VOD':
      return {
        main_state: {
          ...state.main_state,
          vod: {
            ...state.main_state.vod,
            volume: action.volume,
            prevVolume: action.prevVolume,
          },
        },
        error: null,
        user: state.user,
      };
    case 'VOLUME_CHANGE_VOD':
      return {
        main_state: {
          ...state.main_state,
          vod: {
            ...state.main_state.vod,
            volume: action.volume,
          },
        },
        error: null,
        user: state.user,
      };
    case 'SET_VOD_SCHEDULE':
      return {
        main_state: {
          ...state.main_state,
          vod: {
            ...state.main_state.vod,
            vodSchedule: action.vods,
          },
        },
        error: null,
        user: state.user,
      };
    default:
      return state;
  }
};

export default Reducer;
