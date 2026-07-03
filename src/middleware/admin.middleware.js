// ======================================
// Admin Authorization Middleware
// ======================================

exports.authorizeAdmin = (req, res, next) => {

    try {

        // Check user exists
        if (!req.user) {

            return res.status(401).json({

                success: false,
                message: "Unauthorized"

            });

        }

        // Check role
        if (req.user.role !== "admin") {

            return res.status(403).json({

                success: false,
                message: "Access denied. Admin only."

            });

        }

        next();

    } catch (error) {

        return res.status(500).json({

            success: false,
            message: error.message

        });

    }

};