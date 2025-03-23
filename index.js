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
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const users = {};

io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    socket.on("register", (userId) => {
        users[userId] = socket.id;
    });

    socket.on("send", async ({ senderId, receiverId, message }) => {
        try {
            const newMessage = await Messages.create({ senderId, receiverId, message });
            await newMessage.save();

            // Get receiver's socket ID
            const receiverSocketId = users[receiverId];
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("receive", { senderId, message });
            }
        } catch (error) {
            console.error("Error handling socket message:", error);
        }
    });

    socket.on("disconnect", () => {
        for (const userId in users) {
            if (users[userId] === socket.id) {
                delete users[userId];
                break;
            }
        }
        console.log("User disconnected", socket.id);
    });
});


const PORT = 3000 || process.env.PORT

careerconnect.listen(PORT, () => {
    console.log(`careerconnect server started at PORT ${PORT}`);
})

careerconnect.get('/', (req, res) => {
    res.status(200).send(`<p>Cookpedia server started</p>`)
})