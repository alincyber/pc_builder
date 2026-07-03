const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload.middleware");

const productImageController =
require("../controllers/productImage.controller");

router.post(

    "/",

    upload.array("images", 10),

    productImageController.uploadImages

);

module.exports = router;