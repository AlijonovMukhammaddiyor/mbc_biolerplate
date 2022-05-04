/* eslint-disable @typescript-eslint/ban-types */
import { Route, Routes, HashRouter } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import Player from '../Player/Player';
import Ad from '../Ad/Ad';
import '../../styles/fonts/fonts.css';
import '../../styles/app/app.css';
import MiddleContainer from '../MiddleContainer/MiddleContainer';
import Login from '../login/Login';
import Mini from '../Mini/Mini';
import { Context } from '../../context/context/context';
import Utils from '../Utils/utils';

export default function App() {
  const { state, dispatch } = useContext(Context);

  useEffect(() => {
    window.electron.ipcRenderer.receive('minimize-screen', (_, args) => {
      if (args.minimize) {
        dispatch({
          type: 'MINIMIZE_ON',
        });
      } else {
        dispatch({
          type: 'MINIMIZE_OFF',
        });
      }
    });

    window.electron.ipcRenderer.receive('login-again', (_, args) => {
      if (state.main_state.login.password && state.main_state.login.id) {
        const util = new Utils(state, dispatch);
        util.logInOut(
          state.main_state.login.id,
          state.main_state.login.password,
          true
        );
      }
    });

    window.electron.ipcRenderer.receive('app-info', (_, args) => {
      if (args.windowSize.width === 960) {
        dispatch({ type: 'MINIMIZE_OFF' });
      } else if (args.windowSize.height === 110) {
        // mini and no message
        dispatch({ type: 'MINIMIZE_ON' });
        if (state.main_state.mini.isMessageOpen) {
          dispatch({ type: 'TOGGLE_MINI_MESSAGE' });
        }
      } else {
        // mini with message
        dispatch({ type: 'MINIMIZE_ON' });
        if (!state.main_state.mini.isMessageOpen) {
          dispatch({ type: 'TOGGLE_MINI_MESSAGE' });
        }
      }

      window.electron.ipcRenderer.receive('not-info', () => {
        console.log('notification renderer');
      });

      console.log(args);

      dispatch({
        type: 'CHANGE_SETTINGS',
        autostart: args.settings.autoStart,
        videoNotice: state.main_state.settings.videoNotice,
        onTop: args.settings.onTop,
      });
    });

    window.onbeforeunload = (e) => {
      window.electron.ipcRenderer.send('app-quit', {});
      window.onbeforeunload = null;
    };

    return () => {
      window.electron.ipcRenderer.removeListener('app-info', (args) => {
        if (args.windowSize.width === 960) {
          dispatch({ type: 'MINIMIZE_OFF' });
        } else if (args.windowSize.height === 110) {
          // mini and no message
          dispatch({ type: 'MINIMIZE_ON' });
          if (state.main_state.mini.isMessageOpen) {
            dispatch({ type: 'TOGGLE_MINI_MESSAGE' });
          }
        } else {
          // mini with message
          dispatch({ type: 'MINIMIZE_ON' });
          if (!state.main_state.mini.isMessageOpen) {
            dispatch({ type: 'TOGGLE_MINI_MESSAGE' });
          }
        }
      });

      window.electron.ipcRenderer.removeListener('login-again', () => {
        if (state.main_state.login.password && state.main_state.login.id) {
          const util = new Utils(state, dispatch);
          util.logInOut(
            state.main_state.login.id,
            state.main_state.login.password,
            true
          );
        }
      });

      window.electron.ipcRenderer.removeListener('minimize-screen', (args) => {
        if (args.minimize) {
          dispatch({
            type: 'MINIMIZE_ON',
          });
        } else {
          dispatch({
            type: 'MINIMIZE_OFF',
          });
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {state.main_state.mini.isMini ? (
        <Mini />
      ) : (
        <div
          className={
            state.main_state.general.isLogInScreen
              ? 'app__container app__login'
              : 'app__container'
          }
        >
          <HashRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Login />
                    <Player />
                    <MiddleContainer />
                    <Ad />
                  </>
                }
              />
            </Routes>
          </HashRouter>
        </div>
      )}
    </>
  );
}
