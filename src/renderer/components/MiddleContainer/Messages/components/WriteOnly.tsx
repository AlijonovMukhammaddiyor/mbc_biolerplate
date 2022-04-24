import writeonlyIcon from '../../../../assets/middle/message/img_write.svg';
import { MessagesType, STATE } from '../../../../context/utils/types';
import Message from './Message';
import '../../../../styles/writeonly/writeOnly.css';

type Props = {
  messages: MessagesType['MsgList'];
  checkIfWrittenToday: (date: string) => string;
  state: STATE;
  render: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  setNewRender: Function;
  // eslint-disable-next-line @typescript-eslint/ban-types
  appendDeletedMsg: Function;
};

export default function WriteOnly({
  messages,
  checkIfWrittenToday,
  state,
  render,
  setNewRender,
  appendDeletedMsg,
}: Props) {
  return (
    <div className="write_only__container">
      {messages.length > 0 ? (
        messages.map((msg) => {
          return (
            <Message
              state={state}
              checkIfWrittenToday={checkIfWrittenToday}
              message={msg}
              key={msg.SeqID}
              render={render}
              setNewRender={setNewRender}
              appendDeletedMsg={appendDeletedMsg}
            />
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
}
