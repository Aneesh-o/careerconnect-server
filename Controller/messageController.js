const Messages = require('../Models/MessageModel');
const mongoose = require("mongoose");

// Save and broadcast new message
exports.sendMessage = async (req, res) => {
    console.log("sendMessage");
    
    try {
        const { senderId, receiverId, message } = req.body;

        // Validate input fields
        if (!senderId || !receiverId || typeof message !== "string" || !message.trim()) {
            return res.status(400).json({ success: false, error: "All fields are required" });
        }

        // Validate MongoDB ObjectIds
        if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
            return res.status(400).json({ success: false, error: "Invalid sender or receiver ID" });
        }

        // Save message
        const newMessage = await Messages.create({ senderId, receiverId, message });

        res.status(201).json({ success: true, message: "Message sent", data: newMessage });
    } catch (error) {
        console.error("Error saving message:", error);

        // Handle validation errors
        if (error.name === "ValidationError") {
            return res.status(400).json({ success: false, error: error.message });
        }

        res.status(500).json({ success: false, error: "Internal server error" });
    }
};


// Retrieve all messages between two users
exports.getAllMessages = async (req, res) => {
    console.log("get")
    try {
        const { senderId, receiverId } = req.body;
        console.log(senderId, receiverId)

        if (!senderId || !receiverId) {
            return res.status(400).json({ success: false, error: "Both senderId and receiverId are required" });
        }

        // Fetch messages where sender and receiver are either way
        const messages = await Messages.find({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        }).sort({ createdAt: 1 }); 

        res.status(200).json({
            success: true,
            messages,
            message: messages.length > 0 ? "Messages retrieved successfully" : "No messages found",
        });
    } catch (error) {
        console.error("Error retrieving messages:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};
