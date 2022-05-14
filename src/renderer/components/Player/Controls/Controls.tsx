import { useContext, useState, useEffect } from 'react';
import { Context } from '../../../context/context/context';
import Utils from '../../Utils/utils';
import ProgressBar from './components/ProgressBar';
import AudioInfo from './components/AudioInfo';
import PlayPause from './components/PlayPause';
import PlayPausePodcast from './components/PlayPausePodcast';
import Footer from './components/Footer';
import FooterPodcast from './components/FooterPodcast';
import '../../../styles/controls/controls.css';

export default function Controls() {
  const { dispatch, state } = useContext(Context);

  const util = new Utils(state, dispatch);

  return (
    <div
      className={
        state.main_state.podcast.subpodcast.isSubpodcastPlaying
          ? 'player__controls__container controls__subpodcast__in'
          : 'player__controls__container'
      }
    >
      <div className="audio__details">
        {!state.main_state.podcast.subpodcast.isSubpodcastPlaying && (
          <AudioInfo state={state} util={util} />
        )}
        <ProgressBar state={state} dispatch={dispatch} util={util} />
      </div>
      <div className="play__pause">
        {state.main_state.podcast.subpodcast.isSubpodcastPlaying ? (
          <PlayPausePodcast dispatch={dispatch} state={state} />
        ) : (
          <PlayPause dispatch={dispatch} state={state} isMini={false} />
        )}
      </div>
      <div className="footer">
        {state.main_state.podcast.subpodcast.isSubpodcastPlaying ? (
          <FooterPodcast dispatch={dispatch} state={state} />
        ) : (
          <Footer />
        )}
      </div>
    </div>
  );
}

// pause={pause} setPause={setPause}
