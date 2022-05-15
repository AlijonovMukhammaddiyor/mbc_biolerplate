import { useState, useEffect, useContext } from 'react';
import $ from 'jquery';
import { Subpodcast } from '../../../../context/utils/types';
import Data from '../../../../context/utils/data';
import '../../../../styles/recentpodcasts/recentPodcasts.css';
import { Context } from '../../../../context/context/context';
import iconPlaying from '../../../../assets/player/podcast/podcast-icon-list-ing.svg';

export default function RecentPodcasts() {
  const [podcasts, setPodcasts] = useState<Subpodcast[]>([]);
  const { state, dispatch } = useContext(Context);

  useEffect(() => {
    $.ajax({
      url: Data.urls.recentPodcastLIstApi,
      dataType: 'jsonp',
      type: 'GET',
      crossDomain: true,
      xhrFields: {
        withCredentials: true,
      },
      success: (data: Subpodcast[]) => {
        if (data.length > 0) {
          setPodcasts(data);
        }
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }, []);

  return (
    <div className="recent__podcasts">
      <div className="title">
        <p>최신 업로드 에피소드</p>
      </div>
      <div className="podcasts">
        {podcasts.map((podcast, index) => {
          return (
            <div
              key={podcast.PodCastItemIdx}
              className={
                isPLayingSubpodcast(podcast)
                  ? 'recent__podcast playing__subpodcast'
                  : 'recent__podcast'
              }
              onClick={() => {
                dispatch({
                  type: 'SUBPODCAST_ON',
                  subpodcast: podcast,
                  currentIndex: index,
                  playlist: podcasts,
                  podcast: null,
                  channel: null,
                });
              }}
              role="list"
            >
              {isPLayingSubpodcast(podcast) && (
                <img className="icon__playing" src={iconPlaying} alt="" />
              )}
              <img className="title__img" src={podcast.ITunesImageURL} alt="" />
              <div className="info">
                <p className="program__name">{podcast.ProgramTitle}</p>
                <p className="episode__title">{podcast.ContentTitle}</p>
                <p className="date">{podcast.BroadDate.slice(0, 10)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  function isPLayingSubpodcast(podcast: Subpodcast) {
    return (
      podcast.BroadCastID ===
        state.main_state.podcast.subpodcast.currentSubpodcast?.BroadCastID &&
      podcast.BroadDate ===
        state.main_state.podcast.subpodcast.currentSubpodcast?.BroadDate
    );
  }
}
