import { useEffect } from "react";

const useOutsideClick = (ref, callback, isActive) => {
  useEffect(() => {
    if (!isActive) return; //Only attach the listner if the component is active

    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback, isActive]);
};

export default useOutsideClick;
