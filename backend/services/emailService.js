import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter for Gmail
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'zerowastedelhi86@gmail.com',
      pass: process.env.EMAIL_PASSWORD // App password for Gmail
    }
  });
};

// Send welcome email
export const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'zerowastedelhi86@gmail.com',
      to: userEmail,
      subject: 'Welcome to Zero Waste Delhi!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #22c55e;">Welcome to Zero Waste Delhi, ${userName}!</h2>
          <p>Thank you for joining our mission to make Delhi cleaner and greener.</p>
          <p>With your account, you can:</p>
          <ul>
            <li>Report waste collection activities</li>
            <li>Find nearby waste bins</li>
            <li>Track your environmental impact</li>
            <li>Compete on the leaderboard</li>
          </ul>
          <p>Let's work together for a zero waste Delhi!</p>
          <p style="color: #666; font-size: 12px;">
            This email was sent from Zero Waste Delhi. If you didn't create an account, please ignore this email.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${userEmail}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

// Send waste collection confirmation
export const sendWasteCollectionConfirmation = async (userEmail, userName, wasteDetails) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'zerowastedelhi86@gmail.com',
      to: userEmail,
      subject: 'Waste Collection Confirmed - Zero Waste Delhi',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #22c55e;">Waste Collection Confirmed!</h2>
          <p>Hi ${userName},</p>
          <p>Your waste collection has been successfully recorded:</p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Waste Type:</strong> ${wasteDetails.type}</p>
            <p><strong>Weight:</strong> ${wasteDetails.weight} kg</p>
            <p><strong>Location:</strong> ${wasteDetails.location}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <p>Thank you for contributing to a cleaner Delhi!</p>
          <p style="color: #666; font-size: 12px;">
            Zero Waste Delhi Team
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Waste collection confirmation sent to ${userEmail}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending waste collection confirmation:', error);
    return { success: false, error: error.message };
  }
};

// Send notification to admin
export const sendAdminNotification = async (subject, message, data = {}) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'zerowastedelhi86@gmail.com',
      to: 'zerowastedelhi86@gmail.com', // Admin email
      subject: `[Zero Waste Delhi Admin] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Admin Notification</h2>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong> ${message}</p>
          ${Object.keys(data).length > 0 ? `
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <h3>Additional Data:</h3>
              <pre>${JSON.stringify(data, null, 2)}</pre>
            </div>
          ` : ''}
          <p style="color: #666; font-size: 12px;">
            Sent at: ${new Date().toISOString()}
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Admin notification sent: ${subject}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return { success: false, error: error.message };
  }
};

export default {
  sendWelcomeEmail,
  sendWasteCollectionConfirmation,
  sendAdminNotification
};