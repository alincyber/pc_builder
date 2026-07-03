const mongoose = require("mongoose");

const buildSchema = new mongoose.Schema({

    userId: {

        type: Number,
        required: true

    },

    buildName: {

        type: String,
        required: true,
        trim: true

    },

    components: {

        cpu: Number,

        motherboard: Number,

        gpu: Number,

        ram: Number,

        storage: Number,

        psu: Number,

        cabinet: Number,

        cooler: Number

    },

    totalPrice: {

        type: Number,
        default: 0

    },

    status: {

        type: String,

        enum: [

            "Draft",
            "Completed"

        ],

        default: "Draft"

    }

},{
    timestamps:true
});

module.exports = mongoose.model(
    "Build",
    buildSchema
);