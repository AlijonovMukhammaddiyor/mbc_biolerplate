import React, { useContext, useEffect, useState } from 'react';
import '../../../styles/miniControls/miniControls.css';
import Utils from '../../Utils/utils';
import Audio from '../../Player/Controls/components/Audio';
import PlayPause from '../../Player/Controls/components/PlayPause';
import Volume from '../../Player/Controls/components/Volume';
import AudioInfo from './AudioInfo';
import { Context } from '../../../context/context/context';
import iconMes from '../../../assets/mini/mini-icon-mess.svg';
import iconMessOff from '../../../assets/mini/icon-mess-off.svg';

export default function Controls() {
  const { state, dispatch } = useContext(Context);
  const utils = new Utils(state, dispatch);
  const [pause, setPause] = useState(!state.main_state.general.autoplay);

  useEffect(() => {
    dispatch({ type: 'PAUSE_SET_AUDIO', pause });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pause]);

  return (
    <div className="mini__controls__container">
      <div className="left">
        <PlayPause
          dispatch={dispatch}
          pause={pause}
          setPause={setPause}
          state={state}
          isMini
        />
        <AudioInfo util={utils} />
        <Audio getDuration={() => {}} setPause={setPause} />
      </div>
      <div className="right">
        <Volume
          isMini
          setVolume={setVolume}
          toggleVolume={toggleVolume}
          isPodcast={false}
          volume={state.main_state.player.volume}
        />
        <img
          src={state.main_state.mini.isMessageOpen ? iconMessOff : iconMes}
          alt=""
          onClick={toggleMessage}
          className="toggle__message__icon"
        />
      </div>
    </div>
  );

  function setVolume(volume: number) {
    dispatch({ type: 'VOLUME_CHANGE', volume });
  }

  function toggleVolume(): void {
    if (state.main_state.player.volume === 0) {
      dispatch({
        type: 'TOGGLE_VOLUME',
        volume: state.main_state.player.prevVolume,
        prevVolume: state.main_state.player.prevVolume,
      });
    } else {
      dispatch({
        type: 'TOGGLE_VOLUME',
        volume: 0,
        prevVolume: state.main_state.player.volume,
      });
    }
  }

  function toggleMessage() {
    window.electron.ipcRenderer.send('mini-no-message', {
      mini: state.main_state.mini.isMessageOpen,
    });
    dispatch({ type: 'TOGGLE_MINI_MESSAGE' });
  }
}
