/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useState, useContext } from 'react';
import $ from 'jquery';
import Utils from 'renderer/components/Utils/utils';
import {
  PodcastResponse,
  RecommendedPodcast,
} from '../../../../context/utils/types';
import iconCheckboxOff from '../../../../assets/middle/mymini/check-box-off.svg';
import iconCheckboxOn from '../../../../assets/middle/mymini/check-box-on.svg';
import { Context } from '../../../../context/context/context';
import Data from '../../../../context/utils/data';
import '../../../../styles/subscribedPrograms/subscribed.css';
import DeletePrompt from './DeletePrompt';

type ExtendedPodcast = PodcastResponse['list'][0] & { isSubscribed: boolean };

export default function Subscribed() {
  const [programs, setPrograms] = useState<RecommendedPodcast[]>([]);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<number[]>([]);
  const { state, dispatch } = useContext(Context);
  const utils = new Utils(state, dispatch);
  const [prompt, setPrompt] = useState(false);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    const getSubsPodcasts = async () => {
      if (state.user.cookieAvailable) {
        const rawResponse = await fetch(
          `${
            Data.urls.subscribedProgramLIstApiPC
          }?cookieinfo=${utils.readCookie('IMBCSession')}`,
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          }
        );

        const content = await rawResponse.json();
        content.every((podcast: RecommendedPodcast) => {
          podcast.gettingDeleted = false;
          return true;
        });
        if (content.length > 50) {
          setPrograms(content.slice(0, 50));
        } else setPrograms(content);
      }
    };

    getSubsPodcasts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update]);

  return (
    <div className="subscribed__programs__container">
      {prompt && (
        <DeletePrompt
          deleteSelected={deleteSelected}
          title="?????? ????????????????????????"
        />
      )}
      {programs.length > 0 && (
        <div className="header">
          <div className={isDeleting ? 'left deleting' : 'left'}>
            {isDeleting && (
              <img
                className="checkbox"
                src={
                  deleting.length === programs.length
                    ? iconCheckboxOn
                    : iconCheckboxOff
                }
                alt=""
                onClick={ToggleAll}
              />
            )}

            {isDeleting && <p className="all">??????</p>}
            {isDeleting && (
              <p
                onClick={showPrompt}
                className={deleting.length > 0 ? 'delete enabled' : 'delete'}
              >
                ??????
              </p>
            )}
          </div>
          <div className="right">
            <p onClick={() => setIsDeleting(!isDeleting)} className="delete">
              {isDeleting ? '??????' : '??????'}
            </p>
          </div>
        </div>
      )}

      {programs.length > 0 ? (
        <div className="programs">
          {programs.map((program) => {
            return (
              <div key={program.BroadCastID} className="program">
                {isDeleting && (
                  <img
                    onClick={() => {
                      if (program.gettingDeleted) {
                        setDeleting(
                          deleting.filter((val) => {
                            return program.BroadCastID !== val;
                          })
                        );
                        program.gettingDeleted = false;
                      } else {
                        setDeleting([...deleting, program.BroadCastID]);
                        program.gettingDeleted = true;
                      }
                    }}
                    className="checkbox"
                    src={
                      program.gettingDeleted ? iconCheckboxOn : iconCheckboxOff
                    }
                    alt=""
                  />
                )}
                <img
                  className="program__img"
                  src={program.ItunesImageURL || program.ITunesImageURL}
                  alt=""
                  onClick={() =>
                    enterPodcast({
                      ...program,
                      isSubscribed: true,
                    } as unknown as ExtendedPodcast)
                  }
                />

                <div
                  className={isDeleting ? 'info deleting' : 'info'}
                  onClick={() =>
                    enterPodcast({
                      ...program,
                      isSubscribed: true,
                    } as unknown as ExtendedPodcast)
                  }
                  role="list"
                >
                  <p className="program__title">{program.Title}</p>
                  <p className="program__subtitle">{program.SubTitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : state.user.cookieAvailable ? (
        <div className="no__subscribed">
          <p>?????? ?????? ?????? ??????????????? ????????????.</p>
        </div>
      ) : (
        <div className="no__program">
          <div>
            <p>???????????? ???????????? ?????????</p>
            <p>????????? ??? ?????? ???????????????.</p>
          </div>
          <div className="login__direct__btn">
            <button
              type="submit"
              onClick={() => dispatch({ type: 'SHOW_LOGIN_SCREEN' })}
              className="login__btn"
            >
              iMBC ?????????
            </button>
          </div>
        </div>
      )}
    </div>
  );

  function ToggleAll() {
    if (deleting.length === programs.length) {
      setDeleting([]);
      programs.every((val) => {
        val.gettingDeleted = false;
        return true;
      });
    } else {
      const temp: number[] = [];
      programs.every((val) => {
        temp.push(val.BroadCastID);
        val.gettingDeleted = true;
        return true;
      });

      setDeleting(temp);
    }
  }

  function showPrompt() {
    setPrompt(true);
  }

  function deleteSelected(param: boolean) {
    if (param && deleting.length > 0) {
      const temp = programs.filter(async (val) => {
        if (val.gettingDeleted) {
          await utils.handleSubsClick(
            val.BroadCastID.toString(),
            false,
            setUpdate,
            update,
            (s: string) => {}
          );
        }
        return !val.gettingDeleted;
      });

      setPrograms(temp);

      setDeleting([]);
    }

    setPrompt(false);
    setIsDeleting(false);
    // handleDoneClick();
    setUpdate(!update);
  }

  function handleDoneClick() {
    programs.every((program) => {
      program.gettingDeleted = false;
      return true;
    });
  }

  function enterPodcast(podcast: ExtendedPodcast) {
    dispatch({ type: 'PODCAST_TAB' });
    dispatch({ type: 'CHANGE_PODCAST_CHANNEL', channel: 'home' });
    dispatch({
      type: 'PODCAST_IN',
      payload: podcast,
      channel: state.main_state.podcast.channel,
    });
    dispatch({
      type: 'CLOSE_MY_MINI',
    });
  }
}
