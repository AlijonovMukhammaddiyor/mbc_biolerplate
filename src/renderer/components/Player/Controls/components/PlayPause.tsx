import { useState, useEffect } from 'react';
import playIcon from '../../../../assets/player/top/main-icon-play.svg';
import playIconOver from '../../../../assets/player/top/main-icon-play-over.svg';
import pauseIconOver from '../../../../assets/player/top/main-icon-stop-over.svg';
import pauseIcon from '../../../../assets/player/top/main-icon-stop.svg';

import { STATE } from '../../../../context/utils/types';
import '../../../../styles/playPause/playPause.css';

type Props = {
  state: STATE;
  isMini: boolean;
  dispatch: (p: any) => void;
};

export default function PlayPause({
  state,

  isMini,
  dispatch,
}: Props) {
  const [currentPlayIcon, setIcon] = useState(
    state.main_state.general.autoplay ? pauseIcon : playIcon
  );
  useEffect(() => {
    if (!state.main_state.player.pause) {
      if (currentPlayIcon === playIcon) setIcon(pauseIcon);
      else if (currentPlayIcon === playIconOver) setIcon(pauseIconOver);
    } else if (currentPlayIcon === pauseIcon) setIcon(playIcon);
    else if (currentPlayIcon === pauseIconOver) setIcon(playIconOver);
  }, [state.main_state.player.pause, currentPlayIcon]);

  return (
    <div className="play__pause__container">
      <img
        onMouseOver={() => {
          if (currentPlayIcon === playIcon) {
            setIcon(playIconOver);
          } else if (currentPlayIcon === pauseIcon) {
            setIcon(pauseIconOver);
          }
        }}
        onBlur={() => {}}
        onFocus={() => {}}
        onMouseOut={() => {
          if (currentPlayIcon === playIconOver) {
            setIcon(playIcon);
          } else if (currentPlayIcon === pauseIconOver) {
            setIcon(pauseIcon);
          }
        }}
        onClick={() => {
          playAudioVideo();
        }}
        src={currentPlayIcon}
        className={isMini ? 'play__icon mini' : 'play__icon'}
        alt=""
      />
    </div>
  );

  function playAudioVideo() {
    /**
     * Pausing and Playing audio and video
     */
    const audio: HTMLAudioElement = document.getElementById(
      'audio'
    ) as HTMLAudioElement;
    if (!state.main_state.player.pause) {
      if (audio) audio.pause();
    } else if (audio) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          // eslint-disable-next-line promise/always-return
          .then(() => {
            dispatch({ type: 'PAUSE_SET_VIDEO', vodPlay: false });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
    dispatch({
      type: 'PAUSE_SET_AUDIO',
      pause: !state.main_state.player.pause,
    });
  }
}
