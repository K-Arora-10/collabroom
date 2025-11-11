import nodemailer from "nodemailer";
import dotenv from "dotenv";

export const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: "9b47e2001@smtp-brevo.com",
        pass: "vCFhW0SpIJGx1A4w",
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

