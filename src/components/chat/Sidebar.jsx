import { useState } from "react";
import { useChat } from "../../context/ChatContext";
import { useSocket } from "../../context/SocketContext";
import {
  getInitials,
} from "../../utils/userHelpers";

function Sidebar() {
  const [search, setSearch] = useState("");

  const {
  users,
  loadingUsers,

  selectedUser,
  setSelectedUser,

  allChats,

  showSidebar,
  setShowSidebar,
} = useChat();

const { onlineUsers } =
  useSocket();

  const filteredUsers = users.filter(
  (user) =>
    user.name
      .toLowerCase()
      .includes(
        search.toLowerCase()
      )
);

const getLastMessage = (
  userId
) => {
  const messages =
    allChats[userId] || [];

  if (
    messages.length === 0
  )
    return "No messages yet";

  const lastMessage =
    messages[
      messages.length - 1
    ];

  if (
    lastMessage.image
  ) {
    return "📷 Photo";
  }

  return (
    lastMessage.text ||
    "No messages"
  );
};

const getLastMessageTime = (
  userId
) => {
  const messages =
    allChats[userId] || [];

  if (
    messages.length === 0
  )
    return "";

  const lastMessage =
    messages[
      messages.length - 1
    ];

  if (
    !lastMessage.createdAt
  )
    return "";

  return new Date(
    lastMessage.createdAt
  ).toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
};

const getUnreadCount = (
  userId
) => {
  const messages =
    allChats[userId] || [];

  return messages.filter(
    (msg) =>
      !msg.own &&
      !msg.seen
  ).length;
};

if (loadingUsers) {
  return (
    <div className="w-80 bg-white border-r p-4">
      Loading users...
    </div>
  );
}
  return (
    <div
  className={`
    fixed
    md:relative
    z-50
    h-full
    w-[280px]
    bg-white
    border-r
    flex
    flex-col
    transition-all
    duration-300

    ${
      showSidebar
        ? "left-0"
        : "-left-full"
    }

    md:left-0
  `}
>

      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-2xl font-bold">
  Chats
</h2>

<p className="text-sm text-gray-500">
  {onlineUsers.length} Online
</p>
      </div>

      {/* Search */}
      <div className="p-4">
        <input
          type="text"
          placeholder="Search user..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="
            w-full
            border
            rounded-lg
            px-4
            py-2
            outline-none
            focus:border-blue-500
          "
        />
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto">

        {filteredUsers.map((user) => (
          <div
            key={user._id}
            onClick={() => {
  setSelectedUser(user);

  if (window.innerWidth < 768) {
    setShowSidebar(false);
  }
}}
            className={`
              flex
              items-center
              gap-3
              p-4
              cursor-pointer
              transition

              ${
                selectedUser?._id === user._id
                  ? "bg-blue-50"
                  : "hover:bg-slate-100"
              }
            `}
          >

            {/* Avatar */}
            <div className="relative">

              {user.avatar ? (
  <img
    src={`http://localhost:5000${user.avatar}`}
    alt={user.name}
    className="
      w-12
      h-12
      rounded-full
      object-cover
    "
  />
) : (
  <div
    className="
      w-12
      h-12
      rounded-full
      bg-blue-600
      text-white
      flex
      items-center
      justify-center
      font-semibold
    "
  >
    {getInitials(user.name)}
  </div>
)}

              {onlineUsers.includes(
               user._id
              ) && (
                <div
                  className="
                    absolute
                    bottom-0
                    right-0
                    w-3
                    h-3
                    bg-green-500
                    rounded-full
                    border-2
                    border-white
                  "
                ></div>
              )}
            </div>

            {/* User Info */}
            
<div className="flex-1 min-w-0">

  <div className="flex justify-between items-center">

    <h3 className="font-semibold truncate">
      {user.name}
    </h3>

    <span className="text-xs text-gray-400">
      {getLastMessageTime(
        user._id
      )}
    </span>

  </div>

  <p className="text-sm text-gray-500 truncate">
    {getLastMessage(
      user._id
    )}
  </p>

</div>

            {/* Unread Badge */}

            {getUnreadCount(
  user._id
) > 0 && (
  <div
    className="
      min-w-5
      h-5
      px-1
      rounded-full
      bg-red-500
      text-white
      text-xs
      flex
      items-center
      justify-center
      font-semibold
    "
  >
    {getUnreadCount(
      user._id
    )}
  </div>
)}

          </div>
        ))}

      </div>
    </div>
  );
}

export default Sidebar;