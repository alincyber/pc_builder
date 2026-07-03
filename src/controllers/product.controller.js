const pool = require("../config/mysql");
const cacheService =require("../services/cache.service");
const recentService =require("../services/recent.service");
// =====================================
// Get Products
// Search + Pagination + Filter + Sort
// =====================================
exports.getProducts = async (req, res) => {

    try {

        let {
            page = 1,
            limit = 10,
            search = "",
            category,
            brand,
            minPrice,
            maxPrice,
            sort = "newest"
        } = req.query;

        page = Number(page);
        limit = Number(limit);

        // ======================
// Search Cache
// ======================

const searchKey = search
    ? `search:${search.toLowerCase()}`
    : null;

if (searchKey) {

    const cachedSearch = await cacheService.getCache(searchKey);

    if (cachedSearch) {

        return res.status(200).json({

            source: "Redis Search Cache",

            ...cachedSearch

        });

    }

}
        // ======================
        // Redis Cache
        // ======================

        const cacheKey = `products:${JSON.stringify(req.query)}`;

        const cachedData = await cacheService.getCache(cacheKey);

        if (cachedData) {

            return res.status(200).json({

                source: "Redis",

                ...cachedData

            });

        }

        
        const offset = (page - 1) * limit;

        let where = [];
        let values = [];

        // ======================
        // Search
        // ======================

        if (search) {

            where.push("(p.name LIKE ? OR p.sku LIKE ?)");

            values.push(`%${search}%`);
            values.push(`%${search}%`);

        }

        // ======================
        // Category
        // ======================

        if (category) {

            where.push("p.category_id = ?");

            values.push(category);

        }

        // ======================
        // Brand
        // ======================

        if (brand) {

            where.push("p.brand_id = ?");

            values.push(brand);

        }

        // ======================
        // Min Price
        // ======================

        if (minPrice) {

            where.push("p.price >= ?");

            values.push(minPrice);

        }

        // ======================
        // Max Price
        // ======================

        if (maxPrice) {

            where.push("p.price <= ?");

            values.push(maxPrice);

        }

        let whereSQL = "";

        if (where.length > 0) {

            whereSQL = "WHERE " + where.join(" AND ");

        }

        // ======================
        // Sorting
        // ======================

        let orderBy = "p.created_at DESC";

        switch (sort) {

            case "price_asc":
                orderBy = "p.price ASC";
                break;

            case "price_desc":
                orderBy = "p.price DESC";
                break;

            case "name_asc":
                orderBy = "p.name ASC";
                break;

            case "name_desc":
                orderBy = "p.name DESC";
                break;

            case "oldest":
                orderBy = "p.created_at ASC";
                break;

            default:
                orderBy = "p.created_at DESC";

        }

        // ======================
        // Count Products
        // ======================

        const [countResult] = await pool.query(

            `SELECT COUNT(*) AS total
             FROM products p
             ${whereSQL}`,

            values

        );

        const total = countResult[0].total;

        // ======================
        // Fetch Products
        // ======================

        const [products] = await pool.query(

            `SELECT

                p.*,

                c.name AS category_name,

                b.name AS brand_name

            FROM products p

            INNER JOIN categories c
                ON p.category_id = c.id

            INNER JOIN brands b
                ON p.brand_id = b.id

            ${whereSQL}

            ORDER BY ${orderBy}

            LIMIT ?

            OFFSET ?`,

            [...values, limit, offset]

        );

        const response = {

            success: true,

            page,

            limit,

            total,

            totalPages: Math.ceil(total / limit),

            products

        };

        // ======================
        // Save Cache
        // ======================

        await cacheService.setCache(

            cacheKey,

            response,

            300

        );

        // ======================
// Save Search Cache
// ======================

if (searchKey) {

    await cacheService.setCache(

        searchKey,

        response,

        300

    );

}

        return res.status(200).json({

            source: "MySQL",

            ...response

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};

// =====================================
// Get Product By ID
// =====================================

exports.getProductById = async (req, res) => {

    try {

        const { id } = req.params;

        // ===========================
        // Validation
        // ===========================

        if (!id) {

            return res.status(400).json({

                success: false,
                message: "Product ID is required."

            });

        }

        // ===========================
        // Fetch Product
        // ===========================

        const [products] = await pool.query(

            `SELECT

                p.id,
                p.name,
                p.slug,
                p.sku,
                p.short_description,
                p.description,
                p.price,
                p.discount_price,
                p.stock,
                p.thumbnail,
                p.warranty,
                p.status,

                c.id AS category_id,
                c.name AS category_name,

                b.id AS brand_id,
                b.name AS brand_name,

                p.created_at,
                p.updated_at

            FROM products p

            INNER JOIN categories c
                ON p.category_id = c.id

            INNER JOIN brands b
                ON p.brand_id = b.id

            WHERE p.id = ?`,

            [id]

        );

        // ===========================
        // Product Not Found
        // ===========================

        if (products.length === 0) {

            return res.status(404).json({

                success: false,
                message: "Product not found."

            });

        }

        // ===========================
        // Save Recently Viewed Product
        // ===========================

        if (req.user && req.user.id) {

            await recentService.addRecentProduct(

                req.user.id,

                id

            );

        }

        // ===========================
        // Success
        // ===========================

        return res.status(200).json({

            success: true,

            product: products[0]

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: "Internal Server Error"

        });

    }

};
// =====================================
// Create Product
// =====================================

exports.createProduct = async (req, res) => {

    try {

const {
    category_id,
    brand_id,
    name,
    slug,
    sku,
    short_description,
    description,
    price,
    discount_price,
    stock,
    warranty
} = req.body;

const thumbnail = req.file
    ? req.file.filename
    : null;
        // ===========================
        // Validation
        // ===========================

        if (
            !category_id ||
            !brand_id ||
            !name ||
            !slug ||
            !sku ||
            !price
        ) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing."
            });
        }

        if (price <= 0) {
            return res.status(400).json({
                success: false,
                message: "Price must be greater than 0."
            });
        }

        if (discount_price && discount_price > price) {
            return res.status(400).json({
                success: false,
                message: "Discount price cannot be greater than price."
            });
        }

        if (stock < 0) {
            return res.status(400).json({
                success: false,
                message: "Stock cannot be negative."
            });
        }

        // ===========================
        // Check Category
        // ===========================

        const [category] = await pool.query(
            "SELECT id FROM categories WHERE id=?",
            [category_id]
        );

        if (category.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Category not found."
            });
        }

        // ===========================
        // Check Brand
        // ===========================

        const [brand] = await pool.query(
            "SELECT id FROM brands WHERE id=?",
            [brand_id]
        );

        if (brand.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Brand not found."
            });
        }

        // ===========================
        // Duplicate SKU
        // ===========================

        const [existingSku] = await pool.query(
            "SELECT id FROM products WHERE sku=?",
            [sku]
        );

        if (existingSku.length > 0) {
            return res.status(400).json({
                success: false,
                message: "SKU already exists."
            });
        }

        // ===========================
        // Duplicate Slug
        // ===========================

        const [existingSlug] = await pool.query(
            "SELECT id FROM products WHERE slug=?",
            [slug]
        );

        if (existingSlug.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Slug already exists."
            });
        }

        // ===========================
        // Insert Product
        // ===========================

        const [result] = await pool.query(

            `INSERT INTO products
            (
                category_id,
                brand_id,
                name,
                slug,
                sku,
                short_description,
                description,
                price,
                discount_price,
                stock,
                thumbnail,
                warranty
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,

            [
                category_id,
                brand_id,
                name,
                slug,
                sku,
                short_description,
                description,
                price,
                discount_price,
                stock,
                thumbnail,
                warranty
            ]

        );

        return res.status(201).json({

            success: true,
            message: "Product created successfully.",

            product: {

                id: result.insertId,
                category_id,
                brand_id,
                name,
                slug,
                sku,
                price,
                stock

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

// =====================================
// Update Product
// =====================================

exports.updateProduct = async (req, res) => {

    try {

        const { id } = req.params;

const {
    category_id,
    brand_id,
    name,
    slug,
    sku,
    short_description,
    description,
    price,
    discount_price,
    stock,
    warranty,
    status
} = req.body;

const thumbnail = req.file
    ? req.file.filename
    : req.body.thumbnail;

        // ===========================
        // Check Product
        // ===========================

        const [product] = await pool.query(
            "SELECT * FROM products WHERE id = ?",
            [id]
        );

        if (product.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Product not found."
            });

        }

        // ===========================
        // Validation
        // ===========================

        if (
            !category_id ||
            !brand_id ||
            !name ||
            !slug ||
            !sku ||
            !price
        ) {

            return res.status(400).json({
                success: false,
                message: "Required fields are missing."
            });

        }

        if (price <= 0) {

            return res.status(400).json({
                success: false,
                message: "Price must be greater than zero."
            });

        }

        if (discount_price && discount_price > price) {

            return res.status(400).json({
                success: false,
                message: "Discount price cannot be greater than price."
            });

        }

        if (stock < 0) {

            return res.status(400).json({
                success: false,
                message: "Stock cannot be negative."
            });

        }

        // ===========================
        // Check Category
        // ===========================

        const [category] = await pool.query(
            "SELECT id FROM categories WHERE id = ?",
            [category_id]
        );

        if (category.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Category not found."
            });

        }

        // ===========================
        // Check Brand
        // ===========================

        const [brand] = await pool.query(
            "SELECT id FROM brands WHERE id = ?",
            [brand_id]
        );

        if (brand.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Brand not found."
            });

        }

        // ===========================
        // Duplicate Slug
        // ===========================

        const [existingSlug] = await pool.query(
            "SELECT id FROM products WHERE slug = ? AND id != ?",
            [slug, id]
        );

        if (existingSlug.length > 0) {

            return res.status(400).json({
                success: false,
                message: "Slug already exists."
            });

        }

        // ===========================
        // Duplicate SKU
        // ===========================

        const [existingSku] = await pool.query(
            "SELECT id FROM products WHERE sku = ? AND id != ?",
            [sku, id]
        );

        if (existingSku.length > 0) {

            return res.status(400).json({
                success: false,
                message: "SKU already exists."
            });

        }

        // ===========================
        // Update Product
        // ===========================

        await pool.query(

            `UPDATE products SET

                category_id = ?,
                brand_id = ?,
                name = ?,
                slug = ?,
                sku = ?,
                short_description = ?,
                description = ?,
                price = ?,
                discount_price = ?,
                stock = ?,
                thumbnail = ?,
                warranty = ?,
                status = ?

            WHERE id = ?`,

            [
                category_id,
                brand_id,
                name,
                slug,
                sku,
                short_description,
                description,
                price,
                discount_price,
                stock,
                thumbnail,
                warranty,
                status,
                id
            ]

        );

        // ===========================
        // Success
        // ===========================

        return res.status(200).json({

            success: true,
            message: "Product updated successfully."

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: "Internal Server Error"

        });

    }

};

// =====================================
// Delete Product
// =====================================

exports.deleteProduct = async (req, res) => {

    try {

        const { id } = req.params;

        // ===========================
        // Check Product Exists
        // ===========================

        const [product] = await pool.query(
            "SELECT * FROM products WHERE id = ?",
            [id]
        );

        if (product.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Product not found."
            });

        }

        // ===========================
        // Delete Product
        // ===========================

        await pool.query(
            "DELETE FROM products WHERE id = ?",
            [id]
        );

        // ===========================
        // Success Response
        // ===========================

        return res.status(200).json({

            success: true,
            message: "Product deleted successfully."

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: "Internal Server Error"

        });

    }

};

exports.getRecentlyViewed = async (req, res) => {

    try {

        // =============================
        // Get Product IDs From Redis
        // =============================

        const ids = await recentService.getRecentProducts(req.user.id);

        if (!ids || ids.length === 0) {

            return res.status(200).json({

                success: true,

                count: 0,

                products: []

            });

        }

        // =============================
        // Create Placeholders
        // =============================

        const placeholders = ids.map(() => "?").join(",");

        // =============================
        // Fetch Products From MySQL
        // =============================

        const [products] = await pool.query(

            `SELECT

                p.id,
                p.name,
                p.slug,
                p.sku,
                p.price,
                p.discount_price,
                p.stock,
                p.thumbnail,
                p.status

            FROM products p

            WHERE p.id IN (${placeholders})`,

            ids

        );

        // =============================
        // Keep Redis Order
        // =============================

        const sortedProducts = ids.map(id =>

            products.find(product => product.id == id)

        ).filter(Boolean);

        // =============================
        // Response
        // =============================

        return res.status(200).json({

            success: true,

            count: sortedProducts.length,

            products: sortedProducts

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};