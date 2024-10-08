import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: 'dff41b63d27ef8',
    pass: '45a9a45b9b6daf',
  },
});

// Function to send a verification email
export const sendVerificationEmail = async (to: string, verificationUrl: string) => {
  try {
    await transporter.sendMail({
      from: '"Your App Name" <no-reply@yourapp.com>',
      to,
      subject: 'Verify Your Email',
      html: `<p>Please click the link below to verify your email:</p><a href="${verificationUrl}">${verificationUrl}</a>`,
    });
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Error sending verification email');
  }
};


export const sendPasswordResetEmail = async (to: string, token: string) => {
  const resetUrl = `http://localhost:3000/reset-password?token=${token}`;
  const mailOptions = {
    to,
    from: '"Your App Name" <no-reply@yourapp.com>',
    subject: 'Password Reset',
    text: `Please reset your password by clicking the following link: ${resetUrl}`,
  };

  await transporter.sendMail(mailOptions);
};