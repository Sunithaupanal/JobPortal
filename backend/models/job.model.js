import mongoose from "mongoose";
const jobSchema = new mongoose.Schema({     // Job schema definition
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: [{
        type: String
    }],
    salary: {
        type: Number,
        required: true
    },
    experienceLevel: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        required: true
    },
    position: {
        type: Number,
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,   // Reference to Company model
        ref: 'Company',
        required: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,   // Reference to User model
        ref: 'User',
        required: true
    },
    applications: [{
        type: mongoose.Schema.Types.ObjectId,   // Reference to Application model
        ref: 'Application',
    }]
}, {timestamps: true});  //to add createdAt and updatedAt fields
export const Job = mongoose.model("Job", jobSchema); //to create a model named 'Job' using the jobSchema
