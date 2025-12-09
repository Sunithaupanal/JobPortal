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

// Email validation function
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Function to send job application notification
export const sendApplicationNotification = async (email, fullname, jobTitle, companyName) => {
    if (!isValidEmail(email)) {
        console.warn(`Invalid email address: ${email}`);
        return;
    }

    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Job Application Submitted Successfully',
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Application Submitted</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f4f4f4;">
                        <tr>
                            <td align="center" style="padding: 40px 20px;">
                                <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                                    <tr>
                                        <td style="padding: 40px 30px; text-align: center;">
                                            <div style="background-color: #28a745; color: #ffffff; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                                                <h1 style="margin: 0; font-size: 24px;">Application Submitted Successfully!</h1>
                                            </div>

                                            <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Dear ${fullname},</p>

                                            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: left;">
                                                <p style="color: #333333; font-size: 16px; margin: 0 0 15px 0; font-weight: 500;">Application Details:</p>
                                                <p style="color: #666666; font-size: 14px; margin: 5px 0;"><strong>Position:</strong> ${jobTitle}</p>
                                                <p style="color: #666666; font-size: 14px; margin: 5px 0;"><strong>Company:</strong> ${companyName}</p>
                                            </div>

                                            <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 20px 0;">Your application has been submitted successfully. You will be notified once the recruiter reviews your application.</p>

                                            <div style="margin: 30px 0;">
                                                <a href="#" style="background-color: #007bff; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: 500; display: inline-block;">Track Application</a>
                                            </div>

                                            <p style="color: #999999; font-size: 14px; margin: 20px 0 0 0;">Best regards,<br><strong>The Job Portal Team</strong></p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
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
    if (!isValidEmail(email)) {
        console.warn(`Invalid email address: ${email}`);
        return;
    }

    try {
        const isAccepted = status === 'accepted';
        const statusMessage = isAccepted
            ? 'Congratulations! Your application has been accepted.'
            : 'We regret to inform you that your application has been rejected.';

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Application Status Update - ${jobTitle}`,
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Application Status Update</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f4f4f4;">
                        <tr>
                            <td align="center" style="padding: 40px 20px;">
                                <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                                    <tr>
                                        <td style="padding: 40px 30px; text-align: center;">
                                            <div style="background-color: ${isAccepted ? '#28a745' : '#dc3545'}; color: #ffffff; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                                                <h1 style="margin: 0; font-size: 24px;">Application Status Update</h1>
                                            </div>

                                            <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Dear ${fullname},</p>

                                            <div style="background-color: ${isAccepted ? '#d4edda' : '#f8d7da'}; border: 1px solid ${isAccepted ? '#c3e6cb' : '#f5c6cb'}; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center;">
                                                <p style="color: ${isAccepted ? '#155724' : '#721c24'}; font-size: 18px; margin: 0; font-weight: 500;">${statusMessage}</p>
                                            </div>

                                            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: left;">
                                                <p style="color: #333333; font-size: 16px; margin: 0 0 15px 0; font-weight: 500;">Application Details:</p>
                                                <p style="color: #666666; font-size: 14px; margin: 5px 0;"><strong>Position:</strong> ${jobTitle}</p>
                                                <p style="color: #666666; font-size: 14px; margin: 5px 0;"><strong>Company:</strong> ${companyName}</p>
                                                <p style="color: #666666; font-size: 14px; margin: 5px 0;"><strong>Status:</strong> ${status}</p>
                                            </div>

                                            ${isAccepted ? '<p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 20px 0;">Please check your email for further instructions from the company regarding next steps.</p>' : '<p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 20px 0;">Don\'t be discouraged! Keep applying to other opportunities that match your skills and interests.</p>'}

                                            <div style="margin: 30px 0;">
                                                <a href="#" style="background-color: #007bff; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: 500; display: inline-block;">Browse More Jobs</a>
                                            </div>

                                            <p style="color: #999999; font-size: 14px; margin: 20px 0 0 0;">Best regards,<br><strong>The Job Portal Team</strong></p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
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
    if (!isValidEmail(recruiterEmail)) {
        console.warn(`Invalid recruiter email address: ${recruiterEmail}`);
        return;
    }

    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: recruiterEmail,
            subject: 'New Job Application Received',
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>New Application Received</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f4f4f4;">
                        <tr>
                            <td align="center" style="padding: 40px 20px;">
                                <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                                    <tr>
                                        <td style="padding: 40px 30px; text-align: center;">
                                            <div style="background-color: #007bff; color: #ffffff; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                                                <h1 style="margin: 0; font-size: 24px;">New Application Received</h1>
                                            </div>

                                            <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">You have received a new application for the position:</p>

                                            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: left;">
                                                <p style="color: #333333; font-size: 16px; margin: 0 0 15px 0; font-weight: 500;">Application Details:</p>
                                                <p style="color: #666666; font-size: 14px; margin: 5px 0;"><strong>Position:</strong> ${jobTitle}</p>
                                                <p style="color: #666666; font-size: 14px; margin: 5px 0;"><strong>Applicant:</strong> ${applicantName}</p>
                                            </div>

                                            <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 20px 0;">Please log in to your dashboard to review the application and take appropriate action.</p>

                                            <div style="margin: 30px 0;">
                                                <a href="#" style="background-color: #28a745; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: 500; display: inline-block;">Review Application</a>
                                            </div>

                                            <p style="color: #999999; font-size: 14px; margin: 20px 0 0 0;">Best regards,<br><strong>The Job Portal Team</strong></p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('New application notification sent to recruiter:', recruiterEmail);
    } catch (error) {
        console.error('Error sending new application notification:', error);
        throw error;
    }
};
