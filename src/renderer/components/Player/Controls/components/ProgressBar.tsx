import React, { useState, useEffect } from 'react';
import Volume from './Volume';
import Audio from './Audio';
import { STATE } from '../../../../context/utils/types';
import Utils from '../../../Utils/utils';
import '../../../../styles/progressBar/progressBar.css';

type Props = {
  state: STATE;
  util: Utils;
  setPause: (param: boolean) => void;
  dispatch: (param: unknown) => void;
};

export default function TimeProgress({
  state,
  util,
  dispatch,
  setPause,
}: Props) {
  const [progress, setProgress] = useState(0);
  const [playedTime, setPlayedTime] = useState(0);
  const [subpodcastDuration, setDuration] = useState(0);

  const style = {
    '--val': progress,
    '--min': 0,
    '--max': 100,
  } as React.CSSProperties;

  // update progress bar of the program
  useEffect(() => {
    if (
      !state.main_state.podcast.subpodcast.isSubpodcastPlaying &&
      !state.main_state.podcast.subpodcast.currentSubpodcast
    )
      util.updateProgress(progress, `#program__progress`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    progress,
    state.main_state.podcast.subpodcast.isSubpodcastPlaying,
    state.main_state.podcast.subpodcast.currentSubpodcast,
  ]);

  useEffect(() => {
    if (
      !state.main_state.podcast.subpodcast.isSubpodcastPlaying &&
      !state.main_state.podcast.subpodcast.currentSubpodcast
    ) {
      const { channel } = state.main_state.general;
      const { currentPrograms } = state.main_state.general;

      if (currentPrograms[channel]) {
        util.changeProgress(setProgress);
        const timer = window.setInterval(() => {
          util.changeProgress(setProgress);
        }, 5000);
        return () => window.clearInterval(timer);
      }
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.main_state.general.currentPrograms,
    state.main_state.general.channel,
    state.main_state.podcast.subpodcast.isSubpodcastPlaying,
  ]);

  useEffect(() => {
    if (state.main_state.podcast.subpodcast.currentSubpodcast) {
      const prog = window.setInterval(() => {
        if (subpodcastDuration > 0) {
          const audio = document.getElementById('audio') as HTMLAudioElement;
          setPlayedTime(audio.currentTime);
        }
      }, 1000);
      return () => window.clearInterval(prog);
    }
    return () => {};
  }, [
    state.main_state.podcast.subpodcast.currentSubpodcast,
    state.main_state.podcast.subpodcast.isSubpodcastPlaying,
    state.main_state.podcast.subpodcast.resetSubpodcast,
    subpodcastDuration,
  ]);
  // console.log(progress);

  return (
    <div
      className={
        state.main_state.podcast.subpodcast.isSubpodcastPlaying
          ? 'audio__controls controls__podcast__in'
          : 'audio__controls'
      }
    >
      <div
        className={
          state.main_state.podcast.subpodcast.isSubpodcastPlaying
            ? 'time__progress is_subpodcast'
            : 'time__progress'
        }
      >
        {state.main_state.podcast.subpodcast.isSubpodcastPlaying ? (
          <div className="subpodcast__range">
            <div className="buffered">
              <span id="buffered__amount" />
            </div>
            <div className="progress">
              <span id="progress__amount" />
            </div>
          </div>
        ) : (
          <input
            tabIndex={-1}
            type="range"
            name=""
            id="program__progress"
            className="onair__range"
            min={0}
            max={100}
            style={style}
          />
        )}
        {state.main_state.general.currentPrograms[
          state.main_state.general.channel
        ] && (
          <div className="program__interval">
            {state.main_state.podcast.subpodcast.currentSubpodcast ? (
              <>
                <p className="start_time__subpodcast">
                  {formatDuration(Math.ceil(playedTime))}
                </p>
                <p className="end_time__subpodcast">
                  {formatDuration(subpodcastDuration)}
                </p>
              </>
            ) : (
              <>
                <p className="start">{`${state.main_state.general.currentPrograms[
                  state.main_state.general.channel
                ]?.StartTime.substring(
                  0,
                  2
                )}:${state.main_state.general.currentPrograms[
                  state.main_state.general.channel
                ]?.StartTime.substring(2, 4)}`}</p>
                <p className="end">
                  {util.getEndTime(
                    state.main_state.general.currentPrograms[
                      state.main_state.general.channel
                    ]?.StartTime,
                    state.main_state.general.currentPrograms[
                      state.main_state.general.channel
                    ]?.RunningTime
                  )}
                </p>
              </>
            )}
          </div>
        )}
        <Audio getDuration={getSubpodcastDuration} setPause={setPause} />
      </div>
      {!state.main_state.podcast.subpodcast.isSubpodcastPlaying && (
        <div className="volume">
          <Volume
            isMini={false}
            isPodcast={false}
            volume={state.main_state.player.volume}
            setVolume={setVolume}
            toggleVolume={toggleVolume}
          />
        </div>
      )}
    </div>
  );

  function setVolume(volume: number) {
    dispatch({ type: 'VOLUME_CHANGE', volume });
  }

  function toggleVolume(): void {
    if (state.main_state.player.volume === 0) {
      dispatch({
        type: 'TOGGLE_VOLUME',
        volume: state.main_state.player.prevVolume,
        prevVolume: state.main_state.player.prevVolume,
      });
    } else {
      dispatch({
        type: 'TOGGLE_VOLUME',
        volume: 0,
        prevVolume: state.main_state.player.volume,
      });
    }
  }

  function getSubpodcastDuration(duration: number) {
    if (!Number.isNaN(duration)) setDuration(duration);
  }

  function formatDuration(time: number) {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time - 3600 * hours) / 60);
    const seconds = time - 3600 * hours - 60 * minutes;
    let ans = '';
    [hours, minutes, seconds].forEach((num) => {
      const formattedNumber = num.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false,
      });
      ans += `${formattedNumber}:`;
    });
    return ans.substring(0, ans.length - 1);
  }
}
