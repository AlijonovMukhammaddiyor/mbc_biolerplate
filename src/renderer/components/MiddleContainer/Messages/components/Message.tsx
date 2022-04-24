import { MessagesType, STATE } from '../../../../context/utils/types';
import '../../../../styles/message/message.css';

type Props = {
  message: MessagesType['MsgList'][0];
  checkIfWrittenToday: (date: string) => string;
  state: STATE;
};

export default function Message({
  message,
  checkIfWrittenToday,
  state,
}: Props) {
  return (
    <div className={isMyMessage() ? ' my__message' : ''}>
      <div className="message">
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
}
