const User = require("../models/authModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const jwtGenerator = require("./jwtGenerator");

const register = async (req,res) =>{
    try {
        //destructure the body
        const {name , email , password , pic, isAdmin} = req.body
        //check if user exist
        const userExists = await User.findOne({email:email})
        if(userExists){
            res.status(301).json({message:"user already exists"})
        }else{
            //bcrypt
            const hashPass = await bcrypt.hash(password,10)
            //load user data
            const userCreated = await User.create({
                name: name,
                email: email,
                password: hashPass,
                pic: pic,
            })

            //jwt
            const token = await jwtGenerator(name,email,isAdmin)
            
            res.status(200).json({message:"user created successfully",token: token});
        }
        
    } catch (error) {
        res.status(300).json({message:`${error}`})
    }
}
const login = async (req,res) =>{
    try {
        //destructure the body
        const {email , password} = req.body
        //check if user exist
        const userExists = await User.findOne({email:email})
        if(!userExists){
            res.status(301).json({message:"user does not exists"})
        }else{
            //bcrypt
            const comparePass = await bcrypt.compare(password,userExists.password)

            //jwt
            if (!comparePass) {
                return res.status(401).json({ message: "invalid user or password" });
            } else {
                res.status(200).json({
                    message: "user login successfull",
                    token: await jwtGenerator(userExists.name, userExists.email, userExists.isAdmin)
                })
            }
        }
        
    } catch (error) {
        res.status(300).json({message:`${error}`})
    }

}
const user = async (req,res) => {
    try {
        const userData= req.user;
        // console.log(userData);
        res.status(200).json({ userData });
    } catch (error) {
        console.log(`error in user ${error}`);
    }
};

module.exports = { register,login,user }