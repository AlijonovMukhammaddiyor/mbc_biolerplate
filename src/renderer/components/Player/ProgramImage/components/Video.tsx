/* eslint-disable promise/always-return */
import { useEffect, useContext, useRef, useState } from 'react';
import HLs from 'hls.js';
import jsonp from 'jsonp';
import { Context } from '../../../../context/context/context';
import Volume from '../../Controls/components/Volume';
import videoPlayIcon from '../../../../assets/player/video/bora-icon-play.svg';
import videoPauseIcon from '../../../../assets/player/video/main-icon-stop.svg';
import resizeVideoIcon from '../../../../assets/player/video/bora-icon-full.svg';
import popIcon from '../../../../assets/player/video/bt-bora-pop.svg';
import videoCloseIcon from '../../../../assets/player/video/pop-icon-close.svg';
import '../../../../styles/video/video.css';

export default function Audio() {
  const [videoPlayer, setPlayer] = useState<any>(new HLs());
  const [darken, setDarken] = useState(false);
  const { state, dispatch } = useContext(Context);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fullSize, setFullSize] = useState(false);
  const [isPoped, setPopped] = useState(false);
  async function getUrl(): Promise<string> {
    return new Promise((resolve, reject) => {
      const url = `https://sminiplay.imbc.com/boraplay.ashx?agent=webapp`;
      jsonp(url, {}, (err, data) => {
        if (err) reject(err);
        else {
          resolve(data.BoraURL);
        }
      });
    });
  }

  const initStreaming = async () => {
    if (!state.main_state.podcast.subpodcast.isSubpodcastPlaying) {
      const data = await getUrl();
      // eslint-disable-next-line no-param-reassign
      if (HLs.isSupported()) {
        if (videoPlayer) {
          videoPlayer.destroy();
        }
        const newPlayer = new HLs({ autoStartLoad: true, debug: false });

        newPlayer.loadSource(data);

        if (videoRef.current !== null) {
          newPlayer.attachMedia(videoRef.current);
          if (state.main_state.vod.vodPlay)
            newPlayer.on(HLs.Events.MANIFEST_PARSED, () => {
              if (videoRef.current) {
                videoRef.current.volume = state.main_state.player.volume / 10;
                const playPromise = videoRef.current.play();
                if (playPromise !== undefined) {
                  // eslint-disable-next-line promise/no-nesting
                  playPromise
                    .then(() => {})
                    .catch((error) => {
                      console.log(error);
                    });
                }
              }
            });

          newPlayer.on(HLs.Events.ERROR, (_event, res) => {
            if (res.fatal) {
              switch (res.type) {
                case HLs.ErrorTypes.NETWORK_ERROR:
                  // try to recover network error
                  console.log(
                    'fatal network error encountered, try to recover 1'
                  );
                  videoPlayer.startLoad();
                  break;
                case HLs.ErrorTypes.MEDIA_ERROR:
                  console.log(
                    'fatal media error encountered, try to recover 2'
                  );
                  videoPlayer.recoverMediaError();
                  break;
                default:
                  // cannot recover
                  if (videoPlayer) videoPlayer.destroy();
                  break;
              }
            }
          });

          setPlayer(newPlayer);
        }
      }
    }
  };

  useEffect(() => {
    dispatch({ type: 'PAUSE_SET_VIDEO', vodPlay: false });
    initStreaming();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.main_state.general.channel,
    state.main_state.podcast.subpodcast.isSubpodcastPlaying,
  ]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) video.volume = state.main_state.vod.volume / 10;
  }, [state.main_state.vod.volume]);

  useEffect(() => {
    if (!state.main_state.vod.vodPlay && videoRef.current) {
      videoRef.current.pause();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.main_state.vod.vodPlay]);

  useEffect(() => {
    const video = videoRef.current;
    // Video entered Picture-in-Picture mode.
    video?.addEventListener('enterpictureinpicture', () => {
      setFullSize(false);
    });
    // Video left Picture-in-Picture mode.
    video?.addEventListener('leavepictureinpicture', () => {
      setPopped(false);
    });

    return () => {
      video?.removeEventListener('leavepictureinpicture', () => {
        setPopped(false);
      });
      video?.removeEventListener('enterpictureinpicture', () => {
        setFullSize(false);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      onMouseLeave={() => setDarken(false)}
      className="video__container"
      id="video__container"
    >
      <video
        ref={videoRef}
        className={
          state.main_state.vod.vodPlay
            ? darken
              ? 'video__playing video__darken'
              : 'video__playing'
            : 'video__paused'
        }
        preload="metadata"
        id="video"
        controls={false}
        onPause={onPipPause}
        onPlay={onPipPlay}
      >
        <track default kind="captions" srcLang="kor" />
        Your browser does not support the HTML5 video tag. Use a better browser!
      </video>

      {!state.main_state.vod.vodPlay ? (
        <div
          onMouseOver={() => setDarken(true)}
          onClick={toggleVideo}
          className={
            !state.main_state.vod.vodPlay
              ? 'play__icon play__icon__paused'
              : 'play__icon'
          }
          onFocus={() => {}}
          role="list"
        >
          <img src={videoPlayIcon} alt="" />
        </div>
      ) : (
        <div
          onMouseOver={() => setDarken(true)}
          onClick={toggleVideo}
          className="pause__icon"
          onFocus={() => {}}
          role="list"
        >
          <img src={videoPauseIcon} alt="" />
        </div>
      )}
      <div
        onMouseOver={() => setDarken(true)}
        onFocus={() => {}}
        className="video__volume"
      >
        <Volume
          isMini={false}
          // eslint-disable-next-line react/jsx-boolean-value
          isPodcast={true}
          volume={state.main_state.vod.volume}
          setVolume={setVolume}
          toggleVolume={toggleVolume}
        />
      </div>
      {!fullSize && (
        <div
          onMouseOver={() => setDarken(true)}
          onFocus={() => {}}
          className="video__close"
        >
          <img src={videoCloseIcon} onClick={closeVideo} alt="" />
        </div>
      )}
      <div
        onMouseOver={() => setDarken(true)}
        onFocus={() => {}}
        className="video__pop"
      >
        {isPoped ? (
          <img
            onClick={makeVideoUnpop}
            className="pop__icon"
            src={popIcon}
            alt=""
          />
        ) : (
          <img
            onClick={makeVideoPop}
            className="pop__icon"
            src={popIcon}
            alt=""
          />
        )}
      </div>
      <div
        onMouseOver={() => setDarken(true)}
        onFocus={() => {}}
        className="video__resize"
      >
        {fullSize ? (
          <img
            onClick={undoFullSize}
            className="resize__video"
            src={resizeVideoIcon}
            alt=""
          />
        ) : (
          <img
            onClick={requestFullSize}
            className="resize__video"
            src={resizeVideoIcon}
            alt=""
          />
        )}
      </div>
    </div>
  );

  function setVolume(volume: number) {
    dispatch({ type: 'VOLUME_CHANGE_VOD', volume });
  }

  function toggleVolume(): void {
    if (state.main_state.vod.volume === 0) {
      console.log(state.main_state.vod.prevVolume);
      dispatch({
        type: 'TOGGLE_VOLUME_VOD',
        volume: state.main_state.vod.prevVolume,
        prevVolume: state.main_state.vod.prevVolume,
      });
    } else {
      dispatch({
        type: 'TOGGLE_VOLUME_VOD',
        volume: 0,
        prevVolume: state.main_state.vod.volume,
      });
    }
  }

  async function playVideo() {
    dispatch({ type: 'SET_PAUSE', paused: true });
    videoPlayer?.destroy();
    setPlayer(null);
    await initStreaming();
    if (videoRef.current) videoRef.current.play();
  }

  async function toggleVideo() {
    if (!state.main_state.vod.vodPlay) {
      await playVideo();
      dispatch({ type: 'PAUSE_SET_VIDEO', vodPlay: true });
      dispatch({ type: 'PAUSE_SET_AUDIO', pause: true });
    } else {
      dispatch({ type: 'PAUSE_SET_VIDEO', vodPlay: false });
    }
  }

  function closeVideo() {
    dispatch({ type: 'VIDEO_CLOSE' });
    if (videoPlayer) videoPlayer.destroy();
    dispatch({ type: 'PAUSE_SET_VIDEO', vodPlay: false });
  }

  async function onPipPlay() {
    if (isPoped && !state.main_state.vod.vodPlay) {
      toggleVideo();
    }
  }

  function onPipPause() {
    dispatch({ type: 'PAUSE_SET_VIDEO', vodPlay: false });
  }

  function makeVideoPop() {
    const video = document.getElementById('video')! as HTMLVideoElement;
    try {
      if (!document.pictureInPictureElement) {
        video.requestPictureInPicture();
        setPopped(true);
      } else {
        document.exitPictureInPicture();
      }
    } catch (reason) {
      console.error(reason);
    }
  }

  function makeVideoUnpop() {
    console.log('unpop');
    if (document.pictureInPictureElement) {
      console.log('inside');
      document.exitPictureInPicture();
      setPopped(false);
      const video = document.getElementById('video') as HTMLVideoElement;
      const wasPlaying = !video.paused;

      console.log(video.paused);

      if (wasPlaying) {
        dispatch({ type: 'PAUSE_SET_VIDEO', vodPlay: true });
        dispatch({ type: 'PAUSE_SET_AUDIO', pause: true });
      } else {
        dispatch({ type: 'PAUSE_SET_VIDEO', vodPlay: false });
      }
    }
  }

  function requestFullSize() {
    const docElmWithBrowsersFullScreenFunctions = document.getElementById(
      'video__container'
    ) as HTMLElement & {
      mozRequestFullScreen(): Promise<void>;
      webkitRequestFullscreen(): Promise<void>;
      msRequestFullscreen(): Promise<void>;
    };

    if (docElmWithBrowsersFullScreenFunctions.requestFullscreen) {
      makeVideoUnpop();

      docElmWithBrowsersFullScreenFunctions.requestFullscreen();
    } else if (docElmWithBrowsersFullScreenFunctions.mozRequestFullScreen) {
      makeVideoUnpop();

      /* Firefox */
      docElmWithBrowsersFullScreenFunctions.mozRequestFullScreen();
    } else if (docElmWithBrowsersFullScreenFunctions.webkitRequestFullscreen) {
      makeVideoUnpop();

      /* Chrome, Safari and Opera */
      docElmWithBrowsersFullScreenFunctions.webkitRequestFullscreen();
    } else if (docElmWithBrowsersFullScreenFunctions.msRequestFullscreen) {
      makeVideoUnpop();

      /* IE/Edge */
      docElmWithBrowsersFullScreenFunctions.msRequestFullscreen();
    }

    setFullSize(true);
  }

  function undoFullSize() {
    if (document.fullscreenElement) {
      const docWithBrowsersExitFunctions = document as Document & {
        mozCancelFullScreen(): Promise<void>;
        webkitExitFullscreen(): Promise<void>;
        msExitFullscreen(): Promise<void>;
      };
      if (docWithBrowsersExitFunctions.exitFullscreen) {
        docWithBrowsersExitFunctions.exitFullscreen();
      } else if (docWithBrowsersExitFunctions.mozCancelFullScreen) {
        /* Firefox */
        docWithBrowsersExitFunctions.mozCancelFullScreen();
      } else if (docWithBrowsersExitFunctions.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        docWithBrowsersExitFunctions.webkitExitFullscreen();
      } else if (docWithBrowsersExitFunctions.msExitFullscreen) {
        /* IE/Edge */
        docWithBrowsersExitFunctions.msExitFullscreen();
      }
      setFullSize(false);
    }
  }
}
