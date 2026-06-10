import Question from "../model/QuestionModel.js";
import Pattern from "../model/PatternModel.js";
import UserProgress from "../model/UserProgress.js";
import Bookmark from "../model/BookMarkModel.js";
import Note from "../model/NoteModel.js";
import Streak from "../model/Streak.js";

export const addQuestion = async (req, res) => {

    try {

        const {
            patternId,
            title,
            difficulty,
            platform,
            link,
            youtubeLink
        } = req.body;

        const formattedTitle = title.trim();

        // duplicate check
        const existingQuestion = await Question.findOne({
            patternId,
            title: {
                $regex: new RegExp(`^${formattedTitle}$`, "i")
            }
        });

        if (existingQuestion) {

            return res.status(400).json({
                success: false,
                message: "Question already exists"
            });

        }

        const question = await Question.create({
            patternId,
            title: formattedTitle,
            difficulty,
            platform,
            link,
            youtubeLink
        });

        // increase question count
        await Pattern.findByIdAndUpdate(
            patternId,
            {
                $inc: { questionCount: 1 }
            }
        );

        res.status(201).json({
            success: true,
            message: "Question added successfully",
            question
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


export const getQuestionsByPattern = async (req, res) => {
    try {
        const { patternId } = req.params;

        let questions = await Question.find({ patternId }).sort({ createdAt: -1 });

        // 1️⃣ normalize difficulty (important fix)
        questions = questions.map(q => {
            return {
                ...q._doc,
                difficulty: q.difficulty.toLowerCase().trim()
            };
        });

        // 2️⃣ custom sort order
        const order = {
            easy: 1,
            medium: 2,
            hard: 3
        };

        questions.sort((a, b) => order[a.difficulty] - order[b.difficulty]);

        res.status(200).json({
            success: true,
            data: questions
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const toggleSolved = async (req, res) => {

    try {

        const userId = req.user.id;

        const questionId = req.params.id;

        const existing = await UserProgress.findOne({
            userId,
            questionId
        });

        // =========================
        // UNSOLVED
        // =========================

        if (existing) {

            await UserProgress.deleteOne({
                _id: existing._id
            });

            return res.json({

                success: true,

                message: "Marked as unsolved"

            });

        }

        // =========================
        // SOLVED
        // =========================

        const userProgress = await UserProgress.create({

            userId,

            questionId,

            isSolved: true,

            // revisionCount: 0,

            lastSolvedAt: new Date(),

            // needsRevision: false

        });

        // =========================
        // STREAK SYSTEM
        // =========================

        let streak = await Streak.findOne({
            userId
        });

        if (!streak) {

            streak = await Streak.create({

                userId,

                currentStreak: 1,

                bestStreak: 1,

                lastSolvedDate: new Date()

            });

        } else {

            const today = new Date();

            const lastDate = streak.lastSolvedDate
                ? new Date(streak.lastSolvedDate)
                : null;

            // remove time

            today.setHours(0, 0, 0, 0);

            if (lastDate) {

                lastDate.setHours(0, 0, 0, 0);

                const diffTime =
                    today.getTime() -
                    lastDate.getTime();

                const diffDays =
                    diffTime /
                    (1000 * 60 * 60 * 24);

                // already solved today

                if (diffDays === 0) {

                    // do nothing

                }

                // consecutive day

                else if (diffDays === 1) {

                    streak.currentStreak += 1;

                }

                // streak broken

                else {

                    streak.currentStreak = 1;

                }

            } else {

                streak.currentStreak = 1;

            }

            // BEST STREAK

            if (
                streak.currentStreak >
                streak.bestStreak
            ) {

                streak.bestStreak =
                    streak.currentStreak;

            }

            streak.lastSolvedDate = today;

            await streak.save();

        }

        res.json({

            success: true,

            userProgress,

            message: "Marked as solved",

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

export const getProgress = async (req, res) => {
    try {
        const userId = req.user.id;

        const data = await UserProgress.find({ userId });

        res.json({
            success: true,
            data
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteQuestion = async (req, res) => {

    try {

        const question = await Question.findById(req.params.id);

        if (!question) {

            return res.status(404).json({
                success: false,
                message: "Question not found"
            });

        }

        // DELETE QUESTION

        await Question.findByIdAndDelete(req.params.id);

        // DECREASE QUESTION COUNT

        await Pattern.findByIdAndUpdate(
            question.patternId,
            {
                $inc: { questionCount: -1 }
            }
        );

        // DELETE RELATED SOLVED DATA

        await UserProgress.deleteMany({
            questionId: question._id
        });

        // DELETE RELATED BOOKMARKS

        await Bookmark.deleteMany({
            questionId: question._id
        });

        // DELETE RELATED NOTES

        await Note.deleteMany({
            questionId: question._id
        });

        res.status(200).json({
            success: true,
            message: "Question and related data deleted successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export const updateQuestion = async (req, res) => {

    try {

        const {
            title,
            difficulty,
            platform,
            link,
            youtubeLink
        } = req.body;

        const question = await Question.findById(req.params.id);

        if (!question) {

            return res.status(404).json({
                success: false,
                message: "Question not found"
            });

        }

        // duplicate check
        if (title) {

            const existingQuestion = await Question.findOne({
                patternId: question.patternId,
                title: {
                    $regex: new RegExp(`^${title.trim()}$`, "i")
                },
                _id: { $ne: question._id }
            });

            if (existingQuestion) {

                return res.status(400).json({
                    success: false,
                    message: "Question already exists"
                });

            }

            question.title = title.trim();

        }

        if (difficulty) {
            question.difficulty = difficulty;
        }

        if (platform) {
            question.platform = platform;
        }

        if (link) {
            question.link = link;
        }

        if (youtubeLink) {
            question.youtubeLink = youtubeLink;
        }

        await question.save();

        res.status(200).json({
            success: true,
            message: "Question updated successfully",
            question
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


export const searchQuestions = async (req, res) => {

    try {

        const keyword = req.query.keyword;

        const questions = await Question.find({
            title: {
                $regex: keyword,
                $options: "i"
            }
        });

        res.status(200).json({
            success: true,
            questions
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ==============================
// TOGGLE BOOKMARK
// ==============================

export const toggleBookmark = async (req, res) => {

    try {

        const userId = req.user.id;

        const questionId = req.params.id;

        const existing =
            await Bookmark.findOne({
                userId,
                questionId
            });

        if (existing) {

            await Bookmark.findByIdAndDelete(
                existing._id
            );

            return res.json({
                success: true,
                message: "Bookmark removed"
            });

        }

        await Bookmark.create({
            userId,
            questionId
        });

        res.json({
            success: true,
            message: "Bookmarked"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ==============================
// GET BOOKMARKS
// ==============================

export const getBookmarks = async (req, res) => {

    try {

        const bookmarks =
            await Bookmark.find({
                userId: req.user.id
            });

        res.json({
            success: true,
            data: bookmarks
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// =========================
// SAVE NOTE
// =========================

export const saveNote = async (req, res) => {

    try {

        const userId = req.user.id;

        const questionId = req.params.id;

        const { note, questionTitle } = req.body;

        let existingNote = await Note.findOne({
            userId,
            questionId
        });

        // update existing note

        if (existingNote) {

            existingNote.note = note;

            existingNote.questionTitle = questionTitle;

            await existingNote.save();

            return res.json({
                success: true,
                message: "Note updated",
                data: existingNote
            });

        }

        // create new note

        const newNote = await Note.create({
            userId,
            questionId,
            questionTitle,
            note
        });

        res.json({
            success: true,
            message: "Note saved",
            data: newNote
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// =========================
// GET NOTE
// =========================

export const getNote = async (req, res) => {

    try {

        const userId = req.user.id;

        const questionId = req.params.id;

        const note = await Note.findOne({
            userId,
            questionId
        });

        res.json({
            success: true,
            data: note || {}
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// =========================
// DELETE NOTE
// =========================

export const deleteNote = async (req, res) => {

    try {

        const userId = req.user.id;

        const questionId = req.params.id;

        await Note.findOneAndDelete({
            userId,
            questionId
        });

        res.json({
            success: true,
            message: "Note deleted"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// =========================
// GET ALL NOTES
// =========================

export const getAllNotes = async (req, res) => {

    try {

        const notes = await Note.find({
            userId: req.user.id
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            data: notes
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ==========================
// GET SOLVED QUESTIONS
// ===========================
export const getSolvedQuestions = async (req, res) => {

    try {

        const userId = req.user.id;

        // =========================
        // GET SOLVED QUESTIONS
        // =========================

        const solvedQuestions =
            await UserProgress.find({
                userId
            })
                .populate({
                    path: "questionId",
                    populate: {
                        path: "patternId",
                        populate: {
                            path: "topicId"
                        }
                    }
                });

        // =========================
        // REMOVE NULL QUESTIONS
        // =========================

        const filteredQuestions =
            solvedQuestions.filter(
                item => item.questionId !== null
            );

        // =========================
        // GROUP DATA
        // =========================

        const groupedData = {};

        filteredQuestions.forEach((item) => {

            const question = item.questionId;

            const topicName =
                question.patternId?.topicId?.name ||
                "Unknown Topic";

            const patternName =
                question.patternId?.name ||
                "Unknown Pattern";

            // CREATE TOPIC

            if (!groupedData[topicName]) {

                groupedData[topicName] = {};

            }

            // CREATE PATTERN

            if (!groupedData[topicName][patternName]) {

                groupedData[topicName][patternName] = [];

            }

            // PUSH QUESTION

            groupedData[topicName][patternName].push({

                _id: question._id,
                title: question.title,
                difficulty: question.difficulty,
                patternId: question.patternId?._id

            });

        });

        // =========================
        // CONVERT OBJECT → ARRAY
        // =========================

        const finalData =
            Object.entries(groupedData).map(
                ([topicName, patterns]) => ({

                    topicName,

                    patterns:
                        Object.entries(patterns).map(
                            ([patternName, questions]) => ({

                                patternName,
                                questions

                            })
                        )

                })
            );

        res.status(200).json({

            success: true,
            data: finalData

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ==========================
// GET BOOKMARKED QUESTIONS
// ==========================
export const getBookmarkedQuestions = async (req, res) => {

    try {

        const userId = req.user.id;

        // =========================
        // GET BOOKMARKS WITH FULL DATA
        // =========================

        const bookmarks = await Bookmark.find({ userId })

            .populate({
                path: "questionId",
                populate: {
                    path: "patternId",
                    populate: {
                        path: "topicId"
                    }
                }
            });

        // =========================
        // REMOVE DELETED QUESTIONS
        // =========================

        const filteredBookmarks =
            bookmarks.filter(
                (item) => item.questionId
            );

        // =========================
        // GROUP DATA
        // =========================

        const groupedData = {};

        filteredBookmarks.forEach((item) => {

            const question = item.questionId;

            const topicName =
                question.patternId?.topicId?.name ||
                "Unknown Topic";

            const patternName =
                question.patternId?.name ||
                "Unknown Pattern";

            // CREATE TOPIC

            if (!groupedData[topicName]) {

                groupedData[topicName] = {};

            }

            // CREATE PATTERN

            if (!groupedData[topicName][patternName]) {

                groupedData[topicName][patternName] = [];

            }

            // PUSH QUESTION

            groupedData[topicName][patternName].push({

                _id: question._id,
                title: question.title,
                difficulty: question.difficulty,
                platform: question.platform,
                patternId: question.patternId?._id

            });

        });

        // =========================
        // CONVERT OBJECT TO ARRAY
        // =========================

        const finalData =
            Object.entries(groupedData).map(
                ([topicName, patterns]) => ({

                    topicName,

                    patterns:
                        Object.entries(patterns).map(
                            ([patternName, questions]) => ({

                                patternName,
                                questions

                            })
                        )

                })
            );

        res.status(200).json({

            success: true,
            data: finalData

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ==========================
// GET DUE REVISIONS
// =========================
export const getDueRevisions = async (req, res) => {

    try {

        const userId = req.user.id;

        const today = new Date();

        const revisions = await UserProgress.find({

            userId,

            isSolved: true,

            nextRevisionDate: {
                $lte: today
            }

        }).populate("questionId");

        res.json({

            success: true,

            totalDue: revisions.length,

            revisions

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

export const addToRevision = async (req, res) => {
    try {
        const userId = req.user.id;
        const questionId = req.params.id;

        const progress = await UserProgress.findOne({
            userId,
            questionId
        });

        if (!progress) {
            return res.status(404).json({
                success: false,
                message: "Question not solved yet"
            });
        }

        progress.revisionCount = 0;
        progress.needsRevision = true;

        // 👉 FIRST REVISION: next day
        progress.nextRevisionDate = new Date(
            Date.now() + 1 * 24 * 60 * 60 * 1000
        );

        await progress.save();

        res.json({
            success: true,
            message: "Added to revision"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const completeRevision = async (req, res) => {
    try {
        const userId = req.user.id;
        const questionId = req.params.id;

        const progress = await UserProgress.findOne({
            userId,
            questionId
        });

        if (!progress) {
            return res.status(404).json({
                success: false,
                message: "Progress not found"
            });
        }

        // 👉 pattern: 1, 3, 5 days
        const intervals = [1, 3, 5];

        const step = progress.revisionCount;

        // 👉 DONE CONDITION
        if (step >= intervals.length) {
            progress.revisionCount = 3;
            progress.needsRevision = false;
            progress.nextRevisionDate = null;

            await progress.save();

            return res.json({
                success: true,
                message: "All revisions completed"
            });
        }

        // 👉 move forward step
        progress.revisionCount = step + 1;

        const days = intervals[step];

        // 👉 IMPORTANT: next revision based on NOW
        progress.nextRevisionDate = new Date(
            Date.now() + days * 24 * 60 * 60 * 1000
        );

        // 👉 final completion
        if (progress.revisionCount === intervals.length) {
            progress.needsRevision = false;
            progress.nextRevisionDate = null;
        }

        await progress.save();

        res.json({
            success: true,
            message: "Revision completed"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};