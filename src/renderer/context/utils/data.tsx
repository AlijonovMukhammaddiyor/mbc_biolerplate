import $ from 'jquery';

// subtitles in all sections change according to the someitem url. If there is no corresponsing subtitle for the section, then subtitle is the name of the channel
// SFM: title changes according to Schedule
// MFM: title changes according to Schedule
// CHM: title changes according to the Schedule

// const programKey = "MenuList";

export default class Data<T> {
  static urls = {
    onAirPlayAPI: '//sminiplay.imbc.com/boraplay.ashx',
    onAirSecurePlayAPI: 'https://sminiplay.imbc.com/aacplay.ashx',
    onAirPlayAPIForPC: '//miniplay.imbc.com/HLSLive.ashx',

    onAirScheduleAPI: 'https://miniapi.imbc.com/Schedule/schedulelist',
    onAirVodScheduleAPI: '//miniunit.imbc.com/schedule/BoraSchedule',

    onAirVodScheduleCurrentAPI: '//miniunit.imbc.com/schedule/BoraRecentInfo',
    onAirVodScheduleWeekAPI:
      '//miniunit.imbc.com/schedule/BorascheduleWeekList',
    onAirVodScheduleTableAPI: '//miniunit.imbc.com/schedule/BorascheduleTable',

    // programListAPI: "//miniunit.imbc.com/list/programList",
    noticeAPI: '//miniunit.imbc.com/Notice',
    podcastListApi: ' https://miniapi.imbc.com/podcast/programlist',
    podcastListByFilterApi:
      'https://miniapi.imbc.com/podcast/categoryprogramlist',
    messageListApi: `https://miniapi.imbc.com/minimsg/msglist`,
    podcastItemListApi: `https://miniapi.imbc.com/podcast/itemlist`,
    programEpisodeSearchApi: `https://miniapi.imbc.com/podcast/searchprogramitem`,
    vodScheduleApi: `https://miniapi.imbc.com/bora/schedulelist`,
    currentVodApi: `https://miniapi.imbc.com/bora/currentschedule`,
    loginAPI: `https://member.imbc.com/login/ApiLoginProcess.aspx`,
    msgRegisterApi: `http://miniapi.imbc.com/minimsg/msgReg`,
    msgRegisterPCApi: `http://miniapi.imbc.com/minimsg/msgReg_pc`,
    tracklistApi: `https://miniapi.imbc.com/music/tracklist`,
    mbcPopUpPlayerApi: `https://playvod.imbc.com/Vod/PopupPlayer`,
    dailyScheduleApi: `https://miniapi.imbc.com/schedule/dailyprogramschedulelist`,
    recommendedPodcastsApi: `https://miniapi.imbc.com/podcast/recommendedprogramlist`,
    subscribedProgramLIstApi: `https://miniapi.imbc.com/podcast/subscribedprogramlist`,
    subscribedProgramLIstApiPC: `http://miniapi.imbc.com/podcast/subscribedprogramlist_pc`,
    recentPodcastLIstApi: `https://miniapi.imbc.com/podcast/recentitemlist`,
    subscribeProgramApi: `https://miniapi.imbc.com/podcast/subscribe_pc`,
    trackLikeApi: window.location.href.includes('https')
      ? `https://miniapi.imbc.com/music/liketrack`
      : `http://miniapi.imbc.com/music/liketrack`,
    deleteMsgApiPC: `https://miniapi.imbc.com/minimsg/msgDel_pc`,
    noticeApi: `http://miniapi.imbc.com/notice/newNotice`,
    guestCornerApi: `https://miniapi.imbc.com/notice/guestCorner`,
    myMsgListApi: window.location.href.includes('https')
      ? `https://miniapi.imbc.com/minimsg/mymsgList_PC`
      : `http://miniapi.imbc.com/minimsg/mymsgList_PC`,
    messageDelApi: window.location.href.includes('https')
      ? `https://miniapi.imbc.com/minimsg/msgDel_pc`
      : `http://miniapi.imbc.com/minimsg/msgDel_pc`,
    likeItemApi: window.location.href.includes('https')
      ? 'https://miniapi.imbc.com/podcast/likeitem'
      : 'http://miniapi.imbc.com/podcast/likeitem',
  };

  static user = {
    name: 'osifa78',
    uid: 'UTBKTmFTNDVNVEF5TG5CeWIwTjhPRGRoWm1semJ3PT0=',
    password: 'Q~h$a#7*Ah/Jfi@',
    UNO: 0,
  };

  constructor(private url: string) {}

  request(): Promise<T> {
    return new Promise((resolve) => {
      $.ajax({
        url: this.url,
        type: 'GET',
        dataType: 'jsonp',
        success: (data: any, status: any, xhr: any) => {
          resolve(data);
        },
        error: (err: any) => {
          console.log(err);
        },
      });
    });
  }
}
