/* eslint-disable @typescript-eslint/naming-convention */
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
  const [myMessages, setMyMessages] = useState<MessagesType['MsgList']>([]);
  const [deletedMsgs, setDeletedMsgs] = useState<MessagesType['MsgList']>([]);
  const [render, setNewRender] = useState(false);

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
          if (res.MiniMsgView === 'N') {
            if (state.user.cookieAvailable) {
              jsonp(
                `${Data.urls.myMsgListApi}?bid=${
                  programs[channel]?.BroadCastID
                }&gid=${programs[channel]?.ProgramGroupID}&page=1&pagesize=${
                  page * 50
                }`,
                {},
                // eslint-disable-next-line @typescript-eslint/no-shadow
                (err, res) => {
                  const arr: typeof myMessages = [];
                  let msgs = res.MsgList || [];
                  for (let i = 0; i < myMessages.length; i += 1) {
                    if (!isAppendedByServer(msgs, myMessages[i])) {
                      msgs = [myMessages[i], ...msgs];
                    } else {
                      arr.push(myMessages[i]);
                    }
                  }
                  setMyMessages(
                    myMessages.filter((msg) => {
                      for (let i = 0; i < arr.length; i += 1) {
                        if (arr[i].RegDate === msg.RegDate) {
                          console.log('removing', arr[i]);
                          return false;
                        }
                      }
                      return true;
                    })
                  );

                  const arr2: typeof deletedMsgs = [];

                  for (let i = 0; i < deletedMsgs.length; i += 1) {
                    if (isDeletedMessage(msgs, deletedMsgs[i])) {
                      msgs = [...msgs.slice(0, i), ...msgs.slice(i + 1)];
                    } else {
                      arr2.push(deletedMsgs[i]);
                    }
                  }
                  setDeletedMsgs(
                    deletedMsgs.filter((msg) => {
                      for (let i = 0; i < arr2.length; i += 1) {
                        if (arr2[i].SeqID === msg.SeqID) {
                          return false;
                        }
                      }
                      return true;
                    })
                  );

                  setMessages(msgs);
                }
              );
            } else {
              setMessages([]);
            }
          } else {
            const discard: typeof myMessages = [];
            for (let i = 0; i < myMessages.length; i += 1) {
              if (!isAppendedByServer(temp, myMessages[i])) {
                console.log('not appended by server yet');
                temp = [myMessages[i], ...temp];
              } else {
                discard.push(myMessages[i]);
              }
            }

            setMyMessages(
              myMessages.filter((msg) => {
                for (let i = 0; i < discard.length; i += 1) {
                  if (discard[i].RegDate === msg.RegDate) {
                    console.log('appended by server');
                    return false;
                  }
                }
                return true;
              })
            );

            const discard2: typeof deletedMsgs = [];
            for (let i = 0; i < deletedMsgs.length; i += 1) {
              const a = isDeletedMessage(temp, deletedMsgs[i]);
              if (a >= 0) {
                console.log('not deleted by server yet');
                temp = [...temp.slice(0, a), ...temp.slice(a + 1)];
              } else {
                discard2.push(deletedMsgs[i]);
              }
            }
            const newDeletedMsgs = deletedMsgs.filter((msg) => {
              for (let i = 0; i < discard2.length; i += 1) {
                if (discard2[i].RegDate === msg.RegDate) {
                  console.log('already deleted by server');
                  return false;
                }
              }
              return true;
            });
            // console.log(newDeletedMsgs);

            setDeletedMsgs(newDeletedMsgs);

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
  }, [state.main_state.general.channel, currentBrodID, page, myMessOn, render]);

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
                      appendDeletedMsg={appendDeletedMsg}
                      render={render}
                      setNewRender={setNewRender}
                      readCookie={readCookie}
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
            appendDeletedMsg={appendDeletedMsg}
            render={render}
            readCookie={readCookie}
            setNewRender={setNewRender}
          />
        )}
        {visibility !== 'X' && (
          <MessageWrite
            dispatch={dispatch}
            state={state}
            render={render}
            setNewRender={setNewRender}
            appendMyMessage={appendMyMessage}
            readCookie={readCookie}
          />
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

  function isAppendedByServer(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    messages: MessagesType['MsgList'],
    msg: MessagesType['MsgList'][0]
  ) {
    for (let i = 0; i < messages.length; i += 1) {
      if (
        messages[i].Comment === msg.Comment &&
        messages[i].UserNm === msg.UserNm &&
        isTimeTheSame(messages[i].RegDate.slice(14), msg.RegDate.slice(14))
      ) {
        return true;
      }
    }

    return false;
  }

  function isTimeTheSame(time1: string, time2: string): boolean {
    const time1_arr = time1.split(':');
    const time2_arr = time2.split(':');
    const time1_num =
      parseInt(time1_arr[0], 10) * 3600 +
      parseInt(time1_arr[1], 10) * 60 +
      parseInt(time1_arr[2], 10);

    const time2_num =
      parseInt(time2_arr[0], 10) * 3600 +
      parseInt(time2_arr[1], 10) * 60 +
      parseInt(time2_arr[2], 10);
    return Math.abs(time1_num - time2_num) <= 5;
  }

  function appendMyMessage(message: MessagesType['MsgList'][0]) {
    setMyMessages([...myMessages, message]);
  }

  function isDeletedMessage(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    messages: MessagesType['MsgList'],
    msg: MessagesType['MsgList'][0]
  ) {
    for (let i = 0; i < messages.length; i += 1) {
      if (msg.SeqID === messages[i].SeqID) {
        return i;
      }
    }
    return -1;
  }

  function appendDeletedMsg(message: MessagesType['MsgList'][0]) {
    setDeletedMsgs([...deletedMsgs, message]);
  }

  function readCookie(name: string) {
    if (state.user.mainUser) {
      const nameEQ = `${name}=`;
      const ca = state.user.mainUser.UserInfo.IMBCCookie.split(';');
      for (let i = 0; i < ca.length; i += 1) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0)
          return c.substring(nameEQ.length, c.length);
      }
    }
    return null;
  }
}
