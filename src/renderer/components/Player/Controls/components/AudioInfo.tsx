import React, { useEffect, useRef, useState } from 'react';
import { STATE } from 'renderer/context/utils/types';
import Utils from '../../../Utils/utils';
import personIcon from '../../../../assets/player/top/icon-info.svg';
import '../../../../styles/audioinfo/audioinfo.css';

type Props = {
  util: Utils;
  state: STATE;
};

export default function AudioDetails({ util, state }: Props) {
  const titleRef = useRef() as React.RefObject<HTMLParagraphElement>;
  const subtitleRef = useRef() as React.RefObject<HTMLParagraphElement>;
  const [infoType, setInfoType] = useState(true);
  const [currentPersonIcon, setPersonIcon] = useState(personIcon);

  useEffect(() => {
    util.animateText(titleRef);
    util.animateText(subtitleRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    titleRef.current?.innerText,
    subtitleRef.current?.innerText,
    state.main_state.general.channel,
    state.main_state.podcast.isPodcastTab,
    titleRef.current,
    subtitleRef.current,
  ]);

  return (
    <div className="audio__info">
      {util.renderTitle(titleRef)}
      {util.renderSubtitle(
        subtitleRef,
        currentPersonIcon,
        setPersonIcon,
        setInfoType,
        infoType
      )}
    </div>
  );
}
