import backendUrl from "./baseUrl";
// const baseUrl = 'http://localhost:8000/';

const signupUser = async (email, name, password) => {
  const url = `${backendUrl}user/signup`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      email,
      name,
      password,
    }),
  });
  return await response.json();
};
const signinUser = async (email, password) => {
  const url = `${backendUrl}user/signin`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      email,
      password,
    }),
  });
  return await response.json();
};

const addChat = async (roomName, chat) => {
  console.log(roomName);
  console.log(chat);
  const url = `${backendUrl}user/addChat`;
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      roomName: roomName,
      chat: chat,
    }),
  });
  return await response.json();
};

const getChat = async (roomName) => {
  const url = `${backendUrl}user/getChat/${roomName}`;
  const response = await fetch(url, {
    method: "GET",
  });
  return await response.json();
};

const getUserList = async () => {
  // fetch user list
  const url = `${backendUrl}user/userList`;
  const response = await fetch(url, {
    method: "GET",
  });
  return await response.json();
};

export { addChat, getChat, signupUser, signinUser, getUserList };
