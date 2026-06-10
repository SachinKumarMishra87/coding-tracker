import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const MainLayout = () => {
    return (
        <div
            className="
    flex h-screen

    bg-[#1C1E1C]
text-white

  "
        >

            {/* Sidebar */}

            <Sidebar />

            {/* Main */}

            <div className="flex-1 flex flex-col">

                {/* Navbar */}

                <Navbar />

                {/* Page Content */}

                <div
                    className="


    overflow-y-auto

    custom-scroll

    bg-[#1C1E1C]
  "
                >

                    <Outlet />

                </div>

            </div>

        </div>
    );
};

export default MainLayout;