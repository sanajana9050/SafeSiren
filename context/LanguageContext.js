import React, { createContext, useState } from 'react';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [isHindi, setIsHindi] = useState(false);

  const toggleLanguage = () => {
    setIsHindi(!isHindi);
  };

  return (
    <LanguageContext.Provider value={{ isHindi, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
