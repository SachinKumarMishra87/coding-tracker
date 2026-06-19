import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

const PublicProfile = () => {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const location = useLocation();
    const [stats, setStats] = useState(location.state?.leetcodeStats || null);

    const totalSolved = stats?.totalSolved || 0;
    const goal = 500;
    const progressPercentage = Math.min((totalSolved / goal) * 100, 100); // 100% se upar na jaye

    const navigate = useNavigate();

    // 🎯 Encoded URL for space fix (WhatsApp share)
    const getShareableUrl = () => {
        return `https://www.leetpattracker.in/u/${encodeURIComponent(username)}`;
    };

    const getProfile = async () => {
        try {
            const res = await API.get(`/auth/public/${username}`);
            setUser(res.data.user);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getProfile();
    }, [username]);

    const formatUrl = (url) => {
        if (!url) return "#";
        if (url.startsWith("http://") || url.startsWith("https://")) {
            return url;
        }
        return `https://${url}`;
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#080f0f] text-cyan-400 font-medium tracking-wider">
                <div className="animate-pulse flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-cyan-400 animate-ping"></span>
                    Fetching Developer Profile...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#080f0f] bg-gradient-to-br from-[#050d0d] via-[#080f0f] to-[#0a1716] text-white p-4 sm:p-8 flex items-center justify-center selection:bg-cyan-500/30 relative">

            <button
                onClick={() => navigate("/")}
                className="
                            flex items-center gap-2
                            text-gray-400
                            hover:text-cyan-400
                            transition
                         absolute z-10 top-5 left-5
                        "
            >
                ← Back
            </button>

            <div className="w-full max-w-4xl bg-[#112523]/30 backdrop-blur-xl rounded-3xl border border-cyan-500/10 shadow-2xl p-6 sm:p-10 relative overflow-hidden group">

                {/* Background Ambient Lights */}
                <div className="absolute -top-32 -left-32 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/15 transition-all duration-700"></div>
                <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/15 transition-all duration-700"></div>

                {/* MAIN INFRASTRUCTURE */}
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">

                    {/* LEFT SECTION: AVATAR & QUICK STATS */}
                    <div className="flex flex-col items-center gap-4 flex-shrink-0">
                        <div className="relative group/avatar">
                            <div className="absolute -inset-1 bg-gradient-to-tr from-cyan-500 to-purple-500 rounded-full blur opacity-30 group-hover/avatar:opacity-70 transition duration-500"></div>
                            {user.profileImage ? (
                                <img
                                    src={user.profileImage}
                                    alt="profile"
                                    className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-[#081212]"
                                />
                            ) : (
                                <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-5xl font-black text-white">
                                    {user.username?.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        {user.location && (
                            <span className="px-3 py-1 bg-cyan-950/50 rounded-full border border-cyan-500/10 text-xs text-gray-400 font-medium tracking-wide">
                                📍 {user.location}
                            </span>
                        )}
                    </div>

                    {/* CENTER SECTION: BIO & PROFILE CORE */}
                    <div className="flex-1 text-center md:text-left space-y-4 w-full">
                        <div>
                            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-gray-400 bg-clip-text text-transparent break-words">
                                {user.username}
                            </h1>
                            {user.profession && (
                                <p className="text-cyan-400 font-medium text-base sm:text-lg mt-1 tracking-wide inline-flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                                    {user.profession}
                                </p>
                            )}
                        </div>

                        <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-xl font-light">
                            {user.bio || "This developer prefers keeping their bio a mystery. 💻"}
                        </p>

                        {/* INTERNAL SHARING TRIGGERS */}
                        <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-3">
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(getShareableUrl());
                                    alert("Makkhan! Link copied. 🔥");
                                }}
                                className="px-4 py-2 bg-cyan-950/60 hover:bg-cyan-500 text-cyan-400 hover:text-black border border-cyan-500/30 hover:border-transparent rounded-xl text-xs font-semibold tracking-wider transition-all duration-300 transform active:scale-95"
                            >
                                🔗 Copy Profile Link
                            </button>
                        </div>
                    </div>

                    {/* RIGHT SECTION: SOCIO-INTEGRATION CODES */}
                    <div className="w-full md:w-[220px] flex flex-col gap-2.5">
                        <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold text-center md:text-left">Developer Handshakes</span>

                        {user.github && (
                            <a
                                href={formatUrl(user.github)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-300 transition-all duration-200"
                            >
                                <span>🐙 GitHub</span>
                                <span className="text-[10px] text-slate-500">→</span>
                            </a>
                        )}

                        {user.linkedin && (
                            <a
                                href={formatUrl(user.linkedin)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-blue-950/40 hover:bg-blue-900/50 border border-blue-500/10 hover:border-blue-500/30 text-xs font-medium text-blue-300 transition-all duration-200"
                            >
                                <span>💼 LinkedIn</span>
                                <span className="text-[10px] text-blue-500">→</span>
                            </a>
                        )}

                        {user.portfolio && (
                            <a
                                href={formatUrl(user.portfolio)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/10 hover:border-purple-500/30 text-xs font-medium text-purple-300 transition-all duration-200"
                            >
                                <span>🌐 Portfolio</span>
                                <span className="text-[10px] text-purple-500">→</span>
                            </a>
                        )}

                        {user.leetcodeUrl && (
                            <a
                                href={formatUrl(user.leetcodeUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/10 hover:border-amber-500/30 text-xs font-medium text-amber-300 transition-all duration-200"
                            >
                                <span>🟨 LeetCode</span>
                                <span className="text-[10px] text-amber-500">→</span>
                            </a>
                        )}
                    </div>
                </div>

                {/* 🚀 CODING STATS ENGINE */}
                <div className="mt-8 pt-6 border-t border-cyan-500/5">
                    <h3 className="text-xs uppercase tracking-widest text-cyan-500 font-bold mb-4 text-center md:text-left">Coding Statistics</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-[#0b1414] border border-cyan-500/5 p-4 rounded-2xl">
                            <span className="text-gray-500 text-xs block">LeetCode Problems</span>
                            <span className="text-xl font-bold text-slate-200 block mt-1"><span className="text-yellow-300">{stats?.totalSolved}</span> <span className="text-cyan-400"> Solved</span></span>
                        </div>
                        <div className="bg-[#0b1414] border border-cyan-500/5 p-4 rounded-2xl sm:col-span-2">
                            <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                                <span>Problem Solving Journey</span>
                                <span className="text-cyan-400 font-bold">{totalSolved} / {goal}</span>
                            </div>
                            <div className="w-full bg-cyan-950/60 h-2.5 rounded-full overflow-hidden border border-cyan-500/10">
                                <div
                                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-1000"
                                    style={{ width: `${progressPercentage}%` }} // Yahan dynamic width aayegi
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BOTTOM SOCIAL NETWORKS DISTRIBUTOR */}
                <div className="mt-8 pt-6 border-t border-cyan-500/5 flex flex-wrap justify-center gap-3">
                    <button
                        onClick={async () => {
                            if (navigator.share) {
                                try {
                                    await navigator.share({
                                        title: `${user.username} Profile`,
                                        text: `Check out ${user.username}'s coding stats!`,
                                        url: getShareableUrl()
                                    });
                                } catch (err) { console.log(err); }
                            } else {
                                navigator.clipboard.writeText(getShareableUrl());
                                alert("Link copied!");
                            }
                        }}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold tracking-wider transition-all duration-200 shadow-lg transform active:scale-95"
                    >
                        📤 Share Profile
                    </button>

                    <a
                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(getShareableUrl())}&text=${encodeURIComponent(`Check out ${user.username}'s track record!`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 bg-[#1da1f2]/10 hover:bg-[#1da1f2] text-[#1da1f2] hover:text-white border border-[#1da1f2]/20 hover:border-transparent rounded-xl text-xs font-semibold tracking-wider transition-all duration-200 transform active:scale-95"
                    >
                        🐦 Twitter
                    </a>

                    <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareableUrl())}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 bg-[#0077b5]/10 hover:bg-[#0077b5] text-[#0077b5] hover:text-white border border-[#0077b5]/20 hover:border-transparent rounded-xl text-xs font-semibold tracking-wider transition-all duration-200 transform active:scale-95"
                    >
                        💼 LinkedIn
                    </a>
                </div>

            </div>
        </div>
    );
};

export default PublicProfile;