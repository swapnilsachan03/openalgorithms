import { useEffect, useState } from "react";

export function useSystemTheme() {
  const getTheme = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  const [theme, setTheme] = useState(getTheme());

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const handler = () => setTheme(media.matches ? "dark" : "light");

    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  return theme;
}
