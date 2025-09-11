import React, { useState, useEffect } from "react";

const ThemeSwitcher = () => {
  const themes = [
    "light", "dark", "cupcake", "bumblebee", "emerald",
    "corporate", "synthwave", "retro", "cyberpunk", "valentine",
    "halloween", "garden", "forest", "aqua", "lofi",
    "pastel", "fantasy", "wireframe", "black", "luxury", "dracula"
  ];

  // ✅ Load saved theme from localStorage or default to 'light'
  const savedTheme = localStorage.getItem("theme") || "light";
  const [currentTheme, setCurrentTheme] = useState(savedTheme);

  // ✅ Apply theme on mount
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, [savedTheme]);

  const handleChange = (theme) => {
    setCurrentTheme(theme);
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme); // ✅ Save choice
  };

  return (
    <div className="flex gap-2 flex-wrap p-2">
      {themes.map((theme) => (
        <button
          key={theme}
          className={`btn btn-sm ${currentTheme === theme ? "btn-primary" : "btn-ghost"}`}
          onClick={() => handleChange(theme)}
        >
          {theme}
        </button>
      ))}
    </div>
  );
};

export default ThemeSwitcher;
