import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip
} from "recharts";


const Dashboard = () => {

    const navigate = useNavigate();

    const [stats, setStats] = useState(null);
    const [topicProgress, setTopicProgress] = useState([]);
    const [heatmapData, setHeatmapData] = useState([]);
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    // =========================
    // GET DASHBOARD DATA
    // =========================
    const getDashboardStats = async () => {

        try {

            const { data } = await API.get("/dashboard");

            setStats(data.data);

        } catch (error) {

            console.log(error);

        }

    };

    // =========================
    // GET TOPIC PROGRESS
    // =========================
    const getTopicProgress = async () => {

        try {

            const { data } = await API.get(
                "/dashboard/topic-progress"
            );

            setTopicProgress(data.data);

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {
        getDashboardStats();
        getTopicProgress();
    }, []);

    // =========================
    // GET USER
    // ========================
    const getMe = async () => {

        try {
            setAuthLoading(true);
            const { data } = await API.get(
                "/auth/getuser"
            );

            setUser(data.user);

        } catch {

            setUser(null);

        } finally {

            setAuthLoading(false);
        }

    };

    useEffect(() => {

        getMe();

    }, []);


    // =========================
    // DIFFICULTY COLOR
    // =========================

    const getDifficultyColor = (difficulty) => {

        if (difficulty === "easy") {

            return "text-green-400 bg-green-500/10 border-green-500/20";

        }

        if (difficulty === "medium") {

            return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";

        }

        return "text-red-400 bg-red-500/10 border-red-500/20";

    };
    // =========================
    // CHART DATA
    // =========================

    const chartData = stats ? [

        {
            name: "Solved",
            value: stats.solvedQuestions
        },

        {
            name: "Remaining",
            value:
                stats.totalQuestions -
                stats.solvedQuestions
        }

    ] : [];

    const COLORS = [
        "#22c55e",
        "#1f2937"
    ];

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

    if (!user) {

        return (

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
        );

    }

    return (

        <motion.div
            initial={{
                opacity: 0,
                y: 20
            }}
            animate={{
                opacity: 1,
                y: 0
            }}
            transition={{
                duration: 0.5
            }}
            className="min-h-screen text-white p-4 sm:p-6"
        >

            {/* HEADER */}

            <div className="mb-8">

                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">

                    Dashboard

                </h1>

                <p className="text-gray-400 mt-2 text-sm">

                    Track your coding journey & progress

                </p>

            </div>

            {/* LOADING */}

            {
                !stats ? (

                    <div>

                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">

                            {
                                [...Array(6)].map((_, i) => (

                                    <div
                                        key={i}
                                        className="bg-[#111315]/80 border border-gray-800 rounded-3xl p-5 animate-pulse"
                                    >

                                        <div className="h-3 w-20 bg-gray-700 rounded mb-5"></div>

                                        <div className="h-8 w-12 bg-gray-700 rounded"></div>

                                    </div>

                                ))
                            }

                        </div>

                    </div>

                ) : (

                    <>

                        {/* TOP STATS */}

                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">

                            {/* TOPICS */}

                            <div
                                onClick={() => navigate('/topics')}
                                className="cursor-pointer group bg-linear-to-br from-[#111315] to-[#181b20] border border-gray-800 rounded-3xl p-5 hover:border-blue-500 hover:-translate-y-1 transition duration-300 shadow-lg"
                            >

                                <p className="text-gray-400 text-sm">

                                    Topics

                                </p>

                                <h2 className="text-4xl font-bold mt-4">

                                    {stats.totalTopics}

                                </h2>

                            </div>

                            {/* PATTERNS */}

                            <div
                                className="group bg-linear-to-br from-[#111315] to-[#181b20] border border-gray-800 rounded-3xl p-5 hover:border-indigo-500 hover:-translate-y-1 transition duration-300 shadow-lg"
                            >

                                <p className="text-gray-400 text-sm">

                                    Patterns

                                </p>

                                <h2 className="text-4xl font-bold mt-4">

                                    {stats.totalPatterns}

                                </h2>

                            </div>

                            {/* QUESTIONS */}

                            <div
                                className="group bg-linear-to-br from-[#111315] to-[#181b20] border border-gray-800 rounded-3xl p-5 hover:border-cyan-500 hover:-translate-y-1 transition duration-300 shadow-lg"
                            >

                                <p className="text-gray-400 text-sm">

                                    Questions

                                </p>

                                <h2 className="text-4xl font-bold mt-4">

                                    {stats.totalQuestions}

                                </h2>

                            </div>

                            {/* SOLVED */}

                            <div
                                onClick={() => navigate('/solved')}
                                className="cursor-pointer group bg-linear-to-br from-[#111315] to-[#181b20] border border-gray-800 rounded-3xl p-5 hover:border-green-500 hover:-translate-y-1 transition duration-300 shadow-lg"
                            >

                                <p className="text-gray-400 text-sm">

                                    Solved

                                </p>

                                <h2 className="text-4xl font-bold mt-4 text-green-400">

                                    {stats.solvedQuestions}

                                </h2>

                            </div>

                            {/* BOOKMARKS */}

                            <div
                                onClick={() => navigate('/bookmarks')}
                                className="cursor-pointer group bg-linear-to-br from-[#111315] to-[#181b20] border border-gray-800 rounded-3xl p-5 hover:border-yellow-500 hover:-translate-y-1 transition duration-300 shadow-lg"
                            >

                                <p className="text-gray-400 text-sm">

                                    Bookmarks

                                </p>

                                <h2 className="text-4xl font-bold mt-4 text-yellow-400">

                                    {stats.bookmarkedQuestions}

                                </h2>

                            </div>

                            {/* NOTES */}

                            <div
                                onClick={() => navigate('/notes')}
                                className="cursor-pointer group bg-linear-to-br from-[#111315] to-[#181b20] border border-gray-800 rounded-3xl p-5 hover:border-cyan-500 hover:-translate-y-1 transition duration-300 shadow-lg"
                            >

                                <p className="text-gray-400 text-sm">

                                    Notes

                                </p>

                                <h2 className="text-4xl font-bold mt-4 text-cyan-400">

                                    {stats.totalNotes}

                                </h2>

                            </div>

                        </div>

                        {/* CHART + PROGRESS */}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

                            {/* OVERALL PROGRESS */}

                            <div className="bg-linear-to-br from-[#111315] to-[#181b20] border border-gray-800 rounded-3xl p-6 shadow-lg">

                                <div className="flex items-center justify-between mb-5">

                                    <div>

                                        <h2 className="text-xl font-semibold">

                                            Overall Progress

                                        </h2>

                                        <p className="text-gray-400 text-sm mt-1">

                                            Keep solving daily 🚀

                                        </p>

                                    </div>

                                    <div className="text-2xl font-bold text-green-400">

                                        {stats.progressPercent}%

                                    </div>

                                </div>

                                <div className="w-full h-5 bg-black/40 rounded-full overflow-hidden border border-gray-800">

                                    <motion.div initial={{ width: 0 }} animate={{ width: `${stats.progressPercent}%` }} transition={{ duration: 1 }} className="h-full bg-linear-to-r from-green-400 via-green-500 to-emerald-600 rounded-full"
                                        style={{
                                            width: `${stats.progressPercent}%`
                                        }}
                                    ></motion.div>

                                </div>
                                <div className="mt-5">
                                    <h2 className="text-xl font-semibold mb-5">

                                        Solved vs Remaining

                                    </h2>

                                    <div className="h-[250px]">

                                        <ResponsiveContainer width="100%" height="100%">

                                            <PieChart>

                                                <Pie
                                                    data={chartData}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={80}
                                                    label
                                                >

                                                    {
                                                        chartData.map((entry, index) => (

                                                            <Cell
                                                                key={index}
                                                                fill={COLORS[index % COLORS.length]}
                                                            />

                                                        ))
                                                    }

                                                </Pie>

                                                <Tooltip />

                                            </PieChart>

                                        </ResponsiveContainer>

                                    </div>
                                </div>

                            </div>

                            <div className="bg-linear-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-3xl p-6 shadow-lg">

                                <div className="flex items-center justify-between">

                                    <div>

                                        <p className="text-orange-300 text-sm">

                                            Current Streak

                                        </p>

                                        <h2 className="text-5xl font-bold mt-3 text-white">

                                            {stats.currentStreak} Days

                                        </h2>

                                        <p className="text-gray-400 text-sm mt-3 leading-relaxed">

                                            Keep solving daily to maintain streak 🚀

                                        </p>

                                    </div>

                                    <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-7xl" > 🔥 </motion.div>

                                </div>

                                {/* STATS */}

                                <div className="grid grid-cols-2 gap-4 mt-6">

                                    {/* SOLVED TODAY */}

                                    <div className="bg-black/20 border border-orange-500/10 rounded-2xl p-4 min-h-[120px] flex flex-col justify-between hover:border-orange-400/30 transition">

                                        <p className="text-gray-400 text-sm">

                                            Solved Today

                                        </p>

                                        <div>

                                            <h3 className="text-3xl font-bold text-orange-300">

                                                {stats.solvedToday}

                                            </h3>

                                            <p className="text-xs text-gray-500 mt-1">

                                                Questions completed

                                            </p>

                                        </div>

                                    </div>

                                    {/* BEST STREAK */}

                                    <div className="bg-black/20 border border-orange-500/10 rounded-2xl p-4 min-h-[120px] flex flex-col justify-between hover:border-orange-400/30 transition">

                                        <p className="text-gray-400 text-sm">

                                            Best Streak

                                        </p>

                                        <div>

                                            <h3 className="text-3xl font-bold text-orange-300">

                                                {stats.bestStreak}

                                            </h3>

                                            <p className="text-xs text-gray-500 mt-1">

                                                Highest consistency

                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>



                        </div>

                        {/* RECENT SECTION */}

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-8">

                            {/* RECENT SOLVED */}

                            <div className="bg-linear-to-br from-[#111315] to-[#181b20] border border-gray-800 rounded-3xl p-5 shadow-lg">

                                <div className="flex items-center justify-between mb-5">

                                    <h2 className="text-lg font-semibold">

                                        Recent Solved

                                    </h2>

                                    <span className="text-green-400 text-sm">

                                        {stats.recentSolved?.length}

                                    </span>

                                </div>

                                <div className="space-y-3 h-95 overflow-y-auto custom-scroll pr-1">

                                    {
                                        stats.recentSolved?.length > 0 ? (

                                            stats.recentSolved.map((item) => (

                                                <div
                                                    key={item._id}
                                                    className="bg-black/30 border border-gray-800 rounded-2xl p-4 hover:border-green-500 transition"
                                                >

                                                    <h3 className="text-sm font-medium text-gray-200 leading-relaxed">

                                                        {item.questionId?.title || "Question Deleted"}

                                                    </h3>

                                                    <span
                                                        className={`inline-block mt-3 text-xs px-3 py-1 rounded-full border capitalize ${getDifficultyColor(
                                                            item.questionId?.difficulty
                                                        )}`}
                                                    >

                                                        {item.questionId?.difficulty || "unknown"}

                                                    </span>

                                                </div>

                                            ))

                                        ) : (

                                            <div className="h-full flex items-center justify-center text-gray-500 text-sm">

                                                No solved questions

                                            </div>

                                        )
                                    }

                                </div>

                            </div>

                            {/* RECENT BOOKMARKS */}

                            <div className="bg-linear-to-br from-[#111315] to-[#181b20] border border-gray-800 rounded-3xl p-5 shadow-lg">

                                <div className="flex items-center justify-between mb-5">

                                    <h2 className="text-lg font-semibold">

                                        Recent Bookmarks

                                    </h2>

                                    <span className="text-yellow-400 text-sm">

                                        {stats.recentBookmarks?.length}

                                    </span>

                                </div>

                                <div className="space-y-3 h-95 overflow-y-auto custom-scroll pr-1">

                                    {
                                        stats.recentBookmarks?.length > 0 ? (

                                            stats.recentBookmarks.map((item) => (

                                                <div
                                                    key={item._id}
                                                    className="bg-black/30 border border-gray-800 rounded-2xl p-4 hover:border-yellow-500 transition"
                                                >

                                                    <h3 className="text-sm font-medium text-gray-200 leading-relaxed">

                                                        {item.questionId?.title || "Question Deleted"}

                                                    </h3>

                                                    <span
                                                        className={`inline-block mt-3 text-xs px-3 py-1 rounded-full border capitalize ${getDifficultyColor(
                                                            item.questionId?.difficulty
                                                        )}`}
                                                    >

                                                        {item.questionId?.difficulty || "unknown"}

                                                    </span>

                                                </div>

                                            ))

                                        ) : (

                                            <div className="h-full flex items-center justify-center text-gray-500 text-sm">

                                                No bookmarks

                                            </div>

                                        )
                                    }

                                </div>

                            </div>

                            {/* RECENT NOTES */}

                            <div className="bg-linear-to-br from-[#111315] to-[#181b20] border border-gray-800 rounded-3xl p-5 shadow-lg">

                                <div className="flex items-center justify-between mb-5">

                                    <h2 className="text-lg font-semibold">

                                        Recent Notes

                                    </h2>

                                    <span className="text-cyan-400 text-sm">

                                        {stats.recentNotes?.length}

                                    </span>

                                </div>

                                <div className="space-y-3 h-95 overflow-y-auto custom-scroll pr-1">

                                    {
                                        stats.recentNotes?.length > 0 ? (

                                            stats.recentNotes.map((note) => (

                                                <div
                                                    key={note._id}
                                                    className="bg-black/30 border border-gray-800 rounded-2xl p-4 hover:border-cyan-500 transition"
                                                >

                                                    <h3 className="text-sm font-semibold text-cyan-400 mb-3 leading-relaxed">

                                                        {note.questionTitle}

                                                    </h3>

                                                    <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto custom-scroll pr-1">

                                                        {note.note}

                                                    </p>

                                                </div>

                                            ))

                                        ) : (

                                            <div className="h-full flex items-center justify-center text-gray-500 text-sm">

                                                No notes found

                                            </div>

                                        )
                                    }

                                </div>

                            </div>

                        </div>


                        {/* TOPIC PROGRESS */}

                        <div className="bg-linear-to-br from-[#111315] to-[#181b20] border border-gray-800 rounded-3xl p-6 mt-8 shadow-lg">

                            <div className="flex items-center justify-between mb-6">

                                <div>

                                    <h2 className="text-xl font-semibold">

                                        Topic Progress

                                    </h2>

                                    <p className="text-sm text-gray-400 mt-1">

                                        Track topic-wise mastery

                                    </p>

                                </div>

                                <span className="text-blue-400 text-sm font-medium">

                                    {topicProgress.length} Topics

                                </span>

                            </div>

                            <div className="space-y-5">

                                {
                                    topicProgress.length > 0 ? (

                                        topicProgress.map((topic, index) => (

                                            <div
                                                key={index}
                                                className="bg-black/30 border border-gray-800 rounded-2xl p-4 hover:border-blue-500 transition"
                                            >

                                                <div className="flex items-center justify-between mb-3">

                                                    <div>

                                                        <h3 className="text-sm sm:text-base font-semibold text-gray-200">

                                                            {topic.topicName}

                                                        </h3>

                                                        <p className="text-xs text-gray-500 mt-1">

                                                            {topic.solvedQuestions} / {topic.totalQuestions} solved

                                                        </p>

                                                    </div>

                                                    <div className="text-blue-400 font-bold text-sm">

                                                        {topic.progress}%

                                                    </div>

                                                </div>

                                                <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">

                                                    <div
                                                        className={`h-full rounded-full transition-all duration-700
                                                        ${topic.progress < 30
                                                                ? "bg-red-500"
                                                                : topic.progress < 70
                                                                    ? "bg-yellow-500"
                                                                    : "bg-green-500"
                                                            }`}
                                                        style={{
                                                            width: `${topic.progress}%`
                                                        }}
                                                    ></div>

                                                </div>

                                            </div>

                                        ))

                                    ) : (

                                        <div className="text-center text-gray-500 text-sm py-10">

                                            No topic progress found

                                        </div>

                                    )
                                }

                            </div>

                        </div>

                    </>

                )
            }

        </motion.div>

    );

};

export default Dashboard;
