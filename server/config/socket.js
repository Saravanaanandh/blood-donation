import http from 'http'
import express from 'express'
import { Server } from 'socket.io'

const app = express()

const server = http.createServer(app)

const io = new Server(server,{
    cors:{
        origin:["https://blood-donation-o7z9.onrender.com","http://localhost:5173"], 
        methods: "GET,POST,PATCH,PUT,DELETE",
        allowedHeaders: ["Content-Type"],
        credentials:true
    }
})

const userSocket = {}
export const getUserId = (Id)=>{
    return userSocket[Id]
}
io.on("connection",(socket)=>{
    console.log(`a user connected : ${socket.id}`)
    const userId = socket.handshake.query.userId
    if(userId) userSocket[userId] = socket.id

    io.emit("getOnlineUsers",Object.keys(userSocket))

    // socket.on("sendRequest",(request)=>{
    //     console.log("Request Details On Console :"+request)
    //     io.emit("newRequest",request)
    // })
    // socket.on("sendBloodRequest", (request) => {
    //     io.emit("newBloodRequest", request); 
    // });
 
    // socket.on("acceptRequest", ({ requestId, donorId }) => {
    //     io.emit("requestAccepted", { requestId, donorId }); 
    // });
    socket.on("disconnect",()=>{
        console.log(`A user disconnected : ${socket.id}`)
        delete userSocket[userId]
        io.emit("getOnlineUsers",Object.keys(userId))
    })
})

export {io, app, server}