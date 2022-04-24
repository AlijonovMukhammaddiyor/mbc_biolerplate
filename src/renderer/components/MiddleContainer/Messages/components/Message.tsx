import Data from '../../../../context/utils/data';
import { MessagesType, STATE } from '../../../../context/utils/types';
import '../../../../styles/message/message.css';
import iconClose from '../../../../assets/middle/message/mini-icon-close.svg';

type Props = {
  message: MessagesType['MsgList'][0];
  checkIfWrittenToday: (date: string) => string;
  state: STATE;
  // eslint-disable-next-line @typescript-eslint/ban-types
  appendDeletedMsg: Function;
  // eslint-disable-next-line @typescript-eslint/ban-types
  setNewRender: Function;
  render: boolean;
};

export default function Message({
  message,
  checkIfWrittenToday,
  state,
  appendDeletedMsg,
  setNewRender,
  render,
}: Props) {
  return (
    <div className={isMyMessage() ? ' my__message' : ''}>
      <div className="message">
        {isMyMessage() && (
          <img
            onClick={() => deleteMessage()}
            src={iconClose}
            alt="삭제"
            className="close__icon"
          />
        )}
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
    if (program)
      $.ajax({
        url: Data.urls.messageDelApi,
        type: 'POST',
        data: $.param({
          bid: parseInt(program?.BroadCastID, 10),
          gid: parseInt(program?.ProgramGroupID, 10),
          seqID: message.SeqID,
        }),
        dataType: 'json',
        crossDomain: true,
        xhrFields: {
          withCredentials: true,
        },
        success: (data: any) => {
          // console.log("Deleted message", data);
          if (data.Success === 'OK') {
            appendDeletedMsg(message);
          }
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
