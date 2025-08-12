const { sendEmail } = require('./lib/email-service');

async function testGmailIntegration() {
  console.log('🧪 Testing Gmail Integration...\n');
  
  const testEmail = process.argv[2] || 'your-email@gmail.com';
  
  if (!testEmail || testEmail === 'your-email@gmail.com') {
    console.log('❌ Please provide an email address as an argument');
    console.log('Usage: node test-gmail.js your-email@gmail.com');
    console.log('\nExample: node test-gmail.js jeevansm025@gmail.com');
    process.exit(1);
  }
  
  console.log(`📧 Sending test email to: ${testEmail}\n`);
  
  try {
    const subject = '🎉 Gmail Integration Test - SUCCESS!';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; border-radius: 20px; color: white; text-align: center;">
        <h1 style="margin: 0; font-size: 36px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">🎯 Gmail Integration Working!</h1>
        <p style="font-size: 20px; margin: 20px 0; opacity: 0.9;">Your email system is fully operational!</p>
        
        <div style="background: rgba(255,255,255,0.1); padding: 25px; border-radius: 15px; margin: 30px 0; backdrop-filter: blur(10px);">
          <h2 style="margin-top: 0; color: #ffd700;">✅ What This Proves:</h2>
          <ul style="text-align: left; font-size: 16px; list-style: none; padding: 0;">
            <li style="margin: 10px 0;">🔐 Gmail SMTP authentication successful</li>
            <li style="margin: 10px 0;">📧 Email delivery working perfectly</li>
            <li style="margin: 10px 0;">🎨 HTML emails rendering correctly</li>
            <li style="margin: 10px 0;">⚡ Fast and reliable delivery</li>
            <li style="margin: 10px 0;">🚀 Production-ready system</li>
          </ul>
        </div>
        
        <div style="margin-top: 30px;">
          <p style="font-size: 14px; opacity: 0.8;">Perfect for client demonstrations and portfolio showcases!</p>
          <div style="margin-top: 20px;">
            <span style="background: #ff6b6b; padding: 10px 20px; border-radius: 25px; font-size: 14px; font-weight: bold;">🎊 Ready to Showcase!</span>
          </div>
        </div>
      </div>
    `;
    
    console.log('📤 Sending email...');
    const result = await sendEmail(testEmail, subject, html);
    
    if (result) {
      console.log('✅ Email sent successfully!');
      console.log('📬 Check your inbox (and spam folder) to see the beautiful email');
      console.log('\n🎯 Perfect for showcasing to clients!');
      console.log('💼 Use this in presentations to prove your email system works');
      console.log('🚀 Your app is production-ready with Gmail integration');
    } else {
      console.log('❌ Failed to send email');
      console.log('🔍 Check your SMTP configuration and environment variables');
    }
    
  } catch (error) {
    console.error('❌ Error testing Gmail integration:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check your .env file has SMTP_EMAIL and SMTP_PASSWORD');
    console.log('2. Ensure you\'re using a Gmail App Password (not regular password)');
    console.log('3. Verify 2FA is enabled on your Gmail account');
    console.log('4. Check the console for detailed error messages');
  }
}

testGmailIntegration();
