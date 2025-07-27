const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/authModel");

const authMiddleware = async (req,res,next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Unauthorized HTTP, Token not provided" });
    }

    const jwtToken = token.replace("Bearer ","");
    try {
        const isVerified = jwt.verify(jwtToken,process.env.JWT_SECRET);

        const userData = await User.findOne({email : isVerified.email})
        // console.log(userData);

        req.token = token;
        req.user = userData;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized. Invalid token." });
    }
}

module.exports = authMiddleware;