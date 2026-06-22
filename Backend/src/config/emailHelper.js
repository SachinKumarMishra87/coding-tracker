import resend from "../config/resend.js";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const data = await resend.emails.send({
      from: "LeetPatTracker <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    });

    return data;
  } catch (error) {
    console.log("Resend error:", error);
    throw error;
  }
};