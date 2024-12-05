"use client";

import { BsMoonStarsFill } from "react-icons/bs";
import { MdOutlineWbSunny } from "react-icons/md";

import { useDarkMode } from "@/hooks/useDarkMode";

const ColorModeSwitcher = () => {
  const [darkMode, setDarkMode] = useDarkMode();

  return (
    <>
      {darkMode ? (
        <button
          className="flex items-center justify-center w-8 h-8 ml-2 rounded-md hover:bg-neutral-700 transition-colors"
          onClick={() => setDarkMode(!darkMode)}
        >
          <MdOutlineWbSunny />
        </button>
      ) : (
        <button
          className="flex items-center justify-center w-8 h-8 ml-2 rounded-md hover:bg-neutral-200 transition-colors"
          onClick={() => setDarkMode(!darkMode)}
        >
          <BsMoonStarsFill />
        </button>
      )}
    </>
  );
};

export default ColorModeSwitcher;
