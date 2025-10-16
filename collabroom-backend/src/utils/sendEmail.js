import nodemailer from "nodemailer";
import dotenv from "dotenv";

export const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASS,
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

