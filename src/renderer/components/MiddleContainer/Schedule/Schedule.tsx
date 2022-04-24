/* eslint-disable promise/always-return */
import { useContext, useEffect, useState, useRef } from 'react';
import '../../../styles/schedule/schedule.css';
import Navbar from './components/Navbar';
import ScheduleDate from './components/Date';
import { Context } from '../../../context/context/context';
import Program from './components/Program';
import Utils from '../../Utils/utils';
import { ChannelSchedule } from '../../../context/utils/types';

export default function Schedule() {
  const [channelSchedule, setChannelSchedule] = useState<ChannelSchedule[]>([]);
  const [slided, setSlided] = useState<ChannelSchedule | null>(null);
  const { state, dispatch } = useContext(Context);
  const onAirContainer = useRef<HTMLDivElement>(null);
  const currentProgramID =
    state.main_state.general.currentPrograms[state.main_state.general.channel]
      ?.BroadCastID;

  useEffect(() => {
    if (currentProgramID && state.main_state.vod.vodSchedule.length > 0) {
      const utils = new Utils(state, dispatch);
      const data = utils.getScheduleForChannel(
        state.main_state.vod.vodSchedule,
        state.main_state.schedule.weekday.substring(0, 1)
      );
      data
        .then((res) => {
          setChannelSchedule(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.main_state.schedule.weekday,
    state.main_state.schedule.scheduleChannel,
    state.main_state.vod.vodSchedule,
    currentProgramID,
  ]);

  useEffect(() => {
    let set = false;
    if (channelSchedule.length > 0) {
      channelSchedule.every((program, index) => {
        if (program.onAir) {
          setSlided(program);
          set = true;
          return false;
        }
        return true;
      });
      if (!set) {
        setSlided(null);
      }
    }
  }, [channelSchedule, state.main_state.schedule.scheduleChannel]);

  useEffect(() => {
    if (slided && slided?.onAir && onAirContainer.current) {
      const programs = document.getElementsByClassName(
        'programs'
      )[0] as HTMLDivElement;
      programs.scrollBy({
        top:
          onAirContainer.current.getBoundingClientRect().y -
          programs.getBoundingClientRect().y,
        behavior: 'smooth',
      });
      window.setTimeout(() => {
        if (onAirContainer.current)
          programs.scrollBy({
            top:
              onAirContainer.current.getBoundingClientRect().y -
              programs.getBoundingClientRect().y,
            behavior: 'smooth',
          });
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.main_state.schedule.scheduleChannel, slided]);

  return (
    <div className="schedule__container">
      {/* <img
				onClick={() => dispatch({ type: "HIDE_SCHEDULE" })}
				className="close__icon"
				style={{ color: "red" }}
				src={closeIcon}
				alt=""
			/> */}
      <div className="title__schedule">
        <p>편성표</p>
      </div>
      <Navbar />
      <ScheduleDate />
      <div className="programs">
        {channelSchedule.length > 0 &&
          channelSchedule.map((program, index) => {
            return (
              <Program
                program={program}
                key={program.BroadCastID}
                slided={program.BroadCastID === slided?.BroadCastID}
                setSlided={setSlided}
                refer={onAirContainer}
              />
            );
          })}
      </div>
    </div>
  );
}
