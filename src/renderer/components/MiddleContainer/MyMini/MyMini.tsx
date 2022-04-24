import { useState } from 'react';
import '../../../styles/myMini/myMini.css';
import Navbar from './components/Navbar';
import RecentEpisodes from './components/RecentEpisodes';
import Subscribed from './components/Subscribed';
import LikedEpisodes from './components/LikedEpisodes';
import LikedSongs from './components/LikedSongs';

export default function MyMini() {
  const tabs = ['recentTabs', 'subscribed', 'likedEpisodes', 'likedSongs'];
  const [tab, setTab] = useState<string>(tabs[0]);

  return (
    <div className="may__mini__container">
      <div className="title__mymini">
        <p>My Mini</p>
      </div>
      <Navbar tab={tab} setTab={setTab} tabs={tabs} />
      {tab === tabs[0] ? (
        <RecentEpisodes />
      ) : tab === tabs[1] ? (
        <Subscribed />
      ) : tab === tabs[2] ? (
        <LikedEpisodes />
      ) : (
        <LikedSongs />
      )}
    </div>
  );
}
