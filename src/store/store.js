import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import themeReducer from "./themeSlice";
import dashboardReducer from "./dashboardSlice";
import employeeReducer from "./employeeSlice";
import tableReducer from "./tableSlice";
import foodReducer from "./foodSlice";
import cartReducer from "./cartSlice";

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        theme: themeReducer,
        dashboard: dashboardReducer,
        employee: employeeReducer,
        table: tableReducer,
        food: foodReducer,
        cart: cartReducer,
    },
});
