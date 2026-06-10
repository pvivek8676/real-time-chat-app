import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { socket } from "../services/socket";

const SocketContext =
  createContext();

export const useSocket = () =>
  useContext(SocketContext);

function SocketProvider({
  children,
}) {

  const [onlineUsers, setOnlineUsers] =
  useState([]);

  useEffect(() => {
  const currentUser =
    JSON.parse(
      localStorage.getItem(
        "user"
      ) || "null"
    );

  socket.connect();

  if (currentUser?.id) {
    socket.emit(
      "join",
      currentUser.id
    );
  }

  socket.on(
    "online_users",
    (users) => {
      console.log(
      "ONLINE USERS:",
      users
    );
      setOnlineUsers(users);
    }
  );

  return () => {
    socket.off(
      "online_users"
    );

    socket.disconnect();
  };
}, []);

  return (
    <SocketContext.Provider
      value={{
  socket,
  onlineUsers,
}}
    >
      {children}
    </SocketContext.Provider>
  );
}

export default SocketProvider;