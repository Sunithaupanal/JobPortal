import { sendApplicationNotification, sendNewApplicationNotification } from './utils/email-improved.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testEmailFix() {
    console.log('🧪 Testing Improved Email System...\n');

    // Test data - replace with real email addresses
    const testCandidate = {
        email: process.env.TEST_CANDIDATE_EMAIL || 'your-real-email@example.com',
        fullname: 'Test Candidate'
    };

    const testJob = {
        title: 'Software Engineer',
        company: { name: 'Test Company' }
    };

    const testRecruiter = {
        email: process.env.TEST_RECRUITER_EMAIL || 'recruiter-real-email@example.com'
    };

    console.log('📧 Testing with the following configuration:');
    console.log(`- Candidate Email: ${testCandidate.email}`);
    console.log(`- Recruiter Email: ${testRecruiter.email}`);
    console.log(`- Email Host: ${process.env.EMAIL_HOST || 'smtp.gmail.com'}`);
    console.log(`- Email User: ${process.env.EMAIL_USER || 'Not configured'}\n`);

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
        console.log('1. Update your .env file with real email addresses');
        console.log('2. Test with real email addresses');
        console.log('3. Run the full application workflow');

    } catch (error) {
        console.error('❌ Email test failed:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Check your email service credentials');
        console.log('2. Verify EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS in .env');
        console.log('3. Make sure your email service allows SMTP connections');
        console.log('4. Check if you need to enable "Less secure app access" or use App Passwords');
        console.log('5. Replace placeholder emails with real email addresses');
    }
}

// Run the test
testEmailFix();
