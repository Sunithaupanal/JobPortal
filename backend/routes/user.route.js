import express from "express";
import { login, logout, register, updateProfile} from "../controllers/user.controller.js"; // Importing user controllers
import isAuthenticated from "../middlewares/isAuthenticated.js"; // Importing authentication middleware
import { singleUpload, multiFieldUpload } from "../middlewares/multer.js"; // Importing multer middleware for file uploads

const router = express.Router();  // Creating a router object

// Defining routes and associating them with controller functions
router.route("/register").post(singleUpload,register); // Route for user registration
router.route("/login").post(login); 
router.route("/logout").get(logout);      
router.route("/profile/update").post(isAuthenticated,multiFieldUpload,updateProfile);

export default router;  // Exporting the router to be used in other parts of the application
