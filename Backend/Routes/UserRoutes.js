const express = require("express");
const userRoute = express.Router();
const {
  signup,
  signin,
  addChat,
  getChat,
  userList,
} = require("../Controllers/UserControllers");

userRoute.post("/signup", signup);
userRoute.post("/signin", signin);
userRoute.put("/addChat", addChat);
userRoute.get("/getChat/:roomName", getChat);
userRoute.get("/userList", userList);

module.exports = userRoute;
