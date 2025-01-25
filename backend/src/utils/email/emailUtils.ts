import { IUser } from '@components/user/models/userModel';
import { KEYS } from 'config/config';
import { randomBytes } from 'crypto';
import nodemailer from 'nodemailer';
import { emailStyles } from './emailStyles';

const sendResetPasswordEmail = async (
  email: string,
  resetPasswordToken: string
) => {
  const resetUrl = `${process.env.WEB_APP_LINK}/forgot-password/${resetPasswordToken}`;

  // Create reusable transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: KEYS.email,
      pass: KEYS.emailPassword,
    },
  });

  const htmlText = `
  <div style="${emailStyles.container}">
    <h1 style="${emailStyles.header}">Reset Your Password</h1>
    <p style="${emailStyles.paragraph}">Hi there,</p>
    <p style="${emailStyles.paragraph}">
      You have requested to reset your password for your Havenly account. Please use the link below to reset your password.
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" style="${emailStyles.button}">
        Reset Password
      </a>
    </div>
    <p style="${emailStyles.paragraph}">
      This link will expire in 1 hour. If you did not request a password reset, please ignore this email.
    </p>
    <footer style="${emailStyles.footer}">
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
    text: `Please click the following link to reset your password: ${resetUrl}`,
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
  <div style="${emailStyles.container}">
    <h1 style="${emailStyles.header}">Welcome to Havenly!</h1>
    <p style="${emailStyles.paragraph}">Hi there,</p>
    <p style="${emailStyles.paragraph}">
      Thank you for joining Havenly! We're excited to have you on board. Please use the verification code below to confirm your email address:
    </p>
    <div style="text-align: center; margin: 20px 0;">
      <span style="font-size: 24px; font-weight: bold; color: #3A0CA3; padding: 10px 20px; border: 1px dashed #3A0CA3; border-radius: 5px;">
        ${code}
      </span>
    </div>
    <p style="${emailStyles.paragraph}">
      If you didn't create this account, you can safely ignore this email.
    </p>
    <div style="text-align: center; margin-top: 30px;">
      <a href="https://havenly-chdr.onrender.com/api/auth/verify?email=${email}&code=${code}" style="${emailStyles.button}">Verify Email</a>
    </div>
    <footer style="${emailStyles.footer}">
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
  userEmail: string,
  propertyTitle: string,
  propertyAddress: string,
  propertyPrice: string,
  propertyDescription: string,
  companyEmail: string, // New parameter for company email
  userName: string
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

  // Format the price
  const formattedPrice = new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
  }).format(Number(propertyPrice));

  // Email content for the user
  const userHtmlContent = `
  <div style="${emailStyles.container}">
    <h1 style="${emailStyles.header}">Inquiry Confirmation</h1>
    <p style="${emailStyles.paragraph}">Hi ${userName},</p>
    <p style="${emailStyles.paragraph}">
      Thank you for your inquiry about <strong>${propertyTitle}</strong>.
    </p>
    <p style="${emailStyles.paragraph}">
      We have received your message and below are the details of the property you inquired about:
    </p>
    <table style="${emailStyles.table}">
      <tr>
        <td style="${emailStyles.tableCell} ${emailStyles.tableCellHeader}">Property Address:</td>
        <td style="${emailStyles.tableCell}">${propertyAddress}</td>
      </tr>
      <tr>
        <td style="${emailStyles.tableCell} ${emailStyles.tableCellHeader}">Price:</td>
        <td style="${emailStyles.tableCell}">${formattedPrice}</td>
      </tr>
      <tr>
        <td style="${emailStyles.tableCell} ${emailStyles.tableCellHeader}">Description:</td>
        <td style="${emailStyles.tableCell}">${propertyDescription}</td>
      </tr>
    </table>
    <p style="${emailStyles.paragraph}">
      We will contact you soon with more information. Thank you for choosing Havenly!
    </p>
    <p style="${emailStyles.paragraph}">
      If you have any additional questions, please contact us at <a href="mailto:support@yourdomain.com" style="color: #3A0CA3; text-decoration: none;">support@yourdomain.com</a>.
    </p>
    <footer style="${emailStyles.footer}">
      <p>
        Havenly Inc., 1234 Street Name, City, State, ZIP Code<br />
        Need help? <a href="mailto:support@yourdomain.com" style="color: #3A0CA3; text-decoration: none;">Contact Support</a>
      </p>
      <p>© 2024 Havenly. All rights reserved.</p>
    </footer>
  </div>
`;

  // Email content for the property owner
  const ownerHtmlContent = `
  <div style="${emailStyles.container}">
    <h1 style="${emailStyles.header}">New Inquiry Received</h1>
    <p style="${emailStyles.paragraph}">Hello,</p>
    <p style="${emailStyles.paragraph}">
      You have received a new inquiry from <strong>${userName}</strong>.
    </p>
    <p style="${emailStyles.paragraph}">
      Below are the details of the inquiry:
    </p>
    <table style="${emailStyles.table}">
      <tr>
        <td style="${emailStyles.tableCell} ${emailStyles.tableCellHeader}">User Name:</td>
        <td style="${emailStyles.tableCell}">${userName}</td>
      </tr>
      <tr>
        <td style="${emailStyles.tableCell} ${emailStyles.tableCellHeader}">User Email:</td>
        <td style="${emailStyles.tableCell}">${userEmail}</td>
      </tr>
      <tr>
        <td style="${emailStyles.tableCell} ${emailStyles.tableCellHeader}">Property Title:</td>
        <td style="${emailStyles.tableCell}">${propertyTitle}</td>
      </tr>
      <tr>
        <td style="${emailStyles.tableCell} ${emailStyles.tableCellHeader}">Property Address:</td>
        <td style="${emailStyles.tableCell}">${propertyAddress}</td>
      </tr>
      <tr>
        <td style="${emailStyles.tableCell} ${emailStyles.tableCellHeader}">Price:</td>
        <td style="${emailStyles.tableCell}">${formattedPrice}</td>
      </tr>
      <tr>
        <td style="${emailStyles.tableCell} ${emailStyles.tableCellHeader}">Description:</td>
        <td style="${emailStyles.tableCell}">${propertyDescription}</td>
      </tr>
    </table>
    <p style="${emailStyles.paragraph}">
      Please follow up with <strong>${userName}</strong> at their email address <a href="mailto:${userEmail}" style="color: #3A0CA3; text-decoration: none;">${userEmail}</a>.
    </p>
    <footer style="${emailStyles.footer}">
      <p>
        Havenly Inc., 1234 Street Name, City, State, ZIP Code<br />
        Need help? <a href="mailto:support@yourdomain.com" style="color: #3A0CA3; text-decoration: none;">Contact Support</a>
      </p>
      <p>© 2024 Havenly. All rights reserved.</p>
    </footer>
  </div>
  `;

  // Send email to the user
  await transporter.sendMail({
    from: KEYS.email,
    to: userEmail,
    subject: 'Inquiry Confirmation - Havenly',
    html: userHtmlContent,
  });

  // Send email to the property owner
  await transporter.sendMail({
    from: KEYS.email,
    to: companyEmail, // Send email to the company (owner of the property)
    subject: `Inquiry for ${propertyTitle} - Havenly`,
    html: ownerHtmlContent,
  });
};

export const sendAdminUpdatePinEmail = async (
  email: string,
  pin: string,
  name: string
) => {
  // Create reusable transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: KEYS.email,
      pass: KEYS.emailPassword,
    },
  });

  // Define styled HTML content with personalized greeting
  const htmlText = `
  <div style="${emailStyles.container}">
    <h1 style="${emailStyles.header}">Profile Update PIN</h1>
    <p style="${emailStyles.paragraph}">Hi ${name},</p>
    <p style="${emailStyles.paragraph}">
      A request to update your profile has been initiated. Use the PIN code below to confirm the update.
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <p style="${emailStyles.button}">
        ${pin}
      </p>
    </div>
    <p style="${emailStyles.paragraph}">
      If you did not request this action, please contact support immediately.
    </p>
    <footer style="${emailStyles.footer}">
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
    subject: 'Profile Update PIN',
    text: `Your PIN for confirming profile update is: ${pin}`,
    html: htmlText, // Use the inline styled HTML content
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sendChatSummaryEmail = async (chat: any) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: KEYS.email,
      pass: KEYS.emailPassword,
    },
  });

  // Chat participants
  const userEmails = chat.users
    .map((user: IUser) => `${user.firstName} ${user.lastName} <${user.email}>`)
    .join(', ');
  const adminEmail = `<${chat.adminId.email}>`;
  const agentDetails = chat.propertyId?.agent
    ? `${chat.propertyId.agent.name} (${chat.propertyId.agent.contact})`
    : 'N/A';

  // Format messages
  const messageList = chat.messages
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((msg: any) => {
      // Determine if the message is from a user or the agent
      const isUser = chat.users.some(
        (user: IUser) => user.firstName === msg.senderName
      );
      const containerStyle = isUser
        ? `${emailStyles.chatSummary.messageContainer} ${emailStyles.chatSummary.userMessageContainer}`
        : `${emailStyles.chatSummary.messageContainer} ${emailStyles.chatSummary.agentMessageContainer}`;
      const senderStyle = isUser
        ? emailStyles.chatSummary.userMessageSender
        : emailStyles.chatSummary.agentMessageSender;

      return `
        <div style="${containerStyle}">
          <span style="${
            emailStyles.chatSummary.messageSender
          } ${senderStyle}">${msg.senderName}</span>
          <span style="${emailStyles.chatSummary.messageTimestamp}">
            (${new Date(msg.timestamp).toLocaleString()})
          </span>
          <p style="${emailStyles.chatSummary.messageContent}">${
        msg.content
      }</p>
        </div>`;
    })
    .join('');

  const emailContent = `
    <div style="${emailStyles.chatSummary.container}">
      <h1 style="${emailStyles.chatSummary.header}">Chat Summary</h1>
      <p style="${emailStyles.paragraph}">The chat has been closed. Below is the summary:</p>
      
      <h2 style="${emailStyles.chatSummary.sectionHeader}">Participants</h2>
      <ul style="${emailStyles.chatSummary.participantList}">
        <li style="${emailStyles.chatSummary.participantItem}"><strong>User:</strong> ${userEmails}</li>
        <li style="${emailStyles.chatSummary.participantItem}"><strong>Agent:</strong> ${agentDetails}</li>
      </ul>
      
      <h2 style="${emailStyles.chatSummary.sectionHeader}">Messages</h2>
      ${messageList}
      
      <p style="${emailStyles.paragraph}">If you have further inquiries, feel free to contact us.</p>
      
      <footer style="${emailStyles.chatSummary.footer}">
        <p>Havenly Inc., 1234 Street Name, City, State, ZIP Code</p>
        <p>Need help? <a href="mailto:support@yourdomain.com" style="color: #3A0CA3; text-decoration: none;">Contact Support</a></p>
        <p>© 2024 Havenly. All rights reserved.</p>
      </footer>
    </div>
  `;

  // Send emails to all participants
  const mailOptions = {
    from: KEYS.email,
    to: [adminEmail, ...chat.users.map((user: IUser) => user.email)],
    subject: 'Chat Summary - Havenly',
    html: emailContent,
  };

  await transporter.sendMail(mailOptions);
};




