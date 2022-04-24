import '../../../../styles/podcast_home/home.css';
import './PodcastByChannel';
import RecentPodcasts from './RecentPodcasts';
import RecommendedPodcasts from './RecommendedPodcasts';
import SubscribedPodcasts from './SubscribedPodcasts';

export default function Home() {
  return (
    <div className="podcasts__home__container">
      <RecommendedPodcasts />
      <SubscribedPodcasts />
      <RecentPodcasts />
    </div>
  );
}
