import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../services/api";

import NameImg from "../assests/Logo_img_3.png";

import ProfileDropdown from "../component/ProfileDropDown";

const Navbar = () => {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);


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

    const handleProfileUpdate = () => {

      getMe();

    };

    window.addEventListener(
      "profileUpdated",
      handleProfileUpdate
    );

    return () => {

      window.removeEventListener(
        "profileUpdated",
        handleProfileUpdate
      );

    };

  }, []);

  // LOGOUT

  const handleLogout = async () => {

    try {

      await API.post("/auth/logout");

      setUser(null);

      navigate("/login", { replace: true });

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <nav
      className="
    sticky top-0 z-50
    w-full
    bg-[#152F2D]
    backdrop-blur-xl
    border-b border-white/10 
    flex items-center justify-between
    px-4 sm:px-6 lg:px-8 
    py-2 sm:py-3.5 lg:py-2
  "
    >

      {/* LEFT */}

      <div
        onClick={() => navigate("/")}
        className="
          flex items-center gap-3
          cursor-pointer
          group
        "
      >

        {/* LOGO */}

        {/* <div
          className="
            relative

            w-11 h-11

            rounded-2xl

            overflow-hidden

            bg-gradient-to-br
            from-blue-500/20
            to-purple-500/20

            border border-white/10

            shadow-lg

            group-hover:scale-105
            transition-all duration-300
          "
        >

          <img
            src={NameImg}
            alt="logo"
            className="
              w-full h-full
              object-cover
            "
          />

        </div> */}

        {/* TITLE */}

        <div className="">

          <h1
            className="
    text-lg font-bold

    bg-gradient-to-r

   from-white
to-gray-600

    bg-clip-text
    text-transparent
  "
          >
            LeetPatTracker
          </h1>

          <p
            className="
    text-xs

   text-gray-500

    -mt-1
  "
          >
            Track • Practice • Grow
          </p>

        </div>

      </div>

      {/* RIGHT */}

      <div className="flex items-center gap-4">

        {/* USERNAME */}

        {/* USER INFO */}

        {user && (

          <div
            className="
    hidden md:flex
    items-center gap-3

    px-4 py-2

    rounded-2xl

   bg-white/5

    border-white/10
    shadow-lg
    backdrop-blur-md
  "
          >

            {/* USERNAME */}

            <div className="leading-tight">

              <p
                className="
    text-sm font-semibold

    text-white
  "
              >
                {user?.username}
              </p>

              <p
                className="
    text-xs

    text-cyan-300
  "
              >
                Welcome back 👋
              </p>

            </div>

          </div>

        )}
        {/* DROPDOWN */}

        <ProfileDropdown
          user={user}
          onLogout={handleLogout}
        />

      </div>

    </nav>

  );

};

export default Navbar;