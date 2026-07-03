const Review = require("../models/review.model");

// =====================================
// Add Review
// =====================================

exports.addReview = async (req, res) => {

    try {

        const {

            productId,
            userId,
            rating,
            review

        } = req.body;

        if (
            !productId ||
            !userId ||
            !rating ||
            !review
        ) {

            return res.status(400).json({

                success: false,
                message: "All fields are required."

            });

        }

        const newReview = await Review.create({

            productId,
            userId,
            rating,
            review

        });

        return res.status(201).json({

            success: true,

            message: "Review added successfully.",

            review: newReview

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};

// ======================================
// Get All Reviews
// ======================================

exports.getReviews = async (req, res) => {

    try {

        const reviews = await Review.find()
            .sort({ createdAt: -1 });

        return res.status(200).json({

            success: true,

            count: reviews.length,

            reviews

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: "Internal Server Error"

        });

    }

};

// ======================================
// Get Review By ID
// ======================================

exports.getReviewById = async (req, res) => {

    try {

        const review = await Review.findById(req.params.id);

        if (!review) {

            return res.status(404).json({

                success:false,
                message:"Review not found."

            });

        }

        return res.status(200).json({

            success:true,

            review

        });

    } catch(error){

        console.error(error);

        return res.status(500).json({

            success:false,
            message:"Internal Server Error"

        });

    }

};

// ======================================
// Get Product Reviews
// ======================================

exports.getProductReviews = async (req,res)=>{

    try{

        const reviews = await Review.find({

            productId:req.params.productId

        }).sort({

            createdAt:-1

        });

        return res.status(200).json({

            success:true,

            count:reviews.length,

            reviews

        });

    }catch(error){

        console.error(error);

        return res.status(500).json({

            success:false,
            message:"Internal Server Error"

        });

    }

};

// ======================================
// Update Review
// ======================================

exports.updateReview = async (req,res)=>{

    try{

        const review = await Review.findByIdAndUpdate(

            req.params.id,

            req.body,

            {

                new:true

            }

        );

        if(!review){

            return res.status(404).json({

                success:false,
                message:"Review not found."

            });

        }

        return res.status(200).json({

            success:true,

            message:"Review updated.",

            review

        });

    }catch(error){

        console.error(error);

        return res.status(500).json({

            success:false,
            message:"Internal Server Error"

        });

    }

};

// ======================================
// Delete Review
// ======================================

exports.deleteReview = async (req,res)=>{

    try{

        const review = await Review.findByIdAndDelete(

            req.params.id

        );

        if(!review){

            return res.status(404).json({

                success:false,
                message:"Review not found."

            });

        }

        return res.status(200).json({

            success:true,

            message:"Review deleted."

        });

    }catch(error){

        console.error(error);

        return res.status(500).json({

            success:false,
            message:"Internal Server Error"

        });

    }

};

// ======================================
// Like Review
// ======================================

exports.likeReview = async (req,res)=>{

    try{

        const review = await Review.findById(req.params.id);

        if(!review){

            return res.status(404).json({

                success:false,
                message:"Review not found."

            });

        }

        review.likes++;

        await review.save();

        return res.status(200).json({

            success:true,

            likes:review.likes

        });

    }catch(error){

        console.error(error);

        return res.status(500).json({

            success:false,
            message:"Internal Server Error"

        });

    }

};