import React, { useContext, useEffect, useState, useRef } from "react";
import backendUrl from "../../utils/baseUrl";
import { io } from "socket.io-client";
import { Spin } from "antd";
import Header from "../Header/Header";
import UserContext from "../../context";
import generateUniqueKey from "../../utils/createRoom";
import { addChat, getChat, getUserList } from "../../utils/apis";
import UserList from "./UserList";
import ChatMessages from "./ChatMessages";
import MessageInput from "./MessageInput";
import "./Chat.css";

const Chat = () => {
  const socket = io.connect(backendUrl);
  const ctx = useContext(UserContext);
  
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [room, setRoom] = useState("groupChatRoom");
  const [headUserName, setHeadUserName] = useState("Community");
  const [headUserImg, setHeadUserImg] = useState("https://i.pinimg.com/564x/c3/25/b7/c325b770f5be36982a47c6fbe2b6e295.jpg");
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [users2, setUsers2] = useState([]);
  const [selfData, setSelfData] = useState(null)
  
  const fetchSelf = async()=>{
    let res = await localStorage.getItem("chatWebApp")
    if(res){
      res = await JSON.parse(res)
      setSelfData(res)
    }
  }

  useEffect(()=>{
    fetchSelf()
  }, [])

  const userDetails = {
    ...ctx?.adminData,
    imgurl: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${ctx?.adminData?.id}`,
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
      setChats((prevData) => [
        ...prevData,
        {
          time: data?.message?.time,
          sender: data?.message?.sender,
          senderEmail: data?.message?.senderEmail,
          message: data?.message?.message,
          imgurl: data?.message?.imgurl,
          id: Math.random().toString(36).substring(6),
        },
      ]);
    });

    return () => {
      socket.off("receive_msg");
    };
  }, [socket, room]);

  const addChatFunc = async () => {
    await addChat(room, {
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
    if (!message) return;
    setChats((prevData) => [
      ...prevData,
      {
        sender: userDetails.name,
        senderEmail: userDetails.email,
        message: message,
        time: new Date(),
        imgurl: userDetails.imgurl,
        id: Math.random().toString(36).substring(6),
      },
    ]);
    try {
      sendMessage();
      addChatFunc();
    } catch (error) {
      setLoading(false);
    }
    setMessage("");
  };

  const handleUserClick = (userId, { userName, userImg }) => {
    if (userId === "groupChatRoom") {
      setRoom("groupChatRoom");
      setHeadUserName(userName);
      setHeadUserImg(userImg);
      return;
    }
    if (userId && userDetails?.id) {
      const newRoom = generateUniqueKey(userId, userDetails?.id);
      setRoom(newRoom);
      if(userId === selfData?.id){
        setHeadUserName(userName + " (You)")
      }else{
        setHeadUserName(userName);
      }
     
      setHeadUserImg(userImg);
    }
  };

  return (
    <>
      <Header  />
      <main className="content">
        <div className="container p-0 mt-3">
          <div className="card">
            <div className="row g-0">
              <UserList
              selfData={selfData}
                users={users}
                userLoading={userLoading}
                fetchUserList={fetchUserList}
                handleUserClick={handleUserClick}
                handleSearchChange={(e) => {
                  const filterUsers = users2.filter(user =>
                    user.name.toLowerCase().includes(e.target.value.toLowerCase())
                  );
                  setUsers(filterUsers);
                }}
              />
              <div className="col-12 col-lg-7 col-xl-9">
                <div className="py-2 px-4 border-bottom d-lg-block">
                  <div className="d-flex align-items-center py-1">
                    <div className="position-relative">
                      <img
                        src={headUserImg}
                        className="rounded-circle mr-1"
                        alt={headUserName}
                        width="40"
                        height="40"
                      />
                    </div>
                    <div className="flex-grow-1 pl-3">
                      <strong>{headUserName}</strong>
                    </div>
                  </div>
                </div>

                <Spin spinning={loading} size="medium">
                  <ChatMessages chats={chats} userDetails={userDetails} />
                </Spin>
                <MessageInput
                  message={message}
                  setMessage={setMessage}
                  handleSendMsgClick={handleSendMsgClick}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Chat;
