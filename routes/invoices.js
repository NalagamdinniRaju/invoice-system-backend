const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const invoiceService = require('../services/invoiceService');
const emailService = require('../services/emailService');

// Get all invoices for a user
router.get('/:userId', async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Download an invoice
router.get('/:invoiceId/download', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.invoiceId).populate('user');
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    const pdfBuffer = await invoiceService.generateInvoicePDF(invoice);
    res.contentType('application/pdf');
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate a new invoice
router.post('/generate', async (req, res) => {
    try {
      const { userId, planDetails, amount } = req.body;
      const invoice = await invoiceService.generateInvoice(userId, planDetails, amount);
      res.status(201).json(invoice);
    } catch (error) {
      console.error('Invoice generation error:', error);
      res.status(400).json({ message: error.message });
    }
  });

module.exports = router;