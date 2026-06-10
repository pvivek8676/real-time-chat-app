import Sidebar from "../components/chat/Sidebar";
import { useState } from "react";
import ChatHeader from "../components/chat/ChatHeader";
import MessageBubble from "../components/chat/MessageBubble";
import MessageInput from "../components/chat/MessageInput";

import { useChat } from "../context/ChatContext";
import useAutoScroll from "../hooks/useAutoScroll";
import EmptyChat from "../components/chat/EmptyChat";


function Chat() {
  const [searchText, setSearchText] =
  useState("");
  const {
  chatMessages,
  isTyping,
  showSidebar,
  setShowSidebar,
} = useChat();
  const bottomRef = useAutoScroll(chatMessages);

  const filteredMessages =
  chatMessages.filter(
    (message) =>
      message.text
        ?.toLowerCase()
        .includes(
          searchText.toLowerCase()
        )
  );

  return (
    <div className="h-screen flex bg-slate-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Mobile Overlay */}
{showSidebar && (
  <div
    className="
      fixed
      inset-0
      bg-black/40
      z-40
      md:hidden
    "
    onClick={() =>
      setShowSidebar(false)
    }
  />
)}

      {/* Chat Section */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <ChatHeader />

        <div className="bg-white border-b p-3">
  <input
    type="text"
    placeholder="Search messages..."
    value={searchText}
    onChange={(e) =>
      setSearchText(
        e.target.value
      )
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

        {/* Messages */}
        <div
  className="
    flex-1
    overflow-y-auto
    p-3 
    md:p-6
    space-y-4
    bg-slate-50
  "
>

  {filteredMessages.length > 0 ? (
    filteredMessages.map((message) => (
      <MessageBubble
  key={message._id || message.id}
  message={message}
/>
    ))
  ) : (
    <EmptyChat />
  )}

  <div ref={bottomRef}></div>
  {isTyping && (
  <p className="text-sm text-gray-500 italic">
    Typing...
  </p>
)}

</div>

        {/* Input */}
        <MessageInput />

      </div>

    </div>
  );
}

export default Chat;