import { useState, useEffect } from 'react';
import iconNext15 from '../../../../assets/player/playPausePodcast/podcast-icon-15-next.svg';
import iconBefore15 from '../../../../assets/player/playPausePodcast/podcast-icon-15-before.svg';
import iconNext3 from '../../../../assets/player/playPausePodcast/podcast-icon-3-next.svg';
import iconBefore3 from '../../../../assets/player/playPausePodcast/podcast-icon-3-before.svg';
import iconPlay from '../../../../assets/player/playPausePodcast/podcast-icon-play.svg';
import iconPause from '../../../../assets/player/playPausePodcast/podcast-icon-stop.svg';
import { STATE } from '../../../../context/utils/types';
import Volume from './Volume';
import Speed from './Speed';
import '../../../../styles/playpausepodcast/playpausepodcast.css';

type Props = {
  state: STATE;
  dispatch: (param: unknown) => void;
  pause: boolean;
  setPause: (param: boolean) => void;
};

export default function PlayPausePodcast({
  state,
  dispatch,
  pause,
  setPause,
}: Props) {
  const pauseClass = pause ? 'paused' : '';
  const [currentPlayIcon, setIcon] = useState(
    state.main_state.general.autoplay ? iconPause : iconPlay
  );
  useEffect(() => {
    if (!pause) {
      if (currentPlayIcon === iconPlay) setIcon(iconPause);
    } else if (currentPlayIcon === iconPause) setIcon(iconPlay);
  }, [pause, currentPlayIcon]);

  return (
    <div className="play__pause__podcast">
      <div className="speed">
        <Speed state={state} dispatch={dispatch} />
      </div>
      <div className="before">
        <img onClick={() => skipAudio(-180)} src={iconBefore3} alt="" />
        <img onClick={() => skipAudio(-15)} src={iconBefore15} alt="" />
        <p onClick={() => skipAudio(-15)} className="before__15">
          -15초
        </p>
      </div>
      <div className={`play__pause__icons ${pauseClass}`}>
        <img
          src={currentPlayIcon}
          onClick={() => {
            playAudioVideo();
          }}
          alt=""
        />
      </div>
      <div className="next">
        <img onClick={() => skipAudio(15)} src={iconNext15} alt="" />
        <img onClick={() => skipAudio(180)} src={iconNext3} alt="" />
      </div>
      <div className="volume">
        <Volume
          isMini={false}
          isPodcast
          volume={state.main_state.player.volume}
          setVolume={setVolume}
          toggleVolume={toggleVolume}
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

  function playAudioVideo() {
    /**
     * Pausing and Playing audio and video
     */
    const audio: HTMLAudioElement = document.getElementById(
      'audio'
    ) as HTMLAudioElement;
    if (!pause) {
      if (audio) audio.pause();
    } else if (audio) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          // eslint-disable-next-line promise/always-return
          .then(() => {})
          .catch((error) => {
            console.log(error);
          });
      }
    }
    setPause(!pause);
  }

  function skipAudio(time: number) {
    const audio = document.getElementById('audio') as HTMLAudioElement;
    audio.currentTime += time;
  }
}
