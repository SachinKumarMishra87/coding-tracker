import axios from "axios";
import User from "../model/User.js";

// =========================
// GET HINT
// =========================

export const getHint = async (
  req,
  res
) => {

  try {

    let { title } = req.body;

    const user = req.user;

    // =========================
    // USER
    // =========================

    const dbUser =
      await User.findById(
        user.id
      );

    // =========================
    // DATE RESET
    // =========================

    const today = new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    if (

      !dbUser.lastHintDate ||

      new Date(
        dbUser.lastHintDate
      ).setHours(
        0,
        0,
        0,
        0
      ) !== today.getTime()

    ) {

      dbUser.dailyHintCount = 0;

      dbUser.lastHintDate =
        today;

    }

    // =========================
    // LIMIT CHECK
    // =========================

    if (
      dbUser.dailyHintCount >= 10
    ) {

      return res.status(429).json({

        success: false,

        message:
          "Daily AI limit reached"
      });

    }

    // =========================
    // VALIDATION
    // =========================

    if (
      !title ||
      typeof title !== "string"
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Question title required"

      });

    }

    title =
      title.trim().slice(0, 300);

    // =========================
    // OPENROUTER API
    // =========================

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        // Ab kisi specific model ka jhanjhat hi khatam!
        // Yeh hamesha chalne waale kisi bhi free model ko automatic pick kar lega.
        model: "openrouter/free",

        messages: [
          {
            role: "system",
            content: "You are a DSA mentor. Give only a short hint. No code."
          },
          {
            role: "user",
            content: `Question: ${title}`
          }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "Coding Tracker"
        }
      }
    );

    // =========================
    // RESPONSE
    // =========================

    const hint =

      response.data
        .choices[0]
        .message.content;

    // =========================
    // SAVE COUNT
    // =========================

    dbUser.dailyHintCount += 1;

    await dbUser.save();

    return res.status(200).json({

      success: true,

      hint,

      remainingHints:
        10 -
        dbUser.dailyHintCount

    });

  } catch (error) {

    console.log(
      error.response?.data ||
      error.message
    );

    return res.status(500).json({

      success: false,

      message:
        error.response?.data?.error?.message ||
        "AI server busy. Try again."

    });

  }

};
