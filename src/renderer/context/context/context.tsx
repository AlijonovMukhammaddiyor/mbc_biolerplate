/* eslint-disable @typescript-eslint/ban-types */
import React, { createContext, useReducer, useEffect, useState } from 'react';
import Reducer from '../reducer/reducer';
import Data from '../utils/data';
import { STATE, Schedule, Vod } from '../utils/types';
import INITIAL_STATE from './state';
import Utils from '../../components/Utils/utils';

export const Context = createContext<{
  state: STATE;
  dispatch: React.Dispatch<any>;
}>({ state: INITIAL_STATE, dispatch: () => {} });

export const ContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(Reducer, INITIAL_STATE);
  /**
   * Because we cannot fetch schedules when initializing INITIAL_STATE
   * we have to fetch it here and provide it to ContextProvider
   */
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [vodSchedule, setVodSchedule] = useState<Vod[]>([]);
  const [updateAgain, setUpdateAgain] = useState<boolean>(true);

  useEffect(() => {
    const utils = new Utils(state, dispatch);
    utils.updateGuestCorner();
    const timer = window.setInterval(() => {
      utils.updateGuestCorner();
    }, 15000);

    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function checkUser() {
      window.electron.ipcRenderer.send('check-user', { name: 'IMBCMAIN' });
    }

    checkUser();

    window.setInterval(checkUser, 5000);

    window.electron.ipcRenderer.receive('take-cookie', (_, args) => {
      if (args.name) {
        dispatch({
          type: 'USER_COOKIE_STATE_YES',
        });
      } else {
        dispatch({
          type: 'USER_COOKIE_STATE_NO',
        });
      }
    });

    return () => {
      window.electron.ipcRenderer.removeListener('take-cookie', (args) => {
        if (args.name) {
          dispatch({
            type: 'USER_COOKIE_STATE',
            cookieAvailable: true,
            mainUser: state.user.mainUser,
          });
        } else {
          dispatch({
            type: 'USER_COOKIE_STATE',
            cookieAvailable: false,
            mainUser: null,
          });
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    /**
     * vod schedule
     */
    function getVodSchedule() {
      const data = new Data<Vod[]>(Data.urls.vodScheduleApi).request();
      data
        // eslint-disable-next-line promise/always-return
        .then((res) => {
          setVodSchedule(res);
          dispatch({ type: 'SET_VOD_SCHEDULE', vods: res });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    getVodSchedule();
  }, []);

  useEffect(() => {
    /**
     * weekly programs schedule
     */
    function getSchedule() {
      const data = new Data<Schedule[]>(
        `${Data.urls.onAirScheduleAPI}?rtype=jsonp`
      ).request();

      data
        .then((res) => {
          console.log('updating again');
          setSchedule(res);
          return res;
        })
        .then((res) => {
          /**
           * Here, we have to initialize currentPrograms for the channels. Otherwise, radio will hang without current programs
           */
          const utils = new Utils(state, dispatch);
          utils.updateCurrentPrograms(res);
          // eslint-disable-next-line promise/always-return
          if (
            !state.main_state.general.currentPrograms.sfm ||
            !state.main_state.general.currentPrograms.mfm ||
            !state.main_state.general.currentPrograms.chm
          ) {
            setUpdateAgain(!updateAgain);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }

    getSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateAgain]);

  // check Bora Schedule for current visible radio
  useEffect(() => {
    const util = new Utils(state, dispatch);
    const setCurrentVod = () => {
      const isVod = util.getCurrentVod();
      isVod
        .then((res) => {
          if (res) {
            dispatch({
              type: 'CURRENT_VOD_AVAILABLE',
              payload: util.currentVod,
            });
          } else {
            dispatch({ type: 'CURRENT_VOD_NOT_AVAILABLE' });
          }
        })
        .catch((err) => {
          dispatch({ type: 'VOD_FETCH_ERROR', error: err });
        });
    };
    setCurrentVod();
    const timer = window.setInterval(() => setCurrentVod(), 5000);

    return () => {
      window.clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.main_state.vod.vodSchedule]);

  useEffect(() => {
    localStorage.setItem(
      'state',
      JSON.stringify({
        main_state: {
          ...state.main_state,
          general: { ...state.main_state.general, autoplay: false },
          podcast: {
            ...state.main_state.podcast,
            subpodcast: {
              ...state.main_state.podcast.subpodcast,
              speed: 1,
            },
          },
          vod: {
            ...state.main_state.vod,
            videoClosed: false,
          },
        },
        user: state.user,
      })
    );
  });

  useEffect(() => {
    const util = new Utils(state, dispatch);
    util.renderCurrentSongs();
    const timer = window.setInterval(() => {
      util.renderCurrentSongs();
    }, 10000);

    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // console.log("useeffect update programs");
    const util = new Utils(state, dispatch);
    util.updateCurrentPrograms(schedule);
    const timer = window.setInterval(
      () => util.updateCurrentPrograms(schedule),
      5000
    );

    return () => {
      window.clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [new Date().getMinutes(), schedule]);

  return (
    <Context.Provider
      value={{
        state: {
          user: state.user,
          error: state.error,
          main_state: {
            ...state.main_state,
            general: { ...state.main_state.general, schedule },
            vod: {
              ...state.main_state.vod,
              vodSchedule,
            },
          },
        },
        dispatch,
      }}
    >
      {children}
    </Context.Provider>
  );
};
