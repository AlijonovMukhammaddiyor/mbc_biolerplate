import { useEffect, useState, useRef } from 'react';
import '../../styles/tooltip/tooltip.css';

type Props = {
  text: string;
  visible: boolean;
};

export default function ToolTip({ text, visible }: Props) {
  const titleRef = useRef() as React.RefObject<HTMLParagraphElement>;

  // useEffect(() => {
  //   console.log(titleRef.current?.offsetWidth, titleRef.current?.scrollWidth);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [text, titleRef.current]);

  console.log(visible);

  return (
    <span
      className={visible ? 'tooltip__container visible' : 'tooltip__container'}
    >
      <div className="inner">
        <p ref={titleRef}>{text}</p>
      </div>
    </span>
  );
}
