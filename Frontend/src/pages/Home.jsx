import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Home = () => {

  const navigate = useNavigate();
  const [stateCount, setStateCount] = useState(null);


  // find a way to get the current streak count and display it in the hero section
  const getDashboardStats = async () => {

    try {

      const { data } = await API.get("/dashboard");

      setStateCount(data.data);

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {
    getDashboardStats();
  }, []);

  const scrollToFeatures = () => {
    const section = document.getElementById("how-it-works");
    const container = document.querySelector(".custom-scroll");

    if (section && container) {
      container.scrollTo({
        top: section.offsetTop,
        behavior: "smooth",
      });
    }
  };
  return (

    <div
      className="
        relative
        overflow-hidden
        min-h-screen
        
        bg-[#070b11]

       text-white

        transition-all duration-500
      "
    >

      {/* ================= BACKGROUND ================= */}

      {/* GRID */}

      <div
        className="
          absolute inset-0

          [background-size:45px_45px]

          [background-image:
          linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),
          linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)]

          dark:[background-image:
          linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),
          linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)]
        "
      />

      {/* GLOW */}

      <div
        className="
          absolute

          top-[-180px]
          left-[-120px]

          w-[500px]
          h-[500px]

          bg-cyan-500/20

          blur-[140px]

          rounded-full
        "
      />

      <div
        className="
          absolute

          bottom-[-200px]
          right-[-150px]

          w-[550px]
          h-[550px]

          bg-purple-500/20

          blur-[160px]

          rounded-full
        "
      />

      {/* ================= HERO ================= */}

      <section
        className="
          relative z-10

          max-w-7xl
          mx-auto

          px-6
          py-10 lg:py-5
          min-h-screen

          flex items-center
        "
      >

        <div
          className="
            grid
            lg:grid-cols-2

            gap-20

            items-center

            w-full
          "
        >

          {/* ================= LEFT ================= */}

          <div>

            {/* BADGE */}

            <div
              className="
                inline-flex

                items-center gap-2

                px-5 py-2

                rounded-full

                border border-cyan-500/20

                bg-cyan-500/10

                text-cyan-400

                backdrop-blur-xl

                text-sm
                font-medium
              "
            >

              🚀 Modern DSA Tracker

            </div>

            {/* TITLE */}

            <h1
              className="
                mt-8

                text-6xl
                sm:text-7xl
                lg:text-8xl

                font-black

                leading-none
              "
            >

              TRACK.

              <br />

              <span
                className="
                  bg-gradient-to-r
                  from-cyan-400
                  via-blue-500
                  to-purple-500

                  bg-clip-text
                  text-transparent
                "
              >

                PRACTICE.

              </span>

              <br />

              WIN.

            </h1>

            {/* DESC */}

            <p
              className="
                mt-8

                text-lg

                leading-relaxed

                max-w-xl

               text-gray-400
              "
            >

              Organize topics, solve patterns,
              track coding streaks, manage notes,
              bookmarks, AI hints, and level up your
              DSA journey with a futuristic experience.

            </p>

            {/* BUTTONS */}

            <div className="flex flex-wrap gap-5 mt-10">

              <button
                className="
                  px-8 py-4

                  rounded-2xl

                  bg-gradient-to-r
                  from-cyan-500
                  to-blue-600

                  hover:scale-105

                  transition-all duration-300

                  font-semibold

                  shadow-[0_0_40px_rgba(34,211,238,0.4)]
                "
                onClick={() => navigate("/topics")}
              >

                Get Started

              </button>

              <button
                onClick={scrollToFeatures}


                className="
                  px-8 py-4

                  rounded-2xl

                  border

                  border-white/10

                 bg-white/5

                  backdrop-blur-xl

                  hover:border-cyan-400

                  transition-all duration-300
                "
              >

                Explore Features

              </button>

            </div>

            {/* SMALL STATS */}

            <div className="flex flex-wrap gap-5 mt-5">

              {[
                "🔥 Daily Streaks",
                "🤖 AI Hints",
                "📈 Progress Insights",
              ].map((item, index) => (

                <div
                  key={index}
                  className="
                    px-5 py-3

                    rounded-2xl

                    bg-white/5

                    border

                    border-white/10

                    backdrop-blur-xl
                  "
                >

                  {item}

                </div>

              ))}

            </div>

          </div>

          {/* ================= RIGHT ================= */}

          <div className="relative">

            {/* FLOAT CARD */}

            <div
              className="
    absolute
    z-10
    -top-11
    lg:-left-10 -left-5
    w-52 /* Width ko thoda badha diya hai taaki text thik se ek hi line me fit ho jaye */
    rounded-3xl
    bg-white/5
    border
    border-white/10
    backdrop-blur-2xl
    p-5
    shadow-2xl
    animate-bounce
  "
            >
              <p className="text-sm text-gray-500">
                Daily Streak
              </p>

              {
                stateCount?.currentStreak !== undefined && stateCount?.currentStreak !== null ? (
                  // items-baseline se number aur text ka bottom alignment ekdum perfect dikhega
                  <div className="flex items-baseline gap-2 mt-2">
                    {/* Streak Number */}
                    <h2 className="text-4xl font-black text-cyan-400">
                      {stateCount.currentStreak}
                    </h2>

                    {/* Text right next to the number */}
                    <p className="text-[11px] font-bold text-gray-400 tracking-wide uppercase whitespace-nowrap">
                      {stateCount.currentStreak === 0
                        ? "— Start Now! 🔥"
                        : "— Active ⚡"
                      }
                    </p>
                  </div>
                ) : (
                  <p
                    onClick={() => { navigate('/login') }}
                    className="text-xs cursor-pointer text-gray-400 mt-2 hover:text-white transition-colors"
                  >
                    Please Login
                  </p>
                )
              }
            </div>

            {/* MAIN CARD */}

            <div
              className="
                relative

                rounded-[35px]

                bg-white/5

                border

               border-white/10

                backdrop-blur-2xl

                p-7

                shadow-[0_20px_80px_rgba(0,0,0,0.25)]
              "
            >

              {/* TOP */}

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="text-2xl font-bold">
                    Coding Dashboard
                  </h2>

                  <p className="text-gray-400 mt-1">
                    Your coding analytics
                  </p>

                </div>

                <div
                  className="
                    w-14 h-14

                    rounded-2xl

                    bg-cyan-500/20

                    flex items-center justify-center

                    text-2xl
                  "
                >

                  ⚡

                </div>

              </div>

              {/* STATS */}

              <div className="grid grid-cols-2 gap-5 mt-8">

                <div
                  className="
                    rounded-2xl

                   bg-[#111315]
border-gray-800

                    p-5
                  "
                >

                  <p className="text-gray-500 text-sm">
                    Problems
                  </p>

                  <h3 className="text-4xl font-black mt-3 text-cyan-400">
                    200+
                  </h3>

                </div>

                <div
                  className="
                    rounded-2xl

                    bg-[#111315]

                   border-gray-800

                    p-5
                  "
                >

                  <p className="text-gray-500 text-sm">
                    Patterns
                  </p>

                  <h3 className="text-4xl font-black mt-3 text-purple-400">
                    60+
                  </h3>

                </div>

              </div>

              {/* HEATMAP */}

              <div className="mt-8">

                <p className="text-sm text-gray-500 mb-4">
                  Coding Activity
                </p>

                <div className="grid grid-cols-12 gap-1">

                  {
                    Array.from({ length: 84 }).map((_, i) => (

                      <div
                        key={i}
                        className={`
                          w-4 h-4 rounded-sm

                          ${i % 5 === 0
                            ? "bg-cyan-500"
                            : i % 4 === 0
                              ? "bg-cyan-400/70"
                              : "bg-[#1f2937]"
                          }
                        `}
                      />

                    ))
                  }

                </div>

              </div>

            </div>

            {/* FLOAT CARD 2 */}

            <div
              className="
                absolute

                -bottom-8
                right-[-20px]

                w-52

                rounded-3xl

               bg-white/5

                border

               border-white/10

                backdrop-blur-2xl

                p-5

                shadow-2xl
              "
            >

              <p className="text-sm text-gray-500">
                AI Hints Used
              </p>

              <h2 className="text-4xl font-black mt-2 text-purple-400">
                100+
              </h2>

            </div>

          </div>

        </div>

      </section>
      {/* ================= HOW IT WORKS ================= */}
      <section
        className="
    relative z-10

    max-w-7xl
    mx-auto

    px-6
    py-12
  "
      >

        {/* TITLE */}

        <div className="text-center mb-10">

          <h2 className="text-4xl sm:text-5xl font-black">

            How It Works

          </h2>

          <p className="mt-2 text-gray-400">

            Learn topic → pattern → problem

          </p>

        </div>

        {/* MAIN WRAPPER */}

        <div
          className="
      relative

      rounded-[35px]

      bg-white/5

      border

      border-white/10

      backdrop-blur-2xl

      p-6 sm:p-8 lg:p-10

      overflow-hidden
    "
        >

          {/* GLOW */}

          <div
            className="
        absolute

        top-0 right-0

        w-72 h-72

        bg-cyan-500/10

        blur-3xl

        rounded-full
      "
          />

          {/* FLOW LIST */}

          <div className="space-y-6 max-w-5xl mx-auto">

            {/* FLOW CARD 1 */}
            <div className="group relative grid gap-6 rounded-3xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/40 lg:grid-cols-[200px_40px_220px_40px_1fr] lg:items-center">
              <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-center lg:text-left">
                <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">Step 01</span>
                <h3 className="text-lg font-bold text-white mt-0.5">Linked List</h3>
              </div>
              <div className="hidden lg:block text-center text-xl font-bold text-cyan-500/50 group-hover:text-cyan-400 transition-colors">➔</div>
              <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-4 text-center lg:text-left">
                <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400">Pattern Focus</span>
                <h3 className="text-base font-bold text-white mt-0.5">Fast & Slow Pointer</h3>
              </div>
              <div className="hidden lg:block text-center text-xl font-bold text-purple-500/50 group-hover:text-purple-400 transition-colors">➔</div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-zinc-950/80 border border-zinc-800 p-4 transition-all hover:scale-[1.02]">
                  <span className="text-[10px] text-cyan-400 font-semibold">LeetCode 141</span>
                  <h4 className="font-bold text-sm text-zinc-200 mt-1">Linked List Cycle</h4>
                </div>
                <div className="rounded-xl bg-zinc-950/80 border border-zinc-800 p-4 transition-all hover:scale-[1.02]">
                  <span className="text-[10px] text-purple-400 font-semibold">LeetCode 876</span>
                  <h4 className="font-bold text-sm text-zinc-200 mt-1">Middle of Node</h4>
                </div>
              </div>
            </div>

            {/* FLOW CARD 2 */}
            <div className="group relative grid gap-6 rounded-3xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/40 lg:grid-cols-[200px_40px_220px_40px_1fr] lg:items-center">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center lg:text-left">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Step 02</span>
                <h3 className="text-lg font-bold text-white mt-0.5">Arrays Matrix</h3>
              </div>
              <div className="hidden lg:block text-center text-xl font-bold text-emerald-500/50 group-hover:text-emerald-400 transition-colors">➔</div>
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-center lg:text-left">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Pattern Focus</span>
                <h3 className="text-base font-bold text-white mt-0.5">Sliding Window</h3>
              </div>
              <div className="hidden lg:block text-center text-xl font-bold text-amber-500/50 group-hover:text-amber-400 transition-colors">➔</div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-zinc-950/80 border border-zinc-800 p-4 transition-all hover:scale-[1.02]">
                  <span className="text-[10px] text-emerald-400 font-semibold">LeetCode 53</span>
                  <h4 className="font-bold text-sm text-zinc-200 mt-1">Maximum Subarray</h4>
                </div>
                <div className="rounded-xl bg-zinc-950/80 border border-zinc-800 p-4 transition-all hover:scale-[1.02]">
                  <span className="text-[10px] text-amber-400 font-semibold">LeetCode 3</span>
                  <h4 className="font-bold text-sm text-zinc-200 mt-1">Longest Substring</h4>
                </div>
              </div>
            </div>

          </div>

        </div>

      </section>
      {/* ================= FEATURES ================= */}

      <section id="how-it-works"
        className="
    relative z-10

    max-w-7xl
    mx-auto

    px-6
    py-2
  "
      >

        {/* HEADER */}

        <div className="text-center mb-10">

          <div
            className="
        inline-flex

        items-center gap-2

        px-5 py-2

        rounded-full

        bg-cyan-500/10

        border border-cyan-500/20

        text-cyan-400

        text-sm font-medium
      "
          >

            ✨ Features

          </div>

          <h2
            className="
        mt-6

        text-5xl
        sm:text-6xl

        font-black

        leading-tight
      "
          >

            Everything You Need
            <br />

            <span
              className="
          bg-gradient-to-r
          from-cyan-400
          via-blue-500
          to-purple-500

          bg-clip-text
          text-transparent
        "
            >

              To Master DSA

            </span>

          </h2>

          <p
            className="
        mt-2

        max-w-2xl
        mx-auto

        text-lg

       text-gray-400

        leading-relaxed
      "
          >

            A complete modern coding tracker with AI,
            progress analytics, bookmarks, notes,
            heatmaps, and beautiful UI.

          </p>

        </div>

        {/* GRID */}

        <div
          className="
      grid

      grid-cols-1
      md:grid-cols-2
      xl:grid-cols-4

      gap-6
    "
        >

          {/* BIG CARD */}

          <div
            className="
        relative

        xl:col-span-2
        xl:row-span-2

        overflow-hidden

        rounded-[38px]

        border border-cyan-500/20

        bg-gradient-to-br
        from-cyan-500/10
        via-blue-500/10
        to-purple-500/10

        backdrop-blur-2xl

        p-8
      "
          >

            {/* GLOW */}

            <div
              className="
          absolute

          top-[-60px]
          right-[-60px]

          w-52 h-52

          bg-cyan-500/20

          blur-3xl

          rounded-full
        "
            />

            {/* TOP */}

            <div className="relative z-10">

              <div
                className="
            w-16 h-16

            rounded-2xl

            bg-cyan-500/20

            flex items-center justify-center

            text-3xl
          "
              >

                🤖

              </div>

              <h3
                className="
            mt-8

            text-4xl

            font-black
          "
              >

                AI Powered
                <br />
                Coding Hints

              </h3>

              <p
                className="
            mt-5

            text-lg

            leading-relaxed

            text-gray-300

            max-w-lg
          "
              >

                Get intelligent coding guidance
                without spoilers and improve
                your problem-solving ability.

              </p>

            </div>

            {/* MINI CHAT */}

            <div
              className="
          relative z-10

          mt-12

          space-y-4
        "
            >

              <div
                className="
            ml-auto

            max-w-sm

            rounded-2xl

            bg-cyan-500

            px-5 py-4

            text-white

            shadow-xl
          "
              >

                How do I optimize this problem?

              </div>

              <div
                className="
            max-w-md

            rounded-2xl

            bg-[#111315]

            border-gray-800

            px-5 py-4

            text-gray-300
          "
              >

                Try using a sliding window instead
                of nested loops 👀

              </div>

            </div>

          </div>

          {/* SMALL CARDS */}

          {[
            {
              icon: "📚",
              title: "Topic Wise Learning",
              desc: "Organize DSA by topic & patterns",
              color: "from-cyan-500/20 to-blue-500/20"
            },
            {
              icon: "📊",
              title: "Dashboard Insights",
              desc: "View topic, pattern and question statistics",
              color: "from-yellow-500/20 to-orange-500/20"
            },

            {
              icon: "🛟",
              title: "Support Center",
              desc: "Create tickets and get help when you need it",
              color: "from-red-500/20 to-pink-500/20"
            },
            {
              icon: "📈",
              title: "Smart Progress",
              desc: "Analyze solved questions & growth",
              color: "from-green-500/20 to-emerald-500/20"
            }


          ].map((item, index) => (

            <div
              key={index}
              className="
          group

          relative

          overflow-hidden

          rounded-[32px]

          border

          border-white/10

          bg-white/5

          backdrop-blur-2xl

          p-7

          hover:-translate-y-2

          transition-all duration-500
        "
            >

              {/* BG */}

              <div
                className={`
            absolute inset-0

            opacity-0

            group-hover:opacity-100

            transition-all duration-500

            bg-gradient-to-br ${item.color}
          `}
              />

              <div className="relative z-10">

                {/* ICON */}

                <div
                  className="
              w-16 h-16

              rounded-2xl

              bg-[#111315]

              border border-gray-800

              flex items-center justify-center

              text-3xl

              shadow-lg
            "
                >

                  {item.icon}

                </div>

                {/* TITLE */}

                <h3
                  className="
              mt-2

              text-2xl

              font-bold
            "
                >

                  {item.title}

                </h3>

                {/* DESC */}

                <p
                  className="
              mt-3

              leading-relaxed

              text-gray-400
            "
                >

                  {item.desc}

                </p>

              </div>

            </div>

          ))}

        </div>

      </section>

    </div>

  );

};

export default Home;