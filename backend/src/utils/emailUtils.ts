import { KEYS } from 'config/config';
import { randomBytes } from 'crypto';
import nodemailer from 'nodemailer';

const sendResetPasswordEmail = async (
  email: string,
  resetPasswordToken: string
) => {
  // Create reusable transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: KEYS.email,
      pass: KEYS.emailPassword,
    },
  });
  const htmlText = `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px;">
    <h1 style="color: #3A0CA3; text-align: center; font-size: 28px; margin-bottom: 20px;">Reset Your Password</h1>
    <p style="font-size: 16px; line-height: 1.5;">Hi there,</p>
    <p style="font-size: 16px; line-height: 1.5;">
      You have requested to reset your password for your Havenly account. Please use the link below to reset your password.
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="http://localhost:5000/reset-password/${resetPasswordToken}" style="background-color: #3A0CA3; color: white; padding: 12px 25px; font-size: 16px; text-decoration: none; border-radius: 5px;">
        Reset Password
      </a>
    </div>
    <p style="font-size: 16px; line-height: 1.5;">
      This link will expire in 1 hour. If you did not request a password reset, please ignore this email.
    </p>
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
    <footer style="text-align: center; font-size: 14px; color: #999;">
      <p>
        Havenly Inc., 1234 Street Name, City, State, ZIP Code<br />
        Need help? <a href="mailto:support@yourdomain.com" style="color: #3A0CA3; text-decoration: none;">Contact Support</a>
      </p>
      <p>© 2024 Havenly. All rights reserved.</p>
    </footer>
  </div>
`;

  // Set up email data
  const mailOptions = {
    from: KEYS.email, // Sender's email address
    to: email, // Recipient's email address
    subject: 'Reset Your Password',
    text: `Please click the following link to reset your password: http://localhost:5000/reset-password/${resetPasswordToken}`,
    html: htmlText, // Use the inline styled HTML content
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

export default sendResetPasswordEmail;



export const sendVerificationEmail = async (email: string, code: string) => {
  if (!KEYS.email || !KEYS.emailPassword) {
    throw new Error(
      'Email credentials are not set in the environment variables.'
    );
  }
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: KEYS.email,
      pass: KEYS.emailPassword,
    },
  });

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px;">
      <h1 style="color: #3A0CA3; text-align: center;">Welcome to Havenly!</h1>
      <p style="font-size: 16px; line-height: 1.5;">Hi there,</p>
      <p style="font-size: 16px; line-height: 1.5;">
        Thank you for joining Havenly! We're excited to have you on board. Please use the verification code below to confirm your email address:
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <span style="font-size: 24px; font-weight: bold; color: #3A0CA3; padding: 10px 20px; border: 1px dashed #3A0CA3; border-radius: 5px;">
          ${code}
        </span>
      </div>
      <p style="font-size: 16px; line-height: 1.5;">
        If you didn't create this account, you can safely ignore this email.
      </p>
      <div style="text-align: center; margin-top: 30px;">
        <a href="http://localhost:5000/api/auth/verify?email=${email}&code=${code}" style="text-decoration: none; padding: 10px 20px; background-color: #3A0CA3; color: white; font-size: 16px; border-radius: 5px;">Verify Email</a>
      </div>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
      <footer style="text-align: center; font-size: 14px; color: #999;">
        <p>
          Havenly Inc., 1234 Street Name, City, State, ZIP Code<br />
          Need help? <a href="mailto:support@yourdomain.com" style="color: #3A0CA3; text-decoration: none;">Contact Support</a>
        </p>
        <p>© 2024 Havenly. All rights reserved.</p>
      </footer>
    </div>
  `;

  await transporter.sendMail({
    from: KEYS.email,
    to: email,
    subject: 'Havenly Email Verification',
    html: htmlContent, // Use HTML content instead of plain text
  });
};

export const generateVerificationCode = (length: number): string => {
  return randomBytes(length).toString('hex').slice(0, length).toUpperCase();
};



export const sendInquiryEmail = async (
  email: string,
  propertyTitle: string,
  propertyAddress: string,
  propertyPrice: string,
  propertyDescription: string,
) => {
  if (!KEYS.email || !KEYS.emailPassword) {
    throw new Error(
      'Email credentials are not set in the environment variables.'
    );
  }
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: KEYS.email,
      pass: KEYS.emailPassword,
    },
  });

const formattedPrice = new Intl.NumberFormat('en-IE', {
  style: 'currency',
  currency: 'EUR',
}).format(Number(propertyPrice));

const htmlContent = `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px;">
    <h1 style="color: #3A0CA3; text-align: center;">Inquiry Confirmation</h1>
    <p style="font-size: 16px; line-height: 1.5;">Hi there,</p>
    <p style="font-size: 16px; line-height: 1.5;">
      Thank you for your inquiry about <strong>${propertyTitle}</strong>.
    </p>
    <p style="font-size: 16px; line-height: 1.5;">
      We have received your message and below are the details of the property you inquired about:
    </p>
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <tr>
        <td style="font-size: 16px; padding: 10px; font-weight: bold; color: #555;">Property Address:</td>
        <td style="font-size: 16px; padding: 10px; color: #333;">${propertyAddress}</td>
      </tr>
      <tr>
        <td style="font-size: 16px; padding: 10px; font-weight: bold; color: #555;">Price:</td>
        <td style="font-size: 16px; padding: 10px; color: #333;">${formattedPrice}</td>
      </tr>
      <tr>
        <td style="font-size: 16px; padding: 10px; font-weight: bold; color: #555;">Description:</td>
        <td style="font-size: 16px; padding: 10px; color: #333;">${propertyDescription}</td>
      </tr>
    </table>
    <p style="font-size: 16px; line-height: 1.5;">
      We will contact you soon with more information. Thank you for choosing Havenly!
    </p>
    <p style="font-size: 16px; line-height: 1.5;">
      If you have any additional questions, please contact us at <a href="mailto:support@yourdomain.com" style="color: #3A0CA3; text-decoration: none;">support@yourdomain.com</a>.
    </p>
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
    <footer style="text-align: center; font-size: 14px; color: #999;">
      <p>
        Havenly Inc., 1234 Street Name, City, State, ZIP Code<br />
        Need help? <a href="mailto:support@yourdomain.com" style="color: #3A0CA3; text-decoration: none;">Contact Support</a>
      </p>
      <p>© 2024 Havenly. All rights reserved.</p>
    </footer>
  </div>
`;


  await transporter.sendMail({
    from: KEYS.email,
    to: email,
    subject: 'Inquiry Confirmation - Havenly',
    html: htmlContent,
  });
};