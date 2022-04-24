import { useEffect, useState } from 'react';
import iconLike from '../../../../assets/player/podcast/podcast-icon-like_footer.svg';
import iconLikeOn from '../../../../assets/player/podcast/podcast-icon-like-on_footer.svg';
import iconShare from '../../../../assets/player/podcast/podcast-icon-share.svg';
import iconList from '../../../../assets/player/podcast/podcast-icon-list_footer.svg';
import '../../../../styles/footerPodcast/footerPodcast.css';
import { STATE, ListenedSubpodcast } from '../../../../context/utils/types';

type Props = {
  dispatch: (param: unknown) => void;
  state: STATE;
};

export default function FooterPodcast({ dispatch, state }: Props) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const inList = isInList(
      state.main_state.podcast.subpodcast.currentSubpodcast
    );
    if (inList) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [
    state.main_state.podcast.subpodcast.currentSubpodcast,
    state.main_state.general.refreshLikedEpisodes,
  ]);

  return (
    <div className="footer__podcast">
      <div className="footer__left">
        <div className="footer__share">
          <img
            onClick={() =>
              dispatch({
                type: 'PODCAST_SHARE_ON',
                url:
                  state.main_state.podcast.subpodcast.currentSubpodcast
                    ?.LinkURL ||
                  state.main_state.podcast.subpodcast.currentSubpodcast
                    ?.LinkUrl,
              })
            }
            src={iconShare}
            alt="Img"
            className="share__icon"
          />
          <p>공유</p>
        </div>
        <div className="footer__like">
          <img
            onClick={() =>
              toggleLike(state.main_state.podcast.subpodcast.currentSubpodcast)
            }
            src={liked ? iconLikeOn : iconLike}
            alt=""
            className="like__icon"
          />
          <p>좋아요</p>
        </div>
      </div>
      <div className="footer__right">
        <div className="footer__podcast_list">
          <img
            onClick={showEpisodeList}
            src={iconList}
            alt=""
            id="list__icon"
            className="list__icon"
          />
        </div>
      </div>
    </div>
  );

  function showEpisodeList() {
    const { channel } = state.main_state.podcast.subpodcast.parent;
    const { podcast } = state.main_state.podcast.subpodcast.parent;
    if (channel && podcast)
      dispatch({
        type: 'PODCAST_IN',
        channel,
        payload: podcast,
      });
  }

  function toggleLike(subpodcast: ListenedSubpodcast | null) {
    if (subpodcast) {
      const episodes = window.localStorage.getItem('LikedEpisodes');
      let parsedEpisodes: ListenedSubpodcast[] = episodes
        ? JSON.parse(episodes).list
        : [];

      const inList = isInList(subpodcast);

      if (!inList) {
        parsedEpisodes.unshift(subpodcast);
        setLiked(true);
        dispatch({ type: 'REFRESH_LIKED_EPISODES' });
      } else {
        setLiked(false);
        parsedEpisodes = parsedEpisodes.filter((val) => {
          return (
            val.PodCastItemIdx !==
            state.main_state.podcast.subpodcast.currentSubpodcast
              ?.PodCastItemIdx
          );
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
  }

  function isInList(subpodcast: ListenedSubpodcast | null) {
    const episodes = window.localStorage.getItem('LikedEpisodes');
    const parsedEpisodes: ListenedSubpodcast[] = episodes
      ? JSON.parse(episodes).list
      : [];
    if (subpodcast) {
      let inList = false;
      parsedEpisodes.every((episode) => {
        if (episode.PodCastItemIdx === subpodcast.PodCastItemIdx) {
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
