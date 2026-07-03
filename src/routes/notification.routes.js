const express = require("express");

const router = express.Router();

const notificationController =
require("../controllers/notification.controller");

router.post(
    "/",
    notificationController.createNotification
);

router.get(
    "/user/:userId",
    notificationController.getUserNotifications
);

router.patch(
    "/:id/read",
    notificationController.markAsRead
);

router.delete(
    "/:id",
    notificationController.deleteNotification
);

module.exports = router;