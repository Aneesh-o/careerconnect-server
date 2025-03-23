const users = require("../Models/userModel")
const jwt = require('jsonwebtoken')


// Registration
exports.seekerRegisterController = async (req, res) => {
    console.log("Inside seekerRegisterController");
    const { email, username, password } = req.body
    try {
        const existingUser = await users.findOne({ email })
        if (existingUser) {
            res.status(406).json("User already exists...Please login")
        } else {
            const newUser = new users({
                email, username, password, phoneNumber: "", gender: "", birthDate: "", address: "", university: "", qualification: "", yearOfGraduation: "", experienceInYears: "", currentEmployer: "", currentSalary: "", expectedSalary: "", profilePic: ""
            })
            await newUser.save()
            res.status(200).json(newUser)
        }
    } catch (errr) {
        console.log(errr);
    }
}

// Login
exports.seekerLoginController = async (req, res) => {
    console.log("Inside seekerLoginController");
    const { email, password } = req.body
    try {
        const existingUser = await users.findOne({ email, password })
        if (existingUser) {
            const token = jwt.sign({ userId: existingUser._id }, process.env.jwtPassword)
            res.status(200).json({ user: existingUser, token })
        } else {
            res.status(401).json("Invalid account/password...")
        }
    } catch (errr) {
        console.log(errr);
    }
}

// Updation
exports.seekerProfileUpdationController = async (req, res) => {
    console.log("Inside seekerProfileUpdationController");
    const { email, username, phoneNumber, gender, birthDate, address, university, qualification, yearOfGraduation, experienceInYears, currentEmployer, currentSalary, expectedSalary ,profilePic} = req.body
    const userId = req.userId
    const uploadProfilePic = req.file?req.file.filename:profilePic
    try {
        const updatedUser = await users.findByIdAndUpdate({ _id: userId }, { email, username, phoneNumber, gender, birthDate, address, university, qualification, yearOfGraduation, experienceInYears, currentEmployer, currentSalary, expectedSalary ,profilePic:uploadProfilePic }, { new: true })
        await updatedUser.save()
        res.status(200).json(updatedUser)
    } catch (error) {
        res.status(401).json(error)
    }
}


// get userDetails
exports.seekerProfileDetails = async (req, res) => {
    console.log("Inside seekerProfileUpdationController");
    const userId = req.userId
    try {
        const userDetails = await users.findOne({ _id: userId })
        res.status(200).json(userDetails)
    } catch (error) {
        res.status(401).json(error)
    }
}

// getJobsSeekerDetails
exports.getJobsSeekerDetails = async (req, res) => {
    console.log("inide GetJobsSeekerDetails");
    try {
        const getUsers = await users.find()
        res.status(200).json(getUsers)
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.getProfileById = async (req, res) => {
    try {
        const { id } = req.params; // ✅ Get id from params
        if (!id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await users.findById(id); // Assuming you're using Mongoose
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
