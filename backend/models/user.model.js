import mongoose from "mongoose";
const userSchema = new mongoose.Schema({      // User schema definition
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'recruiter'],
        required: true
    },
    profile: {
        bio: {type: String},
        skills: [{type: String}],
        resume: {type: String},   // URL to the resume file
        resumeOriginalName: {type: String},
        company: {type: mongoose.Schema.Types.ObjectId, ref: 'Company'},  // Reference to Company model if the user is a recruiter
        profilePhoto: {type: String, default: ""}  // URL to the profile photo
    },
}, {timestamps: true});  //to add createdAt and updatedAt fields
export const User = mongoose.model('User', userSchema);  //to create a model named 'User' using the userSchema
