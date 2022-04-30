/* eslint-disable @typescript-eslint/ban-types */
import { useContext } from 'react';
import { Context } from '../../../context/context/context';
import OnOff from './components/OnOff';
import '../../../styles/settings/settings.css';
import iconAccount from '../../../assets/middle/menu-icon-login.svg';
import iconClose from '../../../assets/middle/pop-icon-close.svg';
import iconSettingRedirect from '../../../assets/middle/setting-i-bt.svg';
import iconMbc from '../../../assets/middle/mbc-logo_version.svg';
import iconIMbc from '../../../assets/middle/imbc-logo_version.svg';
import iconChat from '../../../assets/middle/setting-i-1.svg';
import iconCall from '../../../assets/middle/icon-info-phone.svg';
import iconAsk from '../../../assets/middle/setting-i-fap.svg';

export default function Settings() {
  const { state, dispatch } = useContext(Context);

  return (
    <div className="settings__container">
      <img
        onClick={() => dispatch({ type: 'CLOSE_SETTINGS' })}
        src={iconClose}
        className="icon__close"
        alt=""
      />
      <div className="user__login">
        <img src={iconAccount} alt="" />
        <div className="info">
          {state.user.cookieAvailable ? (
            <>
              <p className="name">
                {state.user.mainUser?.UserInfo?.UserName} 님
              </p>
              <button
                onClick={() => {
                  window.electron.ipcRenderer.send('logout', {});
                  dispatch({ type: 'LOGOUT' });
                }}
                type="button"
                className="logout"
              >
                로그아웃
              </button>
              <button className="modify" type="button">
                <a
                  href="https://member.imbc.com/User/Info/ModifyUserCheck.aspx"
                  target="_blank"
                  rel="noreferrer"
                >
                  회원정보 수정/탈퇴
                </a>
              </button>
            </>
          ) : (
            <>
              <p
                onClick={() => dispatch({ type: 'SHOW_LOGIN_SCREEN' })}
                className="login__prompt"
              >
                iMBC 로그인
              </p>
              <p>
                <a
                  href="https://member.imbc.com/User/Join/Agree.aspx"
                  className="join__prompt"
                  target="_blank"
                  rel="noreferrer"
                >
                  아직 회원이 아니신가요?
                </a>
              </p>
            </>
          )}
        </div>
      </div>

      <div className="main">
        <div className="preferences">
          <p className="title">환경설정</p>
          <div className="options">
            <div>
              <p>PC 시작 시 자동실행</p>
              <OnOff
                handleChange={handleChangeAutomatic}
                on={state.main_state.settings.autostart}
                id="autostart"
              />
            </div>
            <div>
              <p>항상 맨 위에</p>
              <OnOff
                handleChange={handleChangeOnTop}
                on={state.main_state.settings.onTop}
                id="onTop"
              />
            </div>
            <div>
              <p>보이는 라디오 온에어 알림</p>
              <OnOff
                handleChange={handleChangeVideoNotice}
                on={state.main_state.settings.videoNotice}
                id="notice"
              />
            </div>
          </div>
        </div>
        <div className="links">
          <div>
            <p>개인정보 처리방침</p>
            <a
              href="http://help.imbc.com/rules/privacy.html"
              target="_blank"
              rel="noreferrer"
            >
              <img src={iconSettingRedirect} alt="" />
            </a>
          </div>
          <div>
            <p>라디오 공지사항</p>
            <a
              href="https://www.imbc.com/broad/radio/notice/index.html"
              target="_blank"
              rel="noreferrer"
            >
              <img src={iconSettingRedirect} alt="" />
            </a>{' '}
          </div>
          <div>
            <p>라디오 광고 협찬 안내</p>
            <a
              href="http://www.imbc.com/broad/radio/radioads/index.html"
              target="_blank"
              rel="noreferrer"
            >
              <img src={iconSettingRedirect} alt="" />
            </a>{' '}
          </div>
          <div>
            <p>APP 버전 V3.0.0</p>
            <img src={iconMbc} alt="" />
            <span className="and">&</span>
            <img src={iconIMbc} alt="" />
          </div>
        </div>
      </div>
      <div className="footer">
        <div>
          <a
            href="https://help.imbc.com/Inquiry/pc_index"
            target="_blank"
            rel="noreferrer"
          >
            <img src={iconChat} alt="" />
          </a>
          <p className="chat">1:1문의하기</p>
        </div>
        <div>
          <img src={iconCall} alt="" />
          <div>
            <p>02-789-0011</p>
            <p>02-780-0011</p>
          </div>
        </div>
        <div>
          <a
            href="https://help.imbc.com/faq/pc_index"
            target="_blank"
            rel="noreferrer"
          >
            <img src={iconAsk} alt="" />
          </a>
          <p className="faq">FAQ</p>
        </div>
      </div>
    </div>
  );

  function handleChangeAutomatic() {
    window.electron.ipcRenderer.send('auto-start', {
      autoStart: !state.main_state.settings.autostart,
    });

    dispatch({
      type: 'CHANGE_SETTINGS',
      autostart: !state.main_state.settings.autostart,
      videoNotice: state.main_state.settings.videoNotice,
      onTop: state.main_state.settings.onTop,
    });
  }

  function handleChangeOnTop() {
    window.electron.ipcRenderer.send('always-top', {
      onTop: !state.main_state.settings.onTop,
    });
    dispatch({
      type: 'CHANGE_SETTINGS',
      autostart: state.main_state.settings.autostart,
      videoNotice: state.main_state.settings.videoNotice,
      onTop: !state.main_state.settings.onTop,
    });
  }

  function handleChangeVideoNotice() {
    // window.electron.ipcRenderer.send('video-notification', {});
    dispatch({
      type: 'CHANGE_SETTINGS',
      autostart: state.main_state.settings.autostart,
      videoNotice: !state.main_state.settings.videoNotice,
      onTop: state.main_state.settings.onTop,
    });
  }
}
