import {
  Trash2,
  Pencil,
} from "lucide-react";
import { useChat } from "../../context/ChatContext";

function MessageBubble({ message }) {

  const {
  deleteMessage,
  editMessage,
} = useChat();

  const handleDelete =
    () => {
      if (
        window.confirm(
          "Delete this message?"
        )
      ) {
        deleteMessage(
          message._id
        );
      }
    };

    const handleEdit =
  () => {

    const newText =
      prompt(
        "Edit message",
        message.text
      );

    if (
      !newText ||
      newText ===
        message.text
    )
      return;

    editMessage(
      message._id,
      newText
    );
  };
  return (
    <div
      className={`flex ${
        message.own
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div
        className={`
          max-w-[70%]
          px-4
          py-3
          rounded-2xl
          shadow-sm
          break-words

          ${
            message.own
              ? "bg-blue-600 text-white rounded-br-md"
              : "bg-white border border-gray-200 text-gray-800 rounded-bl-md"
          }
        `}
      >
        {message.image && (
  <img
    src={`http://localhost:5000${message.image}`}
    alt="chat"
    className="
      rounded-lg
      mb-2
      max-w-full
      max-h-64
      object-cover
    "
  />
)}

{message.text && (
  <p>
    {message.text}

    {message.edited && (
      <span className="ml-2 text-xs opacity-70">
        (edited)
      </span>
    )}
  </p>
)}

{message.own && (
  <div className="flex justify-end gap-2 mt-2">

    <button
      onClick={
        handleEdit
      }
      className="
        text-blue-200
        hover:text-white
      "
    >
      <Pencil
        size={14}
      />
    </button>

    <button
      onClick={
        handleDelete
      }
      className="
        text-red-200
        hover:text-white
      "
    >
      <Trash2
        size={14}
      />
    </button>

  </div>
)}

        <div
  className={`
    text-xs
    mt-1
    flex
    justify-end
    items-center
    gap-1

    ${
      message.own
        ? "text-blue-100"
        : "text-gray-400"
    }
  `}
>
  <span>
    {message.time || (
      message.createdAt &&
      new Date(
        message.createdAt
      ).toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      )
    )}
  </span>

  {message.own && (
    <span>
      {message.seen
        ? "✓✓"
        : "✓"}
    </span>
  )}
</div>
      </div>
    </div>
  );
}

export default MessageBubble;