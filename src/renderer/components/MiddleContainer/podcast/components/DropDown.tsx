import { CSSProperties, useState } from 'react';
import '../../../../styles/dropdown/dropdown.css';
import iconDown from '../../../../assets/player/podcast/icon-option.svg';

type Props = {
  names: string[];
  setName: (name: string) => void;
};

export default function DropDown({ names, setName }: Props) {
  //   const [choice, setChoice] = useState<Channels | null>(null);
  const [drop, setDrop] = useState(false);

  const style = {
    height: `${34 * names.length}px`,
    borderBottom: '1px solid #cacacf',
  } as CSSProperties;

  return (
    <div className="dropdown" style={drop ? style : {}}>
      <div
        onClick={() => setDrop(!drop)}
        className="option default"
        role="list"
      >
        <p className="name">{names[0]}</p>
        <div className="separator" />
        <img
          className={drop ? 'icon_up' : ''}
          onClick={() => setDrop(!drop)}
          src={iconDown}
          alt=""
        />
      </div>
      {names.map((name, index) => {
        if (index !== 0) {
          return (
            <div
              key={name}
              onClick={() => {
                setName(names[index]);
                setDrop(false);
              }}
              className={index === names.length - 1 ? 'option last' : 'option'}
              role="list"
            >
              <p className="name">{names[index]}</p>
            </div>
          );
        }
        return <div key={name} />;
      })}
    </div>
  );
}
