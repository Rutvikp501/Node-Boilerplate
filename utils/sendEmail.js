import nodemailer from 'nodemailer';

export const sendMailWithAttachment = async (to, subject, text, attachmentBuffer, filename = 'attachment.txt') => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_USER,
    to,
    subject,
    text,
    attachments: [
      {
        filename,
        content: attachmentBuffer,
      }
    ]
  };

  await transporter.sendMail(mailOptions);
};
