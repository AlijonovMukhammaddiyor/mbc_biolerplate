import { useContext } from 'react';
import '../../../styles/podcastTab/podcastTab.css';
import PodcastNav from './components/podcastNav';
import Home from './components/Home';
import { Context } from '../../../context/context/context';
import Podcast from './components/PodcastByChannel';
import Subpodcasts from './components/Subpodcasts';
import Share from './components/Share';

export default function PodcastTab() {
  const { state, dispatch } = useContext(Context);
  const { channel } = state.main_state.podcast;

  return (
    <div className="podcastTab__container">
      <PodcastNav />
      {channel === 'home' ? (
        !(state.main_state.podcast.PodcastIn.channel === channel) ? (
          <Home />
        ) : (
          <Subpodcasts />
        )
      ) : channel === 'byChannel' ? (
        !(state.main_state.podcast.PodcastIn.channel === channel) ? (
          <Podcast isByCatgory={false} />
        ) : (
          <Subpodcasts />
        )
      ) : !(state.main_state.podcast.PodcastIn.channel === channel) ? (
        <Podcast isByCatgory />
      ) : (
        <Subpodcasts />
      )}

      {state.main_state.podcast.shareScreenOn &&
        state.main_state.podcast.shareUrl !== '' && (
          <Share dispatch={dispatch} url={state.main_state.podcast.shareUrl} />
        )}
    </div>
  );
}
