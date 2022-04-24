/* eslint-disable @typescript-eslint/ban-types */
import { useState, useContext } from 'react';
import '../../styles/login/login.css';
import naver from '../../assets/player/login/naver.png';
import kakao from '../../assets/player/login/kakao.png';
import closeIcon from '../../assets/player/login/icon-more-right.svg';
import Utils from '../Utils/utils';
import { Context } from '../../context/context/context';

export default function Login() {
  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const { state, dispatch } = useContext(Context);
  const utils = new Utils(state, dispatch);

  const miniClass = state.main_state.mini.isMini ? 'mini' : '';

  return (
    <div
      className={
        state.main_state.general.isLogInScreen
          ? `login__container is__visible ${miniClass}`
          : `login__container ${miniClass}`
      }
    >
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
        <p>iMBC 회원 로그인</p>
      </div>
      <div className="inputs">
        <input
          onChange={(e) => {
            setUsername(e.currentTarget.value);
          }}
          type="text"
          placeholder="아이디를 입력하세요"
          value={username || ''}
        />
        <input
          onChange={(e) => {
            setPassword(e.currentTarget.value);
          }}
          type="text"
          placeholder="비밀번호를 입력하세요"
          value={password || ''}
        />
        <button
          type="submit"
          onClick={() => utils.logInOut(username, password, true)}
        >
          로그인
        </button>
      </div>
      <div className="options">
        <a href="/">아이디 찾기</a>
        <p>|</p>
        <a href="/">비밀번호 찾기</a>
        <p>|</p>
        <a href="/">회원가입</a>
      </div>
      <div className="others">
        <div className="naver">
          <img src={naver} alt="" />
          <p>네이버 계정으로 로그인</p>
        </div>
        <div className="kakao">
          <img src={kakao} alt="" />
          <p>카카오톡 계정으로 로그인</p>
        </div>
        <div className="facebook">
          <img src="" alt="" />
          <p>페이스북 계정으로 로그인</p>
        </div>
      </div>
    </div>
  );
}
