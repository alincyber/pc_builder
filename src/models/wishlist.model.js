const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({

    userId:{

        type:Number,

        required:true,

        unique:true

    },

    products:[{

        type:Number

    }]

},{
    timestamps:true
});

module.exports = mongoose.model(
    "Wishlist",
    wishlistSchema
);