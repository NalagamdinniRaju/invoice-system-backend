const Invoice = require('../models/Invoice');
const User = require('../models/User');
const pdfGenerator = require('../utils/pdfGenerator');

const generateInvoice = async (userId, planDetails, amount) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const gstRate = 0.18; // 18% GST
  const gstAmount = amount * gstRate;
  const totalAmount = amount + gstAmount;

  const invoice = new Invoice({
    user: userId,
    invoiceNumber: generateInvoiceNumber(),
    planDetails,
    amount,
    gstAmount,
    totalAmount
  });

  await invoice.save();
  return invoice;
};

const generateInvoicePDF = async (invoice) => {
  return pdfGenerator.generatePDF(invoice);
};

const generateInvoiceNumber = () => {
  return `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

module.exports = {
  generateInvoice,
  generateInvoicePDF
};