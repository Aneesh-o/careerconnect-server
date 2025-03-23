const Job = require("../Models/jobModel");

// Add job
exports.addJobDetails = async (req, res) => {
    console.log("Inside addJobDetails");
    const { jobLocation, jobType, skills, salaryRange, companyName, designation, description } = req.body;
    const userId = req.userId; // Get userId from middleware (authentication)
    try {
        const newJob = new Job({ jobLocation, designation, jobType, skills, salaryRange, userId, companyName, description });
        await newJob.save();
        res.status(200).json({ newJob });
    } catch (error) {
        console.error("Error creating job:", error);
        res.status(500).json({ error: "Failed to create job" });
    }
};

// Get all jobs with applicant details
exports.getAllJobDetails = async (req, res) => {
    console.log("Inside getAllJobDetails");
    try {
        const getJobs = await Job.find().populate("applicants.userId", "name email"); // Populate applicant details
        res.status(200).json(getJobs);
    } catch (error) {
        console.error("Error fetching all jobs:", error);
        res.status(500).json({ error: "Failed to fetch all jobs" });
    }
};

// Get jobs posted by a specific user
exports.getJobDetails = async (req, res) => {
    console.log("Inside getJobDetails");
    const userId = req.userId;
    try {
        const getJobs = await Job.find({ userId });
        res.status(200).json(getJobs);
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ error: "Failed to fetch jobs" });
    }
};

// Apply for a job
exports.applyForJob = async (req, res) => {
    console.log("Inside applyForJob");
    const { jobId } = req.params;
    const userId = req.userId;
    try {
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }
        // Check if the user already applied
        const alreadyApplied = job.applicants.some(applicant => applicant.userId.toString() === userId);
        if (alreadyApplied) {
            return res.status(400).json({ error: "User already applied for this job" });
        }
        // Add new applicant
        job.applicants.push({
            userId,
            appliedAt: new Date()
        });
        await job.save();
        res.status(200).json({ message: "Applied successfully", job });
    } catch (error) {
        console.error("Error applying for job:", error);
        res.status(500).json({ error: "Failed to apply for job" });
    }
};


exports.getMyPostedJobsWithApplicants = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized. Employer ID missing." });
        }

        const jobs = await Job.find({ userId })
            .populate({
                path: "applicants.userId",
                model: "users",
                select: "username email phoneNumber skills education"
            })
            .select("companyName designation jobLocation jobType skills status applicants");

        if (!jobs.length) {
            return res.status(200).json({ message: "No jobs posted yet", jobs: [] });
        }

        // Map response to handle missing user details
        const jobData = jobs.map(job => ({
            _id: job._id,
            companyName: job.companyName,
            designation: job.designation,
            jobLocation: job.jobLocation,
            jobType: job.jobType,
            skills: job.skills,
            status: job.status,
            totalApplicants: job.applicants.length,
            applicants: job.applicants.map(applicant => ({
                userId: applicant.userId?._id || "Unknown",
                username: applicant.userId?.username || "Unknown",
                email: applicant.userId?.email || "Unknown",
                phoneNumber: applicant.userId?.phoneNumber || "Unknown",
                skills: applicant.userId?.skills || "Not provided",
                education: applicant.userId?.education || "Not provided",
                appliedAt: applicant.appliedAt,
                status: applicant.status || "Pending"  // ✅ Added status field
            }))
        }));

        res.status(200).json({ jobs: jobData });

    } catch (error) {
        console.error("Error fetching posted jobs with applicants:", error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
};


// Rejuction from employer 
exports.rejectApplicant = async (req, res) => {
    try {
        const { jobId, applicantId } = req.body;
        const employerId = req.userId;

        if (!jobId || !applicantId) {
            return res.status(400).json({ error: "Job ID and Applicant ID are required." });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ error: "Job not found." });
        }

        // Verify if the logged-in employer owns the job
        if (job.userId.toString() !== employerId) {
            return res.status(403).json({ error: "Forbidden. You are not the owner of this job." });
        }

        // Find the applicant
        const applicant = job.applicants.find(app => app.userId.toString() === applicantId);

        if (!applicant) {
            return res.status(404).json({ error: "Applicant not found." });
        }

        // Check if already rejected
        if (applicant.status === "Rejected") {
            return res.status(409).json({ error: "Applicant is already rejected." });
        }

        // Update the applicant's status
        applicant.status = "Rejected";
        job.markModified("applicants"); // Ensure Mongoose detects the change
        await job.save();

        return res.status(200).json({ message: "Applicant rejected successfully!", job });

    } catch (error) {
        console.error("Error rejecting applicant:", error);
        return res.status(500).json({ error: "Failed to reject applicant." });
    }
};


// Approove from employer 
exports.selectApplicant = async (req, res) => {
    try {
        const { jobId, applicantId } = req.body;
        const employerId = req.userId;

        if (!jobId || !applicantId) {
            return res.status(400).json({ error: "Job ID and Applicant ID are required." });
        }
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ error: "Job not found." });
        }

        // Verify if the logged-in employer owns the job
        if (job.userId.toString() !== employerId) {
            return res.status(403).json({ error: "Forbidden. You are not the owner of this job." });
        }

        // Find the applicant
        const applicant = job.applicants.find(app => app.userId.toString() === applicantId);

        if (!applicant) {
            return res.status(404).json({ error: "Applicant not found." });
        }

        // Check if already rejected
        if (applicant.status === "Selected") {
            return res.status(409).json({ error: "Applicant is already selected." });
        }

        // Update the applicant's status
        applicant.status = "Selected";
        job.markModified("applicants"); // Ensure Mongoose detects the change
        await job.save();

        return res.status(200).json({ message: "Applicant selected successfully!", job });

    } catch (error) {
        console.error("Error rejecting applicant:", error);
        return res.status(500).json({ error: "Failed to reject applicant." });
    }
};



// // getUserapliedjobs
// exports.getAppliedJobs = async (req, res) => {
//     try {
//         const jobseekerId = req.userId; // Assume jobseekerId comes from authentication token
//         // Find jobs where applicants contain the jobseeker's ID
//         const appliedJobs = await Job.find({
//             "applicants.userId": jobseekerId
//         });

//         // Format the response
//         const formattedJobs = appliedJobs.map(job => {
//             const applicant = job.applicants.find(app => app.userId.toString() === jobseekerId);

//             return {
//                 jobId: job._id,
//                 companyName: job.companyName,
//                 designation: job.designation,
//                 jobLocation: job.jobLocation,
//                 jobType: job.jobType,
//                 appliedAt: applicant ? new Date(applicant.appliedAt).toLocaleDateString() : "N/A",
//                 status: applicant ? applicant.status : "Unknown"
//             };
//         });

//         return res.status(200).json({ appliedJobs: formattedJobs });
//     } catch (error) {
//         console.error("Error fetching applied jobs:", error);
//         res.status(500).json({ error: "Failed to fetch applied jobs." });
//     }
// };


// deleteUserjobs
exports.deleteUserPostedjobs = async (req, res) => {
    console.log("Inside deleteUserPostedjobs");
    const userId = req.userId; // Extracted from JWT middleware
    const jobId = req.params.id;  // ✅ Corrected parameter name

    try {
        // ✅ Ensure the job is deleted if it belongs to the user
        const deletedJob = await Job.findOneAndDelete({ _id: jobId, userId });

        if (!deletedJob) {
            return res.status(404).json({ message: "Job not found or unauthorized" });
        }

        res.status(200).json({ message: "Job deleted successfully", deletedJob });
    } catch (error) {
        console.error("Error deleting job:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};


// deleteUserjobs
exports.editUserPostedJobs = async (req, res) => {
    console.log("Inside editUserPostedJobs");
    const userId = req.userId;
    const jobId = req.params.id;
    const { jobLocation, jobType, skills, salaryRange, companyName, designation, description } = req.body;
    try {
        const updateJob = await Job.findOneAndUpdate(
            { _id: jobId, userId: userId }, // Match both jobId and userId
            { jobLocation, jobType, skills, salaryRange, companyName, designation, description },
            { new: true } // Return updated document
        );
        if (!updateJob) {
            return res.status(404).json("Job not found or unauthorized to update");
        }
        return res.status(200).json(updateJob);
    } catch (error) {
        console.error("Error updating job:", error);
        return res.status(500).json({ message: "Internal Server Error", error });
    }
};





// Get all jobs where the given user has applied
exports.getJobsByApplicant = async (req, res) => {
    const { userId } = req.params; // Get userId from request params
    console.log(`Fetching jobs for user: ${userId}`);

    try {
        // Find jobs where the given userId is in the applicants list
        const jobs = await Job.find({ "applicants.userId": userId }).populate("applicants.userId", "name email");
        if (!jobs || jobs.length === 0) {
            return res.status(404).json({ message: "No jobs found for this user" });
        }
        // Filter only the relevant applicant details for the given userId
        const filteredJobs = jobs.map(job => ({
            ...job.toObject(),
            applicants: job.applicants.filter(applicant => applicant.userId._id.toString() === userId) // Ensure correct ID matching
        }));

        res.status(200).json(filteredJobs);
    } catch (error) {
        console.error("Error fetching jobs by applicant:", error);
        res.status(500).json({ error: "Failed to fetch jobs" });
    }
};
