const express = require("express");

const router = express.Router();

const productController = require("../controllers/product.controller");

const upload = require("../middleware/upload.middleware");

// Products
router.get("/", productController.getProducts);

router.get("/recent",productController.getRecentlyViewed);
router.get("/:id", productController.getProductById);

router.post(
    "/",
    upload.single("thumbnail"),
    productController.createProduct
);

router.put(
    "/:id",
    upload.single("thumbnail"),
    productController.updateProduct
);

router.delete("/:id", productController.deleteProduct);

module.exports = router;