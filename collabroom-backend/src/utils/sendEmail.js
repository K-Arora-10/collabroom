import nodemailer from "nodemailer";
import dotenv from "dotenv";

export const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: "collabroom.team@gmail.com",
        pass: "bskX9DWZIJUGzjT",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });


  const mailOptions = {
    from: `"CollabRoom" <${process.env.EMAIL}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

