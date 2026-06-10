import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import {
  Image,
  Smile,
} from "lucide-react";
import { useChat } from "../../context/ChatContext";
import { useSocket } from "../../context/SocketContext";
import api from "../../services/api";

function MessageInput() {
  const [message, setMessage] = useState("");
  const [showEmoji, setShowEmoji] =
  useState(false);
  const [selectedImage, setSelectedImage] =
  useState(null);

  const [uploading, setUploading] =
  useState(false);

  const {
  sendMessage,
  setIsTyping,
} = useChat();

const { socket } = useSocket();

  const handleSend = async () => {
  try {
    if (
      !message.trim() &&
      !selectedImage
    )
      return;

    let imageUrl = "";

    if (selectedImage) {
      setUploading(true);

      const formData =
        new FormData();

      formData.append(
        "image",
        selectedImage
      );

      const response =
        await api.post(
          "/messages/upload",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      imageUrl =
        response.data.imageUrl;

      setUploading(false);
    }

    await sendMessage(
      message,
      imageUrl
    );

    setMessage("");
    setSelectedImage(null);
  } catch (error) {
    console.error(error);

    setUploading(false);
  }
};
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const onEmojiClick = (
  emojiData
) => {
  setMessage(
    (prev) =>
      prev + emojiData.emoji
  );
};

  return (
    <div className="relative bg-white border-t p-4 flex items-center gap-3">
      <input
  type="file"
  accept="image/*"
  id="imageUpload"
  className="hidden"
  onChange={(e) =>
    setSelectedImage(
      e.target.files[0]
    )
  }
/>

{showEmoji && (
  <div
    className="
      absolute
      bottom-20
      left-4
      z-50
    "
  >
    <EmojiPicker
      onEmojiClick={
        onEmojiClick
      }
    />
  </div>
)}
      <input
        type="text"
        value={message}
        onChange={(e) => {
  setMessage(e.target.value);

  socket.emit(
    "typing",
    true
  );
}}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="
          flex-1
          border
          border-gray-300
          rounded-lg
          px-4
          py-3
          outline-none
          focus:border-blue-500
        "
      />

      <button
  onClick={() =>
    setShowEmoji(
      !showEmoji
    )
  }
  className="
    p-3
    rounded-lg
    border
    hover:bg-gray-100
  "
>
  <Smile size={20} />
</button>

      <label
  htmlFor="imageUpload"
  className="
    cursor-pointer
    p-3
    rounded-lg
    border
    hover:bg-gray-100
  "
>
  <Image size={20} />
</label>

      <button
        onClick={handleSend}
        className="
          bg-blue-600
          hover:bg-blue-700
          text-white
          px-6
          py-3
          rounded-lg
          transition
        "
      >
        {uploading
  ? "Uploading..."
  : "Send"}
      </button>
    </div>
  );
}

export default MessageInput;