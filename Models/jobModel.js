const mongoose = require("mongoose");

const addJobSchema = new mongoose.Schema({
    jobLocation: {
        type: String
    },
    jobType: {
        type: String
    },
    skills: {
        type: String
    },
    salaryRange: {
        type: String
    },
    companyName: {
        type: String
    },
    designation: {
        type: String
    },
    description: {
        type: String
    }, userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users", 
        required: true
    }, status: {
        type: String,
        required: true,
        default: "pending"
    },
    applicants: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
            appliedAt: { type: Date, default: Date.now },
            status: { type: String, default: "Pending" }
        }
    ]
});

const Job = mongoose.model("Job", addJobSchema);

module.exports = Job;
