import cloudinary from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadResume = async (req, res) => {
  try {
    // Example: resume file comes from multer or base64
    const filePath = req.file.path;
    const fileExtension = filePath.split('.').pop().toLowerCase();

    let uploadOptions = {
      folder: "resumes",      // optional: keep all resumes in one folder
      public_id: "resume_" + Date.now(), // unique name
      resource_type: "auto"  // Upload all resumes as raw for proper URL access
    };

    const result = await cloudinary.v2.uploader.upload(filePath, uploadOptions);

    res.json({
      url: result.secure_url,  // ✅ working PDF link or raw file link
      public_id: result.public_id,
      format: result.format,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export default cloudinary;
