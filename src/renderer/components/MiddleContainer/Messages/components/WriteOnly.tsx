/* eslint-disable @typescript-eslint/ban-types */
import writeonlyIcon from '../../../../assets/middle/message/img_write.svg';
import { MessagesType, STATE } from '../../../../context/utils/types';
import Message from './Message';
import '../../../../styles/writeonly/writeOnly.css';

type Props = {
  messages: MessagesType['MsgList'];
  checkIfWrittenToday: (date: string) => string;
  state: STATE;
  render: boolean;
  setNewRender: Function;
  appendDeletedMsg: Function;
  readCookie: Function;
};

export default function WriteOnly({
  messages,
  checkIfWrittenToday,
  state,
  render,
  setNewRender,
  appendDeletedMsg,
  readCookie,
}: Props) {
  return (
    <div className="write_only__container">
      {messages.length > 0 ? (
        messages.map((msg) => {
          return isMyMessage(msg) ? (
            <Message
              state={state}
              checkIfWrittenToday={checkIfWrittenToday}
              message={msg}
              key={msg.SeqID}
              render={render}
              setNewRender={setNewRender}
              appendDeletedMsg={appendDeletedMsg}
              readCookie={readCookie}
            />
          ) : (
            <></>
          );
        })
      ) : (
        <div className="no__messages_yet">
          <div className="info__text">
            <p>본 프로그램은</p>
            <p>mini 메시지 작성만 가능합니다.</p>
          </div>

          <div className="icon">
            <img src={writeonlyIcon} alt="" />
          </div>
        </div>
      )}
    </div>
  );

  function isMyMessage(message: MessagesType['MsgList'][0]) {
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
}
