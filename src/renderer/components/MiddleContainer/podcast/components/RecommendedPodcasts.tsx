import { useEffect, useState } from 'react';
import $ from 'jquery';
import Data from '../../../../context/utils/data';
import { RecommendedPodcast } from '../../../../context/utils/types';
import '../../../../styles/recommendedPodcasts/recPodcasts.css';
import Carousel from './Carousel';

export default function RecommendedPodcasts() {
  const [podcasts, setPodcasts] = useState<RecommendedPodcast[]>([]);

  useEffect(() => {
    $.ajax({
      url: Data.urls.recommendedPodcastsApi,
      dataType: 'jsonp',
      type: 'GET',
      crossDomain: true,
      xhrFields: {
        withCredentials: true,
      },
      success: (data: RecommendedPodcast[], status, xhr) => {
        if (data.length > 0) {
          setPodcasts(data);
        }
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }, []);

  return podcasts.length > 0 ? (
    <div className="recommended__podcasts">
      <div className="title">
        <p>추천 프로그램</p>
      </div>
      <div className="podcasts__carousel">
        <Carousel podcasts={podcasts} />
      </div>
    </div>
  ) : (
    <></>
  );
}
