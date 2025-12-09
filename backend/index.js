import express from "express";
import cookieParser from "cookie-parser";   //to parse cookies
import cors from "cors";   //to handle cross origin requests
import dotenv from "dotenv";  //to handle environment variables
import connectDB from "./utils/db.js";  //to connect to the database
import userRoute from "./routes/user.route.js"; // Importing user routes
import companyRoute from "./routes/company.route.js"; // Importing company routes
import jobRoute from "./routes/job.route.js"; // Importing job routes
import applicationRoute from "./routes/application.route.js"; // Importing application routes

dotenv.config({});  //to load environment variables from .env file

const app = express();    //calling express function

//used for sample 
// app.get("/home",(req,res)=>{
//     return res.status(200).json({
//         message:"I am coming from backend",
//         success:true
//     })
// });

console.log(process.env.CLOUDINARY_API_KEY);

//middleware
app.use(express.json());  //to parse incoming json data
app.use(express.urlencoded({extended:true})); //to parse urlencoded data
app.use(cookieParser());  //to use cookie parser
const corsOptions = {
    origin: 'http://localhost:5173',  //frontend url
    credentials: true,      //to send cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
};

app.use(cors(corsOptions));  //to use cors

const PORT = process.env.PORT || 8000;   //to get port from environment variable or default to 8000

//api's
app.use("/api/v1/user",userRoute);  //to use user routes
app.use("/api/v1/company",companyRoute);  //to use company routes
app.use("/api/v1/job",jobRoute);  //to use job routes
app.use("/api/v1/application",applicationRoute);  //to use application routes

app.get("/api/test", (req, res) => {
    return res.status(200).json({
        message: "Backend is working!",
        success: true
    });
}); 

//listening to the port
app.listen(PORT,()=>{        
    connectDB();  //to connect to the database
    console.log(`Server is running at port ${PORT}`); 
})