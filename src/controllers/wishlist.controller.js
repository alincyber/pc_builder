const Wishlist = require("../models/wishlist.model");

// =====================================
// Add Product
// =====================================

exports.addToWishlist = async (req,res)=>{

    try{

        const {

            userId,

            productId

        } = req.body;

        let wishlist = await Wishlist.findOne({

            userId

        });

        if(!wishlist){

            wishlist = new Wishlist({

                userId,

                products:[productId]

            });

        }else{

            if(!wishlist.products.includes(productId)){

                wishlist.products.push(productId);

            }

        }

        await wishlist.save();

        res.status(200).json({

            success:true,

            message:"Product added to wishlist.",

            wishlist

        });

    }catch(error){

        console.error(error);

        res.status(500).json({

            success:false,

            message:"Internal Server Error"

        });

    }

};

// =====================================
// Get Wishlist
// =====================================

exports.getWishlist = async(req,res)=>{

    try{

        const wishlist = await Wishlist.findOne({

            userId:req.params.userId

        });

        res.status(200).json({

            success:true,

            wishlist

        });

    }catch(error){

        console.error(error);

        res.status(500).json({

            success:false,

            message:"Internal Server Error"

        });

    }

};

// =====================================
// Remove Product
// =====================================

exports.removeFromWishlist = async(req,res)=>{

    try{

        const {

            userId,

            productId

        } = req.params;

        const wishlist = await Wishlist.findOne({

            userId

        });

        if(!wishlist){

            return res.status(404).json({

                success:false,

                message:"Wishlist not found."

            });

        }

        wishlist.products = wishlist.products.filter(

            id=>id!=productId

        );

        await wishlist.save();

        res.status(200).json({

            success:true,

            message:"Removed Successfully."

        });

    }catch(error){

        console.error(error);

        res.status(500).json({

            success:false,

            message:"Internal Server Error"

        });

    }

};

// =====================================
// Clear Wishlist
// =====================================

exports.clearWishlist = async(req,res)=>{

    try{

        await Wishlist.findOneAndUpdate(

            {

                userId:req.params.userId

            },

            {

                products:[]

            }

        );

        res.status(200).json({

            success:true,

            message:"Wishlist Cleared."

        });

    }catch(error){

        console.error(error);

        res.status(500).json({

            success:false,

            message:"Internal Server Error"

        });

    }

};