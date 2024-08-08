
const PDFDocument = require('pdfkit');
const path = require('path');
 
const generatePDF = (invoice) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });
    doc.on('error', (err) => {
      reject(err);
    });

    doc.fontSize(25).text('INVOICE', { align: 'center' });
    doc.moveDown(1);

    // Company details
    const leftMargin = 50; // Decreased the margin to move content further to the left
    doc.fontSize(12)
    doc.text('Aptitude Guru Hem', leftMargin);
    doc.text('ADDRESS', leftMargin);
    doc.text('Aptitude Guru Hem, Chennai, Tamil Nadu', leftMargin);
    doc.text('PHONE: +91 9176120906', leftMargin);
    doc.text('EMAIL: https://www.aptitudeguru.in/', leftMargin);

    // Logo (assuming you have a way to add images)
    // doc.image('./logo.jpeg', 450, 50, { width: 100 });
     // Add the logo image to the PDF
     const logoPath = path.join(__dirname, 'logo.jpeg'); // Logo path in the same folder
     doc.image(logoPath, 385, 120, { width: 180 });

    doc.moveDown(1);
 
    //add an horizantal line here
       // Add a horizontal line
       doc.moveTo(50, doc.y)  // Start at the left margin
       .lineTo(550, doc.y) // End at the right margin
       .stroke();          // Draw the line
    doc.moveDown(1);
    // Set smaller heading font size
    const headingFontSize = 12;
    const normalFontSize = 11;

    doc.fontSize(headingFontSize);

    // Invoice details
    doc.text(`INVOICE: ${invoice.invoiceNumber}`, 50, doc.y);
    doc.text(`INVOICE DATE: ${invoice.createdAt.toLocaleDateString()}`, 50, doc.y); // Placed directly below the previous text

    // Customer details
    doc.moveDown(); // Slightly separate invoice details from customer details
    doc.fontSize(normalFontSize);
    doc.text('BILL TO:', 50, doc.y);
    doc.text(`USER NAME: ${invoice.user.name}`, 50, doc.y); // Directly below "BILL TO:"
    doc.text(`EMAIL: ${invoice.user.email}`, 50, doc.y); // Directly below user name
    doc.text(`PURCHASE DATE: ${invoice.createdAt.toLocaleDateString()}`, 50, doc.y); // Directly below email
    doc.text(`GST NUMBER: ${invoice.user.gstNumber}`, 50, doc.y); // Directly below purchase date


    doc.moveDown(1);


    // Table
    // const startY = 350;
  
    // doc.rect(50, startY, 500, 20).stroke();
    // doc.text('QUANTITY', 60, startY + 5);
    // doc.text('PLAN', 150, startY + 5);
    // doc.text('AMOUNT', 480, startY + 5);

    // // Table content
    // doc.rect(50, startY + 20, 500, 20).stroke();
    // doc.text('1', 60, startY + 25);
    // doc.text(`${invoice.planDetails}`, 150, startY + 25);
    // doc.text(`${invoice.amount.toFixed(2)}`, 480, startY + 25);

// Table Header with Background Color and Text Color
      const startY = 350;

      // Table Header with Background Color and Text Color
      doc
        .rect(50, startY, 500, 20)
        .fillAndStroke('#1c395c', '#1c395c'); // Background color for header

      doc
        .fillColor('#ffffff') // Text color for header
        .text('QUANTITY', 60, startY + 5)
        .text('PLAN', 150, startY + 5)
        .text('AMOUNT', 480, startY + 5);

      // Draw column dividing lines for header
      doc
        .moveTo(140, startY)
        .lineTo(140, startY + 20)
        .stroke('#ffffff'); // Line color

      doc
        .moveTo(460, startY)
        .lineTo(460, startY + 20)
        .stroke('#ffffff'); // Line color

      // Table Content with Box Borders
      doc
        .fillColor('#000000') // Reset text color to black for content
        .rect(50, startY + 20, 90, 20) // Border for 'QUANTITY'
        .stroke()
        .text('1', 60, startY + 25);

      doc
        .rect(140, startY + 20, 320, 20) // Border for 'PLAN'
        .stroke()
        .text(`${invoice.planDetails}`, 150, startY + 25);

      doc
        .rect(460, startY + 20, 90, 20) // Border for 'AMOUNT'
        .stroke()
        .text(`${invoice.amount.toFixed(2)}`, 480, startY + 25);

      // Draw column dividing lines for content row
      doc
        .moveTo(140, startY + 20)
        .lineTo(140, startY + 40)
        .stroke();

      doc
        .moveTo(460, startY + 20)
        .lineTo(460, startY + 40)
        .stroke();

    doc.moveDown(4);

    // Totals
    const totalsStartY = doc.y;
    doc.text(`AMOUNT: ₹${invoice.amount.toFixed(2)}`, 400, totalsStartY);
    doc.text(`GST (18%): ₹${invoice.gstAmount.toFixed(2)}`, 400, totalsStartY + 20);
    doc.text(`TOTAL: ₹${invoice.totalAmount.toFixed(2)}`, 400, totalsStartY + 40);

    // Terms & Conditions
    doc.moveDown(5);
    doc.rect(50, doc.y, 500, 80).stroke();
    doc.fontSize(12).text('TERMS & CONDITIONS:', 60, doc.y + 10);
    doc.text('1. Please make payment within 15 days from the invoice date.');
    doc.text('2. Late payments may incur additional charges.');
    doc.text('3. For any queries, please contact us at the provided phone number or email.');

    doc.moveDown(4);

    // Thank you note
    doc.fontSize(14).text('THANK YOU FOR YOUR PURCHASE! :)', { align: 'center' });


    doc.end();
  });
};

module.exports = { generatePDF };
