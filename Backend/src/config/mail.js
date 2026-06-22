import nodemailer from "nodemailer";



const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // 587 ke liye false
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS available:", !!process.env.EMAIL_PASS);

transporter.verify(function (error, success) {
    if (error) {
        console.log("SMTP Error:", error);
    } else {
        console.log("SMTP Server is ready");
    }
});

export default transporter;