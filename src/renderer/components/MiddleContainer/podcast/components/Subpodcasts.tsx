/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
import React, { useRef, useContext, useEffect, useState } from 'react';
import '../../../../styles/subpodcasts/subposcasts.css';
import jsonp from 'jsonp';
import backIcon from '../../../../assets/player/podcast/icon-more-right-gray.svg';
import backIconHover from '../../../../assets/player/podcast/icon-more-right-hove.svg';
import { Context } from '../../../../context/context/context';
import iconSubs from '../../../../assets/middle/icon-song-like-on.svg';
import iconNotSubs from '../../../../assets/middle/icon-song-like-off.svg';
import iconShare from '../../../../assets/player/podcast/podcast-icon-share.svg';
import EachSubpodcast from './Subpodcast';
import Data from '../../../../context/utils/data';
import { Subpodcast } from '../../../../context/utils/types';
import Utils from '../../../Utils/utils';

type ItemList = {
  Itemlist: Subpodcast[];
  TotalCount: number;
  ITunesImageURL: string;
  BroadCatID: number;
  Title: string;
  Description: string;
  Link: string;
  SubscribeCNT: number;
  IsSubscribe: boolean;
  page: number;
  pagesize: number;
  ItunesImageURL: string;
};

export default function Subpodcasts() {
  const { state, dispatch } = useContext(Context);
  const [searchQuery, setQeury] = useState<string>('');
  const [isSearching, setSearching] = useState(false);
  const [subpodcasts, setSubPodcasts] = useState<ItemList['Itemlist']>(
    [] as ItemList['Itemlist']
  );
  const [TotalCount, setCount] = useState(0);
  const fetchStep = 50;
  const [currentCount, setCurrentCount] = useState(fetchStep);
  const [searchTotalCount, setSearchCount] = useState(0);
  const [searchCurCount, setSearchCurCount] = useState(fetchStep);
  const listInnerRef = useRef<HTMLDivElement>(null);
  const [backHover, setBackHover] = useState(false);
  const utils = new Utils(state, dispatch);

  useEffect(() => {
    // console.log("useEffect subpodcasts");
    async function getFilteredPodcasts(): Promise<ItemList> {
      return new Promise((resolve, reject) => {
        jsonp(
          `${Data.urls.podcastItemListApi}?bid=${state.main_state.podcast.currentPodcast?.BroadCastID}&page=1&pagesize=${currentCount}`,
          {},
          function (err: null | Error, data: ItemList) {
            if (err) reject(err);
            else {
              resolve(data);
            }
          }
        );
      });
    }

    const list = getFilteredPodcasts();
    list.then((data) => {
      // console.log(data);
      setSubPodcasts(data.Itemlist);
      setCount(data.TotalCount);
    });
  }, [currentCount, state.main_state.podcast.currentPodcast?.BroadCastID]);

  useEffect(() => {
    fetchQueryEpisodes(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchCurCount]);

  // console.log(subpodcasts);

  return (
    <div className="subpodcasts__container">
      <div className={backHover ? 'back__icon hover' : 'back__icon'}>
        <img
          onClick={() => {
            goBack();
          }}
          onBlur={() => {}}
          onFocus={() => {}}
          onMouseOver={() => {
            setBackHover(true);
          }}
          onMouseOut={() => {
            setBackHover(false);
          }}
          src={backHover ? backIconHover : backIcon}
          alt=""
        />
      </div>
      <div className="podcast">
        <img
          src={
            state.main_state.podcast.currentPodcast?.ITunesImageURL ||
            state.main_state.podcast.currentPodcast?.ItunesImageURL
          }
          alt=""
        />
        <div className="info">
          <div className="contents">
            <p className="title">
              {state.main_state.podcast.currentPodcast?.Title}
            </p>
            <p className="subtitle">
              {state.main_state.podcast.currentPodcast?.SubTitle}
            </p>
          </div>
          <div className="main__podcast__icons">
            <button
              type="submit"
              onClick={() => {
                dispatch({
                  type: 'PODCAST_SHARE_ON',
                  url: state.main_state.podcast.currentPodcast?.Link,
                });
              }}
            >
              <img src={iconShare} alt="" />
              공유
            </button>

            <img
              onClick={() =>
                state.main_state.podcast.currentPodcast?.isSubscribed
                  ? utils.handleSubsClick(
                      state.main_state.podcast.currentPodcast?.BroadCastID,
                      false
                    )
                  : utils.handleSubsClick(
                      state.main_state.podcast.currentPodcast?.BroadCastID,
                      true
                    )
              }
              src={
                state.main_state.podcast.currentPodcast?.isSubscribed
                  ? iconNotSubs
                  : iconSubs
              }
              alt=""
            />
          </div>
        </div>
      </div>

      <div className="search">
        <form onSubmit={fetchQueryEpisodes} action="" id="search__form">
          <input
            type="text"
            onChange={(e) => {
              setQeury(e.target.value);
            }}
            value={searchQuery}
            className="search__input"
            placeholder="검색어를 입력해주세요"
          />
          <button type="submit" className="search__submit">
            검색
          </button>
        </form>

        <button
          type="submit"
          className={
            isSearching
              ? searchCurCount >= searchTotalCount
                ? searchTotalCount !== 0
                  ? 'all all__shown'
                  : 'all'
                : 'all'
              : currentCount >= TotalCount
              ? TotalCount !== 0
                ? 'all all__shown'
                : 'all'
              : 'all'
          }
          // onClick={() => {
          // 	isSearching ? setSearchCurCount(searchTotalCount) : setCurrentCount(TotalCount);
          // }}
        >
          전체목록
        </button>

        <p className="result__count">
          {isSearching ? searchTotalCount : TotalCount}개
        </p>
      </div>

      <div ref={listInnerRef} onScroll={onScroll} className="subpodcasts">
        {subpodcasts.length > 0 ? (
          subpodcasts.map((subpodcast, index) => {
            return (
              <EachSubpodcast
                key={subpodcast.PodCastItemIdx}
                subpodcast={subpodcast}
                playSubpodcast={playSubpodcast}
                index={index}
              />
            );
          })
        ) : (
          <div className="no__subpodcast">검색 결과가 없습니다.</div>
        )}
      </div>
    </div>
  );

  function onScroll() {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        if (isSearching) {
          if (searchCurCount < searchTotalCount) {
            if (searchCurCount + fetchStep <= searchTotalCount) {
              setSearchCurCount(searchCurCount + fetchStep);
            } else {
              setSearchCurCount(searchTotalCount);
            }
          }
        } else if (currentCount < TotalCount) {
          if (currentCount + fetchStep <= TotalCount)
            setCurrentCount(currentCount + fetchStep);
          else setCurrentCount(TotalCount);
        }
      }
    }
  }

  function goBack() {
    dispatch({ type: 'PODCAST_OUT' });
  }

  function fetchQueryEpisodes(event: React.FormEvent<HTMLFormElement> | null) {
    /**
     * In case, search query is empty string. We will fetch all subpodcasts
     */
    if (event) event.preventDefault();
    async function getEpisodes(): Promise<ItemList['Itemlist']> {
      return new Promise((resolve, reject) => {
        jsonp(
          `${Data.urls.programEpisodeSearchApi}?query=${searchQuery}&bid=${
            state.main_state.podcast.currentPodcast?.BroadCastID
          }&page=${0}&pagesize=${searchCurCount}&sortType=${`Newest`}&sortOption=${`DESC`}`,
          {},
          function (err: null | Error, data) {
            if (err) reject(err);
            else {
              resolve(data.list);
              setSearchCount(data.Total);
            }
          }
        );
      });
    }

    const episodes = getEpisodes();
    episodes
      .then((data) => {
        setSearching(true);
        setSubPodcasts(data);
        // console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function playSubpodcast(
    subpodcast: Subpodcast,
    podcast: any,
    channel: string | null,
    index: number
  ) {
    dispatch({
      type: 'SUBPODCAST_ON',
      subpodcast,
      currentIndex: index,
      podcast,
      channel,
      playlist: subpodcasts,
    });
  }
}