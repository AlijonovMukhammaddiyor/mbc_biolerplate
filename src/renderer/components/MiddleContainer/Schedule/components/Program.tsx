import React, { CSSProperties, useContext } from 'react';
import Utils from 'renderer/components/Utils/utils';
import { Context } from 'renderer/context/context/context';
import { ChannelSchedule } from '../../../../context/utils/types';
import '../../../../styles/program/program.css';
import iconVideoOff from '../../../../assets/middle/schedule/sch-icon-bora-off.svg';
import iconVideoOn from '../../../../assets/middle/schedule/sch-icon-bora-on.svg';
import iconOnAir from '../../../../assets/middle/schedule/sch-onair-icon.svg';
import iconDown from '../../../../assets/middle/schedule/icon_down-removebg-preview.png';
import iconHomeOn from '../../../../assets/middle/schedule/sch-icon-home_live.svg';
import iconHomeOff from '../../../../assets/middle/schedule/sch-icon-home_off.svg';
import iconInstaOn from '../../../../assets/middle/schedule/sch-icon-sns-on.svg';
import iconInstaOff from '../../../../assets/middle/schedule/sch-icon-sns.svg';
import iconPodcastOn from '../../../../assets/middle/schedule/sch-icon-podcast-on.svg';
import iconPodcastOff from '../../../../assets/middle/schedule/sch-icon-podcast.svg';

type Props = {
  program: ChannelSchedule;
  slided: boolean;
  setSlided: (cha: ChannelSchedule | null) => void;
  refer: React.RefObject<HTMLDivElement>;
};

export default function Program({ program, slided, setSlided, refer }: Props) {
  const { state, dispatch } = useContext(Context);

  const style = {
    '--val': program.isBora ? '64px' : '52.5px',
    '--slidedVal': program.isBora ? '121.5px' : '106px',
  } as CSSProperties;

  return (
    <div
      style={style}
      id={slided ? 'slided__program' : 'not_slided'}
      className={
        program.onAir ? 'program__container on__air' : 'program__container'
      }
    >
      <div
        ref={program.onAir ? refer : null}
        className={program.isBora ? 'top is__bora' : 'top'}
      >
        <div className="left">
          <div className="time">
            <p>
              {program.StartTime.substring(0, 2)}:
              {program.StartTime.substring(2, 4)}
            </p>
          </div>
          <div className="info">
            <div className="title__air">
              <p className="title">{program.ProgramTitle}</p>
              {program.onAir && <img src={iconOnAir} alt="" />}
            </div>
            {program.isBora && (
              <div className="bora">
                <img src={program.onAir ? iconVideoOn : iconVideoOff} alt="" />
                <p>{program.guest}</p>
              </div>
            )}
          </div>
        </div>
        <div className="right">
          <img
            onClick={() => {
              if (slided) setSlided(null);
              else setSlided(program);
            }}
            src={iconDown}
            alt=""
          />
        </div>
      </div>

      <div className="bottom">
        <a href="/" target="_blank" id="link" style={{ display: 'none' }}>
          open in browser
        </a>
        <img
          onClick={() => {
            redirect(program.HomePageUrl);
          }}
          className={program.HomePageUrl ? 'cursor' : ''}
          src={program.HomePageUrl !== '' ? iconHomeOn : iconHomeOff}
          alt=""
        />
        <img
          onClick={() => {
            redirect(program.ProgramSNSLink);
          }}
          className={program.ProgramSNSLink ? 'cursor' : ''}
          src={program.ProgramSNSLink !== '' ? iconInstaOn : iconInstaOff}
          alt=""
        />
        <img
          onClick={() => {
            // redirect(program.PodCastURL);
            openPodcast();
          }}
          className={program.PodCastURL ? 'cursor' : ''}
          src={program.PodCastURL !== '' ? iconPodcastOn : iconPodcastOff}
          alt=""
        />
      </div>
    </div>
  );

  async function openPodcast() {
    if (!program.PodCastURL) return;
    const channel = state.main_state.general.channel === 'sfm' ? 6 : 7;
    const util = new Utils(state, dispatch);
    const { list } = await util.getFilteredPodcastsByChannel(
      channel,
      state.main_state.podcast.search.sortBy,
      100,
      state.main_state.podcast.search.state,
      state.main_state.podcast.search.sort
    );

    const podcastData = list.find(
      ({ BroadCastID }: any) =>
        BroadCastID.toString() === program.BroadCastID.toString()
    );

    if (podcastData == null) {
      redirect(program.PodCastURL);
      return;
    }

    let dropsChannel = ['표준FM', 'FM4U', '오리지널', '코너 다시듣기', '기타'];
    if (state.main_state.general.channel === 'mfm') {
      dropsChannel = ['FM4U', '표준FM', '오리지널', '코너 다시듣기', '기타'];
    }
    dispatch({ type: 'PODCAST_TAB' });
    dispatch({
      type: 'PODCAST_SEARCH',
      search: {
        channel,
        dropsChannel,
      },
    });
    dispatch({ type: 'CHANGE_PODCAST_CHANNEL', channel: 'byChannel' });

    dispatch({
      type: 'PODCAST_IN',
      payload: podcastData,
      channel: 'byChannel',
    });
  }

  function redirect(url: string) {
    const link = document.getElementById('link') as HTMLAnchorElement;
    link.href = url;
    if (url !== '') link.click();
  }
}
