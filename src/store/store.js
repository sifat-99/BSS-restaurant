import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import themeReducer from "./themeSlice";
import dashboardReducer from "./dashboardSlice";

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        theme: themeReducer,
        dashboard: dashboardReducer,
    },
});

