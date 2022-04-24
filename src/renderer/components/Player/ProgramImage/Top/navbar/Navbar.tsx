import { useContext } from 'react';
import logo from '../../../../../assets/player/top/mbcradio-logo.svg';
import settingsIcon from '../../../../../assets/player/top/menu-icon-option.svg';
import accountIcon from '../../../../../assets/player/top/butt-my.svg';
import '../../../../../styles/navbar/navbar.css';
import { Context } from '../../../../../context/context/context';

export default function Navbar() {
  const { dispatch } = useContext(Context);

  return (
    <div className="navbar__container">
      <div className="logo">
        <img src={logo} alt="" className="logo" />
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
          onClick={() => dispatch({ type: 'OPEN_SETTINGS' })}
          className="settings"
          src={settingsIcon}
          alt=""
        />
      </div>
    </div>
  );
}
