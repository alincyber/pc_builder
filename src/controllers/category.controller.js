const pool = require("../config/mysql");

// ======================================
// Get All Categories
// ======================================

exports.getCategories = async (req, res) => {

    try {

        const [categories] = await pool.query(`
            SELECT *
            FROM categories
            ORDER BY id DESC
        `);

        return res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        });

    }

};
// ======================================
// Get Category By ID
// ======================================



exports.getCategoryById = async (req,res)=>{

    try{

        const {id}=req.params;

        const [category]=await pool.query(
            "SELECT * FROM categories WHERE id=?",
            [id]
        );

        if(category.length===0){

            return res.status(404).json({
                success:false,
                message:"Category not found."
            });

        }

        return res.status(200).json({
            success:true,
            data:category[0]
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
// create Category
// ======================================

exports.createCategory = async (req,res)=>{

    try{

        const{
            name,
            slug,
            description,
            image
        }=req.body;

        if(!name || !slug){

            return res.status(400).json({
                success:false,
                message:"Name and slug are required."
            });

        }

        const [exist]=await pool.query(
            "SELECT id FROM categories WHERE name=? OR slug=?",
            [name,slug]
        );

        if(exist.length>0){

            return res.status(400).json({
                success:false,
                message:"Category already exists."
            });

        }

        const [result]=await pool.query(

            `INSERT INTO categories
            (name,slug,description,image)
            VALUES(?,?,?,?)`,

            [
                name,
                slug,
                description,
                image
            ]

        );

        return res.status(201).json({

            success:true,
            message:"Category created successfully.",

            category:{
                id:result.insertId,
                name,
                slug,
                description,
                image,
                status:"active"
            }

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
// update Category

// ======================================

exports.updateCategory = async (req,res)=>{

    try{

        const{id}=req.params;

        const{
            name,
            slug,
            description,
            image,
            status
        }=req.body;

        const [category]=await pool.query(
            "SELECT * FROM categories WHERE id=?",
            [id]
        );

        if(category.length===0){

            return res.status(404).json({
                success:false,
                message:"Category not found."
            });

        }

        await pool.query(

            `UPDATE categories
            SET
            name=?,
            slug=?,
            description=?,
            image=?,
            status=?
            WHERE id=?`,

            [
                name,
                slug,
                description,
                image,
                status,
                id
            ]

        );

        return res.status(200).json({

            success:true,
            message:"Category updated successfully."

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
// delete Category
// ======================================

exports.deleteCategory = async (req,res)=>{

    try{

        const{id}=req.params;

        const [category]=await pool.query(
            "SELECT * FROM categories WHERE id=?",
            [id]
        );

        if(category.length===0){

            return res.status(404).json({
                success:false,
                message:"Category not found."
            });

        }

        await pool.query(
            "DELETE FROM categories WHERE id=?",
            [id]
        );

        return res.status(200).json({

            success:true,
            message:"Category deleted successfully."

        });

    }catch(error){

        console.error(error);

        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        });

    }

};