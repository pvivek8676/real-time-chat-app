function Button({
  children,
  type = "button",
  onClick,
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        w-full
        bg-blue-600
        hover:bg-blue-700
        text-white
        py-3
        rounded-lg
        font-semibold
        transition
        cursor-pointer
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export default Button;