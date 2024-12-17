// import nodemailer from 'nodemailer';

// export const sendEmail = async (recipientEmail: string, content: string): Promise<void> => {
//   try {
//     // Tạo transporter với cấu hình SMTP
//     const transporter = nodemailer.createTransport({
//       host: 'smtp.gmail.com', // Hoặc SMTP của nhà cung cấp bạn sử dụng
//       port: 587,
//       secure: false, // Sử dụng STARTTLS
//       auth: {
//         user: 'liup20204@gmail.com', // Email của bạn
//         pass: 'hhmedia1@', // Mật khẩu hoặc app password womeik123@

//       },
//     });

//     // Cấu hình thông tin email
//     const mailOptions = {
//       from: '"Your Name" <liup20204@gmail.com>', // Người gửi
//       to: recipientEmail, // Người nhận
//       subject: 'Thông báo từ hệ thống', // Tiêu đề email
//       text: content, // Nội dung văn bản thuần
//       html: `<p>${content}</p>`, // Nội dung HTML (tùy chọn)
//     };

//     // Gửi email
//     const info = await transporter.sendMail(mailOptions);

//     console.log(`Email sent: ${info.messageId}`);
//   } catch (error) {
//     console.error('Error sending email:', error);
//     throw new Error('Failed to send email');
//   }
// };

import nodemailer from "nodemailer";

export async function sendEmail(
    to: string,
    subject: string,
    text: string,
    html?: string
): Promise<void> {
    try {
        // Cấu hình transporter (SMTP server)
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com", // SMTP server (ví dụ: Gmail)
            port: 587, // Port cho giao thức SMTP
            secure: false, // False nếu không dùng SSL/TLS
            auth: {
        user: 'liup20204@gmail.com', // Email của bạn
        pass: 'hhmedia1@', // Mật khẩu hoặc app password womeik123@
            },
        });

        // Cấu hình nội dung email
        const mailOptions = {
            from: '"Your Name" <your-email@gmail.com>', // Tên người gửi
            to, // Email người nhận
            subject, // Chủ đề email
            text, // Nội dung email dạng text
            html, // Nội dung email dạng HTML (tùy chọn)
        };

        // Gửi email
        const info = await transporter.sendMail(mailOptions);

        console.log("Email sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Unable to send email");
    }
}
