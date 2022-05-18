import { useEffect, useState, useContext, useRef } from 'react';
import leftIconOff from '../../../../assets/player/podcast/sch-butt-before-off.svg';
import rightIconOn from '../../../../assets/player/podcast/sch-butt-next-on.svg';
import { RecommendedPodcast } from '../../../../context/utils/types';
import '../../../../styles/carousel/carousel.css';
import { Context } from '../../../../context/context/context';

interface Props {
  podcasts: RecommendedPodcast[];
  isSubscribed?: boolean;
}

Carousel.defaultProps = {
  isSubscribed: false,
};

export default function Carousel({ podcasts, isSubscribed }: Props) {
  const { dispatch } = useContext(Context);
  const [unit, setUnit] = useState<number>(0);
  const STEP = 4;
  const LENGTH = Math.ceil(podcasts.length / 4) * 4;
  const [arr, setArr] = useState<number[]>([]);
  const podcastsRef = useRef(null);

  useEffect(() => {
    const temp = [];
    for (let i = 0; i < LENGTH - podcasts.length; i += 1) {
      temp.push(1);
    }
    setArr(temp);
  }, [LENGTH, podcasts.length]);

  return (
    <div className="podcasts__carousel">
      <div className="podcasts__main">
        <button
          type="button"
          onClick={prev}
          className={
            unit >= STEP ? 'move__icon reverse__icon pointer' : 'move__icon'
          }
        >
          <img src={unit === 0 ? leftIconOff : rightIconOn} alt="" />
        </button>
        <div className={`podcasts `} id="podcasts" ref={podcastsRef}>
          {podcasts.map((podcast) => {
            return (
              <div key={podcast.BroadCastID}>
                <button
                  type="button"
                  className="podcast"
                  onClick={() => {
                    dispatch({
                      type: 'PODCAST_IN',
                      payload: podcast,
                      channel: 'home',
                    });
                  }}
                >
                  <img src={podcast.ItunesImageURL} alt="" />
                </button>
                {isSubscribed && (
                  <p className="podcast-title" key={podcast.BroadCastID}>
                    {podcast.Title}
                  </p>
                )}
              </div>
            );
          })}

          {podcasts.map((podcast) => {
            return (
              <div key={podcast.BroadCastID + 10} className="podcast blank" />
            );
          })}
        </div>
        <button
          type="button"
          onClick={next}
          className={
            unit + 4 >= podcasts.length
              ? 'move__icon reverse__icon'
              : ' pointer move__icon'
          }
        >
          <img
            src={unit + 4 >= podcasts.length ? leftIconOff : rightIconOn}
            alt=""
          />
        </button>
      </div>
    </div>
  );

  function prev() {
    const newUnit = unit - STEP;
    if (newUnit >= 0 && podcastsRef.current) {
      const container = podcastsRef.current as HTMLDivElement;
      container.scroll({
        left: newUnit * 80 + newUnit * 6,
        behavior: 'smooth',
      });
      setUnit(unit - STEP);
    }
  }

  function next() {
    const newUnit = unit + STEP;
    if (newUnit <= podcasts.length && podcastsRef.current) {
      const container = podcastsRef.current as HTMLDivElement;
      container.scroll({
        left: newUnit * 80 + newUnit * 6,
        behavior: 'smooth',
      });
      setUnit(unit + STEP);
    }
  }
}
