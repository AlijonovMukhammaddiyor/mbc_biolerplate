/* eslint-disable @typescript-eslint/ban-types */
import { useState, useContext, useEffect } from 'react';
import '../../styles/login/login.css';
import naver from '../../assets/player/login/naver.png';
import kakao from '../../assets/player/login/kakao.png';
import facebook from '../../assets/player/login/facebook.jpeg';
import closeIcon from '../../assets/player/login/icon-more-right.svg';
import Utils from '../Utils/utils';
import emptyCheck from '../../assets/middle/mymini/check-box-off.svg';
import filledCheck from '../../assets/middle/mymini/check-box-on.svg';
import { Context } from '../../context/context/context';
import LoginAlert from './LoginAlert';

type UserInfo = {
  UserID: string;
  UserName: string;
  UNO: string;
  IMBCCookie: string;
};

type LoginResult = {
  ReturnMsg: string;
  ButtonList: {
    ActionURL: string;
    ClickAction: string;
    Title: string;
  }[];
  UserInfo: UserInfo | null;
};

export default function Login() {
  const { state, dispatch } = useContext(Context);
  const [username, setUsername] = useState<string | null>(
    state.main_state.login.IDremember ? state.main_state.login.id : null
  );
  const [password, setPassword] = useState<string | null>(
    state.main_state.login.IDremember ? state.main_state.login.password : null
  );
  const [loginResult, setLoginResult] = useState<LoginResult | null>(null);

  const utils = new Utils(state, dispatch);
  const miniClass = state.main_state.mini.isMini ? 'mini' : '';

  const sendSNSLoginToMain = (snsType: string) => {
    window.electron.ipcRenderer.send('sns-login', { snsType });
  };

  const getSNSUserCookie = async ({ data }: any) => {
    if (data.State && data.State[0] !== 'E') {
      dispatch({ type: 'LOGIN', mainUser: data });
      window.electron.ipcRenderer.send('set-cookie', {
        cookie: data.UserInfo.IMBCCookie,
        domain: 'https://miniapi.imbc.com',
      });
      dispatch({ type: 'HIDE_LOGIN_SCREEN' });
    }
  };

  const login = async () => {
    try {
      const result = await utils.logInOut(username, password, true);
      if (result?.State !== 'S') {
        setLoginResult(result);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    window.electron.ipcRenderer.receive('sns-login-success', (_, args) =>
      getSNSUserCookie(args)
    );
    if (
      state.main_state.login.autoLogin &&
      state.main_state.login.id !== '' &&
      state.main_state.login.password !== ''
    ) {
      utils.logInOut(
        state.main_state.login.id,
        state.main_state.login.password,
        true
      );
    }
    return () => {
      window.electron.ipcRenderer.removeListener(
        'sns-login-success',
        getSNSUserCookie
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={
        state.main_state.general.isLogInScreen
          ? `login__container is__visible ${miniClass}`
          : `login__container ${miniClass}`
      }
    >
      {loginResult && (
        <LoginAlert
          loginResult={loginResult}
          closeAlert={() => setLoginResult(null)}
          onNextChangeSuccess={() =>
            utils.setUserInfo({
              username,
              password,
              data: loginResult,
            })
          }
        />
      )}
      <button
        type="button"
        onClick={() => {
          dispatch({ type: 'HIDE_LOGIN_SCREEN' });
        }}
        className="close__icon"
      >
        <img src={closeIcon} alt="" />
      </button>

      <div className="title">
        <p>iMBC ?????? ?????????</p>
      </div>
      <div className="inputs">
        <input
          onChange={(e) => {
            setUsername(e.currentTarget.value);
          }}
          type="text"
          placeholder="???????????? ???????????????"
          value={username || ''}
        />
        <input
          onChange={(e) => {
            setPassword(e.currentTarget.value);
          }}
          type="password"
          placeholder="??????????????? ???????????????"
          value={password || ''}
        />
        <button type="submit" onClick={login}>
          ?????????
        </button>
        <div className="checks">
          <div className="id__remember">
            <img
              src={state.main_state.login.IDremember ? filledCheck : emptyCheck}
              alt=""
              onClick={() => {
                dispatch({
                  type: 'LOGIN_ID_REMEMBER',
                  remember: !state.main_state.login.IDremember,
                });
              }}
            />
            <p>ID ??????</p>
          </div>

          <div className="autologin">
            <img
              src={state.main_state.login.autoLogin ? filledCheck : emptyCheck}
              alt=""
              onClick={() => {
                dispatch({
                  type: 'LOGIN_AUTOLOGIN',
                  autoLogin: !state.main_state.login.autoLogin,
                });
              }}
            />
            <p>???????????????</p>
          </div>
        </div>
      </div>
      <div className="options">
        <a
          href="https://member.imbc.com/User/Info/FindID.aspx"
          target="_blank"
          rel="noreferrer"
        >
          ????????? ??????
        </a>
        <p>|</p>
        <a
          href="https://member.imbc.com/User/Info/FindPW.aspx"
          target="_blank"
          rel="noreferrer"
        >
          ???????????? ??????
        </a>
        <p>|</p>
        <a
          href="https://member.imbc.com/User/Join/Agree.aspx"
          target="_blank"
          rel="noreferrer"
        >
          ????????????
        </a>
      </div>
      <div className="others">
        <button
          type="button"
          className="naver"
          onClick={() => {
            sendSNSLoginToMain('naver');
          }}
        >
          <img src={naver} alt="" />
          <p>????????? ???????????? ?????????</p>
        </button>
        <button
          type="button"
          className="kakao"
          onClick={() => {
            sendSNSLoginToMain('kakao');
          }}
        >
          <img src={kakao} alt="" />
          <p>???????????? ???????????? ?????????</p>
        </button>
        <button
          className="facebook"
          onClick={() => {
            sendSNSLoginToMain('facebook');
          }}
          type="button"
        >
          <img src={facebook} alt="" />
          <p>???????????? ???????????? ?????????</p>
        </button>
      </div>
    </div>
  );
}
