const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(

    {

        userId: {

            type: Number,

            required: true,

            unique: true

        },

        products: [

            {

                productId: {

                    type: Number,

                    required: true

                },

                addedAt: {

                    type: Date,

                    default: Date.now

                }

            }

        ]

    },

    {

        timestamps: true

    }

);

module.exports =
    mongoose.models.Wishlist ||
    mongoose.model("Wishlist", wishlistSchema);