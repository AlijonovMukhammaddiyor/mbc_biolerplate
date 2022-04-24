/* eslint-disable promise/no-nesting */
/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
import { useEffect, useContext, useRef, useState } from 'react';
import HLs from 'hls.js';
import jsonp from 'jsonp';
import Data from '../../../../context/utils/data';
import { Context } from '../../../../context/context/context';
import '../../../../styles/audio/audio.css';
import { ListenedSubpodcast } from '../../../../context/utils/types';

type Props = {
  getDuration: (dur: number) => void;
  setPause: (pause: boolean) => void;
};

export default function Audio({ getDuration, setPause }: Props) {
  const [audioPlayer, setPlayer] = useState(new HLs());
  const { state, dispatch } = useContext(Context);
  const audioRef = useRef<HTMLMediaElement>(null);

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
                  setPause(false);
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
              const errorType = errData.type;
              const errorDetails = errData.details;
              const errorFatal = errData.fatal;
              console.log('error', errData.err, data);
              console.log('errorType', errorType);
              console.log('errorDetails', errorDetails);
              console.log('errorFatal', errorFatal);
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
        setPause(false);
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
