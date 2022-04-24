import { useState, useEffect, useContext } from 'react';
import iconLeftOn from '../../../../assets/middle/schedule/sch-butt-before-on.svg';
import iconLeftOff from '../../../../assets/middle/schedule/sch-butt-before-off.svg';
import iconRightOn from '../../../../assets/middle/schedule/sch-butt-next-on.svg';
import iconRightOff from '../../../../assets/middle/schedule/sch-butt-next-off.svg';
import '../../../../styles/scheduleDate/date.css';
import Utils from '../../../Utils/utils';
import { Context } from '../../../../context/context/context';
import { datesObj } from '../../../../context/utils/types';

export default function ScheduleDate() {
  const { state, dispatch } = useContext(Context);
  const [currentDate, setCurrentDate] = useState<number>(2);
  const [dates, setDates] = useState<{ date: Date; weekday: string }[]>([]);
  const utils = new Utils(state, dispatch);

  useEffect(() => {
    const arr = utils.getDatesForschedule();
    setDates(arr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch({
      type: 'CHANGE_SCHEDULE_DAY',
      weekday: datesObj[new Date().getDay()],
    });
    setCurrentDate(2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.main_state.schedule.scheduleChannel]);

  return (
    <div className="schedule__date">
      <img
        className={currentDate === 0 ? 'disable__pointer' : ''}
        onClick={moveDateLeft}
        src={currentDate > 0 ? iconLeftOn : iconLeftOff}
        alt=""
      />
      <div className="date">
        {dates.length > 1 && formatDate(dates[currentDate])}
      </div>
      <img
        className={currentDate === 6 ? 'disable__pointer' : ''}
        onClick={moveDateRight}
        src={currentDate < 6 ? iconRightOn : iconRightOff}
        alt=""
      />
    </div>
  );

  function formatDate(d: { date: Date; weekday: string }) {
    const year = d.date.getFullYear();
    const month = d.date.getMonth() + 1;
    const date = d.date.getDate();

    return `${year}년 ${month}월 ${date}일 ${d.weekday}`;
  }

  function moveDateLeft() {
    if (currentDate !== 0) {
      dispatch({
        type: 'CHANGE_SCHEDULE_DAY',
        weekday: dates[currentDate - 1].weekday,
      });
      setCurrentDate(currentDate - 1);
    }
  }

  function moveDateRight() {
    if (currentDate !== 6) {
      dispatch({
        type: 'CHANGE_SCHEDULE_DAY',
        weekday: dates[currentDate + 1].weekday,
      });
      setCurrentDate(currentDate + 1);
    }
  }
}
