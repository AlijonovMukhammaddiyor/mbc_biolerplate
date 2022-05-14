import { CSSProperties, useState } from 'react';
import '../../../../styles/dropdown/dropdown.css';
import iconDown from '../../../../assets/player/podcast/icon-option.svg';

type Props = {
  names: string[];
  dispatch: (p: any) => void;
};

export default function DropDown({ names, dispatch }: Props) {
  //   const [choice, setChoice] = useState<Channels | null>(null);
  const [drop, setDrop] = useState(false);

  const style = {
    height: `${33 * names.length}px`,
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
                let temp = [
                  '표준FM',
                  'FM4U',
                  '오리지널',
                  '코너 다시듣기',
                  '기타',
                ];
                if (names[index] === 'FM4U') {
                  temp = [
                    'FM4U',
                    '표준FM',
                    '오리지널',
                    '코너 다시듣기',
                    '기타',
                  ];
                } else if (names[index] === '오리지널') {
                  temp = [
                    '오리지널',
                    '표준FM',
                    'FM4U',
                    '코너 다시듣기',
                    '기타',
                  ];
                } else if (names[index] === '코너 다시듣기') {
                  temp = [
                    '코너 다시듣기',
                    '표준FM',
                    'FM4U',
                    '오리지널',
                    '기타',
                  ];
                } else if (names[index] === '기타') {
                  temp = [
                    '기타',
                    '표준FM',
                    'FM4U',
                    '오리지널',
                    '코너 다시듣기',
                  ];
                } else if (names[index] === '방송중') {
                  temp = ['방송중', '방송종료'];
                } else if (names[index] === '방송종료') {
                  temp = ['방송종료', '방송중'];
                }

                if (temp.includes('기타'))
                  dispatch({
                    type: 'PODCAST_SEARCH',
                    search: {
                      channel:
                        temp[0] === '표준FM'
                          ? 6
                          : temp[0] === 'FM4U'
                          ? 7
                          : temp[0] === '오리지널'
                          ? 333
                          : temp[0] === '코너 다시듣기'
                          ? 334
                          : 335,
                      dropChannels: temp,
                    },
                  });
                else {
                  dispatch({
                    type: 'PODCAST_SEARCH',
                    search: {
                      state: temp[0] === '방송중' ? 2 : 3,
                      dropStates: temp,
                    },
                  });
                }
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
