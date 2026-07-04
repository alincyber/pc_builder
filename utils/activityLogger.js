const Activity = require("../models/activity.model");

const logActivity = async ({

    userId,

    action,

    module,

    details = {},

    req = null

}) => {

    try {

        await Activity.create({

            userId,

            action,

            module,

            details,

            ipAddress: req?.ip || "",

            device: req?.headers["user-agent"] || ""

        });

    } catch (error) {

        console.error("Activity Log Error:", error);

    }

};

module.exports = logActivity;