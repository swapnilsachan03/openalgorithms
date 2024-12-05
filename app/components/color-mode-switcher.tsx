"use client";

import { useDarkMode } from "@/hooks/useDarkMode";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const ColorModeSwitcher = () => {
  const [darkMode, setDarkMode] = useDarkMode();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    isClient && (
      <>
        {darkMode ? (
          <button
            className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-neutral-700 transition-colors"
            onClick={() => setDarkMode(!darkMode)}
          >
            <Sun width={20} height={20} />
          </button>
        ) : (
          <button
            className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-neutral-200 transition-colors"
            onClick={() => setDarkMode(!darkMode)}
          >
            <Moon width={20} height={20} />
          </button>
        )}
      </>
    )
  );
};

export default ColorModeSwitcher;
