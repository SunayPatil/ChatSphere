const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatPool = new Schema({
  chatRooms: {
    type: Map,
    of: [
      {
        time: Date,
        sender: String,
        message: String,
        imgurl: String,
        id: String,
        senderEmail: String,
      },
    ],
  },
});

module.exports = mongoose.model("chatPool", chatPool);
