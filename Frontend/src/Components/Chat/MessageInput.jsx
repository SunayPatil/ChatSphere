import React from "react";

const MessageInput = ({ message, setMessage, handleSendMsgClick }) => {
  return (
    <div className="flex-grow-0 py-3 px-4 border-top">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Type your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMsgClick()}
        />
        <button className="btn btn-primary" onClick={handleSendMsgClick}>
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
