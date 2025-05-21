import nodemailer from 'nodemailer';

export const sendShareEmail = async (toEmail: string, pdfLink: string, senderName: string) => {
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
    subject: `${senderName} shared a PDF with you`,
    html: `
      <h3>You’ve been invited to view a PDF</h3>
      <p>${senderName} has shared a PDF with you. Click the link below to view:</p>
      <a href="${pdfLink}">${pdfLink}</a>
    `,
  });
};
