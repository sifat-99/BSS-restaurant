import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../components/Dashboard";
// import DashboardPage from "../components/DashboardPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    handle: "BSS Restaurant",
  },
  {
    path: "/dashboard",
    // element: <DashboardPage />,
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
    handle: "BSS Restaurant - Dashboard",
  },
]);
