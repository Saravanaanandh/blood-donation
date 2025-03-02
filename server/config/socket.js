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

io.on("connection",(socket)=>{
    console.log(`a user connected : ${socket.id}`)
    const userId = socket.handshake.query.userId
    if(userId) userSocket[userId] = socket.id

    io.emit("getOnlineUsers",Object.keys(userSocket))

    socket.on("disconnect",()=>{
        console.log(`A user disconnected : ${socket.id}`)
        delete userSocket[userId]
        io.emit("getOnlineUsers",Object.keys(userId))
    })
})

export {io, app, server}