import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const AdminTickets = () => {

    const [tickets, setTickets] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] =
        useState("All");

    const navigate = useNavigate();

    const getAllTickets = async () => {

        try {

            const res = await API.get(
                "/support/all-tickets"
            );

            setTickets(
                res.data.tickets || []
            );

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        getAllTickets();

    }, []);

    const filteredTickets = useMemo(() => {

        return tickets.filter((ticket) => {

            const matchesSearch =

                ticket.subject
                    ?.toLowerCase()
                    .includes(
                        search.toLowerCase()
                    )

                ||

                ticket.user?.username
                    ?.toLowerCase()
                    .includes(
                        search.toLowerCase()
                    )

                ||

                ticket.user?.email
                    ?.toLowerCase()
                    .includes(
                        search.toLowerCase()
                    );

            const matchesStatus =

                statusFilter === "All"

                    ? true

                    : ticket.status ===
                    statusFilter;

            return (
                matchesSearch &&
                matchesStatus
            );

        });

    }, [
        tickets,
        search,
        statusFilter
    ]);

    const stats = {

        total:
            tickets.length,

        open:
            tickets.filter(
                (t) =>
                    t.status === "Open"
            ).length,

        progress:
            tickets.filter(
                (t) =>
                    t.status ===
                    "In Progress"
            ).length,

        closed:
            tickets.filter(
                (t) =>
                    t.status === "Closed"
            ).length

    };

    const getStatusColor = (
        status
    ) => {

        switch (status) {

            case "Open":

                return `
                bg-yellow-500/15
                text-yellow-400
                border-yellow-500/30
                `;

            case "In Progress":

                return `
                bg-blue-500/15
                text-blue-400
                border-blue-500/30
                `;

            case "Closed":

                return `
                bg-green-500/15
                text-green-400
                border-green-500/30
                `;

            default:

                return `
                bg-gray-500/15
                text-gray-400
                border-gray-500/30
                `;
        }

    };

    return (

        <div className=" text-white relative overflow-hidden">

            {/* BG GLOW */}

            <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 blur-[180px]" />

            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 blur-[180px]" />

            <div className="relative z-10 max-w-7xl mx-auto px-5 py-8">

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

                    <h1
                        className="
                        text-4xl
                        font-black
                    "
                    >
                        🎫 Support Dashboard
                    </h1>

                    <p
                        className="
                        text-gray-400
                        mt-3 ml-2
                    "
                    >
                        Manage user tickets,
                        replies and issue tracking.
                    </p>

                </div>

                {/* STATS */}

                <div
                    className="
                    grid
                    grid-cols-2
                    lg:grid-cols-4
                    gap-5
                    mb-8
                "
                >

                    <div
                        className="
                        rounded-3xl
                        p-5
                        bg-white/5
                        border border-white/10
                        backdrop-blur-xl
                    "
                    >
                        <p className="text-gray-400 text-sm">
                            Total Tickets
                        </p>

                        <h2 className="text-4xl font-black mt-2">
                            {stats.total}
                        </h2>

                    </div>

                    <div
                        className="
                        rounded-3xl
                        p-5
                        bg-yellow-500/10
                        border border-yellow-500/20
                    "
                    >
                        <p className="text-yellow-400 text-sm">
                            Open
                        </p>

                        <h2 className="text-4xl font-black mt-2">
                            {stats.open}
                        </h2>

                    </div>

                    <div
                        className="
                        rounded-3xl
                        p-5
                        bg-blue-500/10
                        border border-blue-500/20
                    "
                    >
                        <p className="text-blue-400 text-sm">
                            In Progress
                        </p>

                        <h2 className="text-4xl font-black mt-2">
                            {stats.progress}
                        </h2>

                    </div>

                    <div
                        className="
                        rounded-3xl
                        p-5
                        bg-green-500/10
                        border border-green-500/20
                    "
                    >
                        <p className="text-green-400 text-sm">
                            Closed
                        </p>

                        <h2 className="text-4xl font-black mt-2">
                            {stats.closed}
                        </h2>

                    </div>

                </div>

                {/* SEARCH + FILTER */}

                <div
                    className="
                    flex
                    flex-col
                    md:flex-row
                    gap-4
                    mb-8
                "
                >

                    <input
                        type="text"

                        placeholder="Search subject, username, email..."

                        value={search}

                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }

                        className="
                        flex-1

                        px-5
                        py-4

                        rounded-2xl

                        bg-white/5

                        border
                        border-white/10

                        outline-none

                        focus:border-cyan-500
                    "
                    />

                    <div className="relative">

                        <select

                            value={statusFilter}

                            onChange={(e) =>
                                setStatusFilter(
                                    e.target.value
                                )
                            }

                            className="
            appearance-none

            px-5
            pr-12
            py-3.5

            rounded-2xl

            bg-white/5
            backdrop-blur-xl

            border
            border-white/10

            text-white

            outline-none

            transition-all
            duration-300

            hover:border-cyan-500/40

            focus:border-cyan-500
            focus:ring-2
            focus:ring-cyan-500/20

            shadow-lg
        "
                        >

                            <option
                                value="All"
                                className="bg-[#111315]"
                            >
                                All Tickets
                            </option>

                            <option
                                value="Open"
                                className="bg-[#111315]"
                            >
                                Open
                            </option>

                            <option
                                value="In Progress"
                                className="bg-[#111315]"
                            >
                                In Progress
                            </option>

                            <option
                                value="Closed"
                                className="bg-[#111315]"
                            >
                                Closed
                            </option>

                        </select>

                        <div
                            className="
            absolute

            right-4
            top-1/2

            -translate-y-1/2

            pointer-events-none

            text-gray-400
        "
                        >
                            ▼
                        </div>

                    </div>

                </div>

                {/* LOADING */}

                {loading ? (

                     <div className="min-h-[30vh] flex items-center justify-center  text-white">

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

                ) : (

                    <div
                        className="
                        grid
                        md:grid-cols-2
                        xl:grid-cols-3

                        gap-6
                    "
                    >

                        {filteredTickets.map(
                            (ticket) => (

                                <div
                                    key={ticket._id}

                                    className="
                                    relative

                                    overflow-hidden

                                    rounded-[30px]

                                    bg-white/5

                                    border
                                    border-white/10

                                    backdrop-blur-xl

                                    p-5

                                    hover:border-cyan-500/40

                                    transition-all

                                    duration-300
                                "
                                >

                                    <div
                                        className="
                                        absolute

                                        top-0
                                        left-0

                                        h-[3px]
                                        w-full

                                        bg-gradient-to-r

                                        from-cyan-500
                                        via-blue-500
                                        to-purple-500
                                    "
                                    />

                                    <div className="flex justify-between gap-4">

                                        <div>

                                            <h2
                                                className="
                                                text-xl
                                                font-bold
                                            "
                                            >
                                                {ticket.subject}
                                            </h2>

                                            <p className="text-gray-400 text-sm mt-2">
                                                👤 {ticket.user?.username}
                                            </p>

                                            <p className="text-gray-500 text-sm">
                                                📧 {ticket.user?.email}
                                            </p>

                                        </div>

                                        <span
                                            className={`
        inline-flex
        items-center
        justify-center

        px-3
        py-1.5
        rounded-full
        text-xs
        font-semibold

        border

        whitespace-nowrap
        h-fit

        ${getStatusColor(ticket.status)}
    `}
                                        >
                                            {ticket.status}
                                        </span>

                                    </div>

                                    <div className="mt-3">

                                        <div
                                            className="
                                            inline-block

                                            px-3
                                            py-1

                                            rounded-lg

                                            bg-white/5

                                            text-sm
                                            text-gray-300
                                        "
                                        >
                                            🏷 {ticket.category}
                                        </div>

                                    </div>

                                    <div
                                        className="
                                        flex
                                        justify-between

                                        text-sm

                                        text-gray-500

                                        mt-2 ml-1
                                    "
                                    >

                                        <span>
                                            📅{" "}
                                            {new Date(
                                                ticket.createdAt
                                            ).toLocaleDateString()}
                                        </span>

                                        <span>
                                            #
                                            {ticket._id.slice(
                                                -6
                                            )}
                                        </span>

                                    </div>

                                    <button

                                        onClick={() =>
                                            navigate(
                                                `/admin/tickets/${ticket._id}`
                                            )
                                        }

                                        className="
                                        w-full

                                        mt-3

                                        py-2

                                        rounded-xl

                                        bg-gradient-to-r

                                        from-cyan-500
                                        to-blue-600

                                        font-semibold

                                        hover:scale-[1.02]

                                        transition
                                    "
                                    >
                                        Open Ticket →
                                    </button>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>

        </div>

    );

};

export default AdminTickets;