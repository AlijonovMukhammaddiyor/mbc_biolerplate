import { MessagesType } from '../../../../context/utils/types';
import '../../../../styles/titleMsg/titleMsg.css';

type Props = {
  message: MessagesType['MsgList'][0];
  checkIfWrittenToday: (date: string) => string;
  mini: boolean;
};

export default function TitleMessage({
  message,
  checkIfWrittenToday,
  mini,
}: Props) {
  return (
    <div
      className={mini ? 'title_msg__container mini' : 'title_msg__container'}
    >
      <div className="title__msg">
        <p className="title">
          {message.UserNm} <span>{checkIfWrittenToday(message.RegDate)}</span>{' '}
          {}
        </p>
        <p className="content">{message.Comment}</p>
      </div>
    </div>
  );
}
