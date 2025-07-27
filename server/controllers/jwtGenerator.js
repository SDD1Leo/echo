const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtGenerator = (name,email,isAdmin) => { 
    const payload = {
        name: name,
        email: email,
        isAdmin: isAdmin,
    };

    return jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'5hr'});
};

module.exports = jwtGenerator;