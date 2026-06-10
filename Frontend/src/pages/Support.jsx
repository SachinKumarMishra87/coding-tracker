import { useState } from "react";
import toast from "react-hot-toast";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const Support = () => {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({

        subject: "",

        category: "Bug Report",

        message: ""

    });
    

    const categories = [

        {
            icon: "🐞",
            title: "Bug Report"
        },

        {
            icon: "💡",
            title: "Feature Request"
        },

        {
            icon: "⭐",
            title: "Feedback"
        },

        {
            icon: "❓",
            title: "Question Issue"
        }

    ];

    const handleSubmit = async () => {

        if (
            !formData.subject.trim() ||
            !formData.message.trim()
        ) {

            toast.error(
                "All fields are required"
            );

            return;

        }

        try {

            await API.post(

                "/support/create-ticket",

                formData

            );

            toast.success(
                "Ticket submitted successfully"
            );

            setFormData({

                subject: "",

                category: "Bug Report",

                message: ""

            });

        } catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Something went wrong"

            );

        }

    };

    return (

        <div className="min-h-screen">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative">
                <button className=" text-sm text-gray-400 hover:text-gray-700  border-2 p-2 rounded-md transition-colors absolute top-6 right-5"
                    onClick={() => navigate("/my-tickets")}
                >
                    My Tickets
                </button>

                {/* HEADER */}

                <div className="text-center mb-10">

                    <div
                        className="
                            inline-flex
                            items-center

                            gap-2

                            px-4 py-2

                            rounded-full

                            bg-cyan-500/10

                            border border-cyan-500/20

                            text-cyan-400

                            text-sm
                        "
                    >
                        🛟 Help & Support
                    </div>

                    <h1
                        className="
                            mt-5

                            text-4xl
                            md:text-5xl

                            font-black
                        "
                    >
                        Need Help?
                    </h1>

                    <p
                        className="
                            mt-3

                            text-gray-400

                            max-w-2xl
                            mx-auto
                        "
                    >
                        Report bugs, request features,
                        send feedback, or ask questions.
                    </p>

                </div>

                {/* CATEGORY CARDS */}

                <div
                    className="
                        grid

                        grid-cols-2
                        md:grid-cols-4

                        gap-4

                        mb-8
                    "
                >

                    {
                        categories.map((item) => (

                            <button

                                key={item.title}

                                onClick={() =>
                                    setFormData({
                                        ...formData,
                                        category: item.title
                                    })
                                }

                                className={`
                                
                                p-5

                                rounded-3xl

                                border

                                backdrop-blur-xl

                                transition-all

                                hover:scale-[1.03]

                                ${formData.category === item.title
                                        ? "border-cyan-500 bg-cyan-500/10"
                                        : "border-white/10 bg-white/5"
                                    }

                            `}
                            >

                                <div className="text-3xl">

                                    {item.icon}

                                </div>

                                <p className="mt-3 font-semibold">

                                    {item.title}

                                </p>

                            </button>

                        ))
                    }

                </div>

                {/* CONTENT */}

                <div
                    className="
                        grid

                        lg:grid-cols-3

                        gap-6
                    "
                >

                    {/* FORM */}

                    <div
                        className="
                            lg:col-span-2

                            rounded-[32px]

                            p-6 md:p-8

                            bg-white/5

                            border

                            border-white/10

                            backdrop-blur-2xl
                        "
                    >

                        <h2 className="text-2xl font-bold">

                            Create Ticket

                        </h2>

                        <div className="mt-6 space-y-5">

                            <div>

                                <label className="block mb-2 text-sm">

                                    Subject

                                </label>

                                <input

                                    type="text"

                                    value={formData.subject}

                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            subject:
                                                e.target.value
                                        })
                                    }

                                    placeholder="Enter subject"

                                    className="
                                        w-full

                                        p-3

                                        rounded-2xl

                                        bg-[#111315]

                                        border

                                       border-gray-700

                                        outline-none

                                        focus:border-cyan-500
                                    "
                                />

                            </div>

                            <div>

                                <label className="block mb-2 text-sm">

                                    Category

                                </label>

                                <select

                                    value={formData.category}

                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            category:
                                                e.target.value
                                        })
                                    }

                                    className="
                                        w-full

                                        p-3

                                        rounded-2xl
bg-[#111315]

                                        border

                                       border-gray-700

                                        outline-none
                                    "
                                >

                                    <option>
                                        Bug Report
                                    </option>

                                    <option>
                                        Feature Request
                                    </option>

                                    <option>
                                        Feedback
                                    </option>

                                    <option>
                                        Question Issue
                                    </option>

                                    <option>
                                        Account Issue
                                    </option>

                                </select>

                            </div>

                            <div>

                                <label className="block mb-2 text-sm">

                                    Message

                                </label>

                                <textarea

                                    rows={7}

                                    value={formData.message}

                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            message:
                                                e.target.value
                                        })
                                    }

                                    placeholder="Describe your issue..."

                                    className="
                                        w-full

                                        p-3

                                        rounded-2xl

                                        bg-[#111315]

                                        border

                                       border-gray-700

                                        resize-none

                                        outline-none

                                        focus:border-cyan-500
                                    "
                                />

                            </div>

                            <button

                                onClick={handleSubmit}

                                className="
                                    w-full

                                    py-3

                                    rounded-2xl

                                    bg-gradient-to-r
                                    from-cyan-500
                                    to-blue-600

                                    text-white

                                    font-semibold

                                    hover:scale-[1.02]

                                    transition-all
                                "
                            >

                                Submit Ticket

                            </button>

                        </div>

                    </div>

                    {/* RIGHT PANEL */}

                    <div
                        className="
                            rounded-[32px]

                            p-6

                            bg-white/5

                            border

                            border-white/10

                            backdrop-blur-2xl
                        "
                    >

                        <h2 className="text-2xl font-bold">

                            Support Info

                        </h2>

                        <div className="space-y-6 mt-6">

                            <div>

                                <h3 className="font-semibold">

                                    ⏱ Response Time

                                </h3>

                                <p className="text-sm text-gray-400 mt-2">

                                    Usually within
                                    24 hours.

                                </p>

                            </div>

                            <div>

                                <h3 className="font-semibold">

                                    We Can Help With

                                </h3>

                                <ul className="mt-3 space-y-2 text-sm text-gray-400">

                                    <li>
                                        ✓ Bug Reports
                                    </li>

                                    <li>
                                        ✓ Feature Requests
                                    </li>

                                    <li>
                                        ✓ Feedback
                                    </li>

                                    <li>
                                        ✓ Question Issues
                                    </li>

                                    <li>
                                        ✓ Account Problems
                                    </li>

                                </ul>

                            </div>

                            <div
                                className="
                                    p-4

                                    rounded-2xl

                                    bg-cyan-500/10

                                    border
                                    border-cyan-500/20
                                "
                            >

                                💡 Detailed descriptions
                                help us resolve issues
                                faster.

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default Support;
