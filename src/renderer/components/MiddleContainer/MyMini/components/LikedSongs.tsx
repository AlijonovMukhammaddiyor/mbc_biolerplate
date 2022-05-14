import { useEffect, useState, useContext } from 'react';
import Data from 'renderer/context/utils/data';
import $ from 'jquery';
import { Context } from '../../../../context/context/context';
import { TrackType } from '../../../../context/utils/types';
import '../../../../styles/likedSongs/likedSongs.css';
import iconCheckboxOff from '../../../../assets/middle/mymini/check-box-off.svg';
import iconCheckboxOn from '../../../../assets/middle/mymini/check-box-on.svg';
import iconNoEpisode from '../../../../assets/middle/mymini/img-no-list.svg';
import iconSongOn from '../../../../assets/middle/icon-song-on.svg';
import iconSongOff from '../../../../assets/middle/icon-song-off.svg';
import DeletePrompt from './DeletePrompt';

export default function RecentEpisodes() {
  const { state } = useContext(Context);
  const [songs, setSongs] = useState<TrackType[]>([]);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<number[]>([]);
  const [prompt, setPrompt] = useState(false);

  useEffect(() => {
    const data = window.localStorage.getItem('LikedSongs');
    const parsed = data ? JSON.parse(data) : null;

    if (parsed) {
      setSongs(parsed.list);
    }
  }, []);

  return (
    <div className="liked__songs__container">
      {prompt && (
        <DeletePrompt
          deleteSelected={deleteSelected}
          title="삭제하시겠습니까"
        />
      )}
      {songs.length > 0 && (
        <div className="header">
          <div className={isDeleting ? 'left deleting' : 'left'}>
            {isDeleting && (
              <button type="button" onClick={deleteAll} className="checkbox">
                <img
                  src={
                    deleting.length === songs.length
                      ? iconCheckboxOn
                      : iconCheckboxOff
                  }
                  alt=""
                />
              </button>
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
      {songs.length > 0 ? (
        <div className="songs">
          {songs.map((song) => {
            return (
              <div key={song.TR_NO} className="song">
                {isDeleting && (
                  <button
                    type="button"
                    onClick={() => {
                      if (song.gettingDeleted) {
                        setDeleting(
                          deleting.filter((val) => {
                            return song.TR_NO !== val;
                          })
                        );
                        song.gettingDeleted = false;
                      } else {
                        setDeleting([...deleting, song.TR_NO]);
                        song.gettingDeleted = true;
                      }
                    }}
                    className="checkbox"
                  >
                    <img
                      src={
                        song.gettingDeleted ? iconCheckboxOn : iconCheckboxOff
                      }
                      alt=""
                    />
                  </button>
                )}

                <img className="song__img" src={song.AlbumImageUrl} alt="" />

                <div className={isDeleting ? 'info deleting' : 'info'}>
                  <p className="song__title">{song.TrackTitle}</p>
                  <p className="song_artist_name">{song.ArtistName}dscscsd</p>
                </div>
                <div className="redirect__icon">
                  {song.SongUrl.includes('http') ? (
                    <a href={song.SongUrl} target="_blank" rel="noreferrer">
                      <img src={iconSongOn} alt="" />
                    </a>
                  ) : (
                    <img src={iconSongOff} alt="" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="no__song">
          <p>선곡이 없습니다</p>
          <div className="no__song_image">
            <img src={iconNoEpisode} alt="" />
          </div>
        </div>
      )}
    </div>
  );

  function deleteAll() {
    if (deleting.length === songs.length) {
      setDeleting([]);
      songs.every((val) => {
        val.gettingDeleted = false;
        return true;
      });
    } else {
      const temp: number[] = [];
      songs.every((val) => {
        temp.push(val.TR_NO);
        val.gettingDeleted = true;
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
      const temp = songs.filter((val) => {
        if (val.gettingDeleted) {
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
              Tr_no: val.TR_NO,
              state: false,
            },
            success: (_) => {
              console.log('unliked the song');
            },
            error: (err) => {
              console.log(err);
            },
          });
        }
        return !val.gettingDeleted;
      });

      setSongs(temp);

      window.localStorage.setItem('LikedSongs', JSON.stringify({ list: temp }));
      setDeleting([]);
    }
    setPrompt(false);
    setIsDeleting(false);
    // handleDoneClick();
  }

  function handleDoneClick() {
    songs.every((song) => {
      song.gettingDeleted = false;
      return true;
    });

    console.log(songs);
    window.localStorage.setItem('LikedSongs', JSON.stringify({ list: songs }));
  }
}
