import { useContext } from 'react';
import '../../styles/mini/mini.css';
import { Context } from '../../context/context/context';
import Navbar from './components/Navbar';
import Contorls from './components/Controls';
import Messages from '../MiddleContainer/Messages/Messages';
import Login from '../login/Login';

export default function Mini() {
  const { state, dispatch } = useContext(Context);

  return (
    <div
      className={
        state.main_state.mini.isMessageOpen
          ? 'minimized__container'
          : 'minimized__container message_closed'
      }
    >
      <Login />
      <Navbar />
      <Contorls />
      {state.main_state.mini.isMessageOpen && (
        <Messages navbarVisible={false} />
      )}
    </div>
  );
}
