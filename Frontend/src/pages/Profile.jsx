import { useEffect, useState } from "react";
import API from "../services/api";

const Profile = () => {

  const [user, setUser] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    profession: "",
    bio: "",
    location: "",
    github: "",
    linkedin: "",
    portfolio: "",
    leetcodeUrl: ""
  });

  const [leetcodeStats, setLeetcodeStats] = useState(null);

  const [leetcodeLoading, setLeetcodeLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);

  // GET PROFILE

  const getProfile = async () => {
    try {
      setProfileLoading(true);
      setAuthLoading(true);
      const { data } = await API.get("/profile/me");
      setUser(data.user);

    } catch (error) {
      console.log(error);
    } finally {
      setProfileLoading(false);
      setAuthLoading(false);
    }
  };

  // UPLOAD PROFILE IMAGE

  const handleImageUpload = async (e) => {

    try {

      const file = e.target.files[0];

      if (!file) return;

      setUploadingImage(true);

      const formData = new FormData();

      formData.append(
        "profileImage",
        file
      );

      const response = await API.post(

        "/auth/upload-profile",

        formData,

        {
          headers: {

            "Content-Type":
              "multipart/form-data"

          }
        }

      );

      setUser(response.data.user);
      window.dispatchEvent(
        new Event("profileUpdated")
      );
    } catch (error) {

      console.log(error);

    } finally {

      setUploadingImage(false);

    }

  };


  // HELPER TO FORMAT URLS 
  const formatUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    return `https://${url}`;
  };

  // =========================
  // UPDATE PROFILE
  // =========================
  const handleUpdateProfile =
    async () => {

      try {

        const { data } =
          await API.put(

            "/profile/update",

            formData

          );
        setShowEditModal(false);
        setUser(data.user);
        window.dispatchEvent(
          new Event("profileUpdated")
        );

      } catch (error) {

        console.log(error);

      }

    };

  useEffect(() => {

    if (user) {

      setFormData({

        username:
          user.username || "",

        profession:
          user.profession || "",

        bio:
          user.bio || "",

        location:
          user.location || "",

        github:
          user.github || "",

        linkedin:
          user.linkedin || "",

        portfolio:
          user.portfolio || "",

        leetcodeUsername:
          user.leetcodeUsername || ""

      });

    }



  }, [user]);

  const handleFetchLeetcode = async () => {
    const url = formData.leetcodeUrl;

    if (!url) return;

    const username = url.split("/").filter(Boolean).pop();

    try {
      setLeetcodeLoading(true);

      const res = await API.get(`/leetcode/${username}`);

      setLeetcodeStats(res.data.stats);

      // DB me save bhi karo
      await API.put("/profile/update", {
        ...formData,
        leetcodeUsername: username,
      });

    } catch (err) {
      console.log(err);
    } finally {
      setLeetcodeLoading(false);
    }
  };
  useEffect(() => {

    getProfile();

  }, []);

  useEffect(() => {

    if (!user?.leetcodeUsername) return;


    const fetch = async () => {
      try {
        setLeetcodeLoading(true);
        const res = await API.get(`/leetcode/${user.leetcodeUsername}`);

        setLeetcodeStats(res.data.stats);

      } catch (err) {
        console.log(err);
      } finally {
        setLeetcodeLoading(false);
      }
    };

    fetch();
  }, [user?.leetcodeUsername]);

  if (authLoading) {
    return (
       <div className="min-h-[80vh] flex items-center justify-center  text-white">

        <div className="text-center flex flex-col items-center gap-4">

           <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>

          {/* Text */}
          <h2 className="text-lg font-semibold ml-3 text-white">
            Loading...
          </h2>

          <p className="text-gray-500 text-xs">
            Please wait while we fetch your data
          </p>

        </div>

      </div>
    );
  }

  return (
    user?.isVerified ? (
      <div className="min-h-screen text-white p-4 sm:p-6">

        {/* HEADER */}

        {/* PROFILE CARD */}

        <div
          className="
    relative
    overflow-hidden
    rounded-xl
    border border-gray-800
    p-6 sm:p-8
    mb-8
  "
        >

          {/* EDIT PROFILE BUTTON */}

          <button
            onClick={() => setShowEditModal(true)}
            className="
      absolute top-5 right-5
      group flex items-center gap-2

      bg-white/10 hover:bg-white/20
      border border-white/10

      px-3 py-2
      rounded-full

      transition-all duration-300
      hover:scale-105
    "
          >
            <span>✏️</span>

            <span
              className="
        max-w-0 overflow-hidden whitespace-nowrap
        group-hover:max-w-30
        transition-all duration-300
      "
            >
              Edit Profile
            </span>

          </button>

          {/* MAIN CONTENT */}

          <div className="flex flex-col sm:flex-row gap-6 items-start">

            {/* PROFILE IMAGE SECTION */}

            <div className="relative shrink-0">

              {/* IMAGE CONTAINER */}

              <div
                className="
          w-28 h-28
          rounded-full
          overflow-hidden
          border-4 border-white/10
          shadow-2xl
          ring-2 ring-purple-500/20
          hover:ring-purple-500/40
          transition
        "
              >

                {/* PROFILE IMAGE */}

                {user?.profileImage ? (

                  <img
                    src={`${user.profileImage}?${Date.now()}`}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />

                ) : (

                  /* DEFAULT AVATAR */

                  <div
                    className="
              w-full h-full
              flex items-center justify-center
              bg-gradient-to-br from-blue-500 to-purple-600
              text-4xl font-bold
            "
                  >

                    {user?.username?.charAt(0)}

                  </div>

                )}

              </div>

              {/* CAMERA BUTTON */}

              <label
                htmlFor="profile-upload"
                className="
          absolute bottom-1 right-1
          w-10 h-10
          rounded-full

          bg-black/80
          border border-gray-700

          flex items-center justify-center

          cursor-pointer

          hover:scale-110

          transition-all duration-300

          shadow-lg
        "
              >

                {/* SHOW LOADER WHILE IMAGE UPLOADING */}

                {

                  uploadingImage

                    ? (

                      <div
                        className="
                  w-4 h-4
                  border-2 border-white
                  border-t-transparent
                  rounded-full
                  animate-spin
                "
                      />

                    )

                    : "📷"

                }

              </label>

              {/* HIDDEN FILE INPUT */}

              <input
                type="file"
                id="profile-upload"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />

              {/* UPLOADING TEXT */}

              {

                uploadingImage && (

                  <p
                    className="
              absolute -bottom-6 left-1/2
              -translate-x-1/2

              text-xs text-blue-400
              whitespace-nowrap
            "
                  >

                    Uploading...

                  </p>

                )

              }

            </div>

            {/* USER INFO */}

            <div className="flex-1">

              {/* USERNAME */}

              <h1 className="text-3xl sm:text-4xl font-bold">
                {user?.username}
              </h1>

              {/* PROFESSION */}

              <p className="text-blue-400 mt-1 text-lg font-medium">
                {user?.profession || "Frontend Developer"}
              </p>

              {/* EMAIL + LOCATION */}

              <div className="flex flex-col gap-1 mt-3 text-gray-400 text-sm">

                <p className="flex items-center gap-2 text-blue-400">
                  📧 {user?.email}
                </p>

                <p className="flex items-center gap-2">
                  📍 {user?.location || "India"}
                </p>

              </div>

              {/* BIO */}

              <p className="text-gray-300 mt-4 max-w-2xl leading-relaxed">
                {user?.bio || "Passionate DSA learner and developer."}
              </p>

              {/* SOCIAL LINKS */}

              {/* SOCIAL + PUBLIC PROFILE */}

              <div
                className="
    flex flex-col sm:flex-row
    sm:items-end
    sm:justify-between
    gap-5
    mt-5
  "
              >
                <button

                  onClick={() => {

                    window.open(

                      `/u/${user.username}`,

                      "_blank"

                    );

                  }}

                  className="
      px-5 py-2.5

      rounded-xl

      bg-blue-600
      hover:bg-blue-700

      font-medium

      transition-all duration-300
      hover:scale-105
    "
                >

                  View Public Profile

                </button>
                {/* LEFT SOCIAL LINKS */}

                <div className="flex flex-wrap gap-3">

                  {/* GITHUB */}

                  {user?.github && (

                    <a
                      href={user.github}
                      target="_blank"
                      className="
          px-4 py-2 rounded-xl
          bg-white/10 hover:bg-white/20
          border border-white/10
          transition hover:scale-105
        "
                    >

                      🐙 GitHub

                    </a>

                  )}

                  {/* LINKEDIN */}

                  {user?.linkedin && (

                    <a
                      href={formatUrl(user.linkedin)}
                      target="_blank"
                      className="
          px-4 py-2 rounded-xl
          bg-blue-500/10 hover:bg-blue-500/20
          border border-blue-500/20
          transition hover:scale-105
        "
                    >

                      💼 LinkedIn

                    </a>

                  )}

                  {/* PORTFOLIO */}

                  {user?.portfolio && (

                    <a
                      href={user.portfolio}
                      target="_blank"
                      className="
          px-4 py-2 rounded-xl
          bg-purple-500/10 hover:bg-purple-500/20
          border border-purple-500/20
          transition hover:scale-105
        "
                    >

                      🌐 Portfolio

                    </a>

                  )}

                </div>

                {/* RIGHT BUTTON */}

              </div>
            </div>

          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-300 mb-4 ml-4">
            Track Your LeetCode Journey
          </h2>
          <div className="bg-[#111315] border border-gray-800 mb-5">
          </div>
          {/* IF NOT ENTERED / LOADING / DATA STATES */}
          {profileLoading || leetcodeLoading ? (
            // 🔵 SHIMMER STATE
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
              <div className="h-40 bg-gray-800 rounded-3xl" />
              <div className="h-40 bg-gray-800 rounded-3xl" />
              <div className="h-40 bg-gray-800 rounded-3xl" />
            </div>

          ) : !leetcodeStats ? (
            // 🟡 FIRST TIME USER (INPUT STATE)
            <div className="bg-[#111315] border border-gray-800 rounded-3xl p-6">

              <p className="text-gray-400 mb-4">
                Paste your LeetCode profile URL
              </p>

              <input
                type="text"
                placeholder="Paste LeetCode Profile URL"
                value={formData.leetcodeUrl}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    leetcodeUrl: e.target.value
                  })
                }
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 outline-none mb-4"
              />

              <button
                onClick={handleFetchLeetcode}
                className="w-full bg-green-700 hover:bg-green-900 py-3 rounded-xl font-semibold"
              >
                Fetch Stats
              </button>

            </div>

          ) : (
            // 🟢 DATA EXISTS STATE
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

              <div className="bg-[#111315] border border-gray-800 rounded-3xl p-6">
                <div className="space-y-4 text-gray-300">

                  <div className="flex justify-between">
                    <span className="text-green-500">Easy</span>
                    <span>{leetcodeStats?.easySolved || 0}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-yellow-500">Medium</span>
                    <span>{leetcodeStats?.mediumSolved || 0}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-red-500">Hard</span>
                    <span>{leetcodeStats?.hardSolved || 0}</span>
                  </div>

                </div>
              </div>

              <div className="bg-[#111315] border border-gray-800 rounded-3xl p-6">
                <p className="text-gray-400">Total Solved</p>
                <h2 className="text-4xl font-bold mt-2 text-yellow-500">
                  {leetcodeStats?.totalSolved || 0}
                </h2>
              </div>

              <div className="bg-[#111315] border border-gray-800 rounded-3xl p-6">
                <p className="text-gray-400">Ranking</p>
                <h2 className="text-4xl font-bold mt-2 text-blue-500">
                  #{leetcodeStats?.ranking || 0}
                </h2>
              </div>

            </div>
          )}
        </div>

        {
          showEditModal && (

            <div
              className="
      fixed inset-0
      bg-black/70
      z-50

      flex
      items-center
      justify-center

      p-3 sm:p-4
      "
            >

              <div
                className="
        w-full
        max-w-2xl

        bg-[#111315]
        border border-gray-700

        rounded-2xl sm:rounded-3xl

        p-4 sm:p-6

        max-h-[90vh]
        overflow-y-auto

        custom-scroll
        "
              >

                {/* HEADER */}

                <div className="flex items-center justify-between mb-6">

                  <h2 className="text-xl sm:text-2xl font-bold">

                    Edit Profile

                  </h2>

                  <button
                    onClick={() =>
                      setShowEditModal(false)
                    }
                    className="text-gray-400 hover:text-white text-2xl"
                  >

                    ✕

                  </button>

                </div>

                {/* FORM */}

                <div className="space-y-4">

                  <input
                    type="text"
                    placeholder="Name"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({

                        ...formData,

                        username:
                          e.target.value

                      })
                    }
                    className="
            w-full

            bg-gray-800
            border border-gray-700

            rounded-xl

            px-4 py-3

            text-sm sm:text-base

            outline-none
            "
                  />

                  <input
                    type="text"
                    placeholder="Profession"
                    value={formData.profession}
                    onChange={(e) =>
                      setFormData({

                        ...formData,

                        profession:
                          e.target.value

                      })
                    }
                    className="
            w-full
            bg-gray-800
            border border-gray-700
            rounded-xl
            px-4 py-3
            text-sm sm:text-base
            outline-none
            "
                  />

                  <textarea
                    rows="4"
                    placeholder="Bio"
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({

                        ...formData,

                        bio:
                          e.target.value

                      })
                    }
                    className="
            w-full
            bg-gray-800
            border border-gray-700
            rounded-xl
            px-4 py-3
            text-sm sm:text-base
            outline-none
            resize-none
            "
                  />

                  <input
                    type="text"
                    placeholder="Location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({

                        ...formData,

                        location:
                          e.target.value

                      })
                    }
                    className="
            w-full
            bg-gray-800
            border border-gray-700
            rounded-xl
            px-4 py-3
            text-sm sm:text-base
            outline-none
            "
                  />

                  <input
                    type="text"
                    placeholder="GitHub Link"
                    value={formData.github}
                    onChange={(e) =>
                      setFormData({

                        ...formData,

                        github:
                          e.target.value

                      })
                    }
                    className="
            w-full
            bg-gray-800
            border border-gray-700
            rounded-xl
            px-4 py-3
            text-sm sm:text-base
            outline-none
            "
                  />

                  <input
                    type="text"
                    placeholder="LinkedIn Link"
                    value={formData.linkedin}
                    onChange={(e) =>
                      setFormData({

                        ...formData,

                        linkedin:
                          e.target.value

                      })
                    }
                    className="
            w-full
            bg-gray-800
            border border-gray-700
            rounded-xl
            px-4 py-3
            text-sm sm:text-base
            outline-none
            "
                  />

                  <input
                    type="text"
                    placeholder="Portfolio Link"
                    value={formData.portfolio}
                    onChange={(e) =>
                      setFormData({

                        ...formData,

                        portfolio:
                          e.target.value

                      })
                    }
                    className="
            w-full
            bg-gray-800
            border border-gray-700
            rounded-xl
            px-4 py-3
            text-sm sm:text-base
            outline-none
            "
                  />

                  <input
                    type="text"
                    placeholder="Paste LeetCode Profile URL"
                    value={formData.leetcodeUrl}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        leetcodeUrl: e.target.value
                      })
                    }
                    className="
    w-full
    bg-gray-800
    border border-gray-700
    rounded-xl
    px-4 py-3
    text-sm sm:text-base
    outline-none
  "
                  />

                </div>

                {/* BUTTON */}

                <button
                  onClick={handleUpdateProfile}
                  className="
          mt-6
          w-full

          bg-blue-600
          hover:bg-blue-700

          py-3

          rounded-2xl

          font-semibold

          text-sm sm:text-base

          transition
          "
                >

                  Save Changes

                </button>

              </div>

            </div>

          )
        }

      </div>
    ) : (
      // Login If Not Verified
      <div className="flex items-center justify-center min-h-[80vh] p-4 overflow-hidden">
        <div className="text-center w-full max-w-sm p-6 rounded-2xl border border-gray-800 bg-[#111315] shadow-xl">
          {/* Icon */}
          <div className="text-4xl mb-3">🔒</div>

          {/* Title */}
          <h1 className="text-xl font-bold text-white mb-2">
            Account Verification Required
          </h1>
          {/* Simple text */}
          <p className="text-gray-400 text-sm mb-5">
            Please verify your email or login to continue.
          </p>

          {/* Button */}
          <button
            onClick={() => window.location.href = "/login"}
            className="w-full bg-blue-600 hover:bg-blue-700 transition py-2.5 rounded-xl font-medium"
          >
            Continue
          </button>

          {/* Small hint */}
          <p className="text-xs text-gray-500 mt-3">
            Create account or login if you already have one
          </p>

        </div>
      </div>
    )
  );

};

export default Profile;