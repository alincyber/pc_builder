const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({

    userId:{
        type:Number,
        required:true
    },

    title:{
        type:String,
        required:true
    },

    message:{
        type:String,
        required:true
    },

    type:{
        type:String,
        enum:[
            "order",
            "payment",
            "review",
            "build",
            "coupon",
            "system"
        ],
        default:"system"
    },

    isRead:{
        type:Boolean,
        default:false
    }

},{
    timestamps:true
});

module.exports =
mongoose.model(
    "Notification",
    notificationSchema
);