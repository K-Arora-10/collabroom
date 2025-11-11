import Brevo from "@getbrevo/brevo";

export const sendEmail = async (options) => {
  try {
    const client = new Brevo.TransactionalEmailsApi();
    client.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

    const emailData = {
      sender: { 
        email: process.env.SENDER_EMAIL, 
        name: "CollabRoom"
      },
      to: [{ email: options.to }],
      subject: options.subject,
      htmlContent: options.html
    };

    const response = await client.sendTransacEmail(emailData);
    console.log("Email sent:", response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
