import React, { useEffect, useState } from "react";
import API from "../services/api";

const RevisionPage = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDueQuestions();
    }, []);

    const fetchDueQuestions = async () => {
        try {
            setLoading(true);
            const res = await API.get("/questions/revision/due");
            setQuestions(res.data?.revisions || []);
        } catch (error) {
            console.error("Error fetching due questions:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRevisionDone = async (id) => {
        if (!id) return;
        try {
            // Optimistic UI update: Pehle state se hata dete hain taaki UI fast response kare
            setQuestions((prev) => prev.filter((item) => item.questionId?._id !== id));
            
            await API.patch(`/questions/revision/complete/${id}`);
        } catch (error) {
            console.error("Error updating revision status:", error);
            // Agar API fail ho jaye toh questions dobara fetch kar lenge
            fetchDueQuestions();
        }
    };

    return (
        <div className="min-h-screen bg-[#111112] text-zinc-100 p-6 md:p-10 selection:bg-orange-500/30">
            <div className=" mx-auto">
                
                {/* HEADER SECTION */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800 pb-6 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-50 to-zinc-400 bg-clip-text text-transparent">
                            Pending Revisions
                        </h1>
                        <p className="text-zinc-400 text-sm mt-1">
                            Keep your streak alive. Review your concepts on time.
                        </p>
                    </div>
                    
                    {/* COUNTER BADGE */}
                    {!loading && questions.length > 0 && (
                        <span className="self-start sm:self-center px-3 py-1 text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-full dashboard-badge">
                            {questions.length} Due Task{questions.length > 1 ? 's' : ''}
                        </span>
                    )}
                </div>

                {/* LOADING STATE */}
                {loading && (
                    <div className="flex flex-col items-center justify-center mt-24 space-y-4">
                        <div className="w-8 h-8 border-2 border-zinc-700 border-t-orange-500 rounded-full animate-spin"></div>
                        <p className="text-zinc-500 text-sm animate-pulse">Loading your revisions...</p>
                    </div>
                )}

                {/* EMPTY STATE */}
                {!loading && questions.length === 0 && (
                    <div className="flex flex-col items-center justify-center mt-24 border border-dashed border-zinc-800 rounded-2xl p-10 bg-zinc-900/20">
                        <span className="text-4xl mb-3">🎉</span>
                        <h3 className="text-zinc-200 font-medium text-lg">All caught up!</h3>
                        <p className="text-zinc-500 text-sm text-center mt-1 max-w-sm">
                            No pending revisions for now. Great job maintaining your learning consistency!
                        </p>
                    </div>
                )}

                {/* REVISION CARDS LIST */}
                {!loading && questions.length > 0 && (
                    <div className="grid gap-4 mt-8">
                        {questions.map((item) => {
                            const questionId = item?.questionId?._id;
                            const title = item?.questionId?.title || "Untitled Question";
                            const link = item?.questionId?.link;

                            return (
                                <div
                                    key={item._id || questionId}
                                    className="group relative bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-zinc-700/80 hover:bg-zinc-900/80 transition-all duration-200 shadow-sm"
                                >
                                    {/* TITLE & DETAILS */}
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-zinc-200 group-hover:text-white font-medium text-base md:text-lg tracking-wide break-words transition-colors">
                                            {title}
                                        </h2>
                                    </div>

                                    {/* ACTIONS */}
                                    <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                                        {/* Solve Again Link */}
                                        {link && (
                                            <a
                                                href={link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex-1 md:flex-none text-center px-4 py-2.5 rounded-lg text-sm font-medium bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white border border-zinc-700/50 transition-all duration-150"
                                            >
                                                Solve Again
                                            </a>
                                        )}

                                        {/* Revision Done Button */}
                                        <button
                                            onClick={() => handleRevisionDone(questionId)}
                                            disabled={!questionId}
                                            className="flex-1 md:flex-none px-4 py-2.5 rounded-lg text-sm font-semibold bg-orange-500 text-zinc-950 hover:bg-orange-400 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-orange-500/10"
                                        >
                                            Revision Done
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                
            </div>
        </div>
    );
};

export default RevisionPage;