import { useState, useContext, useEffect, useRef } from 'react';
import '../../../../styles/podcastsByChannel/podcastsByChannel.css';
import Data from 'renderer/context/utils/data';
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
  const { state, dispatch } = useContext(Context);

  const [podcasts, setPodcasts] = useState<ExtendedPodcast[]>([]);
  const [TotalCount, setTotal] = useState<number>(0);
  // each time user scrolls down the end of podcast container we will load fetchCount more podcasts if available
  const fetchStep = 30;
  const [currentCount, setCurrentCount] = useState(fetchStep);
  const listInnerRef = useRef<HTMLDivElement>(null);
  const [subsPodcasts, setSubsPodcasts] = useState<RecommendedPodcast[]>([]);
  // const [category, setCategory] = useState(2);
  const [render, setRender] = useState<string>('');
  // const [subsRender, setSubsRender] = useState(false);
  // const [unsubsRender, setUnSubsRender] = useState(false);
  const [update, setUpdate] = useState(false);
  // const [newUpdate, setNewUpdate] = useState(false);
  const [subscribed, setSubscribed] = useState<RecommendedPodcast[]>([]);
  const [unsubscribed, setUnsubscribed] = useState<RecommendedPodcast[]>([]);

  const utils = new Utils(state, dispatch);

  useEffect(() => {
    async function getResponse() {
      if (state.user.cookieAvailable) {
        try {
          const rawResponse = await fetch(
            `${
              Data.urls.subscribedProgramLIstApiPC
            }?cookieinfo=${utils.readCookie('IMBCSession')}`,
            {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
            }
          );

          if (!rawResponse.ok) {
            throw new Error('network error');
          }

          setSubsPodcasts(await rawResponse.json());
        } catch (err) {
          console.error(err);
        }
      }
    }

    if (state.user.cookieAvailable) {
      console.log('again??');
      getResponse();
      console.log('render is', render);
      if (render === 'subs') {
        let temp = subscribed;
        for (let i = 0; i < subscribed.length; i += 1) {
          for (let k = 0; k < subsPodcasts.length; k += 1) {
            if (
              subsPodcasts[k].BroadCastID.toString() ===
              subscribed[i].BroadCastID.toString()
            ) {
              // it is already processed by the server. So I can remove from local array
              temp = temp.filter((pod) => {
                if (
                  pod.BroadCastID.toString() ===
                  subsPodcasts[i].BroadCastID.toString()
                )
                  return false;
                return true;
              });
            }
          }
        }

        // /**
        //  * Here, I will make sure all elements of subscribed is in subsPodcasts
        //  */
        const t = subsPodcasts;
        t.concat(temp);

        /**
         * Here, I will check if unsubscribed array containsany subscribed element
         */
        let arr = unsubscribed;
        for (let i = 0; i < unsubscribed.length; i += 1) {
          for (let k = 0; k < subscribed.length; k += 1) {
            if (
              unsubscribed[i].BroadCastID.toString() ===
              subscribed[k].BroadCastID.toString()
            ) {
              arr = arr.filter((e) => {
                if (
                  e.BroadCastID.toString() ===
                  subscribed[k].BroadCastID.toString()
                )
                  return false;
                return true;
              });
              break;
            }
          }
        }

        setUnsubscribed(arr);
        setSubsPodcasts(subsPodcasts);
        setSubscribed(temp);
        // setNewUpdate(!newUpdate);
        console.log('end subs:', subsPodcasts, temp, arr);
      } else if (render === 'unsubs') {
        const tempSubs = [...subsPodcasts, ...subscribed];
        console.log('before 1:', unsubscribed, subsPodcasts);
        let arr = unsubscribed;
        for (let i = 0; i < unsubscribed.length; i += 1) {
          let contains = false;
          for (let k = 0; k < tempSubs.length; k += 1) {
            if (
              unsubscribed[i].BroadCastID.toString() ===
              tempSubs[k].BroadCastID.toString()
            ) {
              // contains unsubscribed podcast
              contains = true;
              break;
            }
          }
          if (!contains) {
            arr = arr.filter((e) => {
              if (
                e.BroadCastID.toString() ===
                unsubscribed[i].BroadCastID.toString()
              )
                return false;
              return true;
            });
          }
        }

        console.log('after:', arr);

        /**
         * if subspodcasts contains element from unsubscribed, remove it
         */
        console.log('before subspodcasts:', subsPodcasts);
        let tempData = subsPodcasts;
        for (let i = 0; i < subsPodcasts.length; i += 1) {
          for (let k = 0; k < unsubscribed.length; k += 1) {
            if (
              unsubscribed[k].BroadCastID.toString() ===
              subsPodcasts[i].BroadCastID.toString()
            ) {
              // contains unsubscribed podcast
              tempData = tempData.filter((e) => {
                if (
                  e.BroadCastID.toString() ===
                  subsPodcasts[i].BroadCastID.toString()
                )
                  return false;
                return true;
              });
              break;
            }
          }
        }

        console.log('after', tempData);

        /**
         * if subscribed contains element from unsubscribed, remove it
         */
        console.log('before 2:', subscribed);
        let arr2 = subscribed;
        for (let i = 0; i < subscribed.length; i += 1) {
          for (let k = 0; k < unsubscribed.length; k += 1) {
            if (
              unsubscribed[k].BroadCastID.toString() ===
              subscribed[i].BroadCastID.toString()
            ) {
              // contains unsubscribed podcast
              arr2 = arr2.filter((e) => {
                if (
                  e.BroadCastID.toString() ===
                  subscribed[i].BroadCastID.toString()
                )
                  return false;
                return true;
              });
              break;
            }
          }
        }
        console.log('after 2:', arr2);

        console.log('end:', tempData, arr2, arr);

        setSubscribed(arr2);
        setUnsubscribed(arr);
        setSubsPodcasts(tempData);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update]);

  useEffect(() => {
    /**
     * this will fetch podcasts according to the categories chosen by the user
     * We are first going to fetch 50 podcasts, and when user scrolls down the end of the container
     * we will fetch another 50 podcasts like we did for messages
     *
     */
    console.log('exectuing ittt', subsPodcasts, subscribed, unsubscribed);

    let tempData = subsPodcasts;
    for (let i = 0; i < subsPodcasts.length; i += 1) {
      for (let k = 0; k < unsubscribed.length; k += 1) {
        if (
          unsubscribed[k].BroadCastID.toString() ===
          subsPodcasts[i].BroadCastID.toString()
        ) {
          // contains unsubscribed podcast
          tempData = tempData.filter((e) => {
            if (
              e.BroadCastID.toString() ===
              subsPodcasts[i].BroadCastID.toString()
            )
              return false;
            return true;
          });
          break;
        }
      }
    }

    const util = new Utils(state, dispatch);
    async function setResponse() {
      const data: PodcastResponse = !isByCatgory
        ? await util.getFilteredPodcastsByChannel(
            state.main_state.podcast.search.channel,
            state.main_state.podcast.search.sortBy,
            currentCount,
            state.main_state.podcast.search.state,
            state.main_state.podcast.search.sort
          )
        : await util.getFilteredPodcastsByCategory(
            state.main_state.podcast.search.category,
            state.main_state.podcast.search.sortBy,
            currentCount,
            state.main_state.podcast.search.sort
          );
      if (data) {
        setTotal(data.Total);
        // console.log(data);
        /**
         * Assign is Subscribed variable to every podcast according to subscribed and unsubcribed arrays
         */

        const temp: ExtendedPodcast[] = [];
        for (let i = 0; i < data.list.length; i += 1) {
          let added = false;
          tempData.every((podcast) => {
            if (
              podcast.BroadCastID.toString() ===
              data.list[i].BroadCastID.toString()
            ) {
              temp.push({ ...data.list[i], isSubscribed: true });
              added = true;
              return false;
            }
            return true;
          });

          /**
           * I am also checking if subsPodcasts and subscribed arrays contain the same element.
           * If yes, push only one
           */

          subscribed.every((podcast) => {
            if (
              podcast.BroadCastID.toString() ===
              data.list[i].BroadCastID.toString()
            ) {
              if (
                !temp.some(
                  (e) =>
                    e.BroadCastID.toString() === podcast.BroadCastID.toString()
                )
              )
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
        console.log('setting podcatsssss');
        setPodcasts(temp);
      }
    }

    setResponse();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.main_state.podcast.search.channel,
    state.main_state.podcast.search.state,
    state.main_state.podcast.search.sortBy,
    state.main_state.podcast.search.sort,
    currentCount,
    state.main_state.podcast.search.category,
    isByCatgory,
    subsPodcasts,
  ]);

  useEffect(() => {
    setCurrentCount(fetchStep);
    if (listInnerRef.current) {
      listInnerRef.current.scrollTop = 0;
    }
  }, [state.main_state.podcast.search.category]);

  return (
    <div className="podcasts__container">
      <div className="filters">
        {isByCatgory ? (
          <Category
            dispatch={dispatch}
            selectedCategory={state.main_state.podcast.search.category}
          />
        ) : (
          <div className="dropdowns">
            <DropDown
              dispatch={dispatch}
              names={state.main_state.podcast.search.dropStates}
            />
            <DropDown
              dispatch={dispatch}
              names={state.main_state.podcast.search.dropChannels}
            />
          </div>
        )}

        <div className="radio__select">
          <Radio
            dispatch={dispatch}
            names={state.main_state.podcast.search.sorts}
            selected={
              state.main_state.podcast.search.sortBy as
                | 'Imp'
                | 'StartTime'
                | 'Title'
            }
          />
        </div>

        <button
          type="submit"
          onClick={() => {
            dispatch({
              type: 'PODCAST_SEARCH',
              search: {
                sort:
                  state.main_state.podcast.search.sort === 'DESC'
                    ? 'ASC'
                    : 'DESC',
              },
            });
          }}
          className={isByCatgory ? 'changeOrder by__category' : 'changeOrder'}
        >
          {state.main_state.podcast.search.sort === 'DESC'
            ? `오름차순`
            : '내림차순'}
          {state.main_state.podcast.search.sort === 'DESC' ? (
            <span>&uarr;</span>
          ) : (
            <span>&darr;</span>
          )}
        </button>
      </div>
      <div onScroll={onScroll} ref={listInnerRef} className="podcasts">
        {podcasts.map((podcast) => {
          return (
            <div key={podcast.BroadCastID} className="podcast" role="list">
              <img
                onClick={() => {
                  enterPodcast(podcast);
                }}
                className="title__img"
                src={podcast.ITunesImageURL}
                alt=""
              />
              <div className="podcast__details">
                <div
                  onClick={() => {
                    enterPodcast(podcast);
                  }}
                  role="list"
                  className="info"
                >
                  <p className="title">{podcast.Title}</p>
                  <p className="subtitle">{podcast.SubTitle}</p>
                </div>
                <img
                  onClick={() => {
                    if (podcast.isSubscribed) {
                      console.log('unsubscribe clicked');
                      setUnsubscribed([
                        ...unsubscribed.filter((pod) => {
                          return (
                            pod.BroadCastID.toString() !==
                            podcast.BroadCastID.toString()
                          );
                        }),
                        {
                          ...podcast,
                          gettingDeleted: false,
                        } as unknown as RecommendedPodcast,
                      ]);
                    } else {
                      console.log('subscribe clicked');
                      setSubscribed([
                        ...subscribed.filter((pod) => {
                          return (
                            pod.BroadCastID.toString() !==
                            podcast.BroadCastID.toString()
                          );
                        }),
                        {
                          ...podcast,
                          gettingDeleted: false,
                        } as unknown as RecommendedPodcast,
                      ]);
                    }
                    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                    podcast.isSubscribed
                      ? utils.handleSubsClick(
                          podcast.BroadCastID,
                          false,
                          setUpdate,
                          update,
                          setRender
                        )
                      : utils.handleSubsClick(
                          podcast.BroadCastID,
                          true,
                          setUpdate,
                          update,
                          setRender
                        );
                  }}
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
