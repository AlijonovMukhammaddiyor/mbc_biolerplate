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
  const [pause, setPause] = useState(!state.main_state.general.autoplay);

  const util = new Utils(state, dispatch);

  useEffect(() => {
    dispatch({ type: 'PAUSE_SET', pause });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pause]);

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
        <ProgressBar
          state={state}
          dispatch={dispatch}
          util={util}
          setPause={setPause}
        />
      </div>
      <div className="play__pause">
        {state.main_state.podcast.subpodcast.isSubpodcastPlaying ? (
          <PlayPausePodcast
            dispatch={dispatch}
            state={state}
            pause={pause}
            setPause={setPause}
          />
        ) : (
          <PlayPause
            state={state}
            pause={pause}
            setPause={setPause}
            isMini={false}
          />
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
