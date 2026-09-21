import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import themeReducer from "./themeSlice";
import dashboardReducer from "./dashboardSlice";
import employeeReducer from "./employeeSlice";
import foodReducer from "./foodSlice";
import cartReducer from "./cartSlice";
import orderReducer from "./orderSlice";
import tableSlice from "./tableSlice";

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        theme: themeReducer,
        dashboard: dashboardReducer,
        employee: employeeReducer,
        table: tableSlice,
        food: foodReducer,
        cart: cartReducer,
        order: orderReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
