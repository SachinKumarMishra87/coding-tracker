import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import Swal from "sweetalert2";
import { FaStickyNote } from "react-icons/fa";
import toast from "react-hot-toast";

import {
  FaYoutube,
  FaBookmark,
  FaRegBookmark
} from "react-icons/fa";

const Question = () => {

  const { patternId } = useParams();

  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);

  const [progress, setProgress] = useState([]);

  const [bookmarks, setBookmarks] = useState([]);

  const [search, setSearch] = useState("");

  const [user, setUser] = useState(null);

  const [showForm, setShowForm] = useState(false);

  const [editQuestionId, setEditQuestionId] = useState(null);

  const [videoModal, setVideoModal] = useState(false);

  const [currentVideo, setCurrentVideo] = useState("");

  const [noteModal, setNoteModal] = useState(false);

  const [selectedQuestionId, setSelectedQuestionId] = useState("");
  const [selectedQuestionTitle, setSelectedQuestionTitle] = useState("");

  const [showRevisionPopup, setShowRevisionPopup] = useState(false);
  const [selectedRevQuestionId, setSelectedRevQuestionId] = useState(null);

  const [noteText, setNoteText] = useState("");

  const [questionData, setQuestionData] = useState({
    title: "",
    difficulty: "easy",
    platform: "",
    link: "",
    youtubeLink: ""
  });

  const [hintLoading, setHintLoading] = useState(false);

  const [hintModal, setHintModal] = useState(false);

  const [hintText, setHintText] = useState("");

  const [displayHint, setDisplayHint] = useState("");
  const [patternDetails, setPatternDetails] = useState(null);

  const [remainingHints, setRemainingHints] = useState(10);
  const [loading, setLoading] = useState(false)

  // =========================
  // GET QUESTIONS
  // =========================

  const getQuestions = async () => {
    try {
      setLoading(true);
      const [questionsRes, patternRes] = await Promise.all([

        API.get(`/questions/pattern/${patternId}`),
        API.get(`/patterns/details/${patternId}`)
      ]);
      setQuestions(questionsRes.data.data ?? []);
      setPatternDetails(patternRes.data.pattern ?? null);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false)
    }
  };

  // =========================
  // GET USER
  // =========================

  const getMe = async () => {

    try {

      const { data } = await API.get(
        "/auth/getuser"
      );

      setUser(data.user);

    } catch (error) {

      console.log(error);

    }

  };

  // =========================
  // GET PROGRESS
  // =========================

  const getProgress = async () => {

    try {

      const { data } = await API.get(
        "/questions/progress"
      );

      setProgress(data.data || []);

    } catch (error) {

      console.log(error);

    }

  };

  // =========================
  // GET BOOKMARKS
  // =========================

  const getBookmarks = async () => {

    try {

      const { data } = await API.get(
        "/questions/raw-bookmark"
      );


      setBookmarks(data.data || []);

    } catch (error) {

      console.log(error);

    }

  };

  // =========================
  // GET HINT FOR A QUESTION
  // =========================
  const getHint = async (title) => {

    try {

      setHintLoading(true);

      setHintModal(true);

      setHintText("");

      setDisplayHint("");

      const { data } = await API.post(
        "/ai/hint",
        { title }
      );

      setHintText(data.hint);
      setRemainingHints(data.remainingHints);

      // =========================
      // TYPING EFFECT
      // =========================

      const fullText = data.hint;

      let index = 0;

      const interval = setInterval(() => {

        setDisplayHint(
          fullText.slice(0, index)
        );

        index++;

        if (index > fullText.length) {

          clearInterval(interval);

        }

      }, 20);

    } catch (error) {

      console.log(error);

      if (
        error.response?.status === 401
      ) {

        setDisplayHint(
          "Please login to use AI hints."
        );

      }

      else if (
        error.response?.status === 429
      ) {

        setDisplayHint(
          "Daily AI hint limit reached."
        );

      }

      else {

        setDisplayHint(
          "AI server busy. Try again in a moment."
        );

      }

    } finally {

      setHintLoading(false);

    }

  };

  // =========================
  // ADD QUESTION
  // =========================

  const handleAddQuestion = async () => {

    if (
      !questionData.title ||
      !questionData.platform ||
      !questionData.link
    ) {

      Swal.fire({
        icon: "warning",
        title: "All fields required",
        background: "#111315",
        color: "#fff"
      });

      return;

    }

    try {

      await API.post(
        "/questions/add-question",
        {
          patternId,
          ...questionData
        }
      );

      Swal.fire({
        icon: "success",
        title: "Question Added",
        background: "#111315",
        color: "#fff",
        timer: 1500,
        showConfirmButton: false
      });

      setQuestionData({
        title: "",
        difficulty: "easy",
        platform: "",
        link: "",
        youtubeLink: ""
      });

      setShowForm(false);

      getQuestions();

    } catch (error) {

      console.log(error);

    }

  };

  // =========================
  // UPDATE QUESTION
  // =========================

  const handleUpdateQuestion = async () => {

    try {

      await API.put(
        `/questions/update-question/${editQuestionId}`,
        questionData
      );

      Swal.fire({
        icon: "success",
        title: "Question Updated",
        background: "#111315",
        color: "#fff",
        timer: 1500,
        showConfirmButton: false
      });

      setQuestionData({
        title: "",
        difficulty: "easy",
        platform: "",
        link: "",
        youtubeLink: ""
      });

      setEditQuestionId(null);

      setShowForm(false);

      getQuestions();

    } catch (error) {

      console.log(error);

    }

  };

  // =========================
  // DELETE QUESTION
  // =========================

  const handleDeleteQuestion = async (id) => {

    const result = await Swal.fire({

      title: "Delete Question?",
      text: "This action cannot be undone",
      icon: "warning",

      background: "#111315",
      color: "#fff",

      showCancelButton: true,

      confirmButtonText: "Delete",

      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#374151"

    });

    if (!result.isConfirmed) return;

    try {

      await API.delete(
        `/questions/${id}`
      );

      Swal.fire({
        icon: "success",
        title: "Deleted Successfully",
        background: "#111315",
        color: "#fff",
        timer: 1500,
        showConfirmButton: false
      });

      getQuestions();

    } catch (error) {

      console.log(error);

    }

  };

  // =========================
  // TOGGLE SOLVED
  // =========================

  const toggleSolved = async (id) => {

    try {

      const res = await API.patch(
        `/questions/toggle-solved/${id}`
      );

      if (res.data.message === "Marked as solved") {

        setShowRevisionPopup(true);

        setSelectedRevQuestionId(id);

      }

      getProgress();

    } catch (error) {
      toast.error("Please login", {
        style: {
          background: "#111315",
          color: "#fff",
          border: "1px solid #374151"
        }
      });
      console.log(error);

    }

  };
  // =========================
  // TOGGLE BOOKMARK
  // =========================

  const toggleBookmark = async (id) => {

    try {

      await API.patch(
        `/questions/raw-bookmark/${id}`
      );

      getBookmarks();

    } catch (error) {
      toast.error("Please login", {
        style: {
          background: "#111315",
          color: "#fff",
          border: "1px solid #374151"
        }
      });
      console.log(error);

    }

  };

  // =========================
  // CHECK SOLVED
  // =========================

  const isSolved = (id) => {

    return progress.some(
      (p) =>
        p.questionId?.toString() === id
    );

  };

  // =========================
  // CHECK BOOKMARKED
  // =========================

  const isBookmarked = (id) => {

    return bookmarks.some(
      (b) =>
        b.questionId?.toString() === id
    );

  };

  // =========================
  // FILTER QUESTIONS
  // =========================

  const filteredQuestions =
    questions.filter((q) =>
      q.title
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  // =========================
  // YOUTUBE MODAL
  // =========================

  const openYoutubeModal = (link) => {

    let videoId = "";

    // normal youtube link
    if (link.includes("watch?v=")) {

      videoId =
        link
          .split("watch?v=")[1]
          .split("&")[0];

    }

    // short youtube link
    else if (link.includes("youtu.be/")) {

      videoId =
        link
          .split("youtu.be/")[1]
          .split("?")[0];

    }

    if (!videoId) return;

    setCurrentVideo(
      `https://www.youtube.com/embed/${videoId}?autoplay=1`
    );

    setVideoModal(true);

  };

  // =========================
  // OPEN NOTE MODAL
  // =========================

  const openNoteModal = async (questionId, questionTitle) => {

    try {

      setSelectedQuestionId(questionId);

      setSelectedQuestionTitle(questionTitle);

      const { data } = await API.get(
        `/questions/note/${questionId}`
      );

      setNoteText(data.data?.note || "");

      setNoteModal(true);

    } catch (error) {
      toast.error("Please login", {
        style: {
          background: "#111315",
          color: "#fff",
          border: "1px solid #374151"
        }
      });
      console.log(error);

    }

  };

  // =========================
  // SAVE NOTE
  // =========================

  const saveNote = async () => {

    try {

      await API.post(
        `/questions/note/${selectedQuestionId}`,
        {
          note: noteText,

          questionTitle:
            selectedQuestionTitle
        }
      );
      Swal.fire({
        icon: "success",
        title: "Note Saved",
        background: "#111315",
        color: "#fff",
        timer: 1200,
        showConfirmButton: false
      });

      setNoteModal(false);

    } catch (error) {

      console.log(error);

    }

  };

  // =========================
  // DELETE NOTE
  // =========================

  const deleteNote = async () => {

    try {

      await API.delete(
        `/questions/note/${selectedQuestionId}`
      );

      Swal.fire({
        icon: "success",
        title: "Note Deleted",
        background: "#111315",
        color: "#fff",
        timer: 1200,
        showConfirmButton: false
      });

      setNoteText("");

      setNoteModal(false);

    } catch (error) {

      console.log(error);

    }

  };

  const handleAddToRevision = async () => {

    try {

      await API.patch(

        `/questions/add-to-revision/${selectedRevQuestionId}`

      );

      setShowRevisionPopup(false);

      setSelectedRevQuestionId(null);

    } catch (error) {

      console.log(error);

    }

  };

  // =========================
  // USE EFFECT
  // =========================

  useEffect(() => {
    getQuestions();
    getProgress();
    getBookmarks();
    getMe();

  }, []);

  return (
    <div className="min-h-screen bg-[#090a0b] text-gray-100 p-4 sm:p-6 lg:p-8 antialiased">

      {/* REVISION POPUP */}
      {showRevisionPopup && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] sm:w-[380px] bg-[#141619] border border-gray-800 rounded-2xl p-5 shadow-2xl shadow-black/80">
          <button
            onClick={() => setShowRevisionPopup(false)}
            className="absolute top-3 right-4 text-gray-500 hover:text-gray-300 transition text-lg"
          >
            ✕
          </button>
          <h3 className="text-white font-semibold text-base mb-1.5 flex items-center gap-2">
            ⏰ Add to Revision?
          </h3>
          <p className="text-gray-400 text-sm mb-4 leading-relaxed">
            You’ll get reminded later to revise this concept.
          </p>
          <button
            onClick={handleAddToRevision}
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl w-full transition-all active:scale-[0.98]"
          >
            Add to Revision
          </button>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto mb-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm text-gray-500 hover:text-blue-400 font-medium gap-1 mb-4 group transition"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform">←</span> Back to Patterns
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center relative sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
              Practice Questions
            </h1>
            <p className="text-sm text-gray-500 mt-1">Track your progress and practice effectively</p>
          </div>

          {user?.role === "admin" && (
            <button
              onClick={() => {
                if (!showForm) {
                  setShowForm(true);

                  setTimeout(() => {
                    document
                      .getElementById("question-form")
                      ?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                  }, 100);
                } else {
                  setShowForm(false);
                }
              }}
              className={`px-5 py-2.5 right-6 z-10 fixed rounded-xl text-sm font-semibold tracking-wide shadow-lg transition-all active:scale-95 ${showForm
                ? "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700"
                : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/10"
                }`}
            >
              {showForm ? "× Close Form" : "＋ Add New Question"}
            </button>
          )}
        </div>
      </div>

      {patternDetails?.description && (
        <div className="mb-8 bg-gradient-to-b from-white/[0.03] to-transparent border border-white/[0.06] rounded-2xl p-5 shadow-inner">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">{patternDetails?.name} Overview</h4>
          </div>

          {/* Fixed Height Box with custom scroll styling */}
          <div className="max-h-38 overflow-y-auto pr-2 text-sm text-slate-300/90 leading-relaxed font-medium text-justify scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            <p className="whitespace-pre-wrap">{patternDetails?.description}</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* SEARCH BAR */}
        <div id="question-form" className="mb-6 relative max-w-md">
          <input
            type="text"
            placeholder="Search questions by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111315] border border-gray-800 rounded-xl px-4 py-3 pl-10 text-sm text-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
          />
          <span className="absolute left-3.5 top-3.5 text-gray-600 text-sm pointer-events-none">🔍</span>
        </div>

        {/* ADMIN MANAGEMENT FORM */}
        {showForm && (
          <div className="bg-[#111315] border border-gray-800 rounded-2xl p-6 mb-8 shadow-xl">
            <h3 className="text-base font-semibold text-gray-200 mb-4 flex items-center gap-2">
              {editQuestionId ? "✏️ Edit Question Details" : "🚀 Add New Question to Pattern"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="md:col-span-2">
                <label className="block text-xs text-gray-500 font-medium mb-1.5">Question Title</label>
                <input
                  type="text"
                  placeholder="e.g., Two Sum"
                  value={questionData.title}
                  onChange={(e) => setQuestionData({ ...questionData, title: e.target.value })}
                  className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-800 outline-none text-sm text-gray-200 focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 font-medium mb-1.5">Difficulty Level</label>
                <select
                  value={questionData.difficulty}
                  onChange={(e) => setQuestionData({ ...questionData, difficulty: e.target.value })}
                  className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-800 outline-none text-sm text-gray-300 focus:border-blue-500 transition"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 font-medium mb-1.5">Platform</label>
                <input
                  type="text"
                  placeholder="e.g., LeetCode, CodeStudio"
                  value={questionData.platform}
                  onChange={(e) => setQuestionData({ ...questionData, platform: e.target.value })}
                  className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-800 outline-none text-sm text-gray-200 focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 font-medium mb-1.5">Problem URL</label>
                <input
                  type="text"
                  placeholder="https://leetcode.com/problems/..."
                  value={questionData.link}
                  onChange={(e) => setQuestionData({ ...questionData, link: e.target.value })}
                  className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-800 outline-none text-sm text-gray-200 focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 font-medium mb-1.5">YouTube Explanation URL (Optional)</label>
                <input
                  type="text"
                  placeholder="https://youtube.com/watch?v=..."
                  value={questionData.youtubeLink}
                  onChange={(e) => setQuestionData({ ...questionData, youtubeLink: e.target.value })}
                  className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-800 outline-none text-sm text-gray-200 focus:border-blue-500 transition"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={editQuestionId ? handleUpdateQuestion : handleAddQuestion}
                className={`px-6 py-2.5 rounded-xl font-semibold text-sm shadow-md transition-all active:scale-95 ${editQuestionId
                  ? "bg-yellow-600 hover:bg-yellow-500 text-gray-900"
                  : "bg-green-600 hover:bg-green-500 text-white"
                  }`}
              >
                {editQuestionId ? "Update Question" : "Save Question"}
              </button>
            </div>
          </div>
        )}


        {
          loading ? (
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
            <>
              {/* QUESTIONS ROW LIST */}
              <div className="space-y-3.5">
                {filteredQuestions.length > 0 ? (
                  filteredQuestions.map((q, index) => {
                    const solved = isSolved(q._id);
                    return (
                      <div
                        key={q._id}
                        className={`group relative bg-[#111315] border rounded-xl p-4 transition-all duration-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${solved
                          ? "border-green-500/20 bg-green-500/[0.01]"
                          : "border-gray-800/80 hover:border-gray-700 hover:bg-[#141619]"
                          }`}
                      >
                        {/* LEFT DETAILS CONTAINER */}
                        <div className="flex items-start gap-3.5 flex-1 min-w-0">
                          <div className="flex items-center h-6">
                            <input
                              type="checkbox"
                              checked={solved}
                              onChange={() => toggleSolved(q._id)}
                              className="
    w-4.5 h-4.5
    cursor-pointer
    rounded
    accent-emerald-500
    border-gray-600
    bg-gray-800
    transition-all duration-200
    hover:scale-110
    active:scale-95
  "
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                              <span className="text-gray-600 text-sm font-semibold tabular-nums">
                                {index + 1}.
                              </span>
                              <a
                                href={q.link}
                                target="_blank"
                                rel="noreferrer"
                                className={`text-sm sm:text-base font-medium break-words leading-snug transition-colors ${solved
                                  ? "text-gray-400 line-through group-hover:text-gray-300"
                                  : "text-gray-200 hover:text-blue-400"
                                  }`}
                              >
                                {q.title}
                              </a>
                            </div>

                            {/* BADGES SECTION */}
                            <div className="flex items-center flex-wrap gap-2 mt-2.5">
                              <span className="text-[11px] font-medium tracking-wide bg-gray-800/60 border border-gray-700 px-2 py-0.5 rounded-md text-gray-400 uppercase">
                                {q.platform}
                              </span>

                              <span
                                className={`text-[11px] font-semibold tracking-wide px-2 py-0.5 rounded-md border uppercase ${q.difficulty === "easy" && "text-green-400 border-green-500/20 bg-green-500/5"
                                  } ${q.difficulty === "medium" && "text-yellow-400 border-yellow-500/20 bg-yellow-500/5"
                                  } ${q.difficulty === "hard" && "text-red-400 border-red-500/20 bg-red-500/5"
                                  }`}
                              >
                                {q.difficulty}
                              </span>

                              {q.youtubeLink && (
                                <button
                                  onClick={() => openYoutubeModal(q.youtubeLink)}
                                  className="inline-flex items-center gap-1 text-red-500 hover:text-red-400 text-sm bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded-md transition"
                                  title="Watch Solution"
                                >
                                  <FaYoutube className="text-base" />
                                  <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Solution</span>
                                </button>
                              )}

                              <button
                                onClick={() => getHint(q.title)}
                                className="text-[11px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 text-purple-400 transition"
                              >
                                💡 AI Hint
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* RIGHT ACTION CONTROLS */}
                        <div className="flex items-center justify-end gap-3 border-t border-gray-800/40 sm:border-t-0 pt-3 sm:pt-0">

                          {/* BOOKMARK BUTTON */}
                          <button
                            onClick={() => toggleBookmark(q._id)}
                            className="p-2 rounded-lg bg-gray-900 border border-gray-800/80 hover:border-gray-700 transition"
                            title={isBookmarked(q._id) ? "Remove Bookmark" : "Bookmark Question"}
                          >
                            {isBookmarked(q._id) ? (
                              <FaBookmark className="text-yellow-500 text-sm" />
                            ) : (
                              <FaRegBookmark className="text-gray-500 text-sm hover:text-gray-300" />
                            )}
                          </button>

                          {/* NOTES BUTTON */}
                          <button
                            onClick={() => openNoteModal(q._id, q.title)}
                            className="p-2 rounded-lg bg-gray-900 border border-gray-800/80 hover:border-gray-700 text-cyan-500 hover:text-cyan-400 text-sm transition"
                            title="Personal Notes"
                          >
                            <FaStickyNote />
                          </button>

                          {/* ADMIN UPDATE & DELETE PANEL */}
                          {user?.role === "admin" && (
                            <div className="flex items-center gap-1.5 ml-1 pl-3 border-l border-gray-800">
                              <button
                                onClick={() => {
                                  setShowForm(true);
                                  setEditQuestionId(q._id);
                                  setQuestionData({
                                    title: q.title,
                                    difficulty: q.difficulty,
                                    platform: q.platform,
                                    link: q.link,
                                    youtubeLink: q.youtubeLink || ""
                                  });
                                }}
                                className="p-2 text-xs font-semibold bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 rounded-lg transition"
                                title="Edit"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleDeleteQuestion(q._id)}
                                className="p-2 text-xs font-semibold bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 rounded-lg transition"
                                title="Delete"
                              >
                                🗑️
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 bg-[#111315] border border-gray-800 rounded-2xl">
                    <p className="text-gray-500 text-sm">No questions matched your search criteria.</p>
                  </div>
                )}
              </div>
            </>
          )
        }



      </div>

      {/* =========================
          MODALS ARCHITECTURE
      ========================= */}

      {/* NOTES MODAL */}
      {noteModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[#111315] border border-gray-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-start justify-between mb-4 gap-4">
              <h2 className="text-base font-bold text-gray-100 flex items-center gap-2">
                📝 Notes: <span className="text-blue-400 font-medium text-sm truncate max-w-[280px]">{selectedQuestionTitle}</span>
              </h2>
              <button
                onClick={() => setNoteModal(false)}
                className="text-gray-500 hover:text-white transition text-lg"
              >
                ✕
              </button>
            </div>

            <textarea
              rows="7"
              placeholder="Jot down formulas, edge cases, or approach insights..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 outline-none focus:border-blue-500 text-sm text-gray-200 resize-none leading-relaxed transition"
            />

            <div className="flex items-center justify-end gap-3 mt-4">
              <button
                onClick={deleteNote}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-600/10 hover:bg-red-600/20 text-red-400 transition"
              >
                Clear Note
              </button>
              <button
                onClick={saveNote}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIDEO EXPLANATION MODAL */}
      {videoModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-2 sm:p-4 backdrop-blur-md">
          <div className="bg-black border border-gray-800 rounded-2xl w-full max-w-4xl relative overflow-hidden shadow-2xl">
            <button
              onClick={() => {
                setVideoModal(false);
                setCurrentVideo("");
              }}
              className="absolute top-3 right-3 z-50 bg-black/70 hover:bg-black text-gray-300 hover:text-white w-9 h-9 rounded-full flex items-center justify-center text-xl transition"
            >
              ×
            </button>
            <div className="aspect-video bg-gray-950">
              <iframe
                src={currentVideo}
                title="Youtube Video Player"
                className="w-full h-full border-0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* AI HINT MODAL */}
      {hintModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[#111315] border border-gray-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-gray-800/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">✨</span>
                <h2 className="text-base font-bold text-gray-200">AI Assistant Hint</h2>
              </div>
              <button
                onClick={() => {
                  setHintModal(false);
                  setHintText("");
                  setDisplayHint("");
                }}
                className="text-gray-500 hover:text-white transition text-lg"
              >
                ✕
              </button>
            </div>

            <div className="min-h-[100px] flex flex-col justify-between">
              {hintLoading ? (
                <div className="py-4 flex items-center gap-3 text-gray-400 text-sm">
                  <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  Thinking & rendering approach details...
                </div>
              ) : (
                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap font-sans bg-gray-900/30 border border-gray-800/40 p-3.5 rounded-xl">
                  {displayHint}
                </p>
              )}

              <div className="mt-4 pt-3 border-t border-gray-800/60 flex justify-end">
                <p className="text-[11px] font-medium text-gray-500 tracking-wide uppercase bg-gray-900 px-2 py-1 rounded-md border border-gray-800/80">
                  Remaining today: <span className="text-purple-400 font-bold tabular-nums">{remainingHints}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Question;