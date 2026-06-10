import Topic from "../model/TopicModel.js";

export const addTopic = async (req, res) => {

    try {

        const { name, description } = req.body;

        const existingTopic = await Topic.findOne({ name });

        if (existingTopic) {

            return res.status(400).json({
                success: false,
                message: "Topic already exists"
            });

        }

        const topic = await Topic.create({
            name,
            description
        });

        res.status(201).json({
            success: true,
            message: "Topic added successfully",
            topic
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export const getAllTopics = async (req, res) => {

    try {

        const topics = await Topic.find();

        res.status(200).json({
            success: true,
            topics
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export const deleteTopic = async (req, res) => {

    try {

        const topic = await Topic.findById(req.params.id);

        if (!topic) {

            return res.status(404).json({
                success: false,
                message: "Topic not found"
            });

        }

        await Topic.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Topic deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export const updateTopic = async (req, res) => {

    try {

        const { name, description } = req.body;

        const topic = await Topic.findById(req.params.id);

        if (!topic) {

            return res.status(404).json({
                success: false,
                message: "Topic not found"
            });

        }

        // duplicate check

        const existingTopic = await Topic.findOne({
            name: {
                $regex: new RegExp(`^${name.trim()}$`, "i")
            },
            _id: { $ne: topic._id }
        });

        if (existingTopic) {

            return res.status(400).json({
                success: false,
                message: "Topic already exists"
            });

        }

        topic.name = name.trim();
        topic.description = description;

        await topic.save();

        res.status(200).json({
            success: true,
            message: "Topic updated successfully",
            topic
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export const getTopicById = async (req, res) => {
    try {
        const { topicId } = req.params;

        const topic = await Topic.findById(topicId).select("name description");

        if (!topic) {
            return res.status(404).json({
                success: false,
                message: "Topic not found"
            });
        }

        return res.status(200).json({
            success: true,
            topic
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
