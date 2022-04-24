/* eslint-disable @typescript-eslint/ban-types */
import { useContext, useEffect } from 'react';
import Messages from './Messages/Messages';
import TrackList from './TrackList/TrackList';
import '../../styles/middleContainer/middleContainer.css';
import iconMakeMini from '../../assets/middle/icon_mini_close.svg';
import iconClose from '../../assets/middle/icon_close.svg';
import iconMoreClose from '../../assets/middle/icon_more_close.svg';
import { Context } from '../../context/context/context';
import Schedule from './Schedule/Schedule';
import PodcastTab from './podcast/PodcastTab';
import MyMini from './MyMini/MyMini';
import Settings from './Settings/Settings';

export default function MiddleContainer() {
  const { state, dispatch } = useContext(Context);

  return (
    <div
      className={
        state.main_state.general.isLogInScreen
          ? 'middle__container login__visible'
          : 'middle__container'
      }
    >
      <div className="middle__navbar">
        <div className="icons">
          <div>
            <img
              id="min-btn"
              src={iconMakeMini}
              onClick={() => {
                changeAppState({
                  close: false,
                  hide: false,
                  minimize: true,
                  maximize: false,
                  noMessage: !state.main_state.mini.isMessageOpen,
                });
                dispatch({ type: 'VIDEO_CLOSE' });
                dispatch({
                  type: 'AUTOPLAY_SET',
                  autoplay: !state.main_state.player.pause,
                });
              }}
              alt=""
            />
          </div>
          <div>
            <img
              id="hide-btn"
              src={iconMoreClose}
              onClick={() =>
                changeAppState({
                  close: false,
                  hide: true,
                  minimize: false,
                  maximize: false,
                  noMessage: !state.main_state.mini.isMessageOpen,
                })
              }
              alt=""
            />
          </div>
          <div>
            <img
              id="close-btn"
              src={iconClose}
              onClick={() =>
                changeAppState({
                  close: true,
                  hide: false,
                  minimize: false,
                  maximize: false,
                  noMessage: !state.main_state.mini.isMessageOpen,
                })
              }
              alt=""
            />
          </div>
        </div>
      </div>
      {state.main_state.general.settingsOpen ? (
        <Settings />
      ) : state.main_state.general.myMiniOpen ? (
        <MyMini />
      ) : state.main_state.podcast.isPodcastTab ? (
        <PodcastTab />
      ) : state.main_state.schedule.isScheduleScreen ? (
        <Schedule />
      ) : state.main_state.messages.isMessageTab ? (
        <Messages navbarVisible />
      ) : (
        <TrackList />
      )}
    </div>
  );

  function changeAppState(args: {
    close: boolean;
    hide: boolean;
    minimize: boolean;
    maximize: boolean;
    noMessage: boolean;
  }) {
    window.electron.ipcRenderer.send('toMain', args);
  }
}
