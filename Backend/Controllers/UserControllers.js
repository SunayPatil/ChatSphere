require("dotenv").config();
const userModel = require("../Models/User");
const chatPool = require("../Models/ChatPool");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const { email, name, password } = req.body;
  try {
    const existingUser = await userModel.findOne({
      // username and email both should be unique
      $or: [{ email: email }],
    });
    if (existingUser) {
      return res
        .status(400)
        .send({ message: "User already exist", status: "error" });
    }

    const hashPass = await bcrypt.hash(password, 8);

    const result = await userModel.create({
      email,
      name,
      password: hashPass,
      addedOn: new Date(),
      Chats: [],
      RecoverCode: "",
    });

    const token = jwt.sign(
      { email: result.email, id: result._id },
      process.env.JWT_SECRET
    );
    return res.status(201).send({
      user: result,
      token,
      message: "Account created successfully",
      status: "success",
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Internal server error", status: "error" });
  }
};

// /signin
const signin = async (req, res) => {
  // can think of login with email or username as well
  const { email, password } = req.body;

  try {
    const existingUser = await userModel.findOne({
      email: email,
    });

    if (!existingUser) {
      return res
        .status(404)
        .send({ message: "User not found", status: "error" });
    }

    const matchPassword = await bcrypt.compare(password, existingUser.password);
    if (!matchPassword) {
      return res
        .status(400)
        .send({ message: "Password doesn't match", status: "error" });
    }
    const payload = { id: existingUser._id, email: existingUser.email };
    const secretKey = process.env.JWT_SECRET;

    const token = jwt.sign(payload, secretKey);

    return res.status(201).send({
      user: existingUser,
      token,
      status: "success",
      message: "Successfully login",
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Internal server error", status: "error" });
  }
};

const addChat = async (req, res) => {
  // find rooName in chatRoom of chatPool collection and push chat in it
  const { roomName, chat } = req.body;
  console.log(roomName, chat);

  try {
    // Find the document with the specified room name
    let chatPoolDocument = await chatPool.findOne({});

    // If the document doesn't exist, create a new one
    // if (!chatPoolDocument) {
    //   chatPoolDocument = new chatPool({
    //     chatRooms: new Map(),
    //   });
    // }

    // Get the chatRooms Map from the document or create it if it doesn't exist
    const chatRooms = chatPoolDocument.chatRooms || new Map();

    // Get the array of chat messages for the specified room or create it if it doesn't exist
    const chatRoom = chatRooms.get(roomName) || [];

    // Push the new chat message
    chatRoom.push(chat);

    // Update the chatRooms Map with the new chatRoom
    chatRooms.set(roomName, chatRoom);

    // Update the document with the modified chatRooms Map
    chatPoolDocument.chatRooms = chatRooms;

    // Save the updated or new document to the database
    await chatPoolDocument.save();
    return res.status(201).send({
      message: "Chat added successfully",
      status: "success",
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Internal server error", status: "error", error });
  }
};

const getChat = async (req, res) => {
  const { roomName } = req.params;
  try {
    const chatPoolDocument = await chatPool.findOne({});
    const chatRooms = chatPoolDocument.chatRooms || new Map();
    const chatRoom = chatRooms.get(roomName) || [];
    return res.status(201).send({
      message: "Chat fetched successfully",
      status: "success",
      chats: chatRoom,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Internal server error", status: "error", error });
  }
};

const userList = async (req, res) => {
  try {
    const users = await userModel.find({});
    return res.status(201).send({
      message: "User list fetched successfully",
      status: "success",
      users,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Internal server error", status: "error", error });
  }
};

module.exports = { signup, signin, addChat, getChat, userList };
