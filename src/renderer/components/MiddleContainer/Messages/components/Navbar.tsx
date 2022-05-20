import { useContext, useState } from 'react';
import iconMessOn from '../../../../assets/middle/icon_mess_on.svg';
import iconMessOff from '../../../../assets/middle/message/icon_mess_off.svg';
import iconWriteOn from '../../../../assets/middle/mess_my_on.svg';
import iconWriteOff from '../../../../assets/middle/message/mess_my_off.svg';
import iconListOff from '../../../../assets/middle/icon_list_off.svg';
import iconListOn from '../../../../assets/middle/message/icon_list_on.svg';
import { Context } from '../../../../context/context/context';
import '../../../../styles/mesNavbar/mesNav.css';

type Props = {
  messageVisibility: string;
  getMyMessages: (param: boolean) => void;
  myMess: boolean;
};

export default function Navbar({
  messageVisibility,
  getMyMessages,
  myMess,
}: Props) {
  const { state, dispatch } = useContext(Context);

  return (
    <div className="message__navbar__container">
      <div className="left">
        <div className="message__on_off">
          <button
            type="button"
            onClick={() => dispatch({ type: 'MESSAGES_ON' })}
          >
            <img
              src={
                state.main_state.messages.isMessageTab
                  ? iconMessOn
                  : iconMessOff
              }
              alt=""
            />
          </button>

          <p
            className={
              state.main_state.messages.isMessageTab
                ? 'message_tab'
                : 'not_message_tab'
            }
            style={{ cursor: 'pointer' }}
            onClick={() => dispatch({ type: 'MESSAGES_ON' })}
          >
            mini 메시지
          </p>
        </div>
        {state.user.cookieAvailable &&
          state.main_state.messages.isMessageTab &&
          messageVisibility !== 'X' && (
            <button
              type="button"
              className="my_writings"
              onClick={() => getMyMessages(!myMess)}
            >
              <img src={myMess ? iconWriteOn : iconWriteOff} alt="" />
            </button>
          )}
      </div>
      <div className="right">
        <div className="audio_list">
          <button
            type="button"
            onClick={() => {
              dispatch({ type: 'AUDIO_LIST_ON' });
            }}
          >
            <img
              src={
                state.main_state.messages.isMessageTab
                  ? iconListOff
                  : iconListOn
              }
              alt=""
            />
          </button>

          <p
            className={
              state.main_state.messages.isMessageTab
                ? 'audio_list_off'
                : 'audio_list_on'
            }
          >
            선곡
          </p>
        </div>
      </div>
    </div>
  );
}
