import { useContext, useState, useEffect } from 'react';
import $ from 'jquery';
import Data from '../../../../context/utils/data';
import iconLike from '../../../../assets/player/podcast/podcast-icon-list-like-off.svg';
import iconLikeOn from '../../../../assets/player/podcast/podcast-icon-like-on_footer.svg';
import playIcon from '../../../../assets/player/podcast/podcast-icon-list-play.svg';
import playIconHover from '../../../../assets/player/podcast/podcast-icon-list-play-hover.svg';
import playingIcon from '../../../../assets/player/podcast/podcast-icon-list-ing.svg';
import {
  ListenedSubpodcast,
  Subpodcast,
} from '../../../../context/utils/types';
import { Context } from '../../../../context/context/context';

type Props = {
  subpodcast: Subpodcast;
  playSubpodcast: (any: any, asasx: any, asaas: any, weou: any) => void;
  index: number;
};

export default function EachSubpodcast({
  subpodcast,
  playSubpodcast,
  index,
}: Props) {
  const { state, dispatch } = useContext(Context);
  const [mouseOver, setMouseOver] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const inList = isInList(subpodcast);
    if (inList) {
      setLiked(true);
    } else {
      setLiked(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.main_state.general.refreshLikedEpisodes]);

  return (
    <div
      className="subpodcast"
      onMouseOver={() => setMouseOver(subpodcast.EncloserURL)}
      onMouseLeave={() => {
        setMouseOver(null);
      }}
      onFocus={() => {}}
      role="list"
    >
      <div
        className={isPlayingSubpodcast(subpodcast) ? 'playingIcon' : 'playIcon'}
      >
        <img
          onClick={() => {
            playSubpodcast(
              subpodcast,
              state.main_state.podcast.currentPodcast,
              state.main_state.podcast.channel,
              index
            );
          }}
          src={
            isPlayingSubpodcast(subpodcast)
              ? playingIcon
              : mouseOver === subpodcast.EncloserURL
              ? playIconHover
              : playIcon
          }
          alt=""
        />
      </div>

      <div className="contents">
        <div
          className="subpodcast__info"
          onClick={() => {
            playSubpodcast(
              subpodcast,
              state.main_state.podcast.currentPodcast,
              state.main_state.podcast.channel,
              index
            );
          }}
          role="list"
        >
          <p
            className={
              mouseOver === subpodcast.EncloserURL ? 'title hover' : 'title'
            }
          >
            {subpodcast.ContentTitle}
          </p>
          <p
            className={
              mouseOver === subpodcast.EncloserURL ? 'date hover' : 'date'
            }
          >
            {subpodcast.BroadDate || subpodcast.DatePub || subpodcast.PubDate}
          </p>
        </div>
        <img
          onClick={() => toggleLike(subpodcast as ListenedSubpodcast)}
          src={liked ? iconLikeOn : iconLike}
          alt=""
          className="like__icon"
        />
      </div>
    </div>
  );

  function isPlayingSubpodcast(sub: Subpodcast) {
    /**
     * checks whether there is subpodcast playing anf if yes , compares it with subpodcast
     */
    return state.main_state.podcast.subpodcast.isSubpodcastPlaying
      ? state.main_state.podcast.subpodcast.currentSubpodcast
        ? state.main_state.podcast.subpodcast.currentSubpodcast.EncloserURL ===
          sub.EncloserURL
        : false
      : false;
  }

  function toggleLike(sub: ListenedSubpodcast | null) {
    if (sub) {
      const inList = isInList(sub);
      $.ajax({
        url: Data.urls.likeItemApi,
        type: 'POST',
        // dataType: 'jsonp',
        data: {
          bid: state.main_state.podcast.currentPodcast?.BroadCastID,
          Itemidx: sub.PodCastItemIdx,
          state: !inList,
        },
        success: (data: any) => {
          console.log(data);
          if (data.Success === 'OK') {
            console.log('OKKKK');
            const episodes = window.localStorage.getItem('LikedEpisodes');
            let parsedEpisodes: ListenedSubpodcast[] = episodes
              ? JSON.parse(episodes).list
              : [];

            if (!inList) {
              parsedEpisodes.unshift(sub);
              setLiked(true);
              dispatch({ type: 'REFRESH_LIKED_EPISODES' });
            } else {
              setLiked(false);
              parsedEpisodes = parsedEpisodes.filter((val) => {
                return val.PodCastItemIdx !== subpodcast.PodCastItemIdx;
              });
              dispatch({ type: 'REFRESH_LIKED_EPISODES' });
            }
            if (parsedEpisodes.length > 50)
              parsedEpisodes = parsedEpisodes.slice(0, 50);

            window.localStorage.setItem(
              'LikedEpisodes',
              JSON.stringify({ list: parsedEpisodes })
            );
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  function isInList(sub: ListenedSubpodcast | null) {
    const episodes = window.localStorage.getItem('LikedEpisodes');
    const parsedEpisodes: ListenedSubpodcast[] = episodes
      ? JSON.parse(episodes).list
      : [];
    if (sub) {
      let inList = false;
      parsedEpisodes.every((episode) => {
        if (episode.PodCastItemIdx === sub.PodCastItemIdx) {
          inList = true;
          return false;
        }
        return true;
      });

      return inList;
    }
    return false;
  }
}
