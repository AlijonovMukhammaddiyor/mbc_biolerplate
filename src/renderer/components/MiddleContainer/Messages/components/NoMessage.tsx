import noMessageIcon from '../../../../assets/middle/message/img-no-message.svg';
import '../../../../styles/noMessage/noMessage.css';

export default function NoMessage() {
  return (
    <div className="no_message__container">
      <img src={noMessageIcon} alt="" />
    </div>
  );
}
