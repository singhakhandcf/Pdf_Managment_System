import nodemailer from 'nodemailer';

export const sendOtpEmail = async (toEmail: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // your email
      pass: process.env.EMAIL_PASS, // app password
    },
  });

  await transporter.sendMail({
    from: `"PDF Collaboration" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Please find your OTP for reseting password`,
    html: `
      <h1>your OTP is:  ${otp}</h1>
      
    `,
  });
};
