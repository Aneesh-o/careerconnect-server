const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true
        },
        message: {
            type: String,
            required: true
        }
    },
    { timestamps: true } 
);

const Messages = mongoose.model("Messages", messageSchema);

module.exports = Messages;
