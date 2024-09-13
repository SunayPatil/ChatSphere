import React, { useEffect, useRef } from "react";

const ChatMessages = ({ chats, userDetails }) => {
  const messagesEndRef = useRef()
  useEffect(()=>{
    messagesEndRef.current?.scrollIntoView({})
  }, [chats])
  return (
    <div className="position-relative chat-messages p-4">
      {chats.length > 0 ? (
        chats.map((chat) => (
          <div
            key={chat?.id}
            className={`chat-message-${chat?.senderEmail === userDetails.email ? "right" : "left"} pb-4`}
          >
            <div>
              <img
                src={chat?.imgurl}
                className="rounded-circle mr-1"
                alt={chat?.sender}
                width="40"
                height="40"
              />
              <div className="text-muted small text-nowrap mt-2">
                {new Date(chat?.time).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
            <div className="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
              <div className="font-weight-bold mb-1">{chat?.sender}</div>
              {chat?.message}
            </div>
          </div>
        ))
      ) : (
        <div className="no-messages">No messages to display.</div>
      )}
       <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
