const express = require('express')
require('dotenv').config()
const cors = require('cors')
require('./DatabaseConnection/dbConnection')
const route = require('./Routes/router')
const socket = require('socket.io')
const http = require('http')
const Messages = require('./Models/MessageModel')

const careerconnect = express()
const server = http.createServer(careerconnect);

careerconnect.use(cors())
careerconnect.use(express.json())
careerconnect.use(route)
careerconnect.use('/uploads', express.static('./uploads'))

const io = new socket.Server(server, {
    cors: {
        origin: "http://localhost:5173", //changed
        methods: ["GET", "POST"]
    }
});

const users = {}; // Map to track user socket connections

io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    // Register user and store socket ID
    socket.on("register", (userId) => {
        users[userId] = socket.id;
        console.log(`User ${userId} registered with socket ${socket.id}`);
    });

    // Handle sending messages
    socket.on("send", async ({ senderId, receiverId, message, createdAt }) => {
        try {
            // const newMessage = await Messages.create({ senderId, receiverId, message });
            // await newMessage.save();

            // const receiverSocketId = users[receiverId];
            const senderSocketId = users[senderId];

            if (senderSocketId) {
                io.to(senderSocketId).emit("receive", { senderId, receiverId, message, createdAt });
                console.log("emited sender");
            }
        } catch (error) {
            console.error("Error handling socket message:", error);
        }
    });

    // Remove user from active connections on disconnect
    socket.on("disconnect", () => {
        for (const userId in users) {
            if (users[userId] === socket.id) {
                delete users[userId];
                console.log(`User ${userId} disconnected`);
                break;
            }
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`careerconnect server started at PORT ${PORT}`);
});

careerconnect.get('/', (req, res) => {
    res.status(200).send(`<p>careerconnect server started</p>`);
});
