import { useState } from 'react';
import volumeIcon from '../../../../assets/player/top/p-i-sound_default.svg';
import mutedIcon from '../../../../assets/player/top/p-i-sound-mute.svg';
import volumeChangeIcon from '../../../../assets/player/top/p-i-sound.svg';
import '../../../../styles/volume/volume.css';
import volumeIconPod from '../../../../assets/player/top/p-i-sound-default-white.svg';
import volumeIconMutedPod from '../../../../assets/player/top/p-i-sound-mute-white.svg';
import volumeChangeIconPod from '../../../../assets/player/top/p-i-sound-white.svg';
import volumeIconMini from '../../../../assets/mini/icon-volume-on.svg';
import mutedIconMini from '../../../../assets/mini/icon-sound-off.svg';
import volumeChangeIconMini from '../../../../assets/mini/icon-volume-change.svg';

type Props = {
  setVolume: (param: number) => void;
  volume: number;
  toggleVolume: () => void;
  isPodcast: boolean;
  isMini: boolean;
};

export default function Volume({
  toggleVolume,
  isPodcast,
  volume,
  setVolume,
  isMini,
}: Props) {
  const [changeVol, setChangeVol] = useState(false);
  const [delayHandler, setDelayHandler] = useState<any>(null);

  const podcastClass = isPodcast ? 'podcast_in' : '';
  const miniClass = isMini ? 'mini' : '';

  return (
    <div
      className={
        changeVol
          ? `volume__container change ${podcastClass}`
          : `volume__container`
      }
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img
        src={
          !isPodcast
            ? isMini
              ? changeVol
                ? volumeChangeIconMini
                : volume === 0
                ? mutedIconMini
                : volumeIconMini
              : changeVol
              ? volumeChangeIcon
              : volume === 0
              ? mutedIcon
              : volumeIcon
            : changeVol
            ? volumeChangeIconPod // should be changed to volumeChangeIconPod
            : volume === 0
            ? volumeIconMutedPod // to volumeIconMutedPod
            : volumeIconPod // to volumeIconPod
        }
        onClick={() => toggleVolume()}
        alt=""
        className={changeVol ? 'volume__changing' : ''}
      />

      <input
        onChange={(e) => {
          setVolume(e.currentTarget.valueAsNumber);
        }}
        className={
          isPodcast
            ? `volume__input podcast_in ${miniClass}`
            : `volume__input ${miniClass}`
        }
        type="range"
        name=""
        id="volume"
        value={volume}
        min={0}
        max={10}
      />
    </div>
  );

  function handleMouseEnter() {
    if (delayHandler) {
      window.clearTimeout(delayHandler);
    }
    setChangeVol(true);
  }

  function handleMouseLeave() {
    const timer = window.setTimeout(() => setChangeVol(false), 1000);
    setDelayHandler(timer);
  }
}
