import {
  useEffect,
  useRef,
} from "react";

function useAutoScroll(
  dependency
) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [dependency]);

  return bottomRef;
}

export default useAutoScroll;