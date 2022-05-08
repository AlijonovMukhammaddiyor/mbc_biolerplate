import '../../../../../../styles/channels/chanButton/button.css';
import { Channels } from '../../../../../../context/utils/types';

type Props = {
  changeChannel: (chan: string) => void;
  type: string;
  channel: Channels;
  name: string;
  isPodcastTab: boolean;
};

export default function ChanButton({
  changeChannel,
  type,
  channel,
  name,
  isPodcastTab,
}: Props) {
  return (
    <div className="channel__button">
      <button
        tabIndex={-1}
        type="submit"
        className={`channel__btn ${type}`}
        id={
          isPodcastTab
            ? type === 'podcast'
              ? 'current__channel'
              : ''
            : channel === type
            ? 'current__channel'
            : ''
        }
        onClick={() => changeChannel(type)}
      >
        {name}
      </button>
    </div>
  );
}
