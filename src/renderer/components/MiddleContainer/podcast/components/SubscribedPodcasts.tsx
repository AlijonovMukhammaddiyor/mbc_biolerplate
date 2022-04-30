import { useState, useEffect, useContext } from 'react';
import Carousel from './Carousel';
import { RecommendedPodcast } from '../../../../context/utils/types';
import Data from '../../../../context/utils/data';
import '../../../../styles/subscribedPodcasts/subscribed.css';
import { Context } from '../../../../context/context/context';

export default function SubscribedPodcasts() {
  const [podcasts, setPodcasts] = useState<RecommendedPodcast[]>([]);
  const { state, dispatch } = useContext(Context);

  useEffect(() => {
    const getSubsPodcasts = async () => {
      if (state.user.cookieAvailable) {
        const rawResponse = await fetch(
          `${Data.urls.subscribedProgramLIstApiPC}?cookieinfo=${readCookie(
            'IMBCSession'
          )}`,
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          }
        );

        const content = await rawResponse.json();

        if (content.length > 0) {
          setPodcasts(content);
        }
      }
    };
    getSubsPodcasts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.user.cookieAvailable, state.user.mainUser?.UserInfo.IMBCCookie]);

  return (
    <div className="subscribed__podcasts">
      <div className="title">
        <p>구독 중인 프로그램</p>
      </div>
      {state.user.cookieAvailable ? (
        <>
          {podcasts.length > 0 ? (
            <div className="podcasts__carousel">
              <Carousel podcasts={podcasts} />
            </div>
          ) : (
            <div className="no__podcasts">
              현재 구독 중인 프로그램이 없습니다.
            </div>
          )}
        </>
      ) : (
        <div className="not__subscribed">
          팟캐스트 프로그램 구독은{' '}
          <span
            onClick={() => dispatch({ type: 'SHOW_LOGIN_SCREEN' })}
            role="list"
          >
            로그인
          </span>{' '}
          후 이용 가능합니다
        </div>
      )}
    </div>
  );

  function readCookie(name: string) {
    if (state.user.mainUser) {
      const nameEQ = `${name}=`;
      const ca = state.user.mainUser.UserInfo.IMBCCookie.split(';');
      for (let i = 0; i < ca.length; i += 1) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0)
          return c.substring(nameEQ.length, c.length);
      }
    }
    return null;
  }
}
