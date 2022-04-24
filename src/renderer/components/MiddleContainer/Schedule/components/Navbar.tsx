import { useContext } from 'react';
import '../../../../styles/scheduleNavbar/navbar.css';
import { Context } from '../../../../context/context/context';
import { Channels } from '../../../../context/utils/types';

export default function Navbar() {
  const { state, dispatch } = useContext(Context);

  return (
    <div className="schedule__navbar">
      <p
        onClick={() => changeScheduleChannel('sfm')}
        className={
          state.main_state.schedule.scheduleChannel === 'sfm'
            ? 'channel current'
            : 'channel'
        }
      >
        표준FM
      </p>
      <p
        onClick={() => changeScheduleChannel('mfm')}
        className={
          state.main_state.schedule.scheduleChannel === 'mfm'
            ? 'channel current'
            : 'channel'
        }
      >
        FM4U
      </p>
      <p
        onClick={() => changeScheduleChannel('chm')}
        className={
          state.main_state.schedule.scheduleChannel === 'chm'
            ? 'channel current'
            : 'channel'
        }
      >
        올댓뮤직
      </p>
    </div>
  );

  function changeScheduleChannel(channel: string) {
    if (channel === 'sfm')
      dispatch({
        type: 'CHANGE_SCHEDULE_CHANNEL',
        scheduleChannel: Channels.sfm,
      });
    else if (channel === 'mfm')
      dispatch({
        type: 'CHANGE_SCHEDULE_CHANNEL',
        scheduleChannel: Channels.mfm,
      });
    else if (channel === 'chm')
      dispatch({
        type: 'CHANGE_SCHEDULE_CHANNEL',
        scheduleChannel: Channels.chm,
      });
  }
}
