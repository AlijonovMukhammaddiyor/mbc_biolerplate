import { useContext, useState } from 'react';
import { Context } from '../../../../../context/context/context';
import '../../../../../styles/channels/channels.css';
import ChanButton from './channel.button/ChanButton';

export default function Channels() {
  /**
   * @wasImageShown - because when we enter podcast tab, imagOpen will be set to false, we have to preserve previous imageOpen state
   */
  const [wasImageShown, setImage] = useState(true);
  const { dispatch, state } = useContext(Context);
  const ChannelObject = {
    sfm: '표준FM',
    mfm: 'FM4U',
    chm: '올댓뮤직',
    podcast: '팟캐스트',
  };
  return (
    <div className="mini__channels__container">
      {Object.entries(ChannelObject).map((entry) => {
        return (
          <ChanButton
            key={entry[0]}
            type={entry[0]}
            changeChannel={changeChannel}
            name={entry[1]}
            channel={state.main_state.general.channel}
            isPodcastTab={state.main_state.podcast.isPodcastTab}
          />
        );
      })}
    </div>
  );

  function changeChannel(chan: string) {
    const isPodcast = state.main_state.podcast.isPodcastTab;
    if (chan !== 'podcast') {
      dispatch({
        type: 'CHANGE_CHANNEL',
        channel: chan,
        imageOpen: isPodcast
          ? wasImageShown
          : state.main_state.general.ImageOpen,
      });
    } else {
      setImage(state.main_state.general.ImageOpen);
      dispatch({ type: 'PODCAST_TAB' });
    }
    dispatch({
      type: 'CLOSE_MY_MINI',
    });
    dispatch({ type: 'HIDE_SCHEDULE' });
    dispatch({ type: 'CLOSE_SETTINGS' });
  }
}
