import '../../styles/player/player.css';
import { useContext } from 'react';
import Image from './ProgramImage/Image';
import Controls from './Controls/Controls';
import { Context } from '../../context/context/context';

export default function Player() {
  const { state } = useContext(Context);
  return (
    <div
      className={
        state.main_state.general.isLogInScreen
          ? 'player__container login__visible'
          : 'player__container'
      }
    >
      <Image />
      <div className="extra" />
      <Controls />
    </div>
  );
}
