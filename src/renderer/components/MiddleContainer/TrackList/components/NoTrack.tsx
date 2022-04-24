import '../../../../styles/noTrack/noTrack.css';
import iconNoTrack from '../../../../assets/middle/img-no-list.svg';

export default function NoTrack() {
  return (
    <div className="no__tracks">
      <p>선곡이 없습니다.</p>
      <div className="no_tracks_img">
        {' '}
        <img src={iconNoTrack} alt="" />
      </div>
    </div>
  );
}
