const pool = require("../config/mysql");

// ==============================
// Add Specification
// ==============================

exports.addSpecification = async (req, res) => {

    try {

        const {
            product_id,
            specification_name,
            specification_value
        } = req.body;

        if (
            !product_id ||
            !specification_name ||
            !specification_value
        ) {

            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });

        }

        const [product] = await pool.query(
            "SELECT id FROM products WHERE id=?",
            [product_id]
        );

        if (product.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Product not found."
            });

        }

        const [result] = await pool.query(

            `INSERT INTO product_specifications
            (
                product_id,
                specification_name,
                specification_value
            )
            VALUES (?, ?, ?)`,

            [
                product_id,
                specification_name,
                specification_value
            ]

        );

        return res.status(201).json({

            success: true,

            message: "Specification added successfully.",

            specification: {

                id: result.insertId,

                product_id,

                specification_name,

                specification_value

            }

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: "Internal Server Error"

        });

    }

};