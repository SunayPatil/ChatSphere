const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String, // truck name
  },
  password: {
    type: String,
  },
  email: {
    type: String,
  },
  Chats: {
    type: Object,
  },
  addedOn: {
    type: Date,
  },
  RecoverCode: {
    type: String,
  },
});

module.exports = mongoose.model("user", UserSchema);
