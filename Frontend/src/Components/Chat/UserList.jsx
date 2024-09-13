import React from "react";
import { Spin } from "antd";

const UserList = ({ users, userLoading, fetchUserList, handleUserClick, handleSearchChange, selfData }) => {

  return (
    <div className="col-12 col-lg-5 col-xl-3 border-right">
      <div className="px-1 d-md-block">
        <div className="d-flex align-items-center">
          <div className="flex-grow-1">
            <input
              onChange={handleSearchChange}
              type="text"
              className="form-control my-3"
              placeholder="Search..."
            />
          </div>
        </div>
      </div>

      <Spin spinning={userLoading} size="small">
        <div className="user-list chat-messages">
          <p onClick={fetchUserList} className="refresh-btn">Refresh</p>
          <div
            onClick={() =>
              handleUserClick("groupChatRoom", {
                userName: "Community",
                userImg: `https://i.pinimg.com/564x/c3/25/b7/c325b770f5be36982a47c6fbe2b6e295.jpg`,
              })
            }
            className="list-group-item list-group-item-action border-0"
          >
            <div className="d-flex align-items-start">
              <img
                src="https://i.pinimg.com/564x/c3/25/b7/c325b770f5be36982a47c6fbe2b6e295.jpg"
                className="rounded-circle mr-1"
                alt="Community"
                width="40"
                height="40"
              />
              <div className="flex-grow-1 ml-3">Community</div>
            </div>
          </div>

          {users.map((user) => (
            <div
              onClick={() =>
                handleUserClick(user._id, {
                  userName: user.name,
                  userImg: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${user._id}`,
                })
              }
              key={user._id}
              className="list-group-item list-group-item-action border-0"
            >
              <div className="d-flex align-items-start">
                <img
                  src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${user._id}`}
                  className="rounded-circle mr-1"
                  alt={user.name}
                  width="40"
                  height="40"
                />
                <div className="flex-grow-1 ml-3">{user.name} {user._id === selfData?.id ? " (You)" : ""}</div>
              </div>
            </div>
          ))}
        </div>
      </Spin>
    </div>
  );
};

export default UserList;
