const PDFDocument = require('pdfkit');

const generateTicketPDF = (ticket, fixture) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: [400, 600], margin: 20 });
    const buffers = [];
    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    doc.rect(0, 0, 400, 600).fill('#0A0A0A');
    doc.rect(20, 20, 360, 560).lineWidth(2).stroke('#00C853');

    doc.fillColor('#00C853').font('Helvetica-Bold').fontSize(24).text('NAIROBI CELTICS FC', { align: 'center' });
    doc.moveDown(0.5);
    doc.fillColor('#FFFFFF').fontSize(10).text('OFFICIAL MATCH TICKET', { align: 'center' });
    doc.moveDown(1);

    doc.fillColor('#00C853').fontSize(14).text('VS', { align: 'center' });
    doc.fillColor('#FFFFFF').fontSize(18).font('Helvetica-Bold').text(fixture.opponent, { align: 'center' });
    doc.moveDown(0.5);

    const dateStr = new Date(fixture.date).toLocaleDateString('en-GB', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    });
    doc.fontSize(11).font('Helvetica').fillColor('#CCCCCC').text(`${dateStr} | ${fixture.kickoff}`, { align: 'center' });
    doc.text(fixture.stadium || 'Nairobi Celtics Stadium', { align: 'center' });
    doc.moveDown(1);

    doc.rect(60, doc.y, 280, 80).fill('#111111').stroke('#00C853');
    doc.fillColor('#00C853').fontSize(10).text('SEAT DETAILS', 80, doc.y - 70, { align: 'center' });
    doc.fillColor('#FFFFFF').fontSize(13).font('Helvetica-Bold').text(
      `Zone: ${ticket.seatZoneLabel} | Qty: ${ticket.quantity}`, 60, doc.y + 5, { align: 'center' }
    );
    doc.fontSize(11).font('Helvetica').fillColor('#AAAAAA').text(
      `Ticket Type: ${ticket.ticketType}`, { align: 'center' }
    );
    doc.moveDown(2);

    if (ticket.qrCode) {
      const qrBase64 = ticket.qrCode.replace(/^data:image\/png;base64,/, '');
      doc.image(Buffer.from(qrBase64, 'base64'), 140, doc.y, { width: 120, height: 120 });
      doc.moveDown(6);
    }

    doc.fillColor('#00C853').fontSize(8).font('Helvetica').text(`Booking Ref: ${ticket.bookingRef}`, { align: 'center' });
    doc.fillColor('#666666').fontSize(7).text('Nairobi Celtics FC | Kasarani, Nairobi, Kenya', { align: 'center' });

    doc.end();
  });
};

const generateReceiptPDF = (order) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 30 });
    const buffers = [];
    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#0A0A0A');
    doc.fillColor('#00C853').font('Helvetica-Bold').fontSize(22).text('NAIROBI CELTICS FC', { align: 'center' });
    doc.fillColor('#FFFFFF').fontSize(10).text('ORDER RECEIPT', { align: 'center' });
    doc.moveDown(0.5);
    doc.fillColor('#888888').fontSize(9).text(`Order: ${order.orderNumber}`, { align: 'center' });
    doc.moveDown(1);

    doc.fillColor('#FFFFFF').fontSize(11).font('Helvetica-Bold').text('Items', { underline: true });
    doc.moveDown(0.3);
    doc.font('Helvetica').fontSize(10);
    order.items.forEach((item) => {
      doc.text(`${item.name}${item.size ? ` (${item.size})` : ''} x ${item.quantity} — KES ${(item.price * item.quantity).toLocaleString()}`, { indent: 10 });
    });
    doc.moveDown(1);

    doc.fillColor('#00C853').fontSize(11).font('Helvetica-Bold').text('Order Summary');
    doc.font('Helvetica').fillColor('#FFFFFF').fontSize(10);
    doc.text(`Subtotal: KES ${order.subtotal.toLocaleString()}`);
    doc.text(`Delivery: KES ${order.deliveryFee.toLocaleString()}`);
    if (order.promoDiscount) doc.text(`Discount: -KES ${order.promoDiscount.toLocaleString()}`);
    doc.fillColor('#00C853').font('Helvetica-Bold').fontSize(12).text(`Total: KES ${order.total.toLocaleString()}`);
    doc.moveDown(1);
    doc.fillColor('#00C853').fontSize(10).text(`Payment: ${order.paymentMethod.toUpperCase()} | Ref: ${order.paymentRef || 'N/A'}`, { align: 'center' });
    doc.fillColor('#666666').fontSize(7).text('Thank you for supporting Nairobi Celtics FC!', { align: 'center' });

    doc.end();
  });
};

module.exports = { generateTicketPDF, generateReceiptPDF };
