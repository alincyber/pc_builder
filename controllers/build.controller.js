const Build = require("../models/build.model");

// =====================================
// Save Build
// =====================================

exports.createBuild = async (req,res)=>{

    try{

        const build = await Build.create(req.body);

        return res.status(201).json({

            success:true,

            message:"Build saved successfully.",

            build

        });

    }catch(error){

        console.error(error);

        return res.status(500).json({

            success:false,

            message:"Internal Server Error"

        });

    }

};

// =====================================
// Get All Builds
// =====================================

exports.getBuilds = async(req,res)=>{

    try{

        const builds = await Build.find()
        .sort({createdAt:-1});

        return res.status(200).json({

            success:true,

            count:builds.length,

            builds

        });

    }catch(error){

        console.error(error);

        return res.status(500).json({

            success:false,

            message:"Internal Server Error"

        });

    }

};


// =====================================
// Get Build By ID
// =====================================

exports.getBuildById = async(req,res)=>{

    try{

        const build =
        await Build.findById(req.params.id);

        if(!build){

            return res.status(404).json({

                success:false,

                message:"Build not found."

            });

        }

        return res.status(200).json({

            success:true,

            build

        });

    }catch(error){

        console.error(error);

        return res.status(500).json({

            success:false,

            message:"Internal Server Error"

        });

    }

};


// =====================================
// Update Build
// =====================================

exports.updateBuild = async(req,res)=>{

    try{

        const build =
        await Build.findByIdAndUpdate(

            req.params.id,

            req.body,

            {new:true}

        );

        if(!build){

            return res.status(404).json({

                success:false,

                message:"Build not found."

            });

        }

        return res.status(200).json({

            success:true,

            message:"Build updated.",

            build

        });

    }catch(error){

        console.error(error);

        return res.status(500).json({

            success:false,

            message:"Internal Server Error"

        });

    }

};

// =====================================
// Delete Build
// =====================================

exports.deleteBuild = async(req,res)=>{

    try{

        const build =
        await Build.findByIdAndDelete(
            req.params.id
        );

        if(!build){

            return res.status(404).json({

                success:false,

                message:"Build not found."

            });

        }

        return res.status(200).json({

            success:true,

            message:"Build deleted."

        });

    }catch(error){

        console.error(error);

        return res.status(500).json({

            success:false,

            message:"Internal Server Error"

        });

    }

};