const Activity = require("../models/OrderActivity");

// ======================================
// Create Activity
// ======================================

exports.createActivity = async (req, res) => {

    try {

        const activity = await Activity.create(req.body);

        return res.status(201).json({

            success: true,
            message: "Activity created successfully.",
            activity

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: "Internal Server Error"

        });

    }

};

// ======================================
// Get All Activities
// ======================================

exports.getActivities = async (req, res) => {

    try {

        const activities = await Activity.find()
            .sort({ createdAt: -1 });

        return res.status(200).json({

            success: true,
            count: activities.length,
            activities

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: "Internal Server Error"

        });

    }

};

// ======================================
// Get Activity By ID
// ======================================

exports.getActivityById = async (req, res) => {

    try {

        const activity = await Activity.findById(req.params.id);

        if (!activity) {

            return res.status(404).json({

                success: false,
                message: "Activity not found."

            });

        }

        return res.status(200).json({

            success: true,
            activity

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: "Internal Server Error"

        });

    }

};

// ======================================
// Get User Activities
// ======================================

exports.getUserActivities = async (req, res) => {

    try {

        const activities = await Activity.find({

            userId: req.params.userId

        }).sort({

            createdAt: -1

        });

        return res.status(200).json({

            success: true,
            count: activities.length,
            activities

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: "Internal Server Error"

        });

    }

};

// ======================================
// Delete Activity
// ======================================

exports.deleteActivity = async (req, res) => {

    try {

        const activity = await Activity.findByIdAndDelete(req.params.id);

        if (!activity) {

            return res.status(404).json({

                success: false,
                message: "Activity not found."

            });

        }

        return res.status(200).json({

            success: true,
            message: "Activity deleted successfully."

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: "Internal Server Error"

        });

    }

};