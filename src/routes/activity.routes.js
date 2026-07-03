const express = require("express");

const router = express.Router();

const activityController = require("../controllers/activity.controller");

router.post("/", activityController.createActivity);

router.get("/", activityController.getActivities);

router.get("/user/:userId", activityController.getUserActivities);

router.get("/:id", activityController.getActivityById);

router.delete("/:id", activityController.deleteActivity);

module.exports = router;