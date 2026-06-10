import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const SolvedQuestions = () => {

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    // =========================
    // GET SOLVED QUESTIONS
    // =========================

    const getSolvedQuestions = async () => {

        try {

            const { data } = await API.get(
                "/questions/solved"
            );

            setQuestions(data.data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        getSolvedQuestions();

    }, []);

    // =========================
    // DIFFICULTY COLOR
    // =========================

    const getDifficultyColor = (difficulty) => {

        if (difficulty === "easy") {

            return "text-green-400 bg-green-500/10 border-green-500/20";

        }

        if (difficulty === "medium") {

            return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";

        }

        return "text-red-400 bg-red-500/10 border-red-500/20";

    };

    return (

        <div className="min-h-screen text-white p-4 sm:p-6">

            {/* =========================
                HEADER
            ========================= */}

            <div className="mb-10">

                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">

                    Solved Questions

                </h1>

                <p className="text-gray-400 mt-2 text-sm">

                    Revise all solved coding problems

                </p>

            </div>

            {/* =========================
                LOADING
            ========================= */}

            {
                loading ? (

                    <div className="space-y-6">

                        {
                            [...Array(4)].map((_, i) => (

                                <div
                                    key={i}
                                    className="bg-[#111315] border border-gray-800 rounded-3xl p-6 animate-pulse"
                                >

                                    <div className="h-6 w-52 bg-gray-700 rounded mb-6"></div>

                                    <div className="space-y-4">

                                        {
                                            [...Array(3)].map((_, j) => (

                                                <div
                                                    key={j}
                                                    className="bg-black/30 border border-gray-800 rounded-2xl p-4"
                                                >

                                                    <div className="h-4 w-44 bg-gray-700 rounded mb-3"></div>

                                                    <div className="h-3 w-24 bg-gray-800 rounded"></div>

                                                </div>

                                            ))
                                        }

                                    </div>

                                </div>

                            ))
                        }

                    </div>

                ) : questions.length > 0 ? (

                    <div className="space-y-8">

                        {
                            questions.map((topic, index) => (

                                <div
                                    key={index}
                                    className="bg-linear-to-br from-[#111315] to-[#181b20] border border-gray-800 rounded-3xl p-6 shadow-lg"
                                >

                                    {/* TOPIC */}

                                    <div className="mb-6">

                                        <h2 className="text-2xl font-bold text-green-400">

                                            {topic.topicName}

                                        </h2>

                                    </div>

                                    {/* PATTERNS */}

                                    <div className="space-y-6">

                                        {
                                            topic.patterns.map((pattern, i) => (

                                                <div key={i}>

                                                    {/* PATTERN */}

                                                    <h3 className="text-lg font-semibold text-gray-300 mb-4">

                                                        {pattern.patternName}

                                                    </h3>

                                                    {/* QUESTIONS */}

                                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

                                                        {
                                                            pattern.questions.map((question) => (

                                                                <Link
                                                                    to={`/questions/${question.patternId}`}
                                                                    key={question._id}
                                                                    className="group bg-black/30 border border-gray-800 rounded-2xl p-4 hover:border-green-500 hover:-translate-y-1 transition duration-300"
                                                                >

                                                                    <div className="flex items-start justify-between gap-3">

                                                                        <h4 className="text-sm font-medium text-gray-200 leading-relaxed group-hover:text-white transition">

                                                                            {question.title}

                                                                        </h4>

                                                                        <span className="text-green-400 text-xs font-bold">

                                                                            ✓

                                                                        </span>

                                                                    </div>

                                                                    {/* DIFFICULTY */}

                                                                    <div className="mt-4">

                                                                        <span
                                                                            className={`text-xs px-3 py-1 rounded-full border capitalize ${getDifficultyColor(
                                                                                question.difficulty
                                                                            )}`}
                                                                        >

                                                                            {question.difficulty}

                                                                        </span>

                                                                    </div>

                                                                </Link>

                                                            ))
                                                        }

                                                    </div>

                                                </div>

                                            ))
                                        }

                                    </div>

                                </div>

                            ))
                        }

                    </div>

                ) : (

                    <div className="h-[60vh] flex items-center justify-center text-gray-500">

                        No solved questions found

                    </div>

                )
            }

        </div>

    );

};

export default SolvedQuestions;