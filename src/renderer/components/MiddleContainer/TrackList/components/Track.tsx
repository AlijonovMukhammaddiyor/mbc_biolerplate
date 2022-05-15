import { useEffect, useState, useRef } from 'react';
import $ from 'jquery';
import ToolTip from '../../../Utils/ToolTip';
import '../../../../styles/track/track.css';
import Data from '../../../../context/utils/data';
import { STATE, TrackType } from '../../../../context/utils/types';
import iconLikeOn from '../../../../assets/middle/icon-song-like-on_heart.svg';
import iconLikeOff from '../../../../assets/middle/icon-song-like-off_heart.svg';
import iconSongOn from '../../../../assets/middle/icon-song-on.svg';
import iconSongOff from '../../../../assets/middle/icon-song-off.svg';
import iconPlaying from '../../../../assets/middle/podcast-icon-list-ing.svg';

type Props = {
  track: TrackType;
  state: STATE;
};

export default function Track({ track, state }: Props) {
  const [liked, setLiked] = useState(false);
  const titleRef = useRef() as React.RefObject<HTMLParagraphElement>;
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const inList = isInList(track);
    if (inList) {
      setLiked(true);
    } else {
      setLiked(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.main_state.general.refreshLikedSongs]);

  return (
    <div className="track__container">
      <div className="order_number">
        {isPlaying() ? (
          <img className="playing_icon" src={iconPlaying} alt="" />
        ) : (
          <p>{track.TR_IDX}</p>
        )}
      </div>
      <div
        onMouseOver={() => {
          setHover(true);
        }}
        onMouseLeave={() => {
          setHover(false);
        }}
        onFocus={() => {}}
        className="main"
      >
        <div className="left">
          <img src={track.AlbumImageUrl} alt="" />
          <div className={isPlaying() ? 'names playing__track' : 'names'}>
            <p ref={titleRef} className="title">
              {track.TrackTitle}
            </p>
            <p className="subtitle">{track.ArtistName}</p>
            <ToolTip
              visible={hover && shouldDisplay()}
              text={track.TrackTitle}
            />
          </div>
        </div>
        <div className="icons">
          {track.SongUrl !== '' ? (
            <a href={track.SongUrl} target="_blank" rel="noreferrer">
              <img src={iconSongOn} alt="" />
            </a>
          ) : (
            <img src={iconSongOff} alt="" />
          )}
          <img
            onClick={() => {
              callApi();
              toggleLike(track);
            }}
            src={liked ? iconLikeOn : iconLikeOff}
            alt=""
          />
        </div>
      </div>
    </div>
  );

  function isPlaying() {
    const currentSong =
      state.main_state.general.currentSongs[state.main_state.general.channel];
    if (currentSong) {
      return currentSong.SomItem.includes(track.TrackTitle);
    }
    return false;
  }

  function toggleLike(song: TrackType | null) {
    if (song) {
      const episodes = window.localStorage.getItem('LikedSongs');
      let parsedEpisodes: TrackType[] = episodes
        ? JSON.parse(episodes).list
        : [];

      const inList = isInList(song);

      if (!inList) {
        parsedEpisodes.unshift(song);
        setLiked(true);
      } else {
        setLiked(false);
        parsedEpisodes = parsedEpisodes.filter((val) => {
          return val.TR_NO !== track.TR_NO;
        });
      }
      if (parsedEpisodes.length > 100)
        parsedEpisodes = parsedEpisodes.slice(0, 100);

      window.localStorage.setItem(
        'LikedSongs',
        JSON.stringify({ list: parsedEpisodes })
      );
    }
  }

  function shouldDisplay() {
    if (titleRef.current) {
      return titleRef.current.offsetHeight < titleRef.current.scrollHeight;
    }
    return false;
  }

  function callApi() {
    $.ajax({
      url: Data.urls.trackLikeApi,
      type: 'POST',
      // dataType: 'jsonp',
      data: {
        bid: state.main_state.general.currentPrograms[
          state.main_state.general.channel
        ]?.BroadCastID,
        gid: state.main_state.general.currentPrograms[
          state.main_state.general.channel
        ]?.ProgramGroupID,
        Tr_no: track.TR_NO,
        state: !isInList(track),
      },
      success: (data: any) => {
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  function isInList(song: TrackType | null) {
    const episodes = window.localStorage.getItem('LikedSongs');
    const parsedEpisodes: TrackType[] = episodes
      ? JSON.parse(episodes).list
      : [];
    if (song) {
      let inList = false;
      parsedEpisodes.every((val) => {
        if (val.TR_NO === song.TR_NO) {
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
