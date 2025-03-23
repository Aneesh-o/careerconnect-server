const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    }, 
    email: {
        type: String,
        required: true,
        unique: true
    }, 
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number
    }, 
    gender: {
        type: String,
    }, 
    birthDate: {
        type: String
    }, 
    address: {
        type: String
    }, 
    university: {
        type: String
    }, 
    qualification: {
        type: String
    }, 
    yearOfGraduation: {
        type: String
    }, 
    experienceInYears: {
        type: String
    }, 
    currentEmployer: {
        type: String
    }, 
    currentSalary: {
        type: String
    }, 
    expectedSalary: {
        type: String
    }, 
    profilePic: {
        type: String
    },role: {
        type: String,
        required: true,
        default: "Jobseeker"
    }
})

const users = mongoose.model("users", userSchema)

module.exports = users