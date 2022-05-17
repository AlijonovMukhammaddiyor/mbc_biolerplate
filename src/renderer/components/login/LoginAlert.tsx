import { useState } from 'react';
import iconClose from '../../assets/middle/icon_close.svg';
import '../../styles/loginAlert/loginAlert.css';

type UserInfo = {
  UserID: string;
  UserName: string;
  UNO: string;
  IMBCCookie: string;
};

type Props = {
  loginResult: {
    ReturnMsg: string;
    ButtonList: {
      ActionURL: string;
      ClickAction: string;
      Title: string;
    }[];
    UserInfo: UserInfo | null;
  };
  closeAlert: () => void;
  onNextChangeSuccess: () => void;
};

const NEXT_RECHANGE_ENDPOINT =
  'https://member.imbc.com/api/app/NextReChangePW_PC.ashx';

const getSessionFromCookie = (cookieInfo: string) =>
  cookieInfo
    .split(';')
    .find((str) => str.includes('IMBCSession'))
    ?.split('=')[1];

export default function LoginAlert({
  loginResult,
  closeAlert,
  onNextChangeSuccess,
}: Props) {
  const [changePasswordError, setChangePasswordError] =
    useState<boolean>(false);

  const { ReturnMsg, ButtonList } = loginResult;

  const rechangePassword = async (UserInfo: UserInfo) => {
    try {
      const fetchResult = await fetch(NEXT_RECHANGE_ENDPOINT, {
        method: 'POST',
        body: new URLSearchParams({
          cookieinfo: getSessionFromCookie(UserInfo.IMBCCookie) || '',
          ReturnType: 'JSON',
        }),
      });
      if (!fetchResult.ok) throw new Error(await fetchResult.text());
      const { State, ReturnMsg: changeResult } = await fetchResult.json();

      if (State !== 'S') throw new Error(changeResult);
      onNextChangeSuccess();
    } catch (err) {
      console.error(err);
      setChangePasswordError(true);
    }
  };

  return (
    <div className="login__alert__container">
      <img
        src={iconClose}
        alt=""
        className="icon__close"
        onClick={closeAlert}
      />
      {changePasswordError ? (
        <>
          <div className="alert__message">
            에러가 발생했습니다. 나중에 다시 시도해주세요.
          </div>
          <div className="button__container">
            <button
              type="submit"
              className="confirmation_button"
              onClick={closeAlert}
            >
              확인
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="alert__message">{ReturnMsg}</div>
          <div className="button__container">
            {ButtonList.map(({ ActionURL, ClickAction, Title }) => (
              <button
                type="submit"
                className={
                  ClickAction === 'C' ? 'cancel_button' : 'confirmation_button'
                }
                key={Title}
                onClick={() => {
                  switch (ClickAction) {
                    case 'C':
                      break;
                    case 'N':
                      rechangePassword(loginResult.UserInfo!);
                      return;
                    default:
                      window.electron.ipcRenderer.send(
                        'redirect-to-action-url',
                        {
                          ActionURL,
                        }
                      );
                      break;
                  }
                  closeAlert();
                }}
              >
                {Title}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
