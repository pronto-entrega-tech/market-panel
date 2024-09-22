import { useEffect, useState } from "react";

const getWindowSize = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
});

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState(getWindowSize());

  useEffect(() => {
    const handleWindowResize = () => setWindowSize(getWindowSize());

    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return windowSize;
};
