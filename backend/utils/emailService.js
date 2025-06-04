const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

exports.sendVerificationEmail = async (email, verificationToken) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
  
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Verify your email address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2c5282;">Email Verification</h1>
        <p>Thank you for registering with ClothConnect. Please click the button below to verify your email address:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #2c5282; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Verify Email Address</a>
        </div>
        <p>Or copy and paste this URL into your browser:</p>
        <p style="word-break: break-all; color: #4a5568;">${verificationUrl}</p>
        <p><strong>This link will expire in 24 hours.</strong></p>
        <p>If you didn't create an account with us, you can safely ignore this email.</p>
      </div>
    `
  });
};

exports.sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2c5282;">Password Reset Request</h1>
        <p>You requested to reset your password. Click the button below to proceed:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #2c5282; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Reset Password</a>
        </div>
        <p><strong>This link will expire in 10 minutes.</strong></p>
        <p>If you didn't request this reset, please ignore this email and ensure your account is secure.</p>
        <hr style="margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">For security reasons, never share this link with anyone.</p>
      </div>
    `
  });
};

exports.sendPasswordChangeConfirmation = async (email) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Password Successfully Changed',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2c5282;">Password Changed Successfully</h1>
        <p>Your password has been successfully changed.</p>
        <p>If you did not make this change, please contact our support team immediately.</p>
      </div>
    `
  });
};

exports.sendTwoFactorAuthCode = async (email, code) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Your Two-Factor Authentication Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2c5282;">Two-Factor Authentication Code</h1>
        <p>Your verification code is:</p>
        <div style="text-align: center; margin: 30px 0;">
          <h2 style="letter-spacing: 8px; font-size: 32px;">${code}</h2>
        </div>
        <p>This code will expire in 5 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      </div>
    `
  });
};