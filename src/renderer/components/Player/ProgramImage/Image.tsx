import { useContext, useState } from 'react';
import { Context } from '../../../context/context/context';
import Top from './Top/Top';
import Video from './components/Video';
import SubpodcastInfo from './components/SubpodcastInfo';
import { ChannelObject } from '../../../context/utils/types';
import '../../../styles/programImage/image.css';
import toRightIcon from '../../../assets/player/top/icon-main.svg';
import toLeftIcon from '../../../assets/player/top/icon-main_left.svg';
import toLeftIconOn from '../../../assets/player/top/icon_ch_left_on.svg';
import toRightIconOn from '../../../assets/player/top/icon_ch_right_on.svg';

export default function Image() {
  const { state, dispatch } = useContext(Context);
  const [leftIcon, setLeftIcon] = useState(toLeftIcon);
  const [rightIcon, setRightIcon] = useState(toRightIcon);

  const style = {
    display: state.main_state.podcast.subpodcast.isSubpodcastPlaying
      ? 'none'
      : 'flex',
  };

  return (
    <div
      className="program__image__container"
      style={
        isPodcast()
          ? {
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.0)), url("${
                state.main_state.podcast.subpodcast.currentSubpodcast
                  ?.ITunesImageURL ||
                state.main_state.podcast.subpodcast.currentSubpodcast
                  ?.ItunesImageURL
              }")`,
            }
          : isVod()
          ? state.main_state.vod.videoClosed
            ? {
                backgroundImage: `url("${
                  state.main_state.general.currentPrograms[
                    state.main_state.general.channel
                  ]?.HDPicture
                }")`,
              }
            : {
                backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(${
                  state.main_state.general.currentPrograms[
                    state.main_state.general.channel
                  ]?.HDPicture
                })`,
              }
          : {
              backgroundImage: `url("${
                state.main_state.general.currentPrograms[
                  state.main_state.general.channel
                ]?.HDPicture
              }")`,
            }
      }
    >
      <img
        onClick={moveChannelLeft}
        onMouseEnter={() => setLeftIcon(toLeftIconOn)}
        onMouseLeave={() => setLeftIcon(toLeftIcon)}
        src={leftIcon}
        className="to_left__icon"
        alt=""
        style={style}
      />
      <img
        onMouseEnter={() => setRightIcon(toRightIconOn)}
        onMouseLeave={() => setRightIcon(toRightIcon)}
        onClick={moveChannelRight}
        src={rightIcon}
        className="to_right__icon"
        alt=""
        style={style}
      />
      <Top />
      {state.main_state.podcast.subpodcast.isSubpodcastPlaying && (
        <SubpodcastInfo />
      )}
      <div className="temp">
        {isVod() && !state.main_state.vod.videoClosed && <Video />}
      </div>
    </div>
  );

  function isPodcast() {
    return state.main_state.podcast.subpodcast.isSubpodcastPlaying;
  }

  function isVod() {
    if (
      state.main_state.vod.isVod &&
      state.main_state.vod.currentVod &&
      ChannelObject[state.main_state.vod.currentVod.Channel] ===
        state.main_state.general.channel &&
      !state.main_state.podcast.subpodcast.isSubpodcastPlaying
    )
      return true;
    return false;
  }

  function moveChannelLeft() {
    const { channel } = state.main_state.general;
    if (state.main_state.podcast.isPodcastTab) {
      dispatch({ type: 'CHANGE_CHANNEL', channel: 'chm' });
    } else if (channel === 'sfm') {
      dispatch({ type: 'PODCAST_TAB' });
    } else if (channel === 'mfm') {
      dispatch({ type: 'CHANGE_CHANNEL', channel: 'sfm' });
    } else if (channel === 'chm') {
      dispatch({ type: 'CHANGE_CHANNEL', channel: 'mfm' });
    }
  }

  function moveChannelRight() {
    const { channel } = state.main_state.general;
    if (state.main_state.podcast.isPodcastTab) {
      dispatch({ type: 'CHANGE_CHANNEL', channel: 'sfm' });
    } else if (channel === 'sfm') {
      dispatch({ type: 'CHANGE_CHANNEL', channel: 'mfm' });
    } else if (channel === 'mfm') {
      dispatch({ type: 'CHANGE_CHANNEL', channel: 'chm' });
    } else if (channel === 'chm') {
      dispatch({ type: 'PODCAST_TAB' });
    }
  }
}
