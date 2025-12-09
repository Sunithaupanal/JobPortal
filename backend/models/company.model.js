import mongoose from "mongoose";

const companySchema = new mongoose.Schema({   // Company schema definition
    name: {
        type: String,
        required: true,     // required field used for company name 
        unique: true 
    },
    description: {
        type: String
    },
    website: {
        type: String
    },
    location: {
        type: String
    },
    logo: {
        type: String  // URL to the company logo image
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps: true});  //to add createdAt and updatedAt fields
export const Company = mongoose.model("Company", companySchema); //to create a model named 'Company' using the companySchema
