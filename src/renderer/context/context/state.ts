import { STATE, Channels, datesObj } from '../utils/types';

// refer to types.tsx
const DEFAULT_STATE = {
  main_state: {
    general: {
      channel: Channels.mfm,
      autoplay: false,
      schedule: [],
      ImageOpen: true,
      ImageOpenMedia: true,
      currentPrograms: {
        [Channels.sfm]: null,
        [Channels.mfm]: null,
        [Channels.chm]: null,
      }, // current programs for 3 channels
      currentSongs: {
        [Channels.sfm]: null,
        [Channels.mfm]: null,
        [Channels.chm]: null,
      },
      isLogInScreen: false,
      myMiniOpen: false,
      refreshLikedEpisodes: false,
      refreshLikedSongs: false,
      settingsOpen: false,
      isMinimized: false,
      guests: {
        sfm: null,
        mfm: null,
        chm: null,
      },
    },

    mini: {
      isMini: false,
      isMessageOpen: false,
    },
    login: {
      IDremember: false,
      autoLogin: false,
      id: '',
      password: '',
    },
    settings: {
      autostart: false,
      onTop: false,
      videoNotice: false,
    },
    schedule: {
      isScheduleScreen: false,
      scheduleChannel: Channels.mfm,
      weekday: datesObj[new Date().getDay()],
    },
    podcast: {
      isPodcastTab: false,
      PodcastIn: { isIn: false, channel: null },
      channel: 'home',
      currentPodcast: null,
      shareScreenOn: false,
      search: {
        category: 2,
        sortBy: 'Imp',
        sort: 'DESC',
        channel: 6,
        state: 2,
        sorts: ['인기순', '방송시간순', '가나다순'],
        dropChannels: ['표준FM', 'FM4U', '오리지널', '코너 다시듣기', '기타'],
        dropStates: ['방송중', '방송종료'],
        categories: ['음악/예능/오락', '시사/교양', '드라마', '기타'],
      },
      shareUrl: '',
      subpodcast: {
        isSubpodcastPlaying: false,
        currentSubpodcast: null,
        resetSubpodcast: true,
        episodePlaylist: [],
        currentIndex: 0,
        speed: 1,
        parent: {
          podcast: null,
          channel: null,
        },
      },
    },
    vod: {
      videoPlayer: null,
      videoClosed: false,
      isVod: false,
      vodPlay: false,
      currentVod: null,
      vodSchedule: [],
      volume: 5,
      prevVolume: 5,
    },
    player: {
      audioPlayer: null,
      volume: 5,
      prevVolume: 5,
      pause: false,
    },
    messages: { isMessageTab: true },
  },
  error: null,
  user: { cookieAvailable: false, mainUser: null },
  isPopUp: false,
};

// If we already saved the data in the localStorage and it is still available, then retrieve it
const localStorageData: string | null = localStorage.getItem('state');
const parsedState = localStorageData ? JSON.parse(localStorageData) : null;

if (parsedState?.main_state.podcast) {
  if (!parsedState.main_state.podcast.search)
    parsedState.main_state.podcast.search = {
      category: 2,
      sortBy: 'Imp',
      sort: 'DESC',
      channel: 6,
      state: 2,
      sorts: ['인기순', '방송시간순', '가나다순'],
      dropChannels: ['표준FM', 'FM4U', '오리지널', '코너 다시듣기', '기타'],
      dropStates: ['방송중', '방송종료'],
      categories: ['음악/예능/오락', '시사/교양', '드라마', '기타'],
    };

  parsedState.main_state.podcast.isPodcastIn = false;
  parsedState.main_state.podcast.currentPodcast = null;
}

const INITIAL_STATE: STATE = parsedState
  ? {
      main_state: parsedState.main_state,
      error: null,
      user: parsedState.user,
    }
  : DEFAULT_STATE;

export default INITIAL_STATE;
