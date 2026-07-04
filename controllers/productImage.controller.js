const pool = require("../config/mysql");

// ==============================
// Upload Product Images
// ==============================

exports.uploadImages = async (req, res) => {

    try {

        const { product_id } = req.body;

        if (!product_id) {

            return res.status(400).json({

                success: false,
                message: "Product ID is required."

            });

        }

        if (!req.files || req.files.length === 0) {

            return res.status(400).json({

                success: false,
                message: "Please upload images."

            });

        }

        const images = [];

        for (const file of req.files) {

            await pool.query(

                `INSERT INTO product_images
                (
                    product_id,
                    image
                )
                VALUES (?, ?)`,
                [
                    product_id,
                    file.filename
                ]

            );

            images.push(file.filename);

        }

        return res.status(201).json({

            success: true,
            message: "Images uploaded successfully.",

            images

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: "Internal Server Error"

        });

    }

};