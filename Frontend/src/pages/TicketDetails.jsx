import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

const TicketDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reply, setReply] = useState("");
    const [sending, setSending] = useState(false);
    const bottomRef = useRef();

    const getTicket = async () => {
        try {
            const res = await API.get(`/support/${id}`);
            setTicket(res.data.ticket);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const sendReply = async () => {
        if (!reply.trim()) return;
        try {
            setSending(true);
            await API.patch(`/support/user-reply/${ticket._id}`, { message: reply });
            setReply("");
            await getTicket();
        } catch (error) {
            console.log(error);
            alert(error?.response?.data?.message || "Something went wrong");
        } finally {
            setSending(false);
        }
    };

    useEffect(() => {
        getTicket();
        const interval = setInterval(() => {

            if (!document.hidden) {
                getTicket();
            }

        }, 15000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [ticket?.messages]);

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
            <div className="min-h-screen text-white flex items-center justify-center relative">
                <div className="w-14 h-14 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="min-h-screen text-white flex items-center justify-center px-5">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 max-w-md w-full text-center backdrop-blur-xl">
                    <div className="text-5xl mb-4">🔍</div>
                    <h2 className="text-2xl font-bold mb-2">Ticket Not Found</h2>
                    <p className="text-gray-400 text-sm mb-6">
                        The ticket you are looking for does not exist or has been removed.
                    </p>
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
        <div className="text-white relative overflow-hidden">
            {/* BACKGROUND GLOWS */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 blur-[200px] pointer-events-none" />
            <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-500/5 blur-[200px] pointer-events-none" />

            <div className="p-5 md:p-10 mx-auto relative z-10">

                {/* TOP BAR */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition"
                    >
                        ← Back
                    </button>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400 font-mono tracking-wider bg-white/5 border border-white/5 px-3 py-1.5 rounded-lg">
                            #{ticket._id.slice(-6).toUpperCase()}
                        </span>
                        <span className={`px-4 py-1.5 rounded-full border text-xs font-bold tracking-wide shadow-sm ${getStatusColor(ticket.status)}`}>
                            {ticket.status}
                        </span>
                    </div>
                </div>

                {/* HEADER / SUBJECT CARD */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-white/10 to-white/[0.02] border border-white/10 backdrop-blur-xl p-6 md:p-8 mb-8 shadow-xl">
                    <div className="absolute top-0 left-0 h-[3px] w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
                    <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-2.5 py-1 rounded-md">
                        {ticket.category}
                    </span>
                    <h1 className="text-2xl md:text-3xl font-black mt-4 tracking-tight leading-tight">
                        {ticket.subject}
                    </h1>
                </div>

                {/* CONVERSATION */}
                <div className="space-y-5 mb-8">
                    {ticket.messages?.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex flex-col w-full ${msg.sender === "user" ? "items-end" : "items-start"}`}
                        >
                            <span
                                className={`text-xs font-semibold mb-2 ${msg.sender === "user"
                                    ? "text-cyan-400 mr-4"
                                    : "text-purple-400 ml-4"
                                    }`}
                            >
                                {msg.sender === "user" ? "🧑‍💻 You" : "🛡️ Support Staff"}
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
                </div>

                {/* REPLY BOX — only when waiting for user */}
                {ticket.waitingFor === "user" && ticket.status !== "Closed" && (
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-5 mb-8">
                        <h3 className="font-semibold mb-4">Reply to Support</h3>
                        <textarea
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    sendReply();
                                }
                            }}
                            rows={4}
                            placeholder="Type your reply..."
                            className="w-full bg-[#111315] border border-white/10 rounded-xl p-4 outline-none resize-none"
                        />
                        <button
                            onClick={sendReply}
                            disabled={sending || !reply.trim()}
                            className="mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] transition-all"
                        >
                            {sending ? "Sending..." : "Send Reply"}
                        </button>
                    </div>
                )}

                {/* STATUS BANNERS */}
                {ticket.status === "Closed" && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 mb-8 text-green-400">
                        ✅ This ticket has been closed.
                    </div>
                )}

                {/* FIX: was > 1, now >= 1 so first message also shows waiting state */}
                {ticket.waitingFor === "admin" &&
                    ticket.status !== "Closed" &&
                    ticket.messages.length >= 1 && (
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mb-8 text-blue-400">
                            ⏳ Waiting for support staff reply...
                        </div>
                    )}

                <div ref={bottomRef}></div>

                {/* INFO CARD */}
                <div className="rounded-3xl bg-white/[0.03] border border-white/5 p-6 backdrop-blur-md">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
                        📋 Ticket Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm border-t border-white/5 pt-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-gray-500">Full Ticket ID</span>
                            <span className="font-mono text-gray-300 select-all selection:bg-cyan-500/30">
                                {ticket._id}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-gray-500">Created At</span>
                            <span className="text-gray-300 font-medium">
                                📅 {new Date(ticket.createdAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketDetails;