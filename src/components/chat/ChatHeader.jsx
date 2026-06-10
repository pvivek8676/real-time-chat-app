import {
  Menu,
  Camera,
} from "lucide-react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import { getInitials } from "../../utils/userHelpers";
import { useSocket } from "../../context/SocketContext";

function ChatHeader() {
  const navigate = useNavigate();

 const {
  selectedUser,
  showSidebar,
  setShowSidebar,
} = useChat();

const { onlineUsers } =
  useSocket();

  const {
  user,
  logout,
} = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleAvatarChange =
async (e) => {

  if (!user) return;

  try {
      const file =
        e.target.files[0];

      if (!file) return;

      const formData =
        new FormData();

      formData.append(
        "avatar",
        file
      );

      formData.append(
        "userId",
        user.id
      );

      const response = await api.put(
  "/users/avatar",
  formData,
  {
    headers: {
      "Content-Type":
        "multipart/form-data",
    },
  }
);

localStorage.setItem(
  "user",
  JSON.stringify({
    ...user,
    avatar: response.data.user.avatar,
  })
);

window.location.reload();

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-6">
      
      <div className="flex items-center gap-3">

  <button
    onClick={() =>
      setShowSidebar(!showSidebar)
    }
    className="md:hidden"
  >
    <Menu size={24} />
  </button>

  {/* Avatar */}
  <div className="relative">
    {selectedUser?.avatar ? (
  <img
    src={`http://localhost:5000${selectedUser.avatar}`}
    alt={selectedUser.name}
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
    {getInitials(selectedUser?.name)}
  </div>
)}

    {onlineUsers.includes(
  selectedUser?._id
) && (
  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
)}
  </div>

  {/* User Info */}
  <div>
    <h2 className="font-semibold text-lg">
      {selectedUser?.name || "Select User"}
    </h2>

    <p
  className={`text-sm ${
    onlineUsers.includes(
      selectedUser?._id
    )
      ? "text-green-600"
      : "text-gray-500"
  }`}
>
  {onlineUsers.includes(
  selectedUser?._id
)
  ? "Online"
  : selectedUser?.lastSeen
  ? `Last seen ${new Date(
      selectedUser.lastSeen
    ).toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    )}`
  : "Offline"}
</p>
  </div>

</div>
      {/* Logout */}
      <div className="relative">

  <input
    type="file"
    accept="image/*"
    id="avatarUpload"
    className="hidden"
    onChange={
      handleAvatarChange
    }
  />

  <label
    htmlFor="avatarUpload"
    className="
      cursor-pointer
      p-2
      rounded-lg
      border
      hover:bg-gray-100
      flex
      items-center
      justify-center
    "
  >
    <Camera size={18} />
  </label>

</div>
      <button
        onClick={handleLogout}
        className="
  bg-red-500
  hover:bg-red-600
  text-white
  px-3
  py-2
  rounded-lg
  transition
  text-sm
"
      >
        Logout
      </button>
    </div>
  );
}

export default ChatHeader;