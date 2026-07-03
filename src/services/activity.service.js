const Activity = require("../models/OrderActivity");

exports.createActivity = async (data) => {

    return await Activity.create(data);

};