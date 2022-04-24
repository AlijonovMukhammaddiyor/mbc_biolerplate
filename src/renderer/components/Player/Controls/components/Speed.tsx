import { useState } from 'react';
import { STATE } from '../../../../context/utils/types';
import speedArrowIcon from '../../../../assets/player/playPausePodcast/podcast-icon-arrow.svg';
import speedIcon from '../../../../assets/player/playPausePodcast/podcast-icon-bg.svg';
import '../../../../styles/speed/speed.css';

type Props = {
  state: STATE;
  dispatch: (param: unknown) => void;
};

export default function Speed({ state, dispatch }: Props) {
  const [speedHover, setSpeedHover] = useState(false);

  return (
    <div
      className={
        speedHover
          ? 'subpodcast__play__speed speed-hover'
          : 'subpodcast__play__speed'
      }
    >
      <div
        className="speed__inner"
        onMouseLeave={() => {
          setSpeedHover(false);
        }}
      >
        <div
          className={
            state.main_state.podcast.subpodcast.speed === 1 ||
            state.main_state.podcast.subpodcast.speed === 2
              ? 'current__speed one_two'
              : 'current__speed'
          }
        >
          <p>{`x${state.main_state.podcast.subpodcast.speed}`}</p>
          <img src={speedArrowIcon} alt="" className="speed__hover__arrow" />
        </div>

        <img
          onMouseOver={() => {
            setSpeedHover(true);
          }}
          onFocus={() => {}}
          src={speedIcon}
          alt=""
          className="speed__icon"
        />
        <p className="speed__option" onClick={() => changeSpeed(0.5)}>
          x0.5
        </p>
        <p className="speed__option" onClick={() => changeSpeed(0.8)}>
          x0.8
        </p>
        <p className="speed__option " onClick={() => changeSpeed(1)}>
          x1
        </p>
        <p className="speed__option" onClick={() => changeSpeed(1.2)}>
          x1.2
        </p>
        <p className="speed__option" onClick={() => changeSpeed(1.5)}>
          x1.5
        </p>
        <p className="speed__option " onClick={() => changeSpeed(2)}>
          x2
        </p>
      </div>
    </div>
  );

  function changeSpeed(speed: number) {
    setSpeedHover(false);
    dispatch({ type: 'SUBPODCAST_SPEED', speed });
  }
}
