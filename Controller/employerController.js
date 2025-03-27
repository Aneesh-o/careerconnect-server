const employers = require("../Models/employerModel")
const jwt = require("jsonwebtoken")

// employerRegistration
exports.employeeRegistraionController = async (req, res) => {
    console.log("Iniside employeeRegistraionController");
    const { email, companyname, password } = req.body
    try {
        const existingUser = await employers.findOne({ email })
        if (existingUser) {
            res.status(406).json("User already exists...Please login")
        } else {
            const newEmployer = new employers({ email, companyname, password, phoneNumber: "", address: "", profilePic: "" })
            await newEmployer.save()
            res.status(200).json(newEmployer)
        }
    } catch (error) {
        console.log(error);

    }
}

// loginRegistration

exports.loginRegistrationController = async (req, res) => {
    console.log("Iniside loginRegistration");
    const { email, password } = req.body
    try {
        const existingUser = await employers.findOne({ email, password })
        if (existingUser) {
            const token = jwt.sign({ userId: existingUser._id }, process.env.jwtPassword)
            res.status(200).json({ user: existingUser, token })
        } else {
            res.status(401).json("Invalid email/password")
        }
    } catch (error) {
        console.log(error);
    }
}

// Update employerDetails
exports.employeUpdateController = async (req, res) => {
    console.log("Iniside employeUpdateController");
    const { email, companyname, phoneNumber, address ,profilePic} = req.body

    console.log(req.body);
    
    const userId = req.userId
    const uploadProfilePic = req.file?req.file.filename:profilePic
    try {
        const newEmployer = await employers.findByIdAndUpdate({ _id: userId }, { email, companyname, phoneNumber, address,profilePic:uploadProfilePic }, { new: true })
        await newEmployer.save()
        res.status(200).json(newEmployer)
    } catch (error) {
        res.status(401).json(error)
    }
}

// get employerProfileDetails
exports.employerProfileDetails = async (req, res) => {
    console.log("Inside employerProfileDetails");
    const userId = req.userId
    try {
        const employerDetails = await employers.findOne({_id:userId })
        res.status(200).json(employerDetails)
    } catch (error) {
        res.status(401).json(error)
    }
}


// Get employer details
exports.employerdetails = async (req, res) => {
    console.log("Inside employerdetails");

    try {
        const employerDetails = await employers.find();
        res.status(200).json(employerDetails); 
    } catch (error) {
        console.error("Error fetching employer details:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
