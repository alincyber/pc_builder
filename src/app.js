const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
app.use(express.json());
app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);
app.use(cors());
const userRoutes = require("./routes/user.routes");
const categoryRoutes = require("./routes/category.routes"); // ✅ Add this line
const productRoutes = require("./routes/product.routes"); // ✅ Add this line
const productImageRoutes =require("./routes/productImage.routes");
const specificationRoutes =require("./routes/specification.routes");
const reviewRoutes =require("./routes/review.routes");

app.use("/api/product-images",productImageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes); // ✅ Add this line
app.use("/api/specifications",specificationRoutes);
app.use("/api/reviews", reviewRoutes);

module.exports = app;