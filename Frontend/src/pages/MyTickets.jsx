import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const MyTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const navigate = useNavigate();


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

    const getMyTickets = async () => {
        try {
            const res = await API.get("/support/my-tickets");
            setTickets(res.data.tickets || []);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getMyTickets();
    }, []);

    const filteredTickets = useMemo(() => {
        return tickets.filter(
            (ticket) =>
                ticket.subject
                    ?.toLowerCase()
                    .includes(search.toLowerCase()) ||
                ticket.category
                    ?.toLowerCase()
                    .includes(search.toLowerCase())
        );
    }, [tickets, search]);

    const stats = {
        total: tickets.length,
        open: tickets.filter((t) => t.status === "Open").length,
        progress: tickets.filter(
            (t) => t.status === "In Progress"
        ).length,
        closed: tickets.filter((t) => t.status === "Closed").length,
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Open":
                return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";

            case "In Progress":
                return "bg-blue-500/15 text-blue-400 border-blue-500/30";

            case "Closed":
                return "bg-green-500/15 text-green-400 border-green-500/30";

            default:
                return "bg-gray-500/15 text-gray-400 border-gray-500/30";
        }
    };
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
        <div className="min-h-screen text-white relative overflow-hidden">

            {/* BACKGROUND */}

            <div className="absolute top-0 left-0 w-80 h-80 bg-cyan-500/10 blur-[180px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/10 blur-[180px] pointer-events-none" />
            {user ?
                (
                    <div className="relative z-10 max-w-7xl mx-auto px-5 py-10">

                        {/* HEADER */}

                        <div className="mb-5">

                            <button
                                onClick={() => navigate(-1)}
                                className="
                            flex items-center gap-2
                            text-gray-400
                            hover:text-cyan-400
                            transition
                        "
                            >
                                ← Back
                            </button>

                            <h1 className="text-4xl font-black">
                                🎫 My Tickets
                            </h1>

                            <p className="text-gray-400 mt-2 ml-2 text-lg">
                                Manage support requests and track responses.
                            </p>
                        </div>

                        {/* STATS */}

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-5">

                            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-xl">
                                <h3 className="text-gray-400 text-sm">
                                    Total
                                </h3>
                                <p className="text-3xl font-bold mt-2">
                                    {stats.total}
                                </p>
                            </div>

                            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-3xl p-5">
                                <h3 className="text-yellow-400 text-sm">
                                    Open
                                </h3>
                                <p className="text-3xl font-bold mt-2">
                                    {stats.open}
                                </p>
                            </div>

                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-3xl p-5">
                                <h3 className="text-blue-400 text-sm">
                                    In Progress
                                </h3>
                                <p className="text-3xl font-bold mt-2">
                                    {stats.progress}
                                </p>
                            </div>

                            <div className="bg-green-500/10 border border-green-500/20 rounded-3xl p-5">
                                <h3 className="text-green-400 text-sm">
                                    Closed
                                </h3>
                                <p className="text-3xl font-bold mt-2">
                                    {stats.closed}
                                </p>
                            </div>

                        </div>

                        {/* SEARCH */}

                        <div className="mb-12">
                            <input
                                type="text"
                                placeholder="Search tickets..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                className="
                            w-full
                            bg-white/5
                            border border-white/10
                            rounded-2xl
                            px-5 py-4
                            outline-none
                            backdrop-blur-xl
                            focus:border-cyan-500
                        "
                            />
                        </div>

                        {/* LOADING */}

                        {loading ? (
                            <div className="h-[400px] flex justify-center items-center">
                                <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                            </div>
                        ) : filteredTickets.length === 0 ? (

                            <div className="
                        bg-white/5
                        border border-white/10
                        rounded-[32px]
                        p-6
                        text-center
                        backdrop-blur-xl
                    ">
                                <div className="text-7xl mb-3">
                                    📭
                                </div>

                                <h2 className="text-3xl font-bold">
                                    No Tickets Found
                                </h2>

                                <p className="text-gray-400 mt-1">
                                    You haven't created any support tickets yet.
                                </p>

                                <button
                                    onClick={() => navigate("/support")}
                                    className="
                                mt-3
                                px-6 py-2
                                rounded-lg
                                bg-gradient-to-r
                                from-cyan-500
                                to-blue-600
                                font-semibold
                            "
                                >
                                    Create Ticket
                                </button>
                            </div>

                        ) : (

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                                {filteredTickets.map((ticket) => (
                                    <div
                                        key={ticket._id}
                                        className="
        relative
        overflow-hidden
        rounded-[28px]
        border border-white/10
        bg-white/5
        backdrop-blur-xl
        p-5
        transition-all
        duration-300
        hover:border-cyan-500/40
        hover:-translate-y-1
        group
    "
                                    >

                                        {/* Top Accent Line */}
                                        <div
                                            className="
            absolute
            top-0
            left-0
            right-0
            h-[2px]
            bg-gradient-to-r
            from-cyan-500
            via-blue-500
            to-purple-500
        "
                                        />

                                        <div className="relative z-10">

                                            <div className="flex items-start justify-between gap-4">

                                                <div>
                                                    <h2 className="text-xl font-bold text-white">
                                                        {ticket.subject}
                                                    </h2>

                                                    <p className="text-sm text-gray-400 mt-2">
                                                        {ticket.category}
                                                    </p>
                                                </div>

                                                <span
                                                    className={`
                    px-3 py-1
                    rounded-full
                    text-xs
                    font-semibold
                    border
                    whitespace-nowrap
                    ${getStatusColor(ticket.status)}
                `}
                                                >
                                                    {ticket.status}
                                                </span>

                                            </div>

                                            <div className="flex justify-between mt-5 text-sm text-gray-400">

                                                <span>
                                                    📅 {new Date(ticket.createdAt).toLocaleDateString()}
                                                </span>

                                                <span>
                                                    #{ticket._id.slice(-6)}
                                                </span>

                                            </div>

                                            <button
                                                onClick={() => navigate(`/ticket/${ticket._id}`)}
                                                className="
                w-full
                mt-5
                py-3
                rounded-xl
                bg-gradient-to-r
                from-cyan-500
                to-blue-600
                font-semibold
                transition-all
                hover:scale-[1.02]
            "
                                            >
                                                View Conversation →
                                            </button>

                                        </div>

                                    </div>
                                ))}

                            </div>

                        )}
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
            }
        </div>
    );
};

export default MyTickets;