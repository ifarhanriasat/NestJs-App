// src/utils/email.utility.ts
import * as nodemailer from 'nodemailer';

export async function sendVerificationEmail(to: string, token: string): Promise<void> {
    const transporter = nodemailer.createTransport({
        host: 'email-smtp.us-east-1.amazonaws.com', // your AWS SES region
        port: 465, // or 587
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.AWS_SES_USER, // AWS SES SMTP username
            pass: process.env.AWS_SES_PASS, // AWS SES SMTP password
        },
    });

    const verificationUrl = `${process.env.APP_URL}/auth/verify-email?token=${token}`;

    const mailOptions = {
        from: process.env.EMAIL_FROM, // Your verified email
        to: to,
        subject: 'Email Verification',
        html: `<p>Please verify your email by clicking on the following link:</p><p><a href="${verificationUrl}">${verificationUrl}</a></p>`,
    };

    await transporter.sendMail(mailOptions);
}
