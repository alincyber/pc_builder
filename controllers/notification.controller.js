const Notification =require("../models/notification");

exports.createNotification = async (req,res)=>{

    try{

        const notification =
        await Notification.create(req.body);

        res.status(201).json({

            success:true,

            notification

        });

    }catch(error){

        console.error(error);

        res.status(500).json({

            success:false,

            message:"Internal Server Error"

        });

    }

};

exports.getUserNotifications =
async(req,res)=>{

    try{

        const notifications =
        await Notification.find({

            userId:req.params.userId

        })
        .sort({

            createdAt:-1

        });

        res.status(200).json({

            success:true,

            count:notifications.length,

            notifications

        });

    }catch(error){

        console.error(error);

        res.status(500).json({

            success:false,

            message:"Internal Server Error"

        });

    }

};

exports.markAsRead =
async(req,res)=>{

    try{

        const notification =
        await Notification.findByIdAndUpdate(

            req.params.id,

            {

                isRead:true

            },

            {

                new:true

            }

        );

        res.status(200).json({

            success:true,

            notification

        });

    }catch(error){

        console.error(error);

        res.status(500).json({

            success:false,

            message:"Internal Server Error"

        });

    }

};

exports.deleteNotification =
async(req,res)=>{

    try{

        await Notification.findByIdAndDelete(

            req.params.id

        );

        res.status(200).json({

            success:true,

            message:"Deleted Successfully"

        });

    }catch(error){

        console.error(error);

        res.status(500).json({

            success:false,

            message:"Internal Server Error"

        });

    }

};