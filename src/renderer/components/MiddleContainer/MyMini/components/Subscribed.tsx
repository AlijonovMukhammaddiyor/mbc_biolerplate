/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useState, useContext } from 'react';
import $ from 'jquery';
import Utils from 'renderer/components/Utils/utils';
import { RecommendedPodcast } from '../../../../context/utils/types';
import iconCheckboxOff from '../../../../assets/middle/mymini/check-box-off.svg';
import iconCheckboxOn from '../../../../assets/middle/mymini/check-box-on.svg';
import { Context } from '../../../../context/context/context';
import Data from '../../../../context/utils/data';
import '../../../../styles/subscribedPrograms/subscribed.css';
import DeletePrompt from './DeletePrompt';

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
        setPrograms(content);
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
          title="구독 취소하시겠습니까"
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

            {isDeleting && <p className="all">전체</p>}
            {isDeleting && (
              <p
                onClick={showPrompt}
                className={deleting.length > 0 ? 'delete enabled' : 'delete'}
              >
                삭제
              </p>
            )}
          </div>
          <div className="right">
            <p onClick={() => setIsDeleting(!isDeleting)} className="delete">
              {isDeleting ? '완료' : '편집'}
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
                />

                <div className={isDeleting ? 'info deleting' : 'info'}>
                  <p className="program__title">{program.Title}</p>
                  <p className="program__subtitle">{program.SubTitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : state.user.cookieAvailable ? (
        <div className="no__subscribed">
          <p>현재 구독 중인 프로그램이 없습니다.</p>
        </div>
      ) : (
        <div className="no__program">
          <div>
            <p>팟캐스트 프로그램 구독은</p>
            <p>로그인 후 이용 가능합니다.</p>
          </div>
          <div className="login__direct__btn">
            <button
              type="submit"
              onClick={() => dispatch({ type: 'SHOW_LOGIN_SCREEN' })}
              className="login__btn"
            >
              iMBC 로그인
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
    handleDoneClick();
    setUpdate(!update);
  }

  function handleDoneClick() {
    programs.every((program) => {
      program.gettingDeleted = false;
      return true;
    });
  }
}
