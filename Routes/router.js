const express = require("express")
const userControler = require("../Controller/userController")
const jwtMiddleWare = require('../Middleware/jwtMIddleware')
const multerMiddleWare = require("../Middleware/multerMiddleware")
const employerController = require("../Controller/employerController")
const addJobController = require('../Controller/addJobController')
const messageController = require('../Controller/messageController')
const multerResumeMiddlwWare = require('../Middleware/multerResume')


const router = new express.Router()

// Register jobseekers to change  http://localhost:3000/seeker-register
router.post("/seeker-register", userControler.seekerRegisterController)

// Login jobseekers to change  http://localhost:3000/seeker-login
router.post("/seeker-login", userControler.seekerLoginController)

// Update jobseekers to change  http://localhost:3000/seeker-profileUpdate
router.put("/seeker-profileupdate", jwtMiddleWare, multerMiddleWare.single("profilePic"), userControler.seekerProfileUpdationController)

// Update jobseekers to change  http://localhost:3000/seeker-profileUpdate
router.get("/seeker-profileDetails", jwtMiddleWare, userControler.seekerProfileDetails)

// employeRegister
router.post("/employer-register", employerController.employeeRegistraionController)

// employee login
router.post("/employer-login", employerController.loginRegistrationController)

// employee profileUpdate
router.put("/employer-profile", jwtMiddleWare, multerMiddleWare.single("profilePic"), employerController.employeUpdateController)

// Update jobseekers to change  http://localhost:3000/seeker-profileUpdate
router.get("/employer-profileDetails", jwtMiddleWare, employerController.employerProfileDetails)

// Add a job (Protected Route)
router.post("/add-job", jwtMiddleWare, addJobController.addJobDetails);

// Get all jobs with applicant details
router.get("/get-all-jobs", addJobController.getAllJobDetails);

// Get jobs posted by the logged-in user (Protected Route)
router.get("/get-userjobs", jwtMiddleWare, addJobController.getJobDetails);

// Apply for a job (Protected Route)
router.post("/apply-job/:jobId", jwtMiddleWare, addJobController.applyForJob);

// Route to get all jobs posted by the logged-in user along with applicants' details
router.get("/my-posted-jobs", jwtMiddleWare, addJobController.getMyPostedJobsWithApplicants);

// rejuct 
router.put("/reject-applicant", jwtMiddleWare, addJobController.rejectApplicant);

// Approove 
router.put("/select-applicant", jwtMiddleWare, addJobController.selectApplicant);

// getUserAppliedJobs
router.get("/user-appliedjobs", jwtMiddleWare, addJobController.getAllJobDetails);

// getUserAppliedJobs
router.get("/getusers", userControler.getJobsSeekerDetails);

// get particular user details
router.get("/getusersDetails/:id", userControler.getProfileById);

// Delete job
router.delete("/deleteUserJobs/:id", jwtMiddleWare, addJobController.deleteUserPostedjobs);

// Edit job
router.put("/editUserJobs/:id", jwtMiddleWare, addJobController.editUserPostedJobs);

// get job
router.get("/applieduserJobs/:id", addJobController.getJobsByApplicant);

//  Send a message (POST)
router.post("/send-message", messageController.sendMessage);

//  Get all messages between two users (GET)
router.post("/getmessages", messageController.getAllMessages);

// get job
router.get("/employerDetails", employerController.employerdetails);

// Update resume
router.put("/jobseeker-resume", jwtMiddleWare, multerResumeMiddlwWare.single("resume"), userControler.seekerResumeUpdationController);

router.get("/download-resume/:filename", (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, "../uploads", filename);

    res.download(filePath, filename, (err) => {
        if (err) {
            console.error("Error downloading file:", err);
            res.status(500).json({ error: "File not found or server error" });
        }
    });
});



module.exports = router