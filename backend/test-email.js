import { sendApplicationNotification, sendNewApplicationNotification } from './utils/email.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testEmailNotifications() {
    console.log('🧪 Testing Email Notification System...\n');

    // Test data
    const testCandidate = {
        email: process.env.TEST_CANDIDATE_EMAIL || 'test@example.com',
        fullname: 'Test Candidate'
    };

    const testJob = {
        title: 'Software Engineer',
        company: { name: 'Test Company' }
    };

    const testRecruiter = {
        email: process.env.TEST_RECRUITER_EMAIL || 'recruiter@example.com'
    };

    try {
        console.log('1. Testing candidate notification email...');
        await sendApplicationNotification(
            testCandidate.email,
            testCandidate.fullname,
            testJob.title,
            testJob.company.name
        );
        console.log('✅ Candidate notification sent successfully\n');

        console.log('2. Testing recruiter notification email...');
        await sendNewApplicationNotification(
            testRecruiter.email,
            testCandidate.fullname,
            testJob.title
        );
        console.log('✅ Recruiter notification sent successfully\n');

        console.log('🎉 All email tests passed!');
        console.log('\n📋 Next Steps:');
        console.log('1. Set up your email service credentials in .env file');
        console.log('2. Test with real email addresses');
        console.log('3. Run the full application workflow');

    } catch (error) {
        console.error('❌ Email test failed:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Check your email service credentials');
        console.log('2. Verify EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS in .env');
        console.log('3. Make sure your email service allows SMTP connections');
        console.log('4. Check if you need to enable "Less secure app access" or use App Passwords');
    }
}

// Run the test
testEmailNotifications();
