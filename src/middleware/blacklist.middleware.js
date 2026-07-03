const blacklistService =
require("../services/blacklist.service");

module.exports = async (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {

        return res.status(401).json({

            success: false,

            message: "Token Missing"

        });

    }

    const token = authHeader.split(" ")[1];

    const blacklisted =

        await blacklistService.isBlacklisted(

            token

        );

    if (blacklisted) {

        return res.status(401).json({

            success: false,

            message: "Token has been revoked."

        });

    }

    next();

};