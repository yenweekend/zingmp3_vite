import { useEffect } from "react";

const useClickAway = (ref, targetRef, onClickAway) => {
  useEffect(() => {
    const handleClick = (event) => {
      event.stopPropagation();
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        !targetRef.current.contains(event.target)
      ) {
        if (document.querySelector(".ant-modal-wrap")?.contains(event.target)) {
          return null;
        }
        onClickAway();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [ref, onClickAway]);
};

export default useClickAway;
