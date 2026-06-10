import { useEffect, useState } from "react";
import API from "../services/api";
import Swal from "sweetalert2";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loading, setLoading] = useState(false);
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
  // GET NOTES
  // =========================
  const getNotes = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/questions/all-notes");
      setNotes(data.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DELETE NOTE
  // =========================
  const deleteNote = async (id) => {
    const result = await Swal.fire({
      title: "Delete Note?",
      text: "This action cannot be undone",
      icon: "warning",
      background: "#111315",
      color: "#fff",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#374151",
      confirmButtonText: "Delete"
    });

    if (!result.isConfirmed) return;

    try {
      await API.delete(`/questions/note/${id}`);
      Swal.fire({
        icon: "success",
        title: "Note Deleted",
        background: "#111315",
        color: "#fff",
        timer: 1200,
        showConfirmButton: false
      });
      getNotes();
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // UPDATE NOTE
  // =========================
  const updateNote = async (note) => {
    const { value: text } = await Swal.fire({
      title: "Update Note",
      input: "textarea",
      inputValue: note.note,
      inputPlaceholder: "Write your note...",
      background: "#111315",
      color: "#fff",
      showCancelButton: true,
      confirmButtonText: "Update",
      inputAttributes: {
        autocapitalize: "off"
      }
    });

    if (text === undefined) return;

    try {
      // AUTO DELETE IF EMPTY
      if (!text.trim()) {
        await API.delete(`/questions/note/${note.questionId}`);
        Swal.fire({
          icon: "success",
          title: "Empty Note Deleted",
          background: "#111315",
          color: "#fff",
          timer: 1200,
          showConfirmButton: false
        });
        getNotes();
        return;
      }

      // UPDATE NOTE
      await API.post(`/questions/note/${note.questionId}`, {
        note: text,
        questionTitle: note.questionTitle
      });

      Swal.fire({
        icon: "success",
        title: "Note Updated",
        background: "#111315",
        color: "#fff",
        timer: 1200,
        showConfirmButton: false
      });
      getNotes();
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // USE EFFECT
  // =========================
  useEffect(() => {
    getNotes();
  }, []);


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
    <div className="min-h-screen bg-[#090a0b] text-gray-100 p-6 sm:p-8 antialiased">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
          My Personal Notes
        </h1>
        <p className="text-gray-500 text-sm mt-2">Your curated list of edge-cases, insights, and approaches</p>
      </div>

      {/* EMPTY STATE */}
      {notes.length === 0 && (
        <div className="text-center py-20 max-w-md mx-auto bg-[#111315] border border-gray-800/60 rounded-2xl">
          <span className="text-3xl block mb-3">📝</span>
          <p className="text-gray-500 text-sm">No conceptual notes found. Start adding them from questions!</p>
        </div>
      )}

      {/* GRID */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((item) => (
          <div
            key={item._id}
            className="group relative bg-[#111315] border border-gray-800/80 rounded-2xl p-5 hover:border-blue-500/50 transition-all duration-300 flex flex-col h-[260px] shadow-lg hover:shadow-xl hover:shadow-blue-500/[0.02]"
          >
            {/* TOP HEADER */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <h2 className="text-sm sm:text-base font-semibold text-gray-200 line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors">
                {item.questionTitle || "Question Insight"}
              </h2>

              {/* ACTION BUTTONS */}
              <div className="flex items-center gap-1.5 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
                <button
                  onClick={() => updateNote(item)}
                  className="p-1.5 rounded-lg bg-gray-900 border border-gray-800 text-xs text-blue-400 hover:bg-blue-600 hover:text-white transition"
                  title="Edit Note"
                >
                  ✏️
                </button>
                <button
                  onClick={() => deleteNote(item.questionId)}
                  className="p-1.5 rounded-lg bg-gray-900 border border-gray-800 text-xs text-red-400 hover:bg-red-600 hover:text-white transition"
                  title="Delete Note"
                >
                  🗑️
                </button>
              </div>
            </div>

            {/* CONTENT AREA */}
            <div className="flex-1 overflow-y-auto text-xs sm:text-sm text-gray-400 leading-relaxed pr-1 whitespace-pre-wrap scrollbar-thin scrollbar-thumb-gray-800">
              {item.note}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notes;