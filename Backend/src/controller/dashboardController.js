import Topic from "../model/TopicModel.js";
import Pattern from "../model/PatternModel.js";
import Question from "../model/QuestionModel.js";
import UserProgress from "../model/UserProgress.js";
import Bookmark from "../model/BookMarkModel.js";
import Note from "../model/NoteModel.js";
import Streak from "../model/Streak.js";
import mongoose from "mongoose";


export const getDashboardData = async (req, res) => {

  try {

    const userId = req.user.id;
    const streak = await Streak.findOne({
      userId
    });
    // =========================
    // TOTAL COUNTS
    // =========================

    const totalTopics =
      await Topic.countDocuments();

    const totalPatterns =
      await Pattern.countDocuments();

    const totalQuestions =
      await Question.countDocuments();

    // =========================
    // USER DATA
    // =========================

    const solvedQuestions =
      await UserProgress.countDocuments({
        userId
      });

    const bookmarkedQuestions =
      await Bookmark.countDocuments({
        userId
      });

    const totalNotes =
      await Note.countDocuments({
        userId
      });

    // =========================
    // PROGRESS %
    // =========================

    let progressPercent = 0;

    if (totalQuestions > 0) {

      progressPercent =
        Math.round(
          (solvedQuestions / totalQuestions) * 100
        );

    }

    // =========================
    // RECENT SOLVED
    // =========================

    const recentSolved =
      await UserProgress.find({
        userId
      })
        .populate(
          "questionId",
          "title difficulty"
        )
        .sort({ createdAt: -1 })
        .limit(5)
        .then(data =>
          data.filter(
            item => item.questionId !== null
          )
        );

    // =========================
    // TODAY'S SOLVED COUNT
    // =========================
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const solvedToday = await UserProgress.countDocuments({

      userId,

      createdAt: {
        $gte: today
      }

    });

    // =========================
    // RECENT BOOKMARKS
    // =========================

    const recentBookmarks =
      await Bookmark.find({
        userId
      })
        .populate(
          "questionId",
          "title difficulty"
        )
        .sort({ createdAt: -1 })
        .limit(5)
        .then(data =>
          data.filter(
            item => item.questionId !== null
          )
        );

    // =========================
    // RECENT NOTES
    // =========================

    const recentNotes =
      await Note.find({
        userId
      })
        .sort({ updatedAt: -1 })
        .limit(5);

    // =========================
    // RESPONSE
    // =========================

    res.status(200).json({

      success: true,

      data: {

        totalTopics,
        totalPatterns,
        totalQuestions,

        solvedQuestions,
        bookmarkedQuestions,
        totalNotes,

        progressPercent,

        recentSolved,
        recentBookmarks,
        recentNotes,
        currentStreak:
          streak?.currentStreak || 0,

        bestStreak:
          streak?.bestStreak || 0,

        solvedToday

      }

    });

  } catch (error) {

    res.status(500).json({

      success: false,
      message: error.message

    });

  }

};


export const getTopicProgress = async (req, res) => {

  try {

    const userId = req.user.id;

    // all topics
    const topics = await Topic.find();

    const result = [];

    for (const topic of topics) {

      // patterns of topic
      const patterns = await Pattern.find({
        topicId: topic._id
      });

      const patternIds = patterns.map(
        (p) => p._id
      );

      // total questions
      const totalQuestions =
        await Question.countDocuments({
          patternId: {
            $in: patternIds
          }
        });

      // all questions ids
      const questions = await Question.find({
        patternId: {
          $in: patternIds
        }
      });

      const questionIds = questions.map(
        (q) => q._id
      );

      // solved questions
      const solvedQuestions =
        await UserProgress.countDocuments({
          userId,
          questionId: {
            $in: questionIds
          },
          isSolved: true
        });

      // progress %
      const progress =
        totalQuestions > 0
          ? Math.round(
            (solvedQuestions /
              totalQuestions) * 100
          )
          : 0;

      result.push({
        topicName: topic.name,
        totalQuestions,
        solvedQuestions,
        progress
      });

    }

    res.json({
      success: true,
      data: result
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


