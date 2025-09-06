import React, { useContext, useState, createContext } from 'react';

const PopupContext = createContext();

export function usePopup() {
  return useContext(PopupContext);
}

export function PopupProvider({ children }) {
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);

  const openLoginPrompt = () => setIsLoginPromptOpen(true);
  const closeLoginPrompt = () => setIsLoginPromptOpen(false);

  const value = {
    isLoginPromptOpen,
    openLoginPrompt,
    closeLoginPrompt,
  };

  return (
    <PopupContext.Provider value={value}>
      {children}
    </PopupContext.Provider>
  );
}