function Input({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full
          border
          border-gray-300
          rounded-lg
          px-4
          py-3
          outline-none
          focus:border-blue-500
          transition
        "
      />
    </div>
  );
}

export default Input;