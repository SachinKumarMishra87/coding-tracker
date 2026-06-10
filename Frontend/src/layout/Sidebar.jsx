import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

const Sidebar = () => {

  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Topics", path: "/topics" },
    { name: "Notes", path: "/notes" },
    { name: "Bookmarks", path: "/bookmarks" },
    { name: "Profile", path: "/profile" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Help & Support", path: "/support" },

    ...(user?.role === "admin"
      ? [
        {
          name: "Support Tickets",
          path: "/admin/tickets"
        }
      ]
      : [])
  ];

  // GET USER

  const getMe = async () => {

    try {

      const res = await API.get("/auth/getuser");

      setUser(res.data.user);

    } catch (error) {

      setUser(null);

    }

  };

  useEffect(() => {

    getMe();

  }, []);

  return (

    <>

      {/* Mobile Toggle Button */}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="sm:hidden fixed top-12 left-0 z-50 bg-[#152F2D] p-1 rounded-r-lg"
      >

        ☰

      </button>

      {/* Overlay (Mobile) */}

      {isOpen && (

        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 sm:hidden z-40"
        ></div>

      )}

      {/* Sidebar */}

      <div
        className={`

    fixed sm:static
    top-0 left-0

    h-screen w-56

   bg-[#152F2D]
text-white

    z-50

    transform transition-transform duration-300

    

    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    sm:translate-x-0
  `}
      >

        {/* Logo */}

        <div
          className="
    p-5 text-lg font-bold

    border-b
border-gray-700
  "
        >
          CodeTracker 🚀
        </div>

        {/* Menu */}

        <div className="mt-4">

          {menuItems.map((item) => (

            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`

  block px-6 py-3

  transition

 hover:bg-gray-800

  ${location.pathname === item.path

                  ? `
     bg-gray-800

      border-r-4

      border-blue-500
    `
                  : ""
                }

`}
            >

              {item.name}

            </Link>

          ))}

        </div>

      </div>

    </>

  );

};

export default Sidebar;