const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({

    userId: {
        type: Number,
        required: true
    },

    orderId: {
        type: Number
    },

    action: {
        type: String,

        
        required: true
    },

    message: {
        type: String,
        required: true
    }

}, {
    timestamps: true
});

module.exports =
    mongoose.models.OrderActivity ||
    mongoose.model(
        "OrderActivity",
        activitySchema
    );