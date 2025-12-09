import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Function to send welcome email
export const sendWelcomeEmail = async (email, fullname) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to Job Portal!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Welcome to Job Portal, ${fullname}!</h2>
                    <p>Thank you for registering with us. We're excited to help you find your dream job or connect with talented candidates.</p>
                    <p>Here's what you can do next:</p>
                    <ul>
                        <li>Complete your profile</li>
                        <li>Browse available jobs</li>
                        <li>Apply for positions that interest you</li>
                    </ul>
                    <p>If you have any questions, feel free to contact our support team.</p>
                    <p>Best regards,<br>The Job Portal Team</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Welcome email sent successfully to:', email);
    } catch (error) {
        console.error('Error sending welcome email:', error);
        throw error;
    }
};

// Function to send job application notification
export const sendApplicationNotification = async (email, fullname, jobTitle, companyName) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Job Application Submitted Successfully',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Application Submitted!</h2>
                    <p>Dear ${fullname},</p>
                    <p>Your application for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been submitted successfully.</p>
                    <p>You will be notified once the recruiter reviews your application.</p>
                    <p>Best regards,<br>The Job Portal Team</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Application notification email sent to:', email);
    } catch (error) {
        console.error('Error sending application notification email:', error);
        throw error;
    }
};

// Function to send application status update
export const sendStatusUpdateEmail = async (email, fullname, jobTitle, companyName, status) => {
    try {
        const statusMessage = status === 'accepted' ? 'Congratulations! Your application has been accepted.' : 'We regret to inform you that your application has been rejected.';

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Application Status Update - ${jobTitle}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Application Status Update</h2>
                    <p>Dear ${fullname},</p>
                    <p>${statusMessage}</p>
                    <p>Position: <strong>${jobTitle}</strong></p>
                    <p>Company: <strong>${companyName}</strong></p>
                    <p>Best regards,<br>The Job Portal Team</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Status update email sent to:', email);
    } catch (error) {
        console.error('Error sending status update email:', error);
        throw error;
    }
};

// Function to send notification to recruiter about new application
export const sendNewApplicationNotification = async (recruiterEmail, applicantName, jobTitle) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: recruiterEmail,
            subject: 'New Job Application Received',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>New Application Received</h2>
                    <p>You have received a new application for the position: <strong>${jobTitle}</strong></p>
                    <p>Applicant: <strong>${applicantName}</strong></p>
                    <p>Please log in to your dashboard to review the application.</p>
                    <p>Best regards,<br>The Job Portal Team</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('New application notification sent to recruiter:', recruiterEmail);
    } catch (error) {
        console.error('Error sending new application notification:', error);
        throw error;
    }
};
