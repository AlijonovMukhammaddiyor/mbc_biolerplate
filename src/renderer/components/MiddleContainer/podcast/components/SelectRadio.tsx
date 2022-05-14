import empty from '../../../../assets/player/podcast/icon-option-off.svg';
import selectedIcon from '../../../../assets/player/podcast/icon-option-on.svg';
import '../../../../styles/selectRadio/radio.css';

type Props = {
  names: string[];
  dispatch: (p: any) => void;
  selected: 'Imp' | 'StartTime' | 'Title';
};

export default function Radio({ names, selected, dispatch }: Props) {
  const selectedNumber = {
    Imp: 0,
    StartTime: 1,
    Title: 2,
  };

  return (
    <div className="select__radio">
      {names.map((name, index) => {
        return (
          <div className="option" key={name}>
            {index === selectedNumber[selected] ? (
              <img src={selectedIcon} alt="" />
            ) : (
              <img
                onClick={() => {
                  dispatch({
                    type: 'PODCAST_SEARCH',
                    search: {
                      sortBy:
                        index === 0
                          ? 'Imp'
                          : index === 1
                          ? 'StartTime'
                          : 'Title',
                    },
                  });
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
