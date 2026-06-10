import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Swal from "sweetalert2";

const Topics = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editTopicId, setEditTopicId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [topicData, setTopicData] = useState({
    name: "",
    description: "",
  });

  // =========================
  // GET TOPICS
  // =========================
  const getTopics = async () => {
    try {
      setLoading(true);
      const res = await API.get("/topics");
      setTopics(res.data.topics);
    } catch (error) {
      console.log(error);
    }finally{
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
  // ADD TOPIC
  // =========================
  const handleAddTopic = async () => {
    if (!topicData.name || !topicData.description) {
      Swal.fire({
        icon: "warning",
        title: "All fields required",
        background: "#111315",
        color: "#fff",
      });
      return;
    }

    try {
      await API.post("/topics/add-topic", topicData);
      Swal.fire({
        icon: "success",
        title: "Topic Added",
        text: "Topic added successfully",
        background: "#111315",
        color: "#fff",
        timer: 1500,
        showConfirmButton: false
      });
      setTopicData({ name: "", description: "" });
      setShowForm(false);
      getTopics();
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
  // UPDATE TOPIC
  // =========================
  const handleUpdateTopic = async () => {
    if (!topicData.name || !topicData.description) {
      Swal.fire({
        icon: "warning",
        title: "All fields required",
        background: "#111315",
        color: "#fff",
      });
      return;
    }

    try {
      await API.put(`/topics/${editTopicId}`, topicData);
      Swal.fire({
        icon: "success",
        title: "Updated",
        text: "Topic updated successfully",
        background: "#111315",
        color: "#fff",
        timer: 1500,
        showConfirmButton: false
      });
      setTopicData({ name: "", description: "" });
      setEditTopicId(null);
      setShowForm(false);
      getTopics();
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
  // DELETE TOPIC
  // =========================
  const handleDeleteTopic = async (id) => {
    const result = await Swal.fire({
      title: "Delete Topic?",
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
      customClass: {
        popup: "rounded-2xl shadow-xl",
        title: "text-lg font-bold",
        htmlContainer: "text-sm",
        confirmButton: "px-4 py-2 rounded-xl font-medium",
        cancelButton: "px-4 py-2 rounded-xl font-medium"
      }
    });

    if (!result.isConfirmed) return;

    try {
      await API.delete(`/topics/${id}`);
      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Topic deleted successfully",
        background: "#111315",
        color: "#fff",
        timer: 1500,
        showConfirmButton: false
      });
      getTopics();
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

  useEffect(() => {
    getTopics();
    getMe();
  }, []);

  return (
    <div className="min-h-screen p-4 sm:p-8 font-sans antialiased bg-[#090b0d] text-slate-100">

      <>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
      </>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-5 border-b border-slate-500/10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
              DSA Practice Path
            </h1>
            <p className="text-xs sm:text-sm mt-1 font-medium text-slate-400">
              Select a core data structure or algorithm module to begin.
            </p>
          </div>

          {user?.role === "admin" && (
            <button
              onClick={() => {
                setShowForm(!showForm);
                if (showForm) {
                  setEditTopicId(null);
                  setTopicData({ name: "", description: "" });
                }
              }}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold tracking-wide shadow-md transition-all duration-200 active:scale-95 flex items-center gap-2 ${showForm
                ? "bg-slate-500/10 text-slate-400 hover:bg-slate-500/20"
                : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/10"
                }`}
            >
              {showForm ? "✕ Close Form" : "＋ Create Topic"}
            </button>
          )}
        </div>

        {/* ADMIN MANAGEMENT FORM */}
        {showForm && (
          <div className="border rounded-2xl p-6 mb-8 shadow-xl max-w-2xl transform transition-all duration-300 bg-white/[0.02] border-white/10 backdrop-blur-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-blue-500">
              {editTopicId ? "Modify Existing Module" : "Add New DSA Module"}
            </h3>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="e.g., Graphs, Dynamic Programming"
                value={topicData.name}
                onChange={(e) => setTopicData({ ...topicData, name: e.target.value })}
                className="w-full p-3.5 rounded-xl text-sm font-medium border outline-none transition-all duration-200 bg-black/30 border-white/10 text-white focus:border-blue-500"
              />

              <textarea
                placeholder="Provide a concise description of what this topic covers..."
                rows={4}
                value={topicData.description}
                onChange={(e) => setTopicData({ ...topicData, description: e.target.value })}
                className="w-full p-3.5 rounded-xl text-sm font-medium border outline-none transition-all duration-200 bg-black/30 border-white/10 text-white focus:border-blue-500"
              />

              <button
                onClick={editTopicId ? handleUpdateTopic : handleAddTopic}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 active:scale-[0.98] shadow-md ${editTopicId
                  ? "bg-amber-600 hover:bg-amber-500 shadow-amber-600/10"
                  : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/10"
                  }`}
              >
                {editTopicId ? "Save Module Changes" : "Publish Module"}
              </button>
            </div>
          </div>
        )}

        {loading && (
         <div className="min-h-[50vh] flex items-center justify-center  text-white">

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
        )}

        {/* TOPICS CARD GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {topics.map((topic) => (
            <div
              key={topic._id}
              onClick={() => navigate(`/patterns/${topic._id}`)}
              className="group border rounded-2xl p-5 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-[230px] relative bg-white/[0.02] border-white/5 hover:border-blue-500/50 hover:bg-white/[0.04]"
            >
              {/* TOPIC NAME */}
              <h2 className="text-lg font-bold tracking-tight transition-colors duration-200 group-hover:text-blue-500 text-slate-100">
                {topic.name}
              </h2>

              {/* DESCRIPTION SECTION WITH CUSTOM SCROLL */}
              <div className="mt-2.5 flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-rounded">
                <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words font-medium line-clamp-4 group-hover:line-clamp-none transition-all text-slate-400">
                  {topic.description}
                </p>
              </div>

              {/* FOOTER METRICS & CONTROLS */}
              <div className="border-t mt-4 pt-3.5 flex items-center justify-between border-white/5">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md tracking-wide bg-blue-500/10 text-blue-400">
                  {topic.patternCount || 0} Patterns
                </span>

                {user?.role === "admin" && (
                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        setShowForm(true);
                        setEditTopicId(topic._id);
                        setTopicData({ name: topic.name, description: topic.description });
                      }}
                      className="p-1.5 px-3 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white transition-all duration-150"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTopic(topic._id)}
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

export default Topics;