const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({

    userId:{
        type:Number,
        required:true
    },

    action:{
        type:String,
        required:true
    },

    module:{
        type:String,
        required:true
    },

    details:{
        type:Object,
        default:{}
    },

    ipAddress:{
        type:String
    },

    device:{
        type:String
    }

},{
    timestamps:true
});

module.exports = mongoose.model(
    "Activity",
    activitySchema
);