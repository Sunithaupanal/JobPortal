import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import { sendApplicationNotification, sendStatusUpdateEmail, sendNewApplicationNotification } from "../utils/email.js";

export const applyJob = async (req, res) => {
    try {
        const userId = req.id; 
        const jobId = req.params.id;
        if(!jobId) {
            return res.status(400).json({
                message:"Job id is required.",
                success:false
            })
        };

        // check if the user has already applied for the job
        const existingApplication = await Application.findOne({job:jobId, applicant:userId});

        if(existingApplication) {
            return res.status(400).json({
                message:"You have already applied for this job.",
                success:false
            });
        }

        //check if the jobs exists
        const job = await Job.findById(jobId).populate('company').populate('created_by');
        if(!job) {
            return res.status(404).json({
                message:"Job not found.",
                success:false
            })
        }

        //create a new application
        const newApplication = await Application.create({
            job:jobId,
            applicant:userId,
        });

        job.applications.push(newApplication._id);
        await job.save();

        // Get applicant details
        const applicant = await User.findById(userId);

        // Send notification emails
        try {
            // Send notification to applicant
            await sendApplicationNotification(applicant.email, applicant.fullname, job.title, job.company.name);

            // Send notification to recruiter
            await sendNewApplicationNotification(job.created_by.email, applicant.fullname, job.title);
        } catch (emailError) {
            console.error('Failed to send application emails:', emailError);
            // Don't fail application if email fails
        }

        return res.status(201).json({
            message:"Job application submitted successfully.",
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}

export const getResumeUrl = async (req, res) => {
    try {
        const { resumeUrl } = req.body;
        if (!resumeUrl) {
            return res.status(400).json({
                message: "Resume URL is required.",
                success: false
            });
        }

        // Insert fl_inline to force inline display in browser
        const inlineUrl = resumeUrl.replace('/upload/', '/upload/fl_inline/');

        // Ensure the URL ends with .pdf for browser preview if not already
        const finalUrl = inlineUrl.endsWith(".pdf") ? inlineUrl : `${inlineUrl}.pdf`;

        return res.status(200).json({
            signedUrl: finalUrl,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to generate resume URL.",
            success: false
        });
    }
}


export const getAppliedJobs = async (req,res) => {
    try {
        const userId = req.id; //logged in user id
        const application = await Application.find({applicant:userId}).sort({createdAt: -1}).populate({
            path:'job',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'company',
                options:{sort:{createdAt:-1}},
            }
        });
        if(!application) {
            return res.status(404).json({
                message:"No Applications",
                success:false
            })
        };

        return res.status(200).json({
            application,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}

// admin will checks how many users applied for a particular job
export const getApplicants = async (req,res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:'applications',
            options:{sort:{createdAt: -1}},
            populate:{
                path:'applicant'
            }
        });
        if(!job) {
            return res.status(404).json({
                message:"Job not found.",
                success:false
            })
        };

        // check if the logged-in user is the creator of the job
        if(job.created_by.toString() !== req.id) {
            return res.status(403).json({
                message:"Forbidden: You do not have permission to view applicants for this job.",
                success:false
            })
        }

        return res.status(200).json({
            job,
            success:true
        });
    } catch (error) {
        console.log(error);
    }
}

export const updateStatus = async (req,res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;
        if(!status) {
            return res.status(400).json({
                message:"Status is required.",
                success:false
            })
        };

        // find the application by application id
        const application = await Application.findOne({_id:applicationId}).populate({
            path: 'job',
            populate: {
                path: 'company'
            }
        }).populate('applicant');
        if(!application) {
            return res.status(404).json({
                message:"Application not found.",
                success:false
            })
        };

        //update the status
        application.status = status.toLowerCase();
        await application.save();

        // Send status update email to applicant
        try {
            await sendStatusUpdateEmail(
                application.applicant.email,
                application.applicant.fullname,
                application.job.title,
                application.job.company.name,
                status
            );
        } catch (emailError) {
            console.error('Failed to send status update email:', emailError);
            // Don't fail status update if email fails
        }

        return res.status(200).json({
            message:"Application status updated successfully.",
            success:true
        });
    } catch (error) {
        console.log(error);
    }
}
