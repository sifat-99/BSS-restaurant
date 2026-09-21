import DashboardMainPage from "../components/DashboardSidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
    return (
        <DashboardMainPage>
            <Outlet />
        </DashboardMainPage>
    );
};

export default DashboardLayout;
