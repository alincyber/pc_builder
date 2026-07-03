const sessionService =
require("../services/session.service");

module.exports = async (

    req,

    res,

    next

) => {

    const session = await sessionService.getSession(

        req.user.id

    );

    if (!session) {

        return res.status(401).json({

            success: false,

            message: "Session Expired."

        });

    }

    next();

};