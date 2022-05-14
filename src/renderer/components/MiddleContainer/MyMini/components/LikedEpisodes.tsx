import { useEffect, useState, useContext } from 'react';
import $ from 'jquery';
import { ListenedSubpodcast } from '../../../../context/utils/types';
import '../../../../styles/likedEpisodes/likedEpisodes.css';
import iconCheckboxOff from '../../../../assets/middle/mymini/check-box-off.svg';
import iconCheckboxOn from '../../../../assets/middle/mymini/check-box-on.svg';
import { Context } from '../../../../context/context/context';
import iconPlaying from '../../../../assets/middle/mymini/podcast-icon-list-ing.svg';
import iconNoEpisode from '../../../../assets/middle/mymini/img-no-list.svg';
import DeletePrompt from './DeletePrompt';
import Data from '../../../../context/utils/data';

export default function RecentEpisodes() {
  const [episodes, setEpisodes] = useState<ListenedSubpodcast[]>([]);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<string[]>([]);
  const { state, dispatch } = useContext(Context);
  const [prompt, setPrompt] = useState(false);

  useEffect(() => {
    const data = window.localStorage.getItem('LikedEpisodes');
    const parsed = data ? JSON.parse(data) : null;

    if (parsed) {
      setEpisodes(parsed.list);
    }
  }, [state.main_state.general.refreshLikedEpisodes]);

  return (
    <div className="liked__episodes__container">
      {prompt && (
        <DeletePrompt
          deleteSelected={deleteSelected}
          title="삭제하시겠습니까"
        />
      )}
      {episodes.length > 0 && (
        <div className="header">
          <div className={isDeleting ? 'left deleting' : 'left'}>
            {isDeleting && (
              <img
                className="checkbox"
                onClick={deleteAll}
                src={
                  deleting.length === episodes.length
                    ? iconCheckboxOn
                    : iconCheckboxOff
                }
                alt=""
              />
            )}

            {isDeleting && <p className="all">전체</p>}
            {isDeleting && (
              <button
                type="submit"
                onClick={showPrompt}
                className={deleting.length > 0 ? 'delete enabled' : 'delete'}
              >
                <p>삭제</p>
              </button>
            )}
          </div>
          <div className="right">
            <button
              type="button"
              onClick={() => {
                setDeleting([]);
                setIsDeleting(!isDeleting);
                handleDoneClick();
              }}
              className="delete"
            >
              <p>{isDeleting ? '완료' : '편집'}</p>
            </button>
          </div>
        </div>
      )}
      {episodes.length > 0 ? (
        <div className="episodes">
          {episodes.map((episode, index) => {
            return (
              <div
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.className !== 'checkbox')
                    dispatch({
                      type: 'SUBPODCAST_ON',
                      subpodcast: episode,
                      playlist: episodes,
                      currentIndex: index,
                      podcast: null,
                      channel: null,
                    });
                }}
                role="list"
                key={episode.PodCastItemIdx}
                className={
                  isPlayingSubpodcast(episode)
                    ? 'episode playing__subpodcast'
                    : 'episode'
                }
              >
                {isDeleting && (
                  <img
                    onClick={() => {
                      if (episode.GettingDeleted) {
                        setDeleting(
                          deleting.filter((val) => {
                            return episode.PodCastItemIdx !== val;
                          })
                        );
                        episode.GettingDeleted = false;
                      } else {
                        setDeleting([...deleting, episode.PodCastItemIdx]);
                        episode.GettingDeleted = true;
                      }
                    }}
                    className="checkbox"
                    src={
                      episode.GettingDeleted ? iconCheckboxOn : iconCheckboxOff
                    }
                    alt=""
                  />
                )}
                {isPlayingSubpodcast(episode) && (
                  <img
                    className="icon__playing"
                    src={iconPlaying}
                    alt=""
                    style={isDeleting ? { left: '70px' } : {}}
                  />
                )}
                <img
                  className="episode__img"
                  src={episode.ITunesImageURL || episode.ItunesImageURL}
                  alt=""
                />

                <div className={isDeleting ? 'info deleting' : 'info'}>
                  <p className="episode__title">{episode.ContentTitle}</p>
                  <p className="program__title">
                    {episode.ProgramTitle || episode.Title}
                  </p>
                  <p className="date">{getDate(episode)}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="no__episode">
          <p>좋아하는 에피소드가 없습니다</p>
          <div className="no__episode_image">
            <img src={iconNoEpisode} alt="" />
          </div>
        </div>
      )}
    </div>
  );

  function getDate(episode: ListenedSubpodcast) {
    const date = episode.BroadDate || episode.DatePub || episode.PubDate;
    return date.substring(0, 10);
  }

  function deleteAll() {
    if (deleting.length === episodes.length) {
      setDeleting([]);
      episodes.every((val) => {
        val.GettingDeleted = false;
        return true;
      });
    } else {
      const temp: string[] = [];
      episodes.every((val) => {
        temp.push(val.PodCastItemIdx);
        val.GettingDeleted = true;
        return true;
      });

      setDeleting(temp);
    }
  }

  function showPrompt() {
    setPrompt(true);
  }

  function deleteSelected(param: boolean) {
    if (param && deleting.length > 0) {
      const temp = episodes.filter((val) => {
        if (val.GettingDeleted) {
          $.ajax({
            url: Data.urls.likeItemApi,
            type: 'POST',
            // dataType: 'jsonp',
            data: {
              bid: state.main_state.podcast.currentPodcast?.BroadCastID,
              Itemidx: val.PodCastItemIdx,
              state: false,
            },
            success: (data: any) => {
              console.log(data);
            },
            error: (err) => {
              console.log(err);
            },
          });
        }
        return !val.GettingDeleted;
      });

      setEpisodes(temp);

      window.localStorage.setItem(
        'LikedEpisodes',
        JSON.stringify({ list: temp })
      );
      setDeleting([]);
    }
    setPrompt(false);
    setIsDeleting(false);
    // handleDoneClick();
  }

  function isPlayingSubpodcast(subpodcast: ListenedSubpodcast) {
    /**
     * checks whether there is subpodcast playing anf if yes , compares it with subpodcast
     */
    return state.main_state.podcast.subpodcast.isSubpodcastPlaying
      ? state.main_state.podcast.subpodcast.currentSubpodcast
        ? state.main_state.podcast.subpodcast.currentSubpodcast.EncloserURL ===
          subpodcast.EncloserURL
        : false
      : false;
  }

  function handleDoneClick() {
    episodes.every((song) => {
      song.GettingDeleted = false;
      return true;
    });
    window.localStorage.setItem(
      'LikedEpisodes',
      JSON.stringify({ list: episodes })
    );
  }
}
