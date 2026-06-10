import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

const AdminTicketDetails = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reply, setReply] = useState("");
    const [sending, setSending] = useState(false);
    const [status, setStatus] = useState("");
    const bottomRef = useRef();

    const getTicket = async () => {
        try {
            const res = await API.get(`/support/${id}`);
            setTicket(res.data.ticket);
            setStatus(res.data.ticket.status);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getTicket();
        const interval = setInterval(() => {

            if (!document.hidden) {

                getTicket();

            }

        }, 5000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [ticket?.messages]);

    const sendReply = async () => {
        if (!reply.trim()) return;
        try {
            setSending(true);
            await API.patch(`/support/reply/${id}`, { message: reply });
            toast.success("Reply sent");
            setReply("");
            await getTicket();
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Failed");
        } finally {
            setSending(false);
        }
    };

    const updateStatus = async () => {
        try {
            await API.patch(`/support/status/${id}`, { status });
            toast.success("Status updated");
            getTicket();
        } catch (error) {
            console.log(error);
            toast.error("Failed");
        }
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

    if (loading) {
        return (
            <div className="h-screen flex justify-center items-center">
                <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="min-h-screen text-white flex items-center justify-center px-5">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 max-w-md w-full text-center backdrop-blur-xl">
                    <div className="text-5xl mb-4">🔍</div>
                    <h2 className="text-2xl font-bold mb-2">Ticket Not Found</h2>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-5 py-2.5 rounded-xl bg-white/10 border border-white/10 transition text-sm font-medium"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen text-white relative overflow-hidden">

            <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 blur-[180px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 blur-[180px] pointer-events-none" />

            <div className="relative z-10 max-w-6xl mx-auto p-6">

                {/* TOP BAR */}
                <div className="flex items-center justify-between mb-7">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-gray-400 hover:text-cyan-400 transition"
                    >
                        ← Back
                    </button>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400 font-mono tracking-wider bg-white/5 border border-white/5 px-3 py-1.5 rounded-lg">
                            #{ticket._id.slice(-6).toUpperCase()}
                        </span>
                        <span className={`px-4 py-1 rounded-full border text-sm ${getStatusColor(ticket.status)}`}>
                            {ticket.status}
                        </span>
                    </div>
                </div>

                {/* USER INFO CARD */}
                <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl px-6 py-4 mb-6">
                    <h1 className="text-3xl font-black">{ticket.subject}</h1>
                    <div className="mt-2 grid md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-gray-400 text-sm">Username</p>
                            <h3 className="font-semibold">{ticket.user?.username}</h3>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Email</p>
                            <h3 className="font-semibold">{ticket.user?.email}</h3>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Category</p>
                            <h3 className="font-semibold">{ticket.category}</h3>
                        </div>
                    </div>
                </div>

                {/* CONVERSATION — iterates real messages[] array */}
                <div className="space-y-5 mb-6">
                    {ticket.messages?.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex flex-col w-full ${msg.sender === "user" ? "items-end" : "items-start"
                                }`}
                        >
                            <span
                                className={`text-xs font-semibold mb-2 ${msg.sender === "user"
                                    ? "text-cyan-400 mr-4"
                                    : "text-purple-400 ml-4"
                                    }`}
                            >
                                {msg.sender === "user" ? "🧑‍💻 User" : "🛡️ Admin"}
                            </span>
                            <div
                                className={`
                                    max-w-[85%] md:max-w-2xl p-5 shadow-lg whitespace-pre-wrap
                                    ${msg.sender === "user"
                                        ? "bg-cyan-500/10 border border-cyan-500/20 rounded-[24px] rounded-tr-none text-cyan-50"
                                        : "bg-white/5 border border-white/10 rounded-[24px] rounded-tl-none text-gray-200"
                                    }
                                `}
                            >
                                {msg.text}
                                <div className="text-[10px] text-gray-500 mt-3">
                                    {new Date(msg.createdAt).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>

                {/* STATUS BANNERS */}
                {ticket.status === "Closed" && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 mb-6 text-green-400">
                        ✅ This ticket has been closed.
                    </div>
                )}
                {ticket.waitingFor === "user" && ticket.status !== "Closed" && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 mb-6 text-yellow-400">
                        ⏳ Waiting for user reply...
                    </div>
                )}

                {/* ADMIN CONTROLS */}
                <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-6">
                    <h2 className="text-xl font-bold mb-5">Admin Controls</h2>

                    {/* REPLY — only when it's admin's turn */}
                    {ticket.waitingFor === "admin" && ticket.status !== "Closed" ? (
                        <>
                            <textarea
                                rows={5}
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        sendReply();
                                    }
                                }}
                                placeholder="Write reply to user..."
                                className="w-full p-4 rounded-2xl bg-[#111315] border border-white/10 outline-none resize-none"
                            />
                            <button
                                onClick={sendReply}
                                disabled={sending || !reply.trim()}
                                className="mt-4 ml-1 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] transition-all"
                            >
                                {sending ? "Sending..." : "Send Reply"}
                            </button>
                        </>
                    ) : ticket.status !== "Closed" ? (
                        <div className="text-gray-500 text-sm mb-4 bg-white/3 border border-white/5 rounded-xl p-4">
                            Reply box available once user responds.
                        </div>
                    ) : null}

                    {/* STATUS CHANGE */}
                    <div className="mt-6">
                        <label className="block mb-3 ml-1 text-gray-400">
                            Change Status
                        </label>
                        <div className="flex flex-wrap gap-4">
                            <div className="relative">
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="appearance-none px-5 pr-12 py-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-white outline-none transition-all duration-300 hover:border-cyan-500/40 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                                >
                                    <option value="Open" className="bg-[#111315]">🟡 Open</option>
                                    <option value="In Progress" className="bg-[#111315]">🔵 In Progress</option>
                                    <option value="Closed" className="bg-[#111315]">🟢 Closed</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    ▼
                                </div>
                            </div>
                            <button
                                onClick={updateStatus}
                                className="px-5 py-2 rounded-xl bg-green-600 hover:bg-green-700 font-semibold transition"
                            >
                                Update Status
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminTicketDetails;