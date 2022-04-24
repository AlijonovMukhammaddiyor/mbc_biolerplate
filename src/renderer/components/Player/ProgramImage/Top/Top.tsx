import Navbar from './navbar/Navbar';
import Channels from './channel/Channels';
import '../../../../styles/top/top.css';

export default function Top() {
  return (
    <div className="top__container">
      <Navbar />
      <Channels />
    </div>
  );
}
