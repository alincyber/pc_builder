const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const rateLimiter =
require("./middleware/rateLimiter.middleware");
app.use(rateLimiter);
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
const buildRoutes =require("./routes/build.route");
const notificationRoutes =require("./routes/notification.routes");
const activityRoutes = require("./routes/activity.routes");
const wishlistRoutes =require("./routes/wishlist.routes");
const otpRoutes =require("./routes/otp.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");
const adminRoutes = require("./routes/admin.routes");





app.use("/api/product-images",productImageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes); // ✅ Add this line
app.use("/api/specifications",specificationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/builds",buildRoutes);
app.use("/api/notifications",notificationRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/wishlist",wishlistRoutes);
app.use("/api/otp",otpRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

module.exports = app;