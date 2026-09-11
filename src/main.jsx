import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AppThemeProvider } from "./theme/ThemeContextProvider.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/route";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AppThemeProvider>
        <RouterProvider router={router} />
      </AppThemeProvider>
    </Provider>
  </StrictMode>,
);
