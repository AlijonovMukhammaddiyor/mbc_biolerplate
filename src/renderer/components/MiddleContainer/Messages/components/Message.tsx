/* eslint-disable @typescript-eslint/ban-types */
import $ from 'jquery';
import Data from '../../../../context/utils/data';
import { MessagesType, STATE } from '../../../../context/utils/types';
import '../../../../styles/message/message.css';
import iconClose from '../../../../assets/middle/message/mini-icon-close.svg';
import iconCloseDark from '../../../../assets/middle/message/icon_close_black.svg';

type Props = {
  message: MessagesType['MsgList'][0];
  checkIfWrittenToday: (date: string) => string;
  state: STATE;
  appendDeletedMsg: Function;
  setNewRender: Function;
  render: boolean;
  readCookie: Function;
  myMessOn: boolean;
};

export default function Message({
  message,
  checkIfWrittenToday,
  state,
  appendDeletedMsg,
  setNewRender,
  render,
  readCookie,
  myMessOn,
}: Props) {
  console.log(myMessOn);
  const classMyMessOn = myMessOn ? 'my_mess_on' : '';
  return (
    <div
      className={
        isMyMessage()
          ? myMessOn
            ? `message__others ${classMyMessOn}`
            : `my__message`
          : `message__others `
      }
    >
      <div className="message">
        {isMyMessage() ||
          (myMessOn && (
            <img
              onClick={() => deleteMessage()}
              src={myMessOn ? iconCloseDark : iconClose}
              alt="삭제"
              className="close__icon"
            />
          ))}
        <div className="message__arrow" />
        <p className="title">
          {message.UserNm} <span>{checkIfWrittenToday(message.RegDate)}</span>
        </p>
        <p className="content">{message.Comment}</p>
      </div>
    </div>
  );

  function isMyMessage() {
    if (state.user.mainUser) {
      if (
        state.user.mainUser.UserInfo &&
        message.UserID === state.user.mainUser.UserInfo.UserID
      ) {
        return true;
      }
    }
    return false;
  }

  function deleteMessage() {
    const program =
      state.main_state.general.currentPrograms[
        state.main_state.general.channel
      ];

    if (program) {
      console.log('deleting...');
      $.ajax({
        url: Data.urls.messageDelApi,
        type: 'POST',
        data: $.param({
          bid: parseInt(program?.BroadCastID, 10),
          gid: parseInt(program?.ProgramGroupID, 10),
          seqID: message.SeqID,
          cookieinfo: readCookie('IMBCSession'),
        }),
        dataType: 'json',
        crossDomain: true,
        xhrFields: {
          withCredentials: true,
        },
        success: (data: any) => {
          console.log('Deleted message', data);
          if (data.Success === 'OK') {
            console.log('OK...');
            appendDeletedMsg(message);
            setNewRender(!render);
          }
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
}
