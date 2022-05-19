import { useEffect, useState, useContext } from 'react';
import iconHome from '../../../../assets/player/bottom/icon_home.svg';
import iconInsta from '../../../../assets/player/bottom/icon_inst.svg';
import iconSchedule from '../../../../assets/player/bottom/icon_sch.svg';
import videoIconNone from '../../../../assets/player/top/icon-bora-off.svg';
import videoIconYes from '../../../../assets/player/top/icon-bora-on.svg';
import videoIconAir from '../../../../assets/player/top/icon-bora-onair.svg';
import iconKakao from '../../../../assets/player/bottom/icon-kakao@3x.png';
import iconYoutube from '../../../../assets/player/bottom/icon-youtube.svg';
import iconSNS from '../../../../assets/player/bottom/icon-sns.svg';
import '../../../../styles/footer/footer.css';
import { Context } from '../../../../context/context/context';

export default function Footer() {
  const [sns, setSns] = useState<string | null>(null);
  const { state, dispatch } = useContext(Context);
  useEffect(() => {
    function getSNSType() {
      const currentSns =
        state.main_state.general.currentPrograms[
          state.main_state.general.channel
        ]?.ProgramSNSLink;
      if (currentSns?.includes('instagram')) {
        setSns(iconInsta);
      } else if (currentSns?.includes('youtube')) {
        setSns(iconYoutube);
      } else if (currentSns?.includes('kakao')) {
        setSns(iconKakao);
      } else if (currentSns !== '') {
        setSns(iconSNS);
      } else {
        setSns(null);
      }
    }
    getSNSType();
  }, [
    state.main_state.general.channel,
    state.main_state.general.currentPrograms,
  ]);

  return (
    <div className="footer__container">
      <div className="left">
        <a
          href={
            state.main_state.general.currentPrograms[
              state.main_state.general.channel
            ]?.HomePageUrl || '/'
          }
          target="_blank"
          rel="noreferrer"
        >
          <img className="icon__home" src={iconHome} alt="" />
        </a>
        {sns && (
          <a
            href={
              state.main_state.general.currentPrograms[
                state.main_state.general.channel
              ]?.ProgramSNSLink
            }
            target="_blank"
            rel="noreferrer"
          >
            <img src={sns} className="icon__sns" alt="" />
          </a>
        )}
      </div>
      <div className="right">
        <img
          onClick={handleVideoDisclose}
          className="vod__icon"
          src={
            state.main_state.vod.isVod
              ? state.main_state.vod.videoClosed
                ? isRightChannel()
                  ? videoIconYes
                  : videoIconNone
                : isRightChannel()
                ? videoIconAir
                : videoIconNone
              : videoIconNone
          }
          alt=""
        />
        <img
          onClick={() => {
            dispatch({
              type: 'CHANGE_CHANNEL',
              channel: state.main_state.general.channel,
            });
            dispatch({ type: 'SHOW_SCHEDULE' });
            dispatch({ type: 'CLOSE_MY_MINI' });
            dispatch({ type: 'CLOSE_SETTINGS' });
          }}
          className="icon__schedule"
          src={iconSchedule}
          alt=""
        />
      </div>
    </div>
  );

  function isRightChannel() {
    if (state.main_state.vod.currentVod?.Channel === 'FM4U') {
      return state.main_state.general.channel === 'mfm';
    }
    return state.main_state.general.channel === 'sfm';
  }

  function handleVideoDisclose() {
    if (state.main_state.vod.isVod) {
      dispatch({ type: 'VIDEO_DISCLOSE' });
    }
  }
}
