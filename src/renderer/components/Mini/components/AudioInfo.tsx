import React, { useRef, useState } from 'react';
import personIcon from '../../../assets/player/top/icon-info.svg';
import Utils from '../../Utils/utils';
import '../../../styles/miniAudioInfo/audioInfo.css';

type Props = {
  util: Utils;
};

export default function AudioInfo({ util }: Props) {
  const titleRef = useRef() as React.RefObject<HTMLParagraphElement>;
  const subtitleRef = useRef() as React.RefObject<HTMLParagraphElement>;
  const [currentPersonIcon, setPersonIcon] = useState(personIcon);
  const [infoType, setInfoType] = useState(true);

  return (
    <div className="mini__audioinfo__container">
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
