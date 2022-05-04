import { useEffect, useState, useContext, useMemo } from 'react';
import '../../../styles/tracklist/tracklist.css';
import jsonp from 'jsonp';
import Navbar from '../Messages/components/Navbar';
import Data from '../../../context/utils/data';
import { Context } from '../../../context/context/context';
import Track from './components/Track';
import NoTrack from './components/NoTrack';
import { TrackType } from '../../../context/utils/types';

export default function TrackList() {
  const [tracklist, setTracklist] = useState<TrackType[]>([] as TrackType[]);
  const { state } = useContext(Context);

  const currentPrograms = useMemo(() => {
    return state.main_state.general.currentPrograms; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // eslint-disable-next-line react-hooks/exhaustive-deps
    state.main_state.general.currentPrograms[state.main_state.general.channel]
      ?.BroadCastID,
  ]);

  const channel = useMemo(() => {
    return state.main_state.general.channel;
  }, [state.main_state.general.channel]);

  const currentSongs = useMemo(() => {
    return state.main_state.general.currentSongs;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // eslint-disable-next-line react-hooks/exhaustive-deps
    state.main_state.general.currentSongs[state.main_state.general.channel]
      ?.LogCD,
  ]);

  useEffect(() => {
    function getTrackList() {
      const bid =
        state.main_state.general.currentPrograms[
          state.main_state.general.channel
        ]?.BroadCastID;
      const gid =
        state.main_state.general.currentPrograms[
          state.main_state.general.channel
        ]?.ProgramGroupID;
      const today = new Date();
      if (bid)
        jsonp(
          `${
            Data.urls.tracklistApi
          }?bid=${bid}&gid=${gid}&BroadDate=${today.getFullYear()}-${
            today.getMonth() + 1
          }-${today.getDate()}`,
          {},
          (err, res) => {
            if (!err) {
              setTracklist(res.tList);
            }
          }
        );
    }
    getTrackList();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel, currentPrograms, currentSongs]);

  return (
    <div className="tracklist__container">
      <Navbar messageVisibility="" getMyMessages={() => {}} myMess={false} />
      {tracklist.length > 0 ? (
        <div className="tracks">
          {tracklist.map((track) => {
            return <Track state={state} track={track} key={track.TR_NO} />;
          })}
        </div>
      ) : (
        <NoTrack />
      )}
    </div>
  );
}
