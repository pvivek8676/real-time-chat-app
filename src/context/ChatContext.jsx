import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import api from "../services/api";
import { useSocket } from "./SocketContext";

const ChatContext = createContext();

export const useChat = () =>
  useContext(ChatContext);

function ChatProvider({ children }) {
  const [users, setUsers] = useState([]);

const [loadingUsers, setLoadingUsers] =
  useState(true);

  const [selectedUser, setSelectedUser] =
  useState(null);

  const [allChats, setAllChats] =
  useState({});

  const [isTyping, setIsTyping] =
  useState(false);  

  const [showSidebar, setShowSidebar] =
  useState(true);

  const currentUser = JSON.parse(
  localStorage.getItem("user") || "null"
);

  const { socket } = useSocket();

  const fetchUsers = async () => {
  try {
    const response =
      await api.get("/users");

    setUsers(response.data.users);

if (!selectedUser) {
  const firstUser =
    response.data.users.find(
      (u) => u._id !== currentUser?.id
    );

  setSelectedUser(firstUser || null);
} else {
  const updatedUser =
    response.data.users.find(
      (u) =>
        u._id ===
        selectedUser._id
    );

  if (updatedUser) {
    setSelectedUser(updatedUser);
  }
}
  } catch (error) {
    console.error(error);
  } finally {
    setLoadingUsers(false);
  }
};

useEffect(() => {
  fetchUsers();
}, []);



  const sendMessage = async (
  text,
  imageUrl = ""
) => {
    
  try {
    if (!selectedUser || !currentUser)
  return;


    const response =
      await api.post(
  "/messages/send",
  {
    senderId:
      currentUser.id,

    receiverId:
      selectedUser._id,

    text,

    image:
      imageUrl,
  }
);

  } catch (error) {
    console.error(
  "Send Error =>",
  error.response?.data ||
  error.message ||
  error
);
  }
};

const deleteMessage =
  async (messageId) => {
    try {
      await api.delete(
        `/messages/${messageId}`
      );
    } catch (error) {
      console.error(error);
    }
  };

   const editMessage =
  async (
    messageId,
    text
  ) => {
    try {
      await api.put(
        `/messages/edit/${messageId}`,
        { text }
      );
    } catch (error) {
      console.error(error);
    }
  };

const fetchMessages = async () => {
  try {
    if (!selectedUser || !currentUser) return;

    const response =
      await api.get(
        `/messages/${currentUser.id}/${selectedUser._id}`
      );

      await api.put(
  "/messages/seen",
  {
    senderId:
      selectedUser._id,

    receiverId:
      currentUser.id,
  }
);

    const formattedMessages =
  response.data.messages.map(
    (msg) => ({
      ...msg,
      own:
        msg.sender?.toString() ===
        currentUser.id,
    })
  );

setAllChats((prev) => {
  const previousMessages =
    prev[selectedUser._id] || [];

  // Agar messages ki count same hai,
  // to state update mat karo
  if (
    previousMessages.length ===
    formattedMessages.length
  ) {
    return prev;
  }

  return {
    ...prev,
    [selectedUser._id]:
      formattedMessages,
  };
});
  } catch (error) {
    console.error(error);
  }
};

useEffect(() => {
  if (selectedUser && currentUser) {
    fetchMessages();
  }
}, [selectedUser, currentUser]);

useEffect(() => {
  if (!socket) return;

  socket.on(
    "receive_message",
    (message) => {
      console.log(
  "RECEIVED:",
  message
);
      setAllChats((prev) => {
  const chatUserId =
    message.sender?.toString() ===
    currentUser?.id
      ? message.receiver
      : message.sender;

  return {
    ...prev,

    [chatUserId]: [
      ...(prev[
        chatUserId
      ] || []),

      {
        ...message,

        own:
          message.sender?.toString() ===
          currentUser?.id,
      },
    ],
  };
});
    }
  );

  return () => {
    socket.off(
      "receive_message"
    );
  };
}, [socket, currentUser]);

useEffect(() => {
  if (!socket) return;

  socket.on(
    "messages_seen",
    ({ senderId, receiverId }) => {

      console.log(
  "SEEN EVENT:",
  senderId,
  receiverId
);
      setAllChats((prev) => {
        const updatedChats = {
          ...prev,
        };

        Object.keys(
          updatedChats
        ).forEach((chatId) => {
          updatedChats[
            chatId
          ] = updatedChats[
            chatId
          ].map((msg) => {
            if (
              msg.sender?.toString() ===
                senderId &&
              msg.receiver?.toString() ===
                receiverId
            ) {
              return {
                ...msg,
                seen: true,
              };
            }

            return msg;
          });
        });

        return updatedChats;
      });
    }
  );

  return () => {
    socket.off(
      "messages_seen"
    );
  };
}, [socket]);

useEffect(() => {
  if (!socket) return;

  socket.on(
    "user_typing",
    () => {
      setIsTyping(true);

      setTimeout(() => {
        setIsTyping(false);
      }, 1000);
    }
  );

  return () => {
    socket.off(
      "user_typing"
    );
  };
}, [socket]);

useEffect(() => {
  if (!socket) return;

  socket.on(
    "online_users",
    () => {
      // Kuch mat karo
    }
  );

  return () => {
    socket.off(
      "online_users"
    );
  };
}, [socket]);

useEffect(() => {
  if (!socket) return;

  socket.on(
    "message_deleted",
    (messageId) => {
      setAllChats((prev) => {
        const updatedChats = {
          ...prev,
        };

        Object.keys(
          updatedChats
        ).forEach((chatId) => {
          updatedChats[
            chatId
          ] = updatedChats[
            chatId
          ].filter(
            (msg) =>
              msg._id !==
              messageId
          );
        });

        return updatedChats;
      });
    }
  );

  return () => {
    socket.off(
      "message_deleted"
    );
  };
}, [socket]);

useEffect(() => {
  if (!socket) return;

  socket.on(
    "message_edited",
    (updatedMessage) => {
      setAllChats((prev) => {
        const updatedChats = {
          ...prev,
        };

        Object.keys(
          updatedChats
        ).forEach((chatId) => {
          updatedChats[
            chatId
          ] = updatedChats[
            chatId
          ].map((msg) =>
            msg._id ===
            updatedMessage._id
              ? {
                  ...msg,
                  text:
                    updatedMessage.text,
                  edited:
                    true,
                }
              : msg
          );
        });

        return updatedChats;
      });
    }
  );

  return () => {
    socket.off(
      "message_edited"
    );
  };
}, [socket]);

  const chatMessages =
  selectedUser
    ? allChats[selectedUser._id] || []
    : [];

  return (
    <ChatContext.Provider
      value={{
   users,
   loadingUsers,

  selectedUser,
  setSelectedUser,

  chatMessages,

  sendMessage,

  deleteMessage,

  editMessage,

allChats,

  isTyping,
  setIsTyping,

  showSidebar,
  setShowSidebar,
}}
    >
      {children}
    </ChatContext.Provider>
  );
}

export default ChatProvider;