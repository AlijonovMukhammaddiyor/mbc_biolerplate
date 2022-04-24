import { useState, useContext, useEffect, useRef } from 'react';
import '../../../../styles/podcastsByChannel/podcastsByChannel.css';
import DropDown from './DropDown';
import Radio from './SelectRadio';
import { Context } from '../../../../context/context/context';
import iconSubs from '../../../../assets/middle/icon-song-like-on.svg';
import iconSubsDone from '../../../../assets/middle/icon-song-like-off.svg';
import {
  RecommendedPodcast,
  PodcastResponse,
} from '../../../../context/utils/types';
import Category from './Category';
import Utils from '../../../Utils/utils';

type ExtendedPodcast = PodcastResponse['list'][0] & { isSubscribed: boolean };

type Props = {
  isByCatgory: boolean;
};

export default function Podcast({ isByCatgory }: Props) {
  const [selectedChannel, setChannel] = useState('표준FM');
  const [channelsCategory, setChannelCategory] = useState([
    '표준FM',
    'FM4U',
    '오리지널',
    '코너 다시듣기',
    '기타',
  ]);
  const [podcastState, setState] = useState(['방송중', '방송종료']);
  const [selectedState, setSelectedState] = useState(2);
  // const [sorts, setSorts] = useState(["인기순", "방송시간순", "가나다순"]);
  const sorts = ['인기순', '방송시간순', '가나다순'];
  const [selectedSort, setSelectedSort] = useState(0); // index of sorts
  const { state, dispatch } = useContext(Context);
  const [podcasts, setPodcasts] = useState<ExtendedPodcast[]>([]);
  const [order, setOrder] = useState('DESC');
  const [TotalCount, setTotal] = useState<number>(0);
  // each time user scrolls down the end of podcast container we will load fetchCount more podcasts if available
  const fetchStep = 30;
  const [currentCount, setCurrentCount] = useState(fetchStep);
  const listInnerRef = useRef<HTMLDivElement>(null);
  const [subsPodcasts, setSubsPodcasts] = useState<RecommendedPodcast[]>([]);
  const [category, setCategory] = useState(2);
  const utils = new Utils(state, dispatch);

  useEffect(() => {
    async function getResponse() {
      const util = new Utils(state, dispatch);
      const data: RecommendedPodcast[] = await util.getSubscribedPrograms();
      if (data.length > 0) {
        setSubsPodcasts(data);
      }
    }
    if (state.user.cookieAvailable) getResponse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    /**
     * this will fetch podcasts according to the categories chosen by the user
     * We are first going to fetch 50 podcasts, and when user scrolls down the end of the container
     * we will fetch another 50 podcasts like we did for messages
     *
     */
    const util = new Utils(state, dispatch);
    async function setResponse() {
      const data: PodcastResponse = !isByCatgory
        ? await util.getFilteredPodcastsByChannel(
            selectedChannel,
            selectedSort,
            currentCount,
            selectedState,
            order
          )
        : await util.getFilteredPodcastsByCategory(
            category,
            selectedSort,
            currentCount,
            order
          );
      if (data) {
        setTotal(data.Total);
        const temp: ExtendedPodcast[] = [];
        for (let i = 0; i < data.list.length; i += 1) {
          let added = false;
          subsPodcasts.every((podcast) => {
            if (podcast.BroadCastID.toString() === data.list[i].BroadCastID) {
              temp.push({ ...data.list[i], isSubscribed: true });
              added = true;
              return false;
            }
            return true;
          });
          if (!added) {
            temp.push({ ...data.list[i], isSubscribed: false });
          }
        }
        setPodcasts(temp);
      }
    }

    setResponse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedChannel,
    selectedState,
    selectedSort,
    order,
    currentCount,
    subsPodcasts,
    category,
    isByCatgory,
  ]);

  useEffect(() => {
    setCurrentCount(fetchStep);
    if (listInnerRef.current) {
      listInnerRef.current.scrollTop = 0;
    }
  }, [category]);

  return (
    <div className="podcasts__container">
      <div className="filters">
        {isByCatgory ? (
          <Category category={category} setCategory={setCategory} />
        ) : (
          <div className="dropdowns">
            <DropDown names={podcastState} setName={setStateDrop} />
            <DropDown names={channelsCategory} setName={setChannelsDrop} />
          </div>
        )}

        <div className="radio__select">
          <Radio
            names={sorts}
            setCat={setSelectedSort}
            selected={selectedSort}
          />
        </div>

        <button
          type="submit"
          onClick={() => {
            changeOrder();
          }}
          className={isByCatgory ? 'changeOrder by__category' : 'changeOrder'}
        >
          {order === 'DESC' ? `오름차순` : '내림차순'}
          {order === 'DESC' ? <span>&uarr;</span> : <span>&darr;</span>}
        </button>
      </div>
      <div onScroll={onScroll} ref={listInnerRef} className="podcasts">
        {podcasts.map((podcast) => {
          return (
            <div
              key={podcast.BroadCastID}
              onClick={() => {
                enterPodcast(podcast);
              }}
              className="podcast"
              role="list"
            >
              <img className="title__img" src={podcast.ITunesImageURL} alt="" />
              <div className="podcast__details">
                <div className="info">
                  <p className="title">{podcast.Title}</p>
                  <p className="subtitle">{podcast.SubTitle}</p>
                </div>
                <img
                  onClick={() =>
                    podcast.isSubscribed
                      ? utils.handleSubsClick(podcast.BroadCastID, false)
                      : utils.handleSubsClick(podcast.BroadCastID, true)
                  }
                  className="icon__subs"
                  src={podcast.isSubscribed ? iconSubsDone : iconSubs}
                  alt=""
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  function swapElements(arr: string[], elem: string): string[] {
    const idx = arr.indexOf(elem);
    const temp = arr[0];
    const tempArr = arr;
    tempArr[0] = elem;
    tempArr[idx] = temp;
    return tempArr;
  }

  function setChannelsDrop(channel: string) {
    setChannelCategory(swapElements(channelsCategory, channel));
    setChannel(channel);
  }

  function setStateDrop(cat: string) {
    setState(swapElements(podcastState, cat));
    if (cat === '방송종료') setSelectedState(3);
    else setSelectedState(2);
  }

  function changeOrder() {
    if (order === 'DESC') setOrder('ASC');
    else setOrder('DESC');
  }

  function enterPodcast(podcast: ExtendedPodcast) {
    dispatch({
      type: 'PODCAST_IN',
      payload: podcast,
      channel: state.main_state.podcast.channel,
    });
  }

  function onScroll() {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 1) {
        if (currentCount < TotalCount) {
          if (currentCount + fetchStep <= TotalCount)
            setCurrentCount(currentCount + fetchStep);
          else setCurrentCount(TotalCount);
        }
      }
    }
  }
}
