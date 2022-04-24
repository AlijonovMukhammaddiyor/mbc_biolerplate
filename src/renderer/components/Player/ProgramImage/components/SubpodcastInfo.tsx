import { useState, useContext } from 'react';
import { Context } from '../../../../context/context/context';
import '../../../../styles/subpodcastInfo/subpodcastinfo.css';
import iconView from '../../../../assets/player/podcast/podcast-icon-view.svg';
import iconClose from '../../../../assets/middle/icon_close.svg';

export default function SubpodcastInfo() {
  const { state } = useContext(Context);
  const [closed, setClosed] = useState(true);

  const date =
    state.main_state.podcast.subpodcast.currentSubpodcast?.DatePub ||
    state.main_state.podcast.subpodcast.currentSubpodcast?.BroadDate ||
    state.main_state.podcast.subpodcast.currentSubpodcast?.PubDate;

  return (
    <div
      className={
        closed
          ? 'subpodcast_info__container'
          : 'subpodcast_info__container show__info'
      }
    >
      <p className="date">{date}</p>
      <p className="title">
        {state.main_state.podcast.subpodcast.currentSubpodcast?.ContentTitle}
      </p>
      <p className="description">
        {state.main_state.podcast.subpodcast.currentSubpodcast?.Description}
      </p>

      <div className="icons ">
        {closed ? (
          <>
            <img
              onClick={() => setClosed(!closed)}
              src={iconView}
              className="view__icon"
              alt=""
            />
            <p onClick={() => setClosed(!closed)} className="plus__icon">
              +
            </p>
          </>
        ) : (
          <div
            onClick={() => setClosed(!closed)}
            className="disclosed"
            role="list"
          >
            <img src={iconClose} className="close__icon" alt="" />
          </div>
        )}
      </div>
    </div>
  );
}
