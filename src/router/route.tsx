import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import PrivateRoute from "./PrivateRoute";
import ErrorPage from "../components/ErrorPage";
import DashboardLayout from "../layouts/DashboardLayout";
import Profile from "../components/Profile";
import SignupPage from "../components/SignUp";
import Orders from "../components/Orders";
import Dashboard from "../components/Dashboard";
import EmployeeList from "../components/EmployeeList";
import FoodList from "../components/FoodList";
import TableList from "../components/TableList";
import OrderPage from "../components/OrderPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        handle: "BSS Restaurant",
        errorElement: <ErrorPage />,
    },
    {
        path: "/dashboard",
        element: (
            <PrivateRoute>
                <DashboardLayout />
            </PrivateRoute>
        ),
        handle: "BSS Restaurant - Dashboard",
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: "profile",
                element: <Profile />,
            },
            {
                path: "employee",
                element: <EmployeeList />,
            },
            {
                path: "table",
                element: <TableList />,
            },
            {
                path: "food",
                element: <FoodList />,
            },
            {
                path: "new-order",
                element: <OrderPage />,
            },
            {
                path: "orders",
                element: <Orders />,
            },
        ],
    },
    {
        path: "/sign-up",
        element: <SignupPage />,
    },
]);
