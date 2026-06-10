import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const Bookmarks = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
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
  // GET BOOKMARK QUESTIONS
  // =========================
  const getBookmarkedQuestions = async () => {
    try {
      const { data } = await API.get("/questions/bookmarks");
      setQuestions(data.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBookmarkedQuestions();
  }, []);

  // =========================
  // DIFFICULTY COLOR
  // =========================
  const getDifficultyColor = (difficulty) => {
    if (difficulty === "easy") {
      return "text-green-400 border-green-500/20 bg-green-500/5";
    }
    if (difficulty === "medium") {
      return "text-yellow-400 border-yellow-500/20 bg-yellow-500/5";
    }
    return "text-red-400 border-red-500/20 bg-red-500/5";
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
          Bookmarked Questions
        </h1>
        <p className="text-gray-500 text-sm mt-2">Quick dashboard for patterns requiring active revision</p>
      </div>

      {/* LOADING SKELETON */}
      {loading ? (
        <div className="max-w-7xl mx-auto space-y-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-[#111315] border border-gray-800/80 rounded-2xl p-6 animate-pulse">
              <div className="h-6 w-44 bg-gray-800 rounded mb-5"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-24 bg-gray-900/50 border border-gray-800 rounded-xl"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : questions.length > 0 ? (
        <div className="max-w-7xl mx-auto space-y-10">
          {questions.map((topic, index) => (
            <div key={index} className="space-y-4">
              {/* TOPIC BANNER */}
              <div className="flex items-center gap-3 border-b border-gray-900 pb-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 uppercase tracking-wider">
                  Topic
                </span>
                <h2 className="text-xl font-bold text-gray-200">
                  {topic.topicName}
                </h2>
              </div>

              {/* PATTERNS CONTAINER */}
              <div className="space-y-6 pl-1">
                {(topic.patterns || []).map((pattern, i) => (
                  <div key={i} className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-400 flex items-center gap-2">
                      <span className="text-blue-500">↳</span> {pattern.patternName}
                    </h3>

                    {/* QUESTIONS GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {(pattern.questions || []).map((question) => (
                        <Link
                          to={`/questions/${question.patternId}`}
                          key={question._id}
                          className="group bg-[#111315] border border-gray-800/80 rounded-xl p-4 hover:border-yellow-500/40 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between shadow-md"
                        >
                          <div className="flex items-start justify-between gap-3 mb-4">
                            <h4 className="text-sm font-medium text-gray-300 group-hover:text-white leading-snug transition-colors line-clamp-2">
                              {question.title}
                            </h4>
                            <span className="text-yellow-500/40 group-hover:text-yellow-500 transition-colors text-sm shrink-0">
                              🔖
                            </span>
                          </div>

                          {/* CARD FOOTER */}
                          <div className="flex items-center justify-between">
                            <span className={`text-[11px] font-semibold tracking-wide px-2 py-0.5 rounded-md border uppercase ${getDifficultyColor(question.difficulty)}`}>
                              {question.difficulty}
                            </span>
                            <span className="text-[10px] text-gray-600 group-hover:text-blue-400 transition-colors font-medium">
                              Solve →
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-md mx-auto text-center py-20 bg-[#111315] border border-gray-800/60 rounded-2xl">
          <span className="text-3xl block mb-3">🔖</span>
          <p className="text-gray-500 text-sm">No bookmarked questions saved yet.</p>
        </div>
      )}
    </div>
  );
};

export default Bookmarks;