import Pattern from "../model/PatternModel.js";
import Topic from "../model/TopicModel.js";


export const addPattern = async (req, res) => {

    try {

        const { topicId, name, description } = req.body;

        // remove extra spaces
        const formattedName = name.trim();

        // check duplicate pattern in same topic
        const existingPattern = await Pattern.findOne({
            topicId,
            name: {
                $regex: new RegExp(`^${formattedName}$`, "i")
            }
        });

        if (existingPattern) {

            return res.status(400).json({
                success: false,
                message: "Pattern already exists in this topic"
            });

        }

        // create pattern
        const pattern = await Pattern.create({
            topicId,
            name: formattedName,
            description
        });

        // increase topic pattern count
        await Topic.findByIdAndUpdate(
            topicId,
            {
                $inc: { patternCount: 1 }
            }
        );

        res.status(201).json({
            success: true,
            message: "Pattern added successfully",
            pattern
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export const getPatternsByTopic = async (req, res) => {

    try {

        const patterns = await Pattern.find({
            topicId: req.params.topicId
        });

        res.status(200).json({
            success: true,
            patterns
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export const deletePattern = async (req, res) => {

    try {

        const pattern = await Pattern.findById(req.params.id);

        if (!pattern) {

            return res.status(404).json({
                success: false,
                message: "Pattern not found"
            });

        }

        await Pattern.findByIdAndDelete(req.params.id);

        await Topic.findByIdAndUpdate(
            pattern.topicId,
            {
                $inc: { patternCount: -1 }
            }
        );

        res.status(200).json({
            success: true,
            message: "Pattern deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export const updatePattern = async (req, res) => {

    try {

        const {
            name,
            description
        } = req.body;

        const pattern = await Pattern.findById(req.params.id);

        if (!pattern) {

            return res.status(404).json({
                success: false,
                message: "Pattern not found"
            });

        }

        // duplicate check

        if (name) {

            const existingPattern = await Pattern.findOne({

                topicId: pattern.topicId,

                name: {
                    $regex: new RegExp(`^${name.trim()}$`, "i")
                },

                _id: { $ne: pattern._id }

            });

            if (existingPattern) {

                return res.status(400).json({
                    success: false,
                    message: "Pattern already exists"
                });

            }

            pattern.name = name.trim();

        }

        if (description) {

            pattern.description = description;

        }

        await pattern.save();

        res.status(200).json({
            success: true,
            message: "Pattern updated successfully",
            pattern
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export const getPatternById = async (req, res) => {

    try {
        const { patternId } = req.params;
        const pattern = await Pattern.findById(patternId).select("name description");
        if (!pattern) {
            return res.status(404).json({
                success: false,
                message: "Pattern not found",
            });
        }

        return res.status(200).json({
            success: true,
            pattern
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }

}