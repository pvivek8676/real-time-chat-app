function EmptyChat() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold">
          Welcome 👋
        </h2>

        <p className="text-gray-500 mt-2">
          Select a user to start
          chatting
        </p>
      </div>
    </div>
  );
}

export default EmptyChat;