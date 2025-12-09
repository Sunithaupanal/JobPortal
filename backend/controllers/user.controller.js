import { User } from "../models/user.model.js"; // Importing User model
import bcrypt from "bcryptjs";  // Importing bcrypt for password hashing
import jwt from "jsonwebtoken"; // Importing jsonwebtoken for token generation
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { sendWelcomeEmail } from "../utils/email.js";
import fs from 'fs';
import path from 'path';
import os from 'os';

// User registration controller

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };

        // Check if profile photo is uploaded
        if (!req.file) {
            return res.status(400).json({
                message: "Profile photo is required",
                success: false
            });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exists with this email.',
                success: false
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        // Handle profile photo upload
        let cloudResponse;
        try {
            const fileUri = getDataUri(req.file);
            cloudResponse = await cloudinary.v2.uploader.upload(fileUri.content, {
                resource_type: req.file.mimetype === "application/pdf" ? "raw" : "image",
                type: "upload",
                access_mode: "public"
            });
        } catch (uploadError) {
            console.error('Cloudinary upload failed:', uploadError.message);
            // For development without Cloudinary, use a placeholder or make it optional
                cloudResponse = { secure_url: 'https://picsum.photos/150' };
        }

        const newUser = await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: cloudResponse.secure_url,
            }
        });

        // Send welcome email
        try {
            await sendWelcomeEmail(email, fullname);
        } catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
            // Don't fail registration if email fails
        }

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: 'Incorrect email or password.',
                success: false
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: 'Incorrect email or password.',
                success: false
            })
        };

        // check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            })
        };

        const tokenData = {
            userId: user._id
        }

        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }
        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const files = req.files; // resume and profilePhoto files

        let resumeCloudResponse;
        let profilePhotoCloudResponse;

        // Handle resume upload
        if (files && files.file && files.file[0]) {
            const file = files.file[0];
            try {
                const tempDir = os.tmpdir();
                const tempFile = path.join(tempDir, `temp_${Date.now()}_${file.originalname}`);
                fs.writeFileSync(tempFile, file.buffer);
                let uploadOptions = {
                    resource_type: "auto",
                    type: "upload",
                    access_mode: "public",
                    public_id: `resume_${Date.now()}_${path.parse(file.originalname).name}`
                };
                resumeCloudResponse = await cloudinary.v2.uploader.upload(tempFile, uploadOptions);
                fs.unlinkSync(tempFile);
            } catch (uploadError) {
                console.error('Resume Cloudinary upload failed:', uploadError.message);
            }
        }

        // Handle profile photo upload
        if (files && files.profilePhoto && files.profilePhoto[0]) {
            const photoFile = files.profilePhoto[0];
            try {
                const fileUri = getDataUri(photoFile);
                profilePhotoCloudResponse = await cloudinary.v2.uploader.upload(fileUri.content, {
                    resource_type: "image",
                    type: "upload",
                    access_mode: "public"
                });
            } catch (uploadError) {
                console.error('Profile photo Cloudinary upload failed:', uploadError.message);
                profilePhotoCloudResponse = { secure_url: 'https://via.placeholder.com/150' };
            }
        }

        let skillsArray;
        if (skills) {
            skillsArray = skills.split(",");
        }
        const userId = req.id;
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            })
        }
        //updating data
        if (fullname) user.fullname = fullname
        if (email) user.email = email
        if (phoneNumber) user.phoneNumber = phoneNumber
        if (bio) user.profile.bio = bio
        if (skills) user.profile.skills = skillsArray

        if (resumeCloudResponse) {
            user.profile.resume = resumeCloudResponse.secure_url;
            user.profile.resumeOriginalName = files.file[0].originalname;
        }
        if (profilePhotoCloudResponse) {
            user.profile.profilePhoto = profilePhotoCloudResponse.secure_url;
        }

        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).json({
            message: "Profile updated successfully",
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}
