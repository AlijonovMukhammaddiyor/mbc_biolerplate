import React, { useContext, useEffect, useState } from 'react';
import logo from '../../../../../assets/player/top/mbcradio-logo.svg';
import settingsIcon from '../../../../../assets/player/top/menu-icon-option.svg';
import accountIcon from '../../../../../assets/player/top/butt-my.svg';
import '../../../../../styles/navbar/navbar.css';
import { Context } from '../../../../../context/context/context';

export default function Navbar() {
  const { dispatch } = useContext(Context);
  const [opacity, setOpacity] = useState(1);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    window.electron.ipcRenderer.send('opacity-change', { opacity });
  }, [opacity]);

  return (
    <div className="navbar__container">
      <div className="logo">
        <img src={logo} alt="" className="logo" />
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

      <div className="account__settings">
        <img
          onClick={() => {
            dispatch({ type: 'OPEN_MY_MINI' });
            dispatch({ type: 'CLOSE_SETTINGS' });
          }}
          className="account"
          src={accountIcon}
          alt=""
        />
        <img
          onClick={() => {
            dispatch({ type: 'OPEN_SETTINGS' });
            setClicked(!clicked);
          }}
          className={clicked ? 'settings clicked' : 'settings'}
          src={settingsIcon}
          alt=""
        />
      </div>
    </div>
  );
}
