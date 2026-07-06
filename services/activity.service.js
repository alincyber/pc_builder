const Activity = require("../models/orderactivity");
exports.createActivity = async (data) => {

    return await Activity.create(data);

};