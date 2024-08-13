import React, { useContext, useEffect, useRef, useState } from "react";
import backendUrl from "../../utils/baseUrl";
import { io } from "socket.io-client";

const socket = io.connect(backendUrl);
import "./Chat.css";
import { addChat, getChat, getUserList } from "../../utils/apis";
import UserContext from "../../context";
import generateUniqueKey from "../../utils/createRoom";
import Header from "../Header/Header";
import { Spin } from "antd";

const Chat = () => {
  const ctx = useContext(UserContext);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [room, setRoom] = useState("groupChatRoom");
  const [headUserName, setHeadUserName] = useState("Commnunity");
  const [headUserImg, setheadUserImg] = useState(
    "https://i.pinimg.com/564x/c3/25/b7/c325b770f5be36982a47c6fbe2b6e295.jpg"
  );
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [users2, setUsers2] = useState([]);
  const userDetails = {
    ...ctx?.adminData,
    imgurl: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${ctx?.adminData?.id}`
  };

  const fetchUserList = async () => {
    setUserLoading(true);

    let res = await getUserList();
    setUserLoading(false);
    if (res?.users?.length > 0) {
      setUsers(res.users);
      setUsers2(res.users);
    }
  };

  const sendMessage = async () => {
    socket.emit("send_msg", {
      message: {
        sender: userDetails.name,
        senderEmail: userDetails.email,
        message: message,
        time: new Date(),
        imgurl: userDetails.imgurl,
        id: Math.random().toString(36).substring(6),
      },
      room: [room],
    });
  };

  const joinRoom = () => {
    socket.emit("join_room", room);
  };
  useEffect(() => {
    joinRoom();
    socket.on("receive_msg", (data) => {
      setChats((prvData) => {
        return [
          ...prvData,
          {
            time: data?.message?.time,
            sender: data?.message?.sender,
            senderEmail: data?.message?.senderEmail,
            message: data?.message?.message,
            imgurl: data?.message?.imgurl,
            id: Math.random().toString(36).substring(6),
          },
        ];
      });
    });

    return () => {
      // Unregister the event listener when the component unmounts
      socket.off("receive_msg");
    };
  }, [socket, room]);

  const addChatFunc = async () => {
    let res = await addChat(room, {
      time: new Date(),
      sender: userDetails.name,
      senderEmail: userDetails.email,
      message: message,
      imgurl: userDetails.imgurl,
      id: Math.random().toString(36).substring(6),
    });
  };
  const getChatFunc = async () => {
    setLoading(true);
    let res = await getChat(room);
    if (res?.chats) {
      setChats(res?.chats);
    }
    setLoading(false);
  };
  useEffect(() => {
    try {
      getChatFunc();
      fetchUserList();
    } catch (error) {
      setLoading(false);
      setUserLoading(false);
    }
  }, [room]);

  const handleSendMsgClick = async () => {
    if (message === "") return;
    setChats((prvData) => {
      return [
        ...prvData,
        {
          sender: userDetails.name,
          senderEmail: userDetails.email,
          message: message,
          time: new Date(),
          imgurl: userDetails.imgurl,
          id: Math.random().toString(36).substring(6),
        },
      ];
    });
    try {
      sendMessage();
      addChatFunc();
    } catch (error) {
      setLoading(false);
    }

    setMessage("");
  };
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [message, chats, room]);

  const handleSearchChanage = (e) => {
    // update users
    let temp = users;
    let filterUsers = users2?.filter((user) => {
      return user?.name?.toLowerCase().includes(e.target.value?.toLowerCase());
    });
    setUsers(filterUsers);
  };

  const handleUserClick = (userId, { userName, userImg }) => {
    if (userId === "groupChatRoom") {
      setRoom("groupChatRoom");
      setHeadUserName(userName);
      setheadUserImg(userImg);
      return;
    }
    if (userId?.length > 0 && userDetails?.id?.length > 0) {
      const newRoom = generateUniqueKey(userId, userDetails?.id);
      setRoom(newRoom);
      setHeadUserName(userName);
      setheadUserImg(userImg);
      return;
    } else {
      alert("can't make a new room right now");
    }
  };

  function timeSince(date) {
    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  }
  return (
    <>
      <Header />
      <main className="content">
        <div className="container p-0 mt-3">
          <div className="card">
            <div className="row g-0">
              <div className="col-12 col-lg-5 col-xl-3 border-right">
                <div className="px-1 d-md-block">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <input
                        onChange={handleSearchChanage}
                        type="text"
                        className="form-control my-3"
                        placeholder="Search..."
                      />
                    </div>
                  </div>
                </div>

                <Spin spinning={userLoading} size="small">
                  <div className="user-list chat-messages">
                    <p onClick={() => fetchUserList()} className="refresh-btn">
                      Refresh
                    </p>
                    <div
                      onClick={() =>
                        handleUserClick("groupChatRoom", {
                          userName: "Commnunity",
                          userImg: `https://i.pinimg.com/564x/c3/25/b7/c325b770f5be36982a47c6fbe2b6e295.jpg`,
                        })
                      }
                      className="list-group-item list-group-item-action border-0"
                    >
                      <div className="d-flex align-items-start">
                        <img
                          src={`https://i.pinimg.com/564x/c3/25/b7/c325b770f5be36982a47c6fbe2b6e295.jpg`}
                          className="rounded-circle mr-1"
                          alt="Vanessa Tucker"
                          width="40"
                          height="40"
                        />
                        <div className="flex-grow-1 ml-3">
                          Community
                          {/* <div className="small">
                        <span className="fas fa-circle chat-online"></span>{" "}
                        Online
                      </div> */}
                        </div>
                      </div>
                    </div>
                    {users?.map((user) => {
                      return (
                        <div
                          onClick={() =>
                            handleUserClick(user?._id, {
                              userName: user.name,
                              userImg: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${user?._id}`
                            })
                          }
                          className="list-group-item list-group-item-action border-0"
                        >
                          <div className="d-flex align-items-start">
                            <img
                              src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${user?._id}`}
                              className="rounded-circle mr-1"
                              alt="Vanessa Tucker"
                              width="40"
                              height="40"
                            />
                            <div className="flex-grow-1 ml-3">
                              {user?.name}
                              {/* <div className="small">
                        <span className="fas fa-circle chat-online"></span>{" "}
                        Online
                      </div> */}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Spin>

                <hr className="d-block d-lg-none mt-1 mb-0" />
              </div>
              <div className="col-12 col-lg-7 col-xl-9">
                <div className="py-2 px-4 border-bottom d-lg-block">
                  <div className="d-flex align-items-center py-1">
                    <div className="position-relative">
                      <img
                        src={headUserImg}
                        className="rounded-circle mr-1"
                        alt="Sharon Lessman"
                        width="40"
                        height="40"
                      />
                    </div>
                    <div className="flex-grow-1 pl-3">
                      <strong>{headUserName}</strong>
                      {/* <div className="text-muted small">
                      <em>Typing...</em>
                    </div> */}
                    </div>
                    <div>
                      {/* <button className="btn btn-primary btn-lg mr-1 px-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="feather feather-phone feather-lg"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </button>
                    <button className="btn btn-info btn-lg mr-1 px-3 d-none d-md-inline-block">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="feather feather-video feather-lg"
                      >
                        <polygon points="23 7 16 12 23 17 23 7"></polygon>
                        <rect
                          x="1"
                          y="5"
                          width="15"
                          height="14"
                          rx="2"
                          ry="2"
                        ></rect>
                      </svg>
                    </button>
                    <button className="btn btn-light border btn-lg px-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="feather feather-more-horizontal feather-lg"
                      >
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="19" cy="12" r="1"></circle>
                        <circle cx="5" cy="12" r="1"></circle>
                      </svg>
                    </button> */}
                    </div>
                  </div>
                </div>

                <div className="position-relative">
                  <Spin spinning={loading} size="medium">
                    <div className="chat-messages p-4">
                      {chats?.map((chat) => {
                        return (
                          <div
                            key={chat.id}
                            className={
                              chat?.senderEmail === userDetails?.email
                                ? "chat-message-right pb-4"
                                : "chat-message-left pb-4"
                            }
                          >
                            <div>
                              <img
                                src={chat?.imgurl}
                                className="rounded-circle mr-1"
                                alt="Chris Wood"
                                width="40"
                                height="40"
                              />
                              <div className="text-muted small text-nowrap mt-2">
                                {timeSince(new Date(chat?.time))}
                              </div>
                            </div>
                            <div className="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
                              <div className="font-weight-bold mb-1">
                                {chat?.sender}
                              </div>
                              {chat?.message}
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  </Spin>
                </div>

                <div className="flex-grow-0 py-3 px-4 border-top">
                  <div className="input-group">
                    <input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      type="text"
                      className="form-control"
                      placeholder="Type your message"
                    />
                    &nbsp;&nbsp;
                    <button
                      onClick={handleSendMsgClick}
                      className="btn btn-primary"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Chat;
