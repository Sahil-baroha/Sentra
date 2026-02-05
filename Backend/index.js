import dns from 'node:dns';

// Force usage of Google DNS for this Node process
dns.setServers(['8.8.8.8', '8.8.4.4']);

import "dotenv/config"

import express from "express";
import { createServer } from "node:http";
import mongoose from "mongoose"
import { Server } from "socket.io";
const app = express()
import cors from "cors"
import { connectToSocket } from "./src/controller/SocketManager.js"
import userRoutes from "./src/routes/users.routes.js"


// &  Data from .env 
const PORT = process.env.PORT || 5000;
const Murl = process.env.MONGO_URL

// &  Middlewares -->
app.use(cors())
app.use(express.json({ limit: "40kb" }))
app.use(express.urlencoded({ limit: "40kb", extended: true }))
app.use("/api/v1/users", userRoutes)

// 1. Open the door (server listening)
const server = createServer(app);
const io = connectToSocket(server)

// &  DB connection 
const connection = mongoose.connect(Murl, {
    family: 4 // Force IPv4 (very common fix for newer Node versions)
}).then(() => {
    console.log("DB Connected!")
}).catch(err => console.error("Mongo Error:", err));



// &  ROUTES 


server.listen(PORT, () => {
    console.log(`Server is Listening On PORT : ${PORT}`)
});