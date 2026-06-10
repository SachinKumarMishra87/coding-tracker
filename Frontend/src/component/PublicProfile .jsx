import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

const PublicProfile = () => {

    const { username } = useParams();

    const [user, setUser] = useState(null);

    // =========================
    // GET PROFILE
    // =========================

    const getProfile = async () => {

        try {

            const res = await API.get(
                `/auth/public/${username}`
            );

            setUser(res.data.user);

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        getProfile();

    }, [username]);

    // =========================
    // FORMAT URL
    // =========================

    const formatUrl = (url) => {

        if (!url) return "#";

        if (
            url.startsWith("http://") ||
            url.startsWith("https://")
        ) {

            return url;

        }

        return `https://${url}`;

    };

    if (!user) {

        return (

            <div
                className="
                    min-h-screen
                    flex items-center justify-center

                    text-white
                "
            >

                Loading...

            </div>

        );

    }

    return (

        <div
            className="
                min-h-screen

                text-white

                p-4 sm:p-6
            "
        >

            <div
                className="
                    max-w-5xl
                    mx-auto

                    bg-[#152f2d4f]

                    rounded-3xl

                    border border-gray-700

                    p-5 sm:p-8
                "
            >

                {/* TOP SECTION */}

                <div
                    className="
                        flex flex-col
                        lg:flex-row

                        gap-8
                    "
                >

                    {/* LEFT */}

                    <div className="flex-1">

                        {/* IMAGE */}

                        <div
                            className="
                                flex justify-center
                                lg:justify-start
                            "
                        >

                            {user.profileImage ? (

                                <img
                                    src={user.profileImage}
                                    alt="profile"
                                    className="
                                        w-28 h-28
                                        sm:w-32 sm:h-32

                                        rounded-full
                                        object-cover

                                        border-4 border-white/10
                                    "
                                />

                            ) : (

                                <div
                                    className="
                                        w-28 h-28
                                        sm:w-32 sm:h-32

                                        rounded-full

                                        bg-blue-600

                                        flex items-center
                                        justify-center

                                        text-4xl sm:text-5xl
                                        font-bold
                                    "
                                >

                                    {user.username?.charAt(0)}

                                </div>

                            )}

                        </div>

                        {/* INFO */}

                        <div
                            className="
                                text-center
                                lg:text-left

                                mt-6
                            "
                        >

                            <h1
                                className="
                                    text-3xl sm:text-5xl
                                    font-bold
                                    break-words
                                "
                            >

                                {user.username}

                            </h1>

                            <p
                                className="
                                    text-blue-400

                                    mt-2

                                    text-lg sm:text-xl
                                "
                            >

                                {user.profession}

                            </p>

                            <p
                                className="
                                    text-gray-400

                                    mt-4

                                    leading-relaxed
                                "
                            >

                                {user.bio}

                            </p>

                            <p
                                className="
                                    text-gray-500

                                    mt-3
                                "
                            >

                                📍 {user.location}

                            </p>

                        </div>

                        {/* BUTTON */}

                        <div
                            className="
                                flex justify-center
                                lg:justify-start

                                mt-6
                            "
                        >

                            <button

                                onClick={() => {

                                    navigator.clipboard.writeText(

                                        window.location.href

                                    );

                                    alert("Profile link copied");

                                }}

                                className="
                                    px-5 py-3

                                    bg-blue-600
                                    hover:bg-blue-700

                                    rounded-xl

                                    transition-all
                                "
                            >

                                🔗 Copy Profile Link

                            </button>

                        </div>

                    </div>

                    {/* RIGHT */}

                    <div
                        className="
                            w-full
                            lg:w-[280px]

                            flex flex-col

                            gap-4
                        "
                    >

                        {/* GITHUB */}

                        {user.github && (

                            <a
                                href={formatUrl(user.github)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="
                                    w-full

                                    px-5 py-4

                                    rounded-2xl

                                    bg-gray-800
                                    hover:bg-gray-700

                                    border border-gray-700

                                    text-center

                                    transition-all
                                "
                            >

                                🐙 GitHub

                            </a>

                        )}

                        {/* LINKEDIN */}

                        {user.linkedin && (

                            <a
                                href={formatUrl(user.linkedin)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="
                                    w-full

                                    px-5 py-4

                                    rounded-2xl

                                    bg-blue-700
                                    hover:bg-blue-600

                                    text-center

                                    transition-all
                                "
                            >

                                💼 LinkedIn

                            </a>

                        )}

                        {/* PORTFOLIO */}

                        {user.portfolio && (

                            <a
                                href={formatUrl(user.portfolio)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="
                                    w-full

                                    px-5 py-4

                                    rounded-2xl

                                    bg-purple-700
                                    hover:bg-purple-600

                                    text-center

                                    transition-all
                                "
                            >

                                🌐 Portfolio

                            </a>

                        )}

                        {/* LEETCODE */}

                        {user.leetcodeUrl && (

                            <a
                                href={formatUrl(user.leetcodeUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="
                                    w-full

                                    px-5 py-4

                                    rounded-2xl

                                    bg-yellow-600
                                    hover:bg-yellow-500

                                    text-center

                                    transition-all
                                "
                            >

                                🟨 LeetCode

                            </a>

                        )}

                    </div>

                </div>

                {/* SHARE BUTTONS */}

                <div
                    className="
                        flex flex-wrap
                        justify-center

                        gap-3

                        mt-10
                    "
                >

                    {/* SHARE */}

                    <button

                        onClick={async () => {

                            if (navigator.share) {

                                await navigator.share({

                                    title:
                                        `${user.username} Profile`,

                                    text:
                                        `Check out ${user.username}'s coding profile`,

                                    url:
                                        window.location.href

                                });

                            }

                        }}

                        className="
                            px-5 py-3

                            bg-green-600
                            hover:bg-green-500

                            rounded-xl

                            transition-all
                        "
                    >

                        📤 Share

                    </button>

                    {/* TWITTER */}

                    <a

                        href={`https://twitter.com/intent/tweet?url=${window.location.href}`}

                        target="_blank"

                        rel="noopener noreferrer"

                        className="
                            px-5 py-3

                            bg-sky-500
                            hover:bg-sky-400

                            rounded-xl

                            transition-all
                        "
                    >

                        🐦 Twitter

                    </a>

                    {/* LINKEDIN */}

                    <a

                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`}

                        target="_blank"

                        rel="noopener noreferrer"

                        className="
                            px-5 py-3

                            bg-blue-800
                            hover:bg-blue-700

                            rounded-xl

                            transition-all
                        "
                    >

                        💼 LinkedIn

                    </a>

                </div>

            </div>

        </div>

    );

};

export default PublicProfile;