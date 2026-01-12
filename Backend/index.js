import"dotenv/config"

import express from "express";
import { createServer } from "node:http";
import mongoose from "mongoose"
import { Server} from "socket.io";
const app = express()
import cors from "cors"
import {connectToSocket} from "./src/controller/SocketManager.js"
import userRoutes from "./src/routes/users.routes.js"


// &  Data from .env 
const PORT = process.env.PORT || 5000;
const Murl = process.env.MONGO_URL

// &  Middlewares -->
app.use(cors())
app.use(express.json({limit:"40kb"}))
app.use(express.urlencoded({limit:"40kb",extended:true}))
app.use("/api/v1/users",userRoutes)

// 1. Open the door (server listening)
const server = createServer(app);
const io = connectToSocket(server)

// &  DB connection 
const connection  = mongoose.connect(Murl).then(()=>{
    console.log("DB Connected!")
}).catch((err)=>{
    console.log(err)
})



// &  ROUTES 

app.get("/",(req,res)=>{
    return res.send("hello TO World")
})




    server.listen(PORT,()=>{
        console.log(`Server is Listening On PORT : ${PORT}`)
    });