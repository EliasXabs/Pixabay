// utils/emailQueue.ts
import Queue from 'bull';
import { sendVerificationEmail, sendPasswordResetEmail } from './emailUtils.js';

interface EmailJobData {
  email: string;
  verificationUrl?: string;
  resetToken?: string;
}

const emailQueue = new Queue<EmailJobData>('emailQueue', {
  redis: {
    host: '127.0.0.1',
    port: 6379,
  },
});

emailQueue.process(async (job) => {
  const { email, verificationUrl, resetToken } = job.data;
  
  try {
    if (verificationUrl) {
      console.log(`Sending verification email to ${email}`);
      await sendVerificationEmail(email, verificationUrl);
    } else if (resetToken) {
      console.log(`Sending password reset email to ${email}`);
      await sendPasswordResetEmail(email, resetToken);
    }
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
});

export const enqueueVerificationEmail = (email: string, verificationUrl: string) => {
  emailQueue.add({ email, verificationUrl });
};

export const enqueuePasswordResetEmail = (email: string, resetToken: string) => {
  emailQueue.add({ email, resetToken });
};
