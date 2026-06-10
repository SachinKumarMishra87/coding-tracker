import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProfileDropdown = ({ user, onLogout }) => {

    const [open, setOpen] = useState(false);

    const menuRef = useRef();

    const navigate = useNavigate();
   // close on outside click
    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setOpen(false);
            }

        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };

    }, []);

    return (

        <div className="relative" ref={menuRef}>

            {/* PROFILE BUTTON */}

            <div
                onClick={() => {

                    // NOT LOGGED IN

                    if (!user) {

                        navigate("/login");

                        return;

                    }

                    // LOGGED IN

                    setOpen(!open);

                }}

                className="
        w-10 h-10

        rounded-full

        overflow-hidden

        cursor-pointer

        border border-white/40


        flex items-center justify-center

        shadow-lg

        hover:scale-105
        hover:ring-2
        hover:ring-cyan-400/40

        transition-all duration-300
    "
            >

                {user?.profileImage ? (

                    <img
                        src={user.profileImage}
                        alt="profile"
                        className="
                w-full h-full
                object-cover
            "
                    />

                ) : (

                    <span className="text-white font-bold text-sm">

                        {user?.username?.charAt(0)?.toUpperCase() || "👤"}

                    </span>

                )}

            </div>

            {/* Dropdown */}
            {open && user && (

                <div className="absolute right-0 text-white mt-2 w-52 bg-[#111315] border border-gray-800 rounded-lg shadow-lg overflow-hidden z-50">

                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-700">

                        <span className="text-sm font-semibold ">

                            {user?.username
                                ?.trim()
                                .split(" ")
                                .filter(Boolean)
                                .map((word, index, arr) =>
                                    index === 0 || index === arr.length - 1
                                        ? word
                                        : null
                                )
                                .join(" ") || "User"}

                        </span>

                        {user?.role === "admin" && (
                            <span className="text-red-400 ml-2 text-sm font-normal">
                                | Admin
                            </span>
                        )}

                    </div>

                    {/* Profile */}
                    <div
                        onClick={() => {

                            navigate("/profile");

                            setOpen(false);

                        }}
                        className="px-4 py-2 hover:bg-gray-800 cursor-pointer text-sm"
                    >
                        Profile
                    </div>

                    {/* Logout */}
                    <div
                        onClick={() => {

                            setOpen(false);

                            onLogout();

                        }}
                        className="px-4 py-2 hover:bg-red-600 cursor-pointer text-red-400 text-sm"
                    >
                        Logout
                    </div>

                </div>

            )}

        </div>

    );

};

export default ProfileDropdown;