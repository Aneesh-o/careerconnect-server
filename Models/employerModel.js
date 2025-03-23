const mongoose = require("mongoose")

const employerScheme = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }, companyname: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number
    },
    address: {
        type: String
    },
    profilePic: {
        type: String
    },
    role: {
        type: String,
        required: true,
        default: "Employer"
    }
})

const employers = mongoose.model("employers", employerScheme)

module.exports = employers