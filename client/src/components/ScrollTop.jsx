import { useEffect, useState } from "react";
import { IoIosArrowUp } from "react-icons/io";

const ScrollTop = () => {
  const [visibility, setVisibility] = useState(false);

  const scrollBtn = () => {
    window.scroll({ top: 0, left: 0, behavior: "smooth" });
  };

  const listenScroll = () => {
    let heightToHide = 250;
    const windowScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    if (windowScroll > heightToHide) {
      setVisibility(true);
    } else {
      setVisibility(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", listenScroll);
    return () => window.removeEventListener("scroll", listenScroll);
  }, []);

  return (
    <>
      {visibility && (
        <div
          className={`flex items-center cursor-pointer justify-center rounded-full
            bg-slate-100 fixed w-12 h-12 right-4 bottom-20 lg:right-20 z-20 animate-bounce `}
          onClick={scrollBtn}
        >
          <IoIosArrowUp className="text-lg cursor-pointer" />
        </div>
      )}
    </>
  );
};

export default ScrollTop;
