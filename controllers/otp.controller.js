const otpService =
require("../services/otp.service");

exports.sendOTP = async (req,res)=>{

    try{

        const {email}=req.body;

        if(!email){

            return res.status(400).json({

                success:false,

                message:"Email is required."

            });

        }

        const otp = Math.floor(

            100000 +

            Math.random()*900000

        ).toString();

        await otpService.saveOTP(

            email,

            otp

        );

        return res.status(200).json({

            success:true,

            message:"OTP Generated",

            otp

        });

    }catch(error){

        console.error(error);

        return res.status(500).json({

            success:false,

            message:"Internal Server Error"

        });

    }

};

exports.verifyOTP = async(req,res)=>{

    try{

        const {

            email,

            otp

        } = req.body;

        const storedOTP =

        await otpService.getOTP(

            email

        );

        if(!storedOTP){

            return res.status(400).json({

                success:false,

                message:"OTP Expired"

            });

        }

        if(storedOTP!==otp){

            return res.status(400).json({

                success:false,

                message:"Invalid OTP"

            });

        }

        await otpService.deleteOTP(

            email

        );

        return res.status(200).json({

            success:true,

            message:"OTP Verified"

        });

    }catch(error){

        console.error(error);

        return res.status(500).json({

            success:false,

            message:"Internal Server Error"

        });

    }

};