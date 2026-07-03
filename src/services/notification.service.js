const Notification = require("../models/Notification");

exports.createNotification = async (data) => {

    return await Notification.create(data);

};