import Hls from 'hls.js';

export type MessagesType = {
  MiniMsgView: string;
  MsgList: {
    Comment: string;
    Rank: string;
    RegDate: string;
    SeqID: number;
    Uno: number;
    UserID: string;
    UserNm: string;
  }[];
};

export type User = {
  cookieAvailable: boolean;
  mainUser: {
    State: string;
    ReturnMsg: string;
    UserInfo: {
      IMBCCookie: string;
      UNO: string;
      UserName: string;
      UserID: string;
    };
  } | null;
};

export type RecommendedPodcast = {
  Channel: string;
  BroadCastID: number;
  GroupID: number;
  Title: string;
  SubTitle: string;
  ItunesImageURL: string;
  ITunesImageURL: string;
  HomeURL: string;
  HDPicture: string;
  IsNew: string;
  IsRecommand: boolean;
  IsSubscribe: boolean;
  RegDate: string;
  gettingDeleted: boolean;
};

export type Podcast = {
  DOCID: string;
  Title: string;
  ITunesAuthor: string;
  BroadCastID: string;
  BroadStateID: string;
  BroadStateName: string;
  Description: string;
  SubTitle: string;
  Summary: string;
  ITunesImageURL: string;
  Category: string;
  SubCategory: string;
  Link: string;
  IsNew: string;
  IsRecommand: string;
  SubCategoryID: string;
  SubCategoryName: string;
  ProgramGenreID: string;
  Imp: string;
  StartTime: string;
  ItunesImageURL: string;
  isSubscribed: boolean;
};

// export type SubscribedPodcasts = {
// 	DOCID: string;
// 	Title: string;
// 	ITunesAuthor: string;
// 	BroadCastID: string;
// 	BroadStateID: string;
// 	BroadStateName: string;
// 	Description: string;
// 	SubTitle: string;
// 	Summary: string;
// 	ITunesImageURL: string;
// 	Category: string;
// 	SubCategory: string;
// 	Link: string;
// 	IsNew: string;
// 	IsRecommand: string;
// 	SubCategoryID: string;
// 	SubCategoryName: string;
// 	ProgramGenreID: string;
// 	Imp: string;
// 	StartTime: string;
// 	ItunesImageURL: string;
// 	isSubscribed: boolean;
// 	gettingDeleted: boolean;
// };

export type PodcastResponse = {
  list: Podcast[];
  Total: number;
  Display: number;
};

export type Subpodcast = {
  BroadCastID: number;
  RowNum: string;
  ProgramTitle: string;
  PodCastItemIdx: string;
  Title: string;
  ContentTitle: string;
  LinkUrl: string;
  LinkURL: string;
  Description: string;
  EncloserURL: string;
  PubDate: string;
  BroadDate: string;
  ITunesImageURL: string;
  DatePub: string;
  ItunesImageURL: string;
  GettingDeleted: boolean;
};

export type ListenedSubpodcast = {
  BroadCastID: number;
  RowNum: string;
  ProgramTitle: string;
  PodCastItemIdx: string;
  Title: string;
  ContentTitle: string;
  LinkUrl: string;
  LinkURL: string;
  Description: string;
  EncloserURL: string;
  PubDate: string;
  BroadDate: string;
  ITunesImageURL: string;
  DatePub: string;
  ItunesImageURL: string;
  GettingDeleted: boolean;
};

export const enum Channels {
  sfm = 'sfm',
  mfm = 'mfm',
  chm = 'chm',
}

export const ChannelObject: {
  [key: string]: string;
} = {
  표준FM: 'sfm',
  FM4U: 'mfm',
  CHAM: 'chm',
};

export const datesObj = [
  '일요일',
  '월요일',
  '화요일',
  '수요일',
  '목요일',
  '금요일',
  '토요일',
];

export type Schedule = {
  BroadCastID: string; //
  Channel: string; //
  EndTime: Date | null; //
  HDPicture: string; //
  HomePageUrl: string; //
  LiveDays: string; //
  Picture: string; //
  PodCastURL: string; //
  ProgramGroupID: string; //
  ProgramTitle: string; //
  RunningTime: string; //
  StartTime: string; //
  ThumbnailPicture: string | null; //
  ProgramSNSLink: string; //
  NewHDPicture: string;
};

export type ProgramSchedule = {
  Channel: string;
  StartTime: string;
  EndTime: string;
  ProgramTitle: string;
  HomePageUrl: string;
  BroadCastID: string;
  LiveDays: string;
  Picture: string;
  RunningTime: string;
  ProgramGroupID: string;
  PodCastURL: string;
  ProgramSNSLink: string;
  ThumbnailPicture: string;
  HDPicture: string;
  MMSNumber: string;
};

export type ChannelSchedule = {
  Channel: string;
  StartTime: string;
  EndTime: string;
  ProgramTitle: string;
  HomePageUrl: string;
  BroadCastID: string;
  LiveDays: string;
  Picture: string;
  RunningTime: string;
  ProgramGroupID: string;
  PodCastURL: string;
  ProgramSNSLink: string;
  ThumbnailPicture: string;
  HDPicture: string;
  MMSNumber: string;
  onAir: boolean;
  isBora: boolean;
  guest: string | null;
};

export type TrackType = {
  TR_NO: number;
  Seq_no: number;
  TR_IDX: number;
  ArtistName: string;
  TrackTitle: string;
  AlbumImageUrl: string;
  SongUrl: string;
  StartTime: string;
  PlayTime: string;
  gettingDeleted: boolean;
};

export type CurrentVod = {
  Date: string;
  WeekSeq: string;
  WeekDay: string;
  Channel: string;
  BroadCastID: string;
  ProgramTitle: string;
  StartTime: string;
  EndTime: string;
  Picture: string;
  Guest: string;
  HomePageURL: string;
};

export type Vod = {
  Channel: string;
  BroadCastID: string;
  ProgramTitle: string;
  StartTime: string;
  EndTime: string;
  RunDay: string;
  BroadDate: string;
  Guest: string;
};

export type Guest = {
  BroadcastID: number;
  StartTime: string;
  EndTime: string;
  Guest: string;
  Corner: string;
  RegDate: string;
};

export type STATE = {
  main_state: {
    general: {
      channel: Channels;
      autoplay: boolean; // when loading app and when changing channel, we will use this property to autoplay or not
      schedule: Schedule[];
      ImageOpen: boolean; // to close program image or not to
      ImageOpenMedia: boolean; // to close or open image on resizing the window.
      currentPrograms: { [key in Channels]: Schedule | null }; // current programs for 3 channels
      currentSongs: { [key in Channels]: Song | null }; // current song objects for the three channels
      isLogInScreen: boolean; // if true we will show login window
      myMiniOpen: boolean;
      settingsOpen: boolean;
      refreshLikedEpisodes: boolean;
      guests: {
        [key in Channels]: Guest | null;
      };
    };
    mini: {
      isMini: boolean;
      isMessageOpen: boolean;
    };
    settings: { autostart: boolean; onTop: boolean; videoNotice: boolean };
    schedule: {
      isScheduleScreen: boolean;
      scheduleChannel: Channels;
      weekday: string;
    };
    podcast: {
      isPodcastTab: boolean; // when opened podcast tab
      PodcastIn: { isIn: boolean; channel: string | null }; // when clicked on a podcast and show subpodcasts
      channel: string;
      currentPodcast: Podcast | null;
      shareScreenOn: boolean;
      shareUrl: string;
      subpodcast: {
        isSubpodcastPlaying: boolean;
        currentSubpodcast: Subpodcast | null;
        episodePlaylist: Subpodcast[];
        currentIndex: number;
        parent: {
          // because we need to go back episode list screen
          podcast: Podcast | null;
          channel: string | null;
        };
        /**
         * @resetSubpodcast - when clicken on the subpodcast which is currently playing, it should replay from the beginning. So, we have to rerender the useEffect
         *                    hook to assign the subopdcast again. If we change this properety everytime a subpodcast is clicked and pass this to useEffect,
         *                    it will rerender
         */
        resetSubpodcast: boolean;
        speed: number; // subpodcast playing speed
      };
    };
    vod: {
      videoPlayer: Hls | null;
      videoClosed: boolean;
      isVod: boolean; // is it visible radio ?
      vodPlay: boolean;
      currentVod: CurrentVod | null;
      vodSchedule: Vod[]; // weekly vod schedule
      volume: number;
      prevVolume: number;
    };
    player: {
      audioPlayer: Hls | null;
      volume: number;
      prevVolume: number; // for toggling the sound
      pause: boolean;
    };
    messages: { isMessageTab: boolean };
  };
  error: Error | null;
  user: User;
};

export type Song = {
  Channel: string;
  LogCD: string;
  ProgCode: string;
  RegDate: string;
  SomItem: string;
  gettingDeleted: boolean;
};
