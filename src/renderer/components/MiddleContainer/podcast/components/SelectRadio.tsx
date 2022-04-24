import empty from '../../../../assets/player/podcast/icon-option-off.svg';
import selectedIcon from '../../../../assets/player/podcast/icon-option-on.svg';
import '../../../../styles/selectRadio/radio.css';

type Props = {
  names: string[];
  setCat: (index: number) => void;
  selected: number;
};

export default function Radio({ names, selected, setCat }: Props) {
  return (
    <div className="select__radio">
      {names.map((name, index) => {
        return (
          <div className="option" key={name}>
            {index === selected ? (
              <img src={selectedIcon} alt="" />
            ) : (
              <img
                onClick={() => {
                  setCat(index);
                }}
                src={empty}
                alt=""
              />
            )}
            <p>{name}</p>
          </div>
        );
      })}
    </div>
  );
}
