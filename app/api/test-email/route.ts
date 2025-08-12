import { NextRequest } from 'next/server';
import { sendEmail } from '~/lib/email-service';

export async function POST(request: NextRequest) {
  try {
    const { type, recipientEmail } = await request.json();
    
    if (!recipientEmail) {
      return Response.json({
        success: false,
        message: 'Recipient email is required'
      });
    }

    let subject: string;
    let html: string;

    // Different email templates for showcase
    switch (type) {
      case 'welcome':
        subject = '🎉 Welcome to Your Amazing Todo App!';
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; border-radius: 20px; color: white;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="margin: 0; font-size: 32px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">🚀 Welcome Aboard!</h1>
              <p style="font-size: 18px; opacity: 0.9;">Your productivity journey starts now!</p>
            </div>
            
            <div style="background: rgba(255,255,255,0.1); padding: 25px; border-radius: 15px; margin: 20px 0; backdrop-filter: blur(10px);">
              <h2 style="margin-top: 0; color: #ffd700;">✨ What You Can Do:</h2>
              <ul style="text-align: left; font-size: 16px;">
                <li>📝 Create and organize tasks</li>
                <li>⏰ Set due dates and get reminders</li>
                <li>🔗 Link GitHub repositories</li>
                <li>💬 Add comments and collaborate</li>
                <li>📊 Track your progress</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="font-size: 14px; opacity: 0.8;">This email was sent automatically to demonstrate our Gmail integration! 📧</p>
              <div style="margin-top: 20px;">
                <span style="background: #ff6b6b; padding: 8px 16px; border-radius: 20px; font-size: 12px;">🎯 Gmail Integration Working!</span>
              </div>
            </div>
          </div>
        `;
        break;

      case 'achievement':
        subject = '🏆 Achievement Unlocked: Email Master!';
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 40px; border-radius: 20px; color: white;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="font-size: 80px; margin-bottom: 20px;">🏆</div>
              <h1 style="margin: 0; font-size: 32px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">Achievement Unlocked!</h1>
              <p style="font-size: 18px; opacity: 0.9;">You've successfully tested our email system!</p>
            </div>
            
            <div style="background: rgba(255,255,255,0.1); padding: 25px; border-radius: 15px; margin: 20px 0; backdrop-filter: blur(10px);">
              <h2 style="margin-top: 0; color: #ffd700;">🎯 What This Proves:</h2>
              <ul style="text-align: left; font-size: 16px;">
                <li>✅ Gmail SMTP is properly configured</li>
                <li>✅ Email templates are working</li>
                <li>✅ Authentication is successful</li>
                <li>✅ HTML emails render correctly</li>
                <li>✅ System is production-ready</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="font-size: 14px; opacity: 0.8;">Perfect for showcasing to clients or stakeholders! 🎉</p>
              <div style="margin-top: 20px;">
                <span style="background: #4ecdc4; padding: 8px 16px; border-radius: 20px; font-size: 12px;">🚀 Ready for Production!</span>
              </div>
            </div>
          </div>
        `;
        break;

      case 'reminder':
        subject = '⏰ Demo: Task Reminder System Working!';
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 40px; border-radius: 20px; color: white;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="font-size: 80px; margin-bottom: 20px;">⏰</div>
              <h1 style="margin: 0; font-size: 32px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">Reminder System Active!</h1>
              <p style="font-size: 18px; opacity: 0.9;">This is how your users will get notified!</p>
            </div>
            
            <div style="background: rgba(255,255,255,0.1); padding: 25px; border-radius: 15px; margin: 20px 0; backdrop-filter: blur(10px);">
              <h2 style="margin-top: 0; color: #ffd700;">📧 Reminder Features:</h2>
              <ul style="text-align: left; font-size: 16px;">
                <li>🕐 Automated scheduling with Vercel Cron</li>
                <li>📱 Beautiful HTML email templates</li>
                <li>🎨 Responsive design for all devices</li>
                <li>⚡ Fast delivery via Gmail SMTP</li>
                <li>🔄 Smart duplicate prevention</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="font-size: 14px; opacity: 0.8;">Your reminder system is fully operational! 🎯</p>
              <div style="margin-top: 20px;">
                <span style="background: #45b7d1; padding: 8px 16px; border-radius: 20px; font-size: 12px;">📬 Gmail Integration Success!</span>
              </div>
            </div>
          </div>
        `;
        break;

      default:
        subject = '🧪 Test Email: Gmail Integration Working!';
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); padding: 40px; border-radius: 20px; color: #333;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="font-size: 80px; margin-bottom: 20px;">🧪</div>
              <h1 style="margin: 0; font-size: 32px; color: #2c3e50;">Test Email Sent!</h1>
              <p style="font-size: 18px; color: #7f8c8d;">Your Gmail integration is working perfectly!</p>
            </div>
            
            <div style="background: rgba(255,255,255,0.7); padding: 25px; border-radius: 15px; margin: 20px 0; backdrop-filter: blur(10px);">
              <h2 style="margin-top: 0; color: #e74c3c;">🎯 Integration Status:</h2>
              <ul style="text-align: left; font-size: 16px; color: #2c3e50;">
                <li>✅ Gmail SMTP connection established</li>
                <li>✅ Authentication successful</li>
                <li>✅ Email delivery working</li>
                <li>✅ HTML rendering perfect</li>
                <li>✅ Ready for production use</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="font-size: 14px; color: #7f8c8d;">Perfect for client demonstrations! 🎉</p>
              <div style="margin-top: 20px;">
                <span style="background: #27ae60; color: white; padding: 8px 16px; border-radius: 20px; font-size: 12px;">🚀 Production Ready!</span>
              </div>
            </div>
          </div>
        `;
    }

    // Send the email
    const emailSent = await sendEmail(recipientEmail, subject, html);
    
    if (emailSent) {
      return Response.json({
        success: true,
        message: `Test email sent successfully to ${recipientEmail}`,
        type: type,
        subject: subject,
        timestamp: new Date().toISOString()
      });
    } else {
      return Response.json({
        success: false,
        message: 'Failed to send test email'
      });
    }
    
  } catch (error) {
    console.error('Test email error:', error);
    return Response.json({
      success: false,
      message: 'Error occurred while sending test email',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
