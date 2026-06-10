import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import Swal from "sweetalert2";

const Patterns = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();

  const [patterns, setPatterns] = useState([]);
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editPatternId, setEditPatternId] = useState(null);
  const [topicDetails, setTopicDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [patternData, setPatternData] = useState({
    name: "",
    description: "",
  });

  // =========================
  // GET PATTERNS
  // =========================
  const getPatterns = async () => {
    try {
      setLoading(true);

      const [patternsRes, topicRes] = await Promise.all([
        API.get(`/patterns/${topicId}`),
        API.get(`/topics/${topicId}`)
      ]);

      setPatterns(patternsRes.data.patterns);
      setTopicDetails(topicRes.data.topic);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GET USER
  // =========================
  const getMe = async () => {
    try {
      const { data } = await API.get("/auth/getuser");
      setUser(data.user);
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // ADD PATTERN
  // =========================
  const handleAddPattern = async () => {
    if (!patternData.name || !patternData.description) {
      Swal.fire({
        icon: "warning",
        title: "All fields required",
        background: "#111315",
        color: "#fff"
      });
      return;
    }

    try {
      await API.post("/patterns/add-pattern", {
        topicId,
        ...patternData
      });

      Swal.fire({
        icon: "success",
        title: "Pattern Added",
        text: "Pattern added successfully",
        background: "#111315",
        color: "#fff",
        timer: 1500,
        showConfirmButton: false
      });

      setPatternData({ name: "", description: "" });
      setShowForm(false);
      getPatterns();
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Something went wrong",
        background: "#111315",
        color: "#fff",
      });
    }
  };

  // =========================
  // UPDATE PATTERN
  // =========================
  const handleUpdatePattern = async () => {
    try {
      await API.put(`/patterns/update-pattern/${editPatternId}`, patternData);

      Swal.fire({
        icon: "success",
        title: "Updated",
        text: "Pattern updated successfully",
        background: "#111315",
        color: "#fff",
        timer: 1500,
        showConfirmButton: false
      });

      setPatternData({ name: "", description: "" });
      setEditPatternId(null);
      setShowForm(false);
      getPatterns();
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Something went wrong",
        background: "#111315",
        color: "#fff",
      });
    }
  };

  // =========================
  // DELETE PATTERN
  // =========================
  const handleDeletePattern = async (id) => {
    const result = await Swal.fire({
      title: "Delete Pattern?",
      text: "This action cannot be undone",
      icon: "warning",
      background: "#111315",
      color: "#fff",
      width: "350px",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
    });

    if (!result.isConfirmed) return;

    try {
      await API.delete(`/patterns/${id}`);

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Pattern deleted successfully",
        background: "#111315",
        color: "#fff",
        timer: 1500,
        showConfirmButton: false
      });

      getPatterns();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPatterns();
    getMe();
  }, []);

  if (loading) {
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
    )
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 font-sans antialiased bg-[#090b0d] text-slate-100">

      {/* GLOW DECORATIONS */}
      <div className="absolute top-12 right-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-5 border-b border-slate-500/10">
          <div className="space-y-1.5">
            <button
              onClick={() => navigate("/topics")}
              className="text-xs font-bold flex items-center gap-1 uppercase tracking-wider transition-colors duration-150 text-slate-400 hover:text-white"
            >
              <span>←</span> Back to Modules
            </button>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent/0 inline-block">
              Algorithmic Patterns
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-400">
              Analyze recurring logic templates and problem-solving blueprints.
            </p>
          </div>

          {user?.role === "admin" && (
            <button
              onClick={() => {
                setShowForm(!showForm);
                if (showForm) {
                  setEditPatternId(null);
                  setPatternData({ name: "", description: "" });
                }
              }}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold tracking-wide shadow-md transition-all duration-200 active:scale-95 ${showForm
                ? "bg-slate-500/10 text-slate-400 hover:bg-slate-500/20"
                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/10"
                }`}
            >
              {showForm ? "✕ Close Form" : "＋ Create Pattern"}
            </button>
          )}
        </div>

        {/* ADMIN MANAGEMENT FORM */}
        {showForm && (
          <div className="border rounded-2xl p-6 mb-8 shadow-xl max-w-2xl transform transition-all duration-300 bg-white/[0.02] border-white/10 backdrop-blur-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-emerald-500">
              {editPatternId ? "Modify Pattern Architecture" : "Deploy New Strategy Pattern"}
            </h3>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="e.g., Sliding Window, Two Pointers"
                value={patternData.name}
                onChange={(e) => setPatternData({ ...patternData, name: e.target.value })}
                className={`w-full p-3.5 rounded-xl text-sm font-medium border outline-none transition-all duration-200 bg-black/30 border-white/10 text-white focus:border-emerald-500`}
              />

              <textarea
                placeholder="Break down the execution flow or constraints characteristic of this core pattern..."
                rows={4}
                value={patternData.description}
                onChange={(e) => setPatternData({ ...patternData, description: e.target.value })}
                className={`w-full p-3.5 rounded-xl text-sm font-medium border outline-none resize-none transition-all duration-200 bg-black/30 border-white/10 text-white focus:border-emerald-500`}
              />

              <button
                onClick={editPatternId ? handleUpdatePattern : handleAddPattern}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 active:scale-[0.98] shadow-md ${editPatternId
                  ? "bg-amber-600 hover:bg-amber-500 shadow-amber-600/10"
                  : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/10"
                  }`}
              >
                {editPatternId ? "Save Template Changes" : "Publish Pattern"}
              </button>
            </div>
          </div>
        )}

        {topicDetails?.description && (
          <div className="mb-8 bg-gradient-to-b from-white/[0.03] to-transparent border border-white/[0.06] rounded-2xl p-5 shadow-inner">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50" />
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">{topicDetails.name} overview</h4>
            </div>
            
            {/* Fixed Height Box with custom scroll styling */}
            <div className="max-h-38 overflow-y-auto pr-2 text-sm text-slate-300/90 leading-relaxed font-medium text-justify scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
              <p className="whitespace-pre-wrap">{topicDetails.description}</p>
            </div>
          </div>
        )}

        {/* PATTERNS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {patterns.map((pattern) => (
            <div
              key={pattern._id}
              onClick={() => navigate(`/questions/${pattern._id}`)}
              className="group border rounded-2xl p-5 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-[230px] relative bg-white/[0.02] border-white/5 hover:border-emerald-500/40 hover:bg-white/[0.04]"
            >
              {/* PATTERN NAME */}
              <h2 className="text-lg font-bold tracking-tight transition-colors duration-200 group-hover:text-emerald-500 text-slate-100">
                {pattern.name}
              </h2>

              {/* DESCRIPTION */}
              <div className="mt-2.5 flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-rounded">
                <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words font-medium line-clamp-4 group-hover:line-clamp-none transition-all text-slate-400">
                  {pattern.description}
                </p>
              </div>

              {/* FOOTER METRICS & CONTROLS */}
              <div className="border-t mt-4 pt-3.5 flex items-center justify-between border-white/5">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md tracking-wide bg-emerald-500/10 text-emerald-400">
                  {pattern.questionCount || 0} Questions
                </span>

                {user?.role === "admin" && (
                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        setShowForm(true);
                        setEditPatternId(pattern._id);
                        setPatternData({ name: pattern.name, description: pattern.description });
                      }}
                      className="p-1.5 px-3 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white transition-all duration-150"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePattern(pattern._id)}
                      className="p-1.5 px-3 rounded-lg text-xs font-bold bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-150"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Patterns;