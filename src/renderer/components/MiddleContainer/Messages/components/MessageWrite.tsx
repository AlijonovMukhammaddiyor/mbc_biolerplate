/* eslint-disable @typescript-eslint/ban-types */
import { useState } from 'react';
import $ from 'jquery';
import { MessagesType, STATE } from '../../../../context/utils/types';
import '../../../../styles/messageWrite/msgWrite.css';
import Data from '../../../../context/utils/data';

type Props = {
  state: STATE;
  dispatch: <T extends object>(obj: T) => void;
  setNewRender: Function;
  render: boolean;
  appendMyMessage: Function;
  readCookie: Function;
};

export default function MessageWrite({
  setNewRender,
  render,
  state,
  readCookie,
  dispatch,
  appendMyMessage,
}: Props) {
  const [myMessage, setMyMessage] = useState<string>('');

  return (
    <div className="message__write__container">
      {state.user.cookieAvailable ? (
        <input
          type="text"
          className="text"
          placeholder="mini 메시지 작성(200자 내외)"
          value={myMessage}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              registerMessage();
            }
          }}
          onChange={(e) => {
            setMyMessage(e.currentTarget.value);
          }}
        />
      ) : (
        <div className="text">
          <button
            type="button"
            onClick={() => {
              dispatch({ type: 'SHOW_LOGIN_SCREEN' });
            }}
          >
            <p>로그인</p>
          </button>
          후 이용해주세요
        </div>
      )}
      <button
        type="submit"
        onClick={registerMessage}
        className={
          state.user
            ? state.user.cookieAvailable
              ? 'register is__user'
              : 'register '
            : 'register '
        }
      >
        등록
      </button>
    </div>
  );

  async function registerMessage() {
    const BroadCastID =
      state.main_state.general.currentPrograms[state.main_state.general.channel]
        ?.BroadCastID;
    const groupID =
      state.main_state.general.currentPrograms[state.main_state.general.channel]
        ?.ProgramGroupID;

    if (
      state.user.cookieAvailable &&
      BroadCastID &&
      groupID &&
      state.user.mainUser
    )
      $.ajax({
        url: Data.urls.msgRegisterPCApi,
        type: 'POST',
        data: $.param({
          bid: parseInt(BroadCastID!, 10),
          gid: parseInt(groupID!, 10),
          Comment: myMessage,
          Uno: `${state.user.mainUser.UserInfo.UNO}`,
          Username: state.user.mainUser.UserInfo.UserName,
          UserID: state.user.mainUser.UserInfo.UserID,
          Type: '1',
          Device: 'pcApp',
          Cookieinfo: readCookie('IMBCSession'),
          Agent: `${window.navigator.userAgent}`,
        }),
        dataType: 'json',
        crossDomain: true,
        xhrFields: {
          withCredentials: true,
        },
        success: (data: any) => {
          const date = new Date();
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const day = date.getDate();

          const part1 = `${year}-${month < 10 ? `0${month}` : month}-${
            day < 10 ? `0${day}` : day
          }`;

          const seconds = date.getSeconds();
          const minutes = date.getMinutes();
          let hour = date.getHours();
          const ampm = hour >= 12 ? '오후' : '오전';
          if (hour > 12) {
            hour -= 12;
          }

          console.log('name:', readCookie('IMBCMAIN'));

          const msg: MessagesType['MsgList'][0] = {
            Rank: '0',
            Comment: myMessage,
            RegDate: `${part1} ${ampm} ${hour}:${
              minutes < 10 ? `0${minutes}` : minutes
            }:${seconds < 10 ? `0${seconds}` : seconds}`,
            SeqID: -1,
            Uno: 0,
            UserID: readCookie('IMBCMAIN') || '',
            UserNm: `${unescape(readCookie('IMBCNAME') || '')}`,
          };
          appendMyMessage(msg);
          console.log(data);
          console.log('registered message');
          setMyMessage('');
          setNewRender(!render);
        },
        error: (request, status, error) => {
          console.log(
            `code:${request.status}\n` +
              `error:${error}\n` +
              `message:${request.responseText}`
          );
        },
      });
  }
}
