import { useContext, useEffect, useState } from 'react';
import '../../../styles/miniNavbar/miniNavbar.css';
import { Context } from '../../../context/context/context';
import iconLeft from '../../../assets/mini/icon-ch-left.svg';
import iconRight from '../../../assets/mini/icon-ch-right.svg';
import iconMaximize from '../../../assets/mini/mini-icon-original.svg';
import iconHide from '../../../assets/mini/mini-icon-down.svg';
import iconClose from '../../../assets/mini/mini-icon-close.svg';
import iconLeftOn from '../../../assets/mini/icon-ch-left-on.svg';
import iconRightOn from '../../../assets/mini/icon-ch-right-on.svg';

export default function Navbar() {
  const { state, dispatch } = useContext(Context);
  const [leftIcon, setLeftIcon] = useState(iconLeft);
  const [rightIcon, setRightIcon] = useState(iconRight);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    window.electron.ipcRenderer.send('opacity-change', { opacity });
  }, [opacity]);

  return (
    <div className="mini__navbar__container">
      <div className="top">
        <div className="left">
          <img
            src={leftIcon}
            onMouseEnter={() => setLeftIcon(iconLeftOn)}
            onMouseLeave={() => setLeftIcon(iconLeft)}
            onClick={moveChannelLeft}
            alt=""
          />
          <p className="channel__name">
            {state.main_state.general.channel === 'sfm'
              ? '표준FM'
              : state.main_state.general.channel === 'mfm'
              ? 'FM4U'
              : state.main_state.general.channel === 'chm'
              ? '올댓뮤직'
              : '팟캐스트'}
          </p>
          <img
            src={rightIcon}
            onMouseEnter={() => setRightIcon(iconRightOn)}
            onMouseLeave={() => setRightIcon(iconRight)}
            onClick={moveChannelRight}
            alt=""
          />

          <div className="transparency">
            <input
              tabIndex={-1}
              type="range"
              id="transparent"
              min={0}
              max={10}
              value={opacity * 10}
              onChange={(e) => {
                const target = e.target as HTMLInputElement;
                const val = target.valueAsNumber;
                setOpacity(val / 10);
                console.log(val);
                console.log(target.style.backgroundSize);
                target.style.backgroundSize = `${
                  ((val - 0) * 100) / (10 - 0)
                }% 100%`;
              }}
            />
          </div>
        </div>
        <div className="right">
          <div>
            <img id="max-btn" src={iconMaximize} onClick={maximizeApp} alt="" />
          </div>
          <div>
            <img
              id="hide-btn"
              src={iconHide}
              onClick={() =>
                hideOrClose({
                  close: false,
                  hide: true,
                  minimize: false,
                  maximize: false,
                })
              }
              alt=""
            />
          </div>
          <div>
            <img
              id="close-btn"
              onClick={() =>
                hideOrClose({
                  close: true,
                  hide: false,
                  minimize: false,
                  maximize: false,
                })
              }
              src={iconClose}
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );

  function maximizeApp() {
    dispatch({
      type: 'MINIMIZE_OFF',
    });
    dispatch({
      type: 'AUTOPLAY_SET',
      autoplay: !state.main_state.player.pause,
    });
    window.electron.ipcRenderer.send('toMain', {
      close: false,
      hide: false,
      minimize: false,
      maximize: true,
    });
  }

  function hideOrClose(args: {
    close: boolean;
    hide: boolean;
    minimize: boolean;
    maximize: boolean;
  }) {
    window.electron.ipcRenderer.send('toMain', args);
  }

  function moveChannelLeft() {
    const { channel } = state.main_state.general;
    if (channel === 'sfm') {
      dispatch({ type: 'CHANGE_CHANNEL', channel: 'chm' });
    } else if (channel === 'mfm') {
      dispatch({ type: 'CHANGE_CHANNEL', channel: 'sfm' });
    } else if (channel === 'chm') {
      dispatch({ type: 'CHANGE_CHANNEL', channel: 'mfm' });
    }
  }

  function moveChannelRight() {
    const { channel } = state.main_state.general;
    if (channel === 'sfm') {
      dispatch({ type: 'CHANGE_CHANNEL', channel: 'mfm' });
    } else if (channel === 'mfm') {
      dispatch({ type: 'CHANGE_CHANNEL', channel: 'chm' });
    } else if (channel === 'chm') {
      dispatch({ type: 'CHANGE_CHANNEL', channel: 'sfm' });
    }
  }
}
