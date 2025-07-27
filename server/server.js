require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const chatRouter = require("./routes/chatRouter")
const messageRouter = require('./routes/messageRouter')

//cors tackled
const cors = require('cors');
const corsOptions = {
    origin: 'https://echo-chat1.vercel.app',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }
app.use(cors(corsOptions));
//middleware
app.use(express.json())


//routes
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/chat",chatRouter)
app.use("/api/message",messageRouter)

//DB Connect
const dbConnect = async(req,res) => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("connected to db");
    } catch (error) {
        console.log("error connecting db");
    }
}



app.route("/").get((req,res)=>{
    res.send("hello wolrd");
})


dbConnect().then(() => {
    const server = app.listen(process.env.PORT,(req,res)=>{
        console.log(`server is at 3000`);
    })

    const io = require("socket.io")(server,{
        pingTimeout: 60000,
        cors: {
            origin: "https://echo-chat1.vercel.app",
        },
    });

    io.on("connection" , (socket) => {
        
        socket.on("setup" , (userData) => {
            socket.join(userData._id);
            console.log(userData._id);
            socket.emit("connected");
        })

        socket.on("join chat" , (room) => {
            socket.join(room);
            console.log("user joined room: "+room);
            
        })

        socket.on("typing", (room) => {
            socket.in(room).emit("typing");
          });
          
          socket.on("stop typing", (room) => {
            socket.in(room).emit("stop typing");
          });

        socket.on("new message",(newMessageRecieved) => {
            var chat = newMessageRecieved.chat;

            if(!chat.users) return console.log("chat users not defined");

            chat.users.forEach((user) => {
                if (user._id == newMessageRecieved.sender._id) return;

                socket.in(user._id).emit("message recieved" , newMessageRecieved);
            });
            
        })

        socket.off("setup", () => {
            console.log("user disconnected");
            socket.leave(userData._id);
        })
    })
});
