import React, { createContext, useState, useEffect, useMemo } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { spicyTheme, modernTheme, darkTheme } from "./theme";

import SpicyFavicon from "../assets/Icons/Spicy-orange.png";
import ModernFavicon from "../assets/Icons/green-modern.png";
import DarkFavicon from "../assets/Icons/dark-gray.png";

export const ThemeContext = createContext();

export const AppThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState("spicy");

  const themeMap = {
    spicy: { theme: spicyTheme, favicon: SpicyFavicon },
    modern: { theme: modernTheme, favicon: ModernFavicon },
    dark: { theme: darkTheme, favicon: DarkFavicon },
  };

  const currentThemeData = themeMap[themeName] || themeMap["spicy"];

  useEffect(() => {
    // Update favicon
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = currentThemeData.favicon;
  }, [currentThemeData.favicon]);

  const value = useMemo(
    () => ({
      themeName,
      setThemeName,
    }),
    [themeName],
  );

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={currentThemeData.theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
