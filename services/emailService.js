// const nodemailer = require('nodemailer');
// const pdfGenerator = require('../utils/pdfGenerator');

// const transporter = nodemailer.createTransport({
//   // Configure your email service here
//   host: 'smtp.gmail.com',
//   port: 587,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

// const sendInvoiceEmail = async (invoice) => {
//   const pdfBuffer = await pdfGenerator.generatePDF(invoice);

//   const mailOptions = {
//     from: 'nalagamdinniraju@gmail.com',
//     to: invoice.user.email,
//     subject: `Your Invoice #${invoice.invoiceNumber}`,
//     text: `Dear ${invoice.user.name},

// Your invoice #${invoice.invoiceNumber} has been generated for the plan: ${invoice.planDetails}.

// Total amount: $${invoice.totalAmount}

// You can download the invoice from your portal or find it attached to this email.

// Thank you for your business!

// Best regards,
// Your Company Name`,
//     attachments: [
//       {
//         filename: `invoice-${invoice.invoiceNumber}.pdf`,
//         content: pdfBuffer
//       }
//     ]
//   };

//   await transporter.sendMail(mailOptions);
// };

// module.exports = {
//   sendInvoiceEmail
// };
const nodemailer = require('nodemailer');
const pdfGenerator = require('../utils/pdfGenerator');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendInvoiceEmail = async (invoice) => {
  try {
    const pdfBuffer = await pdfGenerator.generatePDF(invoice);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: invoice.user.email,
      subject: `Your Invoice #${invoice.invoiceNumber}`,
      text: `Dear ${invoice.user.name},

Your invoice #${invoice.invoiceNumber} has been generated for the plan: ${invoice.planDetails}.

Total amount: $${invoice.totalAmount}

You can download the invoice from your portal or find it attached to this email.

Thank you for your business!

Best regards,
Your Company Name`,
      attachments: [
        {
          filename: `invoice-${invoice.invoiceNumber}.pdf`,
          content: pdfBuffer
        }
      ]
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${invoice.user.email}`);
  } catch (error) {
    console.error(`Error sending email to ${invoice.user.email}: `, error);
    throw new Error('Failed to send email');
  }
};

module.exports = {
  sendInvoiceEmail
};
