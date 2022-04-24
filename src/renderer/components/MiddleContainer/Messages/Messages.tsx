/* eslint-disable promise/always-return */
import { useEffect, useState, useContext, useRef } from 'react';
import jsonp from 'jsonp';
import Data from '../../../context/utils/data';
import { Context } from '../../../context/context/context';
import { MessagesType } from '../../../context/utils/types';
import Message from './components/Message';
import Navbar from './components/Navbar';
import TitleMessage from './components/TitleMessage';
import NoMessage from './components/NoMessage';
import WriteOnly from './components/WriteOnly';
import '../../../styles/messages/messages.css';
import MessageWrite from './components/MessageWrite';
/**
 * We update current messages every three seconds. You can change it by changing time in setInterval inside useEffect
 */

type Props = {
  navbarVisible: boolean;
};

export default function Messages({ navbarVisible }: Props) {
  const [messages, setMessages] = useState<MessagesType['MsgList'] | null>(
    null
  );
  const [page, setPage] = useState<number>(1); // to set page size in fetching messages
  const { state, dispatch } = useContext(Context);
  const listInnerRef = useRef<HTMLDivElement>(null);
  const [visibility, setVisibility] = useState<string>('Y');
  const [titleMsg, setTitleMsg] = useState<MessagesType['MsgList'][0] | null>(
    null
  );
  const [myMessOn, setMyMessOn] = useState(false);

  const currentBrodID =
    state.main_state.general.currentPrograms[state.main_state.general.channel]
      ?.BroadCastID;

  // to fetch messages
  useEffect(() => {
    async function getMessages() {
      const { channel } = state.main_state.general;
      const programs = state.main_state.general.currentPrograms;
      const promise = new Promise<MessagesType>((resolve, reject) => {
        const url = `${Data.urls.messageListApi}?rtype=jsonp&bid=${
          programs[channel]?.BroadCastID
        }&gid=${programs[channel]?.ProgramGroupID}&page=1&pagesize=${
          page * 50
        }`;
        jsonp(url, {}, (err, data) => {
          if (err) reject(err);
          else {
            resolve(data);
            // console.log(data);
          }
        });
      });

      promise
        .then((res) => {
          let temp = res.MsgList;
          if (temp && temp.length > 0) {
            setTitleMsg(parseInt(temp[0].Rank, 10) > 0 ? temp[0] : null);
            if (parseInt(temp[0].Rank, 10) > 0) {
              temp = [...temp.slice(1)];
            }
          }

          setVisibility(res.MiniMsgView);
          if (res.MiniMsgView === 'N' || myMessOn) {
            temp = temp.filter((elem) => {
              if (state.user.mainUser) {
                return elem.UserID === state.user.mainUser.UserInfo.UserID;
              }
              return false;
            });
          } else {
            setMessages(temp);
          }
        })
        .catch((err) => {
          console.log('Error in getting messages:', err);
        });
    }
    if (
      state.main_state.general.currentPrograms.sfm ||
      state.main_state.general.currentPrograms.mfm
    ) {
      // we are checking if currentPrograms are already set with example of sfm and mfm channel
      getMessages();
      const timer = window.setInterval(() => {
        getMessages();
      }, 10000);

      return () => {
        window.clearInterval(timer);
      };
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.main_state.general.channel, currentBrodID, page, myMessOn]);

  useEffect(() => {
    setPage(1);
    const messagesContainer = document.getElementById(
      'messages'
    ) as HTMLDivElement;

    if (messagesContainer) {
      messagesContainer.scrollTop = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.main_state.general.channel,
    visibility,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.getElementById('messages'),
  ]);

  return (
    <div
      className={
        state.main_state.mini.isMini
          ? 'messages__container mini'
          : 'messages__container'
      }
    >
      {navbarVisible && (
        <Navbar
          messageVisibility={visibility}
          getMyMessages={getMyMessagesOnly}
          myMess={myMessOn}
        />
      )}
      <div
        onScroll={OnScroll}
        id="messages"
        ref={listInnerRef}
        className="messages"
      >
        {visibility && visibility === 'Y' ? (
          messages &&
          messages.length > 0 && (
            <>
              <div className="msg__people">
                {titleMsg && (
                  <TitleMessage
                    checkIfWrittenToday={checkIfWrittenToday}
                    message={titleMsg}
                    mini={state.main_state.mini.isMini}
                  />
                )}
                {messages.map((message) => {
                  return (
                    <Message
                      state={state}
                      message={message}
                      key={message.SeqID}
                      checkIfWrittenToday={checkIfWrittenToday}
                    />
                  );
                })}
              </div>
            </>
          )
        ) : visibility === 'X' ? (
          <NoMessage />
        ) : (
          <WriteOnly
            state={state}
            messages={messages || []}
            checkIfWrittenToday={checkIfWrittenToday}
          />
        )}
        {visibility !== 'X' && (
          <MessageWrite dispatch={dispatch} state={state} />
        )}
      </div>
    </div>
  );

  function OnScroll() {
    if (listInnerRef.current) {
      const { scrollHeight, scrollTop, clientHeight } = listInnerRef.current;
      if (clientHeight + scrollTop > scrollHeight - 20) {
        setPage(page + 1);
      }
    }
  }

  function checkIfWrittenToday(date: string) {
    const today = new Date();
    const temp = new Date(Date.parse(date.slice(0, 10)));

    if (
      temp.getFullYear() === today.getFullYear() &&
      temp.getMonth() === today.getMonth() &&
      temp.getDate() === today.getDate()
    ) {
      return date.slice(10);
    }
    return date;
  }

  function getMyMessagesOnly(param: boolean) {
    setMyMessOn(param);
  }
}
