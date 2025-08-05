import React, { useContext, useState, useEffect, createContext } from 'react';

const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

// මේ function එකෙන් කරන්නේ userගේ system theme එක dark ද කියලා බලන එක
const getSystemTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export function ThemeProvider({ children }) {
  // 1. මුලින්ම localStorage එකේ user තෝරපු theme එකක් තියෙනවද බලනවා.
  // 2. නැත්නම්, system theme එක default විදිහට දෙනවා.
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || getSystemTheme());

  useEffect(() => {
    // Theme එක වෙනස් වෙන හැම වෙලාවකම, ඒක body එකට class එකක් විදිහට දානවා
    // මේකෙන් තමයි main.css එකේ තියෙන පාටවල් ක්‍රියාත්මක වෙන්නේ
    document.body.className = ''; // පරණ class අයින් කරනවා
    document.body.classList.add(theme);
    // User අතින් theme එක මාරු කරපු නිසා, ඒක මතක තියාගන්න localStorage එකේ save කරනවා.
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const value = {
    theme, // 'light' or 'dark'
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}