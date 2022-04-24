import { useContext } from 'react';
import '../../../../styles/podcastNav/podcastNav.css';
import { Context } from '../../../../context/context/context';

export default function PodcastNav() {
  const { state, dispatch } = useContext(Context);

  return (
    <div className="podcast__navbar">
      <p
        onClick={() => changePOdcastChannel('home')}
        className="home"
        id={
          state.main_state.podcast.channel === 'home'
            ? 'podcast__current__channel'
            : ''
        }
      >
        홈
      </p>
      <p
        id={
          state.main_state.podcast.channel === 'byChannel'
            ? 'podcast__current__channel'
            : ''
        }
        onClick={() => changePOdcastChannel('byChannel')}
        className="by__channel"
      >
        채널별
      </p>
      <p
        id={
          state.main_state.podcast.channel === 'byCategory'
            ? 'podcast__current__channel'
            : ''
        }
        onClick={() => changePOdcastChannel('byCategory')}
        className="by__category"
      >
        카테고리별
      </p>
    </div>
  );

  function changePOdcastChannel(chan: string) {
    dispatch({ type: 'CHANGE_PODCAST_CHANNEL', channel: chan });
  }
}
