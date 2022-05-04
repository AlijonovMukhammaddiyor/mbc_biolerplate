/* eslint-disable @typescript-eslint/ban-types */
import jsonp from 'jsonp';
import { RefObject } from 'react';
import $ from 'jquery';

import {
  Schedule,
  STATE,
  Channels,
  Song,
  CurrentVod,
  datesObj,
  Vod,
  ProgramSchedule,
  ChannelSchedule,
  Guest,
} from '../../context/utils/types';
import Data from '../../context/utils/data';
import personIcon from '../../assets/player/top/icon-info.svg';
import personIconHover from '../../assets/player/top/icon-info-on.svg';

export default class Utils {
  private weekdays: string[] = ['월', '화', '수', '목', '금', '토', '일'];

  public currentVod: CurrentVod | null;

  constructor(
    private state: STATE,
    private dispatch: (param: unknown) => void
  ) {
    this.currentVod = null;
  }

  renderTitle(titleRef: RefObject<HTMLParagraphElement>): JSX.Element {
    const { isSubpodcastPlaying } = this.state.main_state.podcast.subpodcast;
    const { currentSubpodcast } = this.state.main_state.podcast.subpodcast;
    const { currentPrograms } = this.state.main_state.general;
    const { channel } = this.state.main_state.general;
    return isSubpodcastPlaying ? (
      currentSubpodcast ? (
        <p ref={titleRef} className="title">
          {currentSubpodcast.ContentTitle}
        </p>
      ) : (
        <p ref={titleRef} className="title">
          {}
        </p>
      )
    ) : currentPrograms[channel] ? (
      <p ref={titleRef} className="title">
        {currentPrograms[channel]?.ProgramTitle}
      </p>
    ) : (
      <p ref={titleRef} className="title" />
    );
  }

  renderSubtitle(
    subtitleRef: RefObject<HTMLParagraphElement>,
    currentIcon: string,
    setPersonIcon: (param: string) => void,
    setInfoType: Function,
    infoType: boolean
  ): JSX.Element {
    const { channel } = this.state.main_state.general;
    const songs = this.state.main_state.general.currentSongs;
    let name: string | undefined;
    if (channel === 'sfm') name = '표준FM';
    else if (channel === 'mfm') name = 'FM4U';
    else if (channel === 'chm') name = '올댓뮤직';

    const subpodcast =
      this.state.main_state.podcast.subpodcast.currentSubpodcast;

    return this.state.main_state.podcast.subpodcast.isSubpodcastPlaying ? (
      subpodcast ? (
        <div className="subtitle">
          <p ref={subtitleRef}>{subpodcast.BroadDate}</p>
        </div>
      ) : (
        <div className="subtitle">
          <p ref={subtitleRef} />
        </div>
      )
    ) : songs[channel] ? (
      <div className="subtitle">
        {this.state.main_state.general.guests[channel]?.Guest ? (
          !infoType ? (
            <>
              <p ref={subtitleRef}>{songs[channel]?.SomItem}</p>
              <img
                onBlur={() => {}}
                onMouseEnter={() => {
                  setPersonIcon(personIconHover);
                }}
                onMouseOut={() => {
                  setPersonIcon(personIcon);
                }}
                onClick={() => setInfoType(!infoType)}
                className="person__icon"
                src={currentIcon}
                alt="Guest"
              />
            </>
          ) : (
            <>
              <p ref={subtitleRef}>
                {this.state.main_state.general.guests[channel]?.Guest}
              </p>
              <img
                onBlur={() => {}}
                onMouseEnter={() => {
                  setPersonIcon(personIconHover);
                }}
                onMouseOut={() => {
                  setPersonIcon(personIcon);
                }}
                onClick={() => setInfoType(!infoType)}
                className="person__icon"
                src={currentIcon}
                alt="Guest"
              />
            </>
          )
        ) : (
          <p ref={subtitleRef}>{songs[channel]?.SomItem}</p>
        )}
      </div>
    ) : (
      <div className="subtitle">
        <p ref={subtitleRef}>{name}</p>
      </div>
    );
  }

  updateGuestCorner() {
    const guests: {
      sfm: Guest | null;
      mfm: Guest | null;
    } = {
      sfm: null,
      mfm: null,
    };
    const date = new Date()
      .toISOString()
      .replace(/T.*/, '')
      .split('-')
      .join('-');

    jsonp(
      `${Data.urls.guestCornerApi}?channel=${`STFM`}&Broaddate=${date}`,
      {},
      (err: Error | null, res: Guest) => {
        if (err) console.log(err);
        else {
          guests.sfm = res;
        }
      }
    );
    jsonp(
      `${Data.urls.guestCornerApi}?channel=${`FM4U`}&Broaddate=${date}`,
      {},
      (err: Error | null, res: Guest) => {
        if (err) console.log(err);
        else {
          guests.mfm = res;
        }
      }
    );

    this.dispatch({ type: 'UPDATE_GUESTS', guests });
  }

  isVodNow(): Promise<boolean> {
    const date = new Date();
    const hour = date.getHours();
    const minutes = date.getMinutes();

    const now = {
      day: this.weekdays[(date.getDay() - 1 + 7) % 7],
      time: hour * 60 + minutes,
    };

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;

    const promise = new Promise<boolean>((resolve, reject) => {
      jsonp(
        Data.urls.currentVodApi,
        { name: 'demoCallback' },
        (err: Error | null, data: CurrentVod) => {
          if (err) reject(err);
          else {
            if (data.WeekDay === now.day) {
              const endTime =
                parseInt(data.EndTime.substring(0, 2), 10) * 60 +
                parseInt(data.EndTime.substring(3, 4), 10);
              const startTime =
                parseInt(data.StartTime.substring(0, 2), 10) * 60 +
                parseInt(data.StartTime.substring(3, 4), 10);

              if (startTime - now.time === 1) {
                // console.log(data);
                window.electron.ipcRenderer.send('video-notification', {
                  title: data.ProgramTitle,
                  guest: data.Guest,
                  icon: data.Picture,
                });
              }
              if (startTime <= now.time && now.time <= endTime) {
                that.currentVod = data;
                resolve(true);
              }
            }
            resolve(false);
          }
        }
      );
    });
    return promise;
  }

  getCurrentVod(): Promise<boolean> {
    return this.isVodNow();
  }

  renderCurrentSongs(): void {
    const currentSongAPI = 'https://miniapi.imbc.com/music/somitem?rtype=jsonp';

    const promise = new Promise<Song[]>((resolve, reject) => {
      jsonp(currentSongAPI, {}, (err, data) => {
        if (err) reject(err);
        else {
          resolve(data);
        }
      });
    });

    promise
      .then((res) => {
        const temp: {
          [key in Channels]: Song | null;
        } = {
          [Channels.sfm]: null,
          [Channels.mfm]: null,
          [Channels.chm]: null,
        };

        for (let i = 0; i < res.length; i += 1) {
          if (res[i].Channel === 'STFM') {
            temp[Channels.sfm] = res[i];
          } else if (res[i].Channel === 'FM4U') {
            temp[Channels.mfm] = res[i];
          } else if (res[i].Channel === 'CHAM') {
            temp[Channels.chm] = res[i];
          }
        }

        this.dispatch({ type: 'SET_CURRENT_SONGS', songs: temp });
      })
      .catch((e) => {
        console.log('Error in  loading current songs: ', e);
      });
  }

  updateCurrentPrograms(schedule: Schedule[]): void {
    const date = new Date();
    const hour = date.getHours();
    const minutes = date.getMinutes();

    const now = {
      day: this.weekdays[(date.getDay() - 1 + 7) % 7],
      time: hour * 60 + minutes,
    };

    const res: {
      [key in Channels]: Schedule | null;
    } = {
      [Channels.sfm]: null,
      [Channels.mfm]: null,
      [Channels.chm]: null,
    };
    const tempA = schedule;
    for (let i = 0; i < tempA.length; i += 1) {
      if (tempA[i].LiveDays === now.day) {
        const pTime =
          parseInt(tempA[i].StartTime.substring(0, 2), 10) * 60 +
          parseInt(tempA[i].StartTime.substring(2, 4), 10);
        if (
          pTime <= now.time &&
          now.time - pTime < parseInt(tempA[i].RunningTime, 10)
        ) {
          if (tempA[i].Channel === 'STFM') {
            res[Channels.sfm] = tempA[i];
          } else if (tempA[i].Channel === 'FM4U') {
            res[Channels.mfm] = tempA[i];
          } else if (tempA[i].Channel === 'CHAM') {
            res[Channels.chm] = tempA[i];
          }
        }
      }
    }
    this.dispatch({ type: 'CURRENT_PROGRAMS', payload: res });
  }

  changeProgress(setProgress: (param: number) => void) {
    const { channel } = this.state.main_state.general;
    const { currentPrograms } = this.state.main_state.general;
    const StartTime =
      parseInt(currentPrograms[channel]!.StartTime.substring(0, 2), 10) * 60 +
      parseInt(currentPrograms[channel]!.StartTime.substring(2, 4), 10);
    const date = new Date();
    const elapsed = date.getHours() * 60 + date.getMinutes();

    const RunningTime = parseInt(currentPrograms[channel]!.RunningTime, 10);
    const prg = (100 * (elapsed - StartTime)) / RunningTime;
    setProgress(prg);
  }

  updateProgress = (progress: number, id: string) => {
    const input: HTMLInputElement = document.querySelector(
      id
    ) as HTMLInputElement;
    document.documentElement.classList.add('js');

    input.addEventListener(
      'input',
      () => {
        // console.log("val", input.style.getPropertyValue("--val"));
        const updatedVal = progress;
        // console.log("ip", updatedVal);
        return input.style.setProperty('--val', `${updatedVal}`);
      },
      false
    );
  };

  getEndTime = (
    startTime: string | undefined,
    runningTime: string | undefined
  ) => {
    function format(time: number) {
      if (time < 10) {
        return `0${time}`;
      }
      return `${time}`;
    }

    if (startTime && runningTime) {
      const sHour = parseInt(startTime.substring(0, 2), 10);
      const sMinutes = parseInt(startTime.substring(2, 4), 10);

      const hour = Math.floor(parseInt(runningTime, 10) / 60);
      let eHours = sHour + hour;
      let eMinutes = sMinutes + parseInt(runningTime, 10) - hour * 60;
      if (eMinutes >= 60) {
        eHours += 1;
        eMinutes -= 60;
      }

      return `${format(eHours)}:${format(eMinutes)}`;
    }
    return '';
  };

  logInOut = (
    username: string | null,
    password: string | null,
    isLogIn: boolean
  ) => {
    if (username) {
      const url = `${Data.urls.loginAPI}`;
      console.log(username, password);
      $.ajax({
        url,
        type: 'POST',
        data: $.param({
          UID: username,
          PASSWORD: password,
          Type: isLogIn ? 1 : 2, // login or logout
          ReturnType: 'JSON',
          Agent: window.navigator.userAgent,
        }),
        crossDomain: true,
        xhrFields: {
          withCredentials: true,
        },
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',
        success: (data) => {
          if (isLogIn)
            if (data.State && data.State[0] !== 'E') {
              console.log(data);
              console.log(this.dispatch);
              this.dispatch({ type: 'LOGIN', mainUser: data });
              console.log('setting cookie', data.UserInfo.IMBCCookie, data);
              window.electron.ipcRenderer.send('set-cookie', {
                cookie: data.UserInfo.IMBCCookie,
                domain: 'https://miniapi.imbc.com',
              });
              this.dispatch({ type: 'HIDE_LOGIN_SCREEN' });
              if (
                this.state.main_state.login.IDremember ||
                this.state.main_state.login.autoLogin
              )
                this.dispatch({
                  type: 'LOGIN_CREDENTIALS',
                  id: username,
                  password,
                });

              if (this.state.main_state.login.autoLogin) {
                setTimeout(
                  () => this.dispatch({ type: 'LOGIN', mainUser: data }),
                  1000
                );
              }
            } else {
              window.electron.ipcRenderer.send('logout', {});
              console.log('Could not get user data');
            }
          else {
            this.dispatch({ type: 'LOGOUT' });
          }
        },
        error: (err) => {
          console.log('Error in login');
          console.log(err);
        },
      });
    }
  };

  getDatesForschedule = () => {
    const temp = [];
    for (let i = -2; i < 5; i += 1) {
      const today = new Date();
      today.setDate(today.getDate() + i);
      temp.push({
        date: today,
        weekday: datesObj[today.getDay()],
      });
    }
    return temp;
  };

  async getScheduleForChannel(vodsSchedule: Vod[], day: string) {
    const channel = this.state.main_state.schedule.scheduleChannel;
    const chan =
      channel === 'sfm' ? 'stfm' : channel === 'mfm' ? 'fm4u' : 'cham';
    const schedule: ChannelSchedule[] = [];
    const onAirProgram = this.state.main_state.general.currentPrograms[channel];

    const promise = new Promise<ChannelSchedule[]>((resolve, reject) => {
      jsonp(
        `${Data.urls.dailyScheduleApi}?channel=${chan}&day=${day}`,
        {},
        (err, data: ProgramSchedule[]) => {
          if (err) reject(err);
          else {
            const vods: Vod[] = [];
            vodsSchedule.forEach((vod) => {
              if (vod.RunDay === day) {
                vods.push(vod);
              }
            });
            data.forEach((program) => {
              let added = false;
              vods.every((vod) => {
                if (vod.BroadCastID === program.BroadCastID) {
                  // console.log(vod, program);
                  schedule.push({
                    ...program,
                    guest: vod.Guest,
                    isBora: true,
                    onAir:
                      program.BroadCastID === onAirProgram?.BroadCastID
                        ? program.LiveDays ===
                          datesObj[new Date().getDay()].substring(0, 1)
                        : false,
                  });
                  added = true;
                  return false;
                }
                return true;
              });
              if (!added) {
                schedule.push({
                  ...program,
                  isBora: false,
                  guest: null,
                  onAir:
                    program.BroadCastID === onAirProgram?.BroadCastID
                      ? program.LiveDays ===
                        datesObj[new Date().getDay()].substring(0, 1)
                      : false,
                });
              }
            });
            resolve(schedule);
          }
        }
      );
    });
    return promise;
  }

  getFilteredPodcastsByChannel = (
    selectedChannel: string,
    selectedSort: number,
    currentCount: number,
    selectedState: number,
    order: string
  ) => {
    const cat = selectedChannel;
    const categoryId =
      cat === '표준FM'
        ? 6
        : cat === 'FM4U'
        ? 7
        : cat === '오리지널'
        ? 333
        : cat === '코너 다시듣기'
        ? 334
        : 335;
    const sortType =
      selectedSort === 0 ? 'Imp' : selectedSort === 1 ? 'StartTime' : 'Title';

    return $.ajax({
      url: Data.urls.podcastListByFilterApi,
      data: {
        page: 0,
        pageSize: currentCount,
        BroadStateID: selectedState,
        SubCategoryID: categoryId,
        SortType: sortType,
        SortOption: order,
      },
      success: (err, res) => {
        console.log(res, 'response from api');
      },
      dataType: 'jsonp',
      type: 'GET',
    });
  };

  getFilteredPodcastsByCategory = (
    category: number,
    selectedSort: number,
    currentCount: number,
    order: string
  ) => {
    const sortType =
      selectedSort === 0 ? 'Imp' : selectedSort === 1 ? 'StartTime' : 'Title';

    return $.ajax({
      url: Data.urls.podcastListByFilterApi,
      data: {
        page: 0,
        GenreID: category,
        pageSize: currentCount,
        SortType: sortType,
        SortOption: order,
      },
      dataType: 'jsonp',
      type: 'GET',
    });
  };

  // getSubscribedPrograms = () => {
  //   const getSubsPodcasts = async () => {
  //     if (this.state.user.cookieAvailable) {
  //       const rawResponse = await fetch(
  //         `${Data.urls.subscribedProgramLIstApiPC}?cookieinfo=${this.readCookie(
  //           'IMBCSession'
  //         )}`,
  //         {
  //           method: 'POST',
  //           headers: {
  //             Accept: 'application/json',
  //             'Content-Type': 'application/json',
  //           },
  //         }
  //       );
  //       const content = await rawResponse.json();
  //       console.log('content', content);
  //       return content;
  //     }
  //     return [];
  //   };

  //   return getSubsPodcasts();
  // };

  async handleSubsClick(
    id: string | undefined,
    stateSubs: boolean,
    setUpdate: (par: boolean) => void,
    update: boolean,
    setRender: (p: string) => void
  ) {
    if (this.state.user.cookieAvailable && id) {
      await $.ajax({
        url: Data.urls.subscribeProgramApi,
        type: 'POST',
        data: {
          bid: id,
          state: stateSubs,
          CookieInfo: this.readCookie('IMBCSession'),
        },
        success: () => {
          if (stateSubs) {
            console.log('rendering subs');
            setRender('subs');
          } else {
            console.log('rendering unsubs');
            setRender('unsubs');
          }
          setUpdate(!update);
        },
        crossDomain: true,
        xhrFields: {
          withCredentials: true,
        },
      });
    } else {
      this.dispatch({ type: 'SHOW_LOGIN_SCREEN' });
    }
  }

  animateText = (textRef: RefObject<HTMLParagraphElement>) => {
    const styleAnimated = {
      width: 'auto',
      display: 'flex',
      textOverflow: 'unset',
      animation: 'slidein 5s linear 0.2s infinite',
      overflow: 'visible',
    };

    function isEllipsisActive(e: RefObject<HTMLParagraphElement>): number {
      if (e.current) {
        // console.log(e.current);

        return e.current.scrollWidth / e.current.offsetWidth;
      }
      return 0;
    }

    function helper(
      ref: React.RefObject<HTMLParagraphElement>,
      css: {
        width: string;
        display: string;
        textOverflow: string;
        animation: string;
        overflow: string;
      }
    ) {
      ref.current!.style.width = css.width;
      ref.current!.style.display = css.display;
      ref.current!.style.textOverflow = css.textOverflow;
      ref.current!.style.animation = css.animation;
      ref.current!.style.overflow = css.overflow;
    }
    const ratio = isEllipsisActive(textRef);
    if (ratio > 1) {
      textRef.current!.onmouseover = (e) => {
        if (textRef.current) {
          helper(
            textRef,
            ratio >= 2
              ? {
                  ...styleAnimated,
                  animation: 'slidein 8s linear 0.2s infinite',
                }
              : styleAnimated
          );
        }
      };
      textRef.current!.onmouseleave = (e) => {
        // if (textRef.current) {
        textRef.current!.removeAttribute('style');
        // }
      };
    } else {
      textRef.current!.onmouseover = (e) => {};
      textRef.current!.onmouseleave = (e) => {};
    }
  };

  readCookie = (name: string) => {
    if (this.state.user.mainUser) {
      const nameEQ = `${name}=`;
      const ca = this.state.user.mainUser.UserInfo.IMBCCookie.split(';');
      for (let i = 0; i < ca.length; i += 1) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0)
          return c.substring(nameEQ.length, c.length);
      }
    }
    return null;
  };
}
