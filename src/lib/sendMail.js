import nodemailer from "nodemailer";
import Order from "@/models/Order";

export const sendOrderConfirmationEmail = async (
  userEmail,
  orderId
) => {
  try {
    const order = await Order.findById(orderId)
      .populate({
        path: "items.imageId"
      })
      .exec();

    if (!order) {
      throw new Error("Order not found");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail", // You can also use other services like "smtp"
      auth: {
        user: process.env.EMAIL_USERNAME, // Your email address
        pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: userEmail,
      subject: "Your Order Confirmation - PixHorizon",
      html: `
        <h1>Thank you for your order!</h1>
        <p>Your order has been successfully processed.</p>
        <h2>Order Details:</h2>
        <ul>
          ${order.items
            .map(
              (item) =>
                `<li><strong>${item.imageId.title}</strong> - $${item.imageId.price}</li>`
            )
            .join("")}
        </ul>
        <p>Click the links below to download your images:</p>
        <ul>
          ${order.items
            .map(
              (item) =>
                `<li><strong>${item.imageId.title}</strong> - <a href="${item.imageId.src}" target="_blank">Download Image</a></li>`
            )
            .join("")}
        </ul>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Order confirmation email sent successfully.");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
