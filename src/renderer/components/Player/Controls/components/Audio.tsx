/* eslint-disable no-useless-escape */
/* eslint-disable promise/no-nesting */
/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
import { useEffect, useContext, useRef, useState } from 'react';
import HLs from 'hls.js';
import jsonp from 'jsonp';
import last from 'lodash/last';

import Data from '../../../../context/utils/data';
import { Context } from '../../../../context/context/context';
import '../../../../styles/audio/audio.css';
import { ListenedSubpodcast } from '../../../../context/utils/types';

type Props = {
  getDuration: (dur: number) => void;
};

export default function Audio({ getDuration }: Props) {
  const [audioPlayer, setPlayer] = useState<HLs | null>(new HLs());
  const { state, dispatch } = useContext(Context);
  const audioRef = useRef<HTMLMediaElement>(null);
  const [reRender, setReRender] = useState(false);

  useEffect(() => {
    if (state.main_state.player.pause) {
      if (audioPlayer) audioPlayer.destroy();
      setPlayer(null);
    } else {
      setReRender(!reRender);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.main_state.player.pause]);

  useEffect(() => {
    async function getUrl(): Promise<string> {
      return new Promise((resolve, reject) => {
        const rand = Math.random();
        const urlFM = `${Data.urls.onAirSecurePlayAPI}?channel=${state.main_state.general.channel}&protocol=M3U8&agent=webapp&nocash=${rand}`;
        jsonp(urlFM, {}, (err, data) => {
          if (err) reject(err);
          else {
            resolve(data.AACLiveURL);
          }
        });
      });
    }

    if (!state.main_state.podcast.subpodcast.isSubpodcastPlaying) {
      const data: Promise<string> = getUrl();

      data.then((res) => {
        const config = {
          autoStartLoad: true,
          debug: false,
          maxBufferLength: 30 * 60 * 60,
          maxBufferSize: 320 * 1000 * 1000,
        };

        if (HLs.isSupported()) {
          if (audioPlayer) audioPlayer.destroy();
          const newPlayer = new HLs(config);

          newPlayer.loadSource(res);
          if (audioRef.current !== null) {
            newPlayer.attachMedia(audioRef.current);
            if (state.main_state.general.autoplay)
              newPlayer.on(HLs.Events.MANIFEST_PARSED, () => {
                if (audioRef.current) {
                  audioRef.current.volume = state.main_state.player.volume / 10;
                  dispatch({ type: 'PAUSE_SET_AUDIO', pause: false });
                  dispatch({ type: 'PAUSE_SET_VIDEO', vodPlay: false });

                  const playPromise = audioRef.current.play();
                  if (playPromise !== undefined) {
                    playPromise
                      .then(() => {})
                      .catch((error) => {
                        console.log(error);
                      });
                  }
                }
              });

            newPlayer.on(HLs.Events.ERROR, (_event, errData) => {
              if (errData.fatal) {
                switch (errData.type) {
                  case HLs.ErrorTypes.NETWORK_ERROR:
                    // try to recover network error
                    console.log(
                      'fatal network error encountered, try to recover 1'
                    );
                    audioPlayer?.startLoad();
                    break;
                  case HLs.ErrorTypes.MEDIA_ERROR:
                    console.log(
                      'fatal media error encountered, try to recover 2'
                    );
                    audioPlayer?.recoverMediaError();
                    break;
                  default:
                    // cannot recover
                    if (audioPlayer) audioPlayer.destroy();
                    break;
                }
              } else if (
                errData.details === 'internalException' &&
                errData.type === 'otherError' &&
                isMobile()
              ) {
                const level = last(audioPlayer?.levels);
                try {
                  audioPlayer?.removeLevel(level, level?.urlId);
                  audioPlayer?.startLoad();
                } catch (e) {
                  console.log(e);
                }
              }
            });

            setPlayer(newPlayer);
          }
        }
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.main_state.general.channel,
    state.main_state.general.autoplay,
    state.main_state.podcast.subpodcast.isSubpodcastPlaying,
    reRender,
  ]);

  useEffect(() => {
    const audio: HTMLAudioElement = document.getElementById(
      'audio'
    ) as HTMLAudioElement;
    function bufferProgress() {
      const { duration } = audio;
      if (duration > 0) {
        for (let i = 0; i < audio.buffered.length; i += 1) {
          if (
            audio.buffered.start(audio.buffered.length - 1 - i) <
            audio.currentTime
          ) {
            const elem = document.getElementById('buffered__amount');
            if (elem) {
              elem.style.width = `${
                (audio.buffered.end(audio.buffered.length - 1 - i) / duration) *
                100
              }%`;
            }
            break;
          }
        }
      }
    }

    function playProgress() {
      const { duration } = audio;
      if (duration > 0) {
        const elem = document.getElementById('progress__amount');
        if (elem) {
          elem.style.width = `${(audio.currentTime / duration) * 100}%`;
        }
      }
    }

    if (
      state.main_state.podcast.subpodcast.isSubpodcastPlaying &&
      state.main_state.podcast.subpodcast.currentSubpodcast
    ) {
      if (audioPlayer) audioPlayer.destroy();

      audio.pause();
      audio.src = '';
      audio.load();
      audio.src =
        state.main_state.podcast.subpodcast.currentSubpodcast.EncloserURL;
      console.log('adding');
      addToRecentListenedEpisodes({
        ...state.main_state.podcast.subpodcast.currentSubpodcast,
        GettingDeleted: false,
      });
      audio.addEventListener('progress', bufferProgress);
      audio.addEventListener('timeupdate', playProgress);
      audio.addEventListener('loadedmetadata', () => {
        getDuration(Math.ceil(audio.duration));
      });

      const playNextEpisode = () => {
        const playlist = state.main_state.podcast.subpodcast.episodePlaylist;
        const { currentIndex } = state.main_state.podcast.subpodcast;
        if (playlist.length > 0 && playlist.length - 1 > currentIndex) {
          dispatch({
            type: 'SUBPODCAST_ON',
            subpodcast: playlist[currentIndex + 1],
            playlist,
            currentIndex: currentIndex + 1,
            podcast: state.main_state.podcast.subpodcast.parent.podcast,
            channel: state.main_state.podcast.subpodcast.parent.channel,
          });
        }
      };
      audio.addEventListener('ended', playNextEpisode);

      if (state.main_state.general.autoplay) {
        const playPromise = audio.play();
        getDuration(audio.duration);
        dispatch({ type: 'PAUSE_SET_AUDIO', pause: false });
        dispatch({ type: 'PAUSE_SET_VIDEO', vodPlay: false });

        if (playPromise !== undefined) {
          playPromise
            .then(() => {})
            .catch((error) => {
              console.log(error);
            });
        }
      }

      return () => {
        audio.removeEventListener('progress', bufferProgress);
        audio.removeEventListener('timeupdate', playProgress);
      };
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.main_state.podcast.subpodcast.isSubpodcastPlaying,
    state.main_state.podcast.subpodcast.currentSubpodcast?.PodCastItemIdx,
    state.main_state.podcast.subpodcast.resetSubpodcast,
  ]);

  useEffect(() => {
    const audio: HTMLAudioElement = document.getElementById(
      'audio'
    ) as HTMLAudioElement;
    if (audio) audio.playbackRate = state.main_state.podcast.subpodcast.speed;
  }, [state.main_state.podcast.subpodcast.speed]);

  useEffect(() => {
    const audio: HTMLAudioElement = document.getElementById(
      'audio'
    ) as HTMLAudioElement;
    if (audio) audio.volume = state.main_state.player.volume / 10;
  }, [state.main_state.player.volume]);

  return (
    <div className="audio__container">
      <audio ref={audioRef} preload="metadata" id="audio" controls>
        <track default kind="captions" srcLang="kor" />
      </audio>
    </div>
  );

  function addToRecentListenedEpisodes(subpodcast: ListenedSubpodcast) {
    const episodes = window.localStorage.getItem('recentListenedEpisodes');
    let parsedEpisodes: ListenedSubpodcast[] = episodes
      ? JSON.parse(episodes).list
      : [];

    parsedEpisodes = parsedEpisodes.filter((episode) => {
      return episode.PodCastItemIdx !== subpodcast.PodCastItemIdx;
    });
    parsedEpisodes.unshift(subpodcast);

    if (parsedEpisodes.length > 50)
      parsedEpisodes = parsedEpisodes.slice(0, 50);

    window.localStorage.setItem(
      'recentListenedEpisodes',
      JSON.stringify({ list: parsedEpisodes })
    );
  }
}
function isMobile() {
  if (
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
      navigator.userAgent
    ) ||
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
      navigator.userAgent.substr(0, 4)
    )
  ) {
    return true;
  }
  return false;
}
