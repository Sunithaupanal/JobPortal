import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({  // Application schema definition
    job: {
        type: mongoose.Schema.Types.ObjectId,  // Reference to Job model
        ref: 'Job',
        required: true
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,  // Reference to User model
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    }
}, {timestamps: true});  //to add createdAt and updatedAt fields
export const Application = mongoose.model("Application", applicationSchema); //to create a model named 'Application' using the applicationSchema