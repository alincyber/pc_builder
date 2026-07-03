const express = require("express");

const router = express.Router();

const buildController =
require("../controllers/build.controller");

router.post("/",
buildController.createBuild);

router.get("/",
buildController.getBuilds);

router.get("/:id",
buildController.getBuildById);

router.put("/:id",
buildController.updateBuild);

router.delete("/:id",
buildController.deleteBuild);

module.exports = router;