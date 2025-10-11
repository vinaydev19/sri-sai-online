// src/utils/InvoiceGenerator.js
import jsPDF from 'jspdf';
import { autoTable } from 'jspdf-autotable';

export const generateInvoice = (customer) => {
    if (!customer) return;

    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const today = new Date();
    const invoiceDate = `${today.getDate()} ${today.toLocaleString('default', { month: 'short' })} ${today.getFullYear()}`;


    // === Header ===
    doc.setFontSize(18);
    doc.setFont("Sri Sai Online Seva", "bold");
    doc.text("TAX INVOICE", pageWidth - 50, 20);

    doc.setFontSize(14);
    doc.text("Sri Sai Online Seva", 14, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("388, below Machha Murali Office, near Ram Mandir Road, Padma Nagar", 14, 26);
    doc.text("Bhiwandi, Maharashtra 421305", 14, 31);
    // doc.text("GSTIN: 27DMIHJ3051C3Z5", 14, 36);
    doc.text("Email: srisai20147@gmail.com", 14, 36);
    doc.text("Phone: +91 8080555795", 14, 41);
    doc.text("Office Phone: +91 9028656995", 14, 46);
    doc.text("Website: www.getswipe.in", 14, 51);

    // === Bill To ===
    doc.setFont("helvetica", "bold");
    doc.text("Bill To:", 14, 62);
    doc.setFont("helvetica", "normal");
    doc.text(customer.fullName || "-", 14, 67);
    doc.text(`Mobile: ${customer.mobileNumber || "-"}`, 14, 72);
    doc.text("Bhiwandi, Maharashtra 421305", 14, 82);

    // === Invoice Info ===
    const rightStart = pageWidth - 80;
    doc.setFont("helvetica", "bold");
    doc.text("Invoice Date:", rightStart, 62);
    doc.text("Due Date:", rightStart, 67);
    doc.text("Invoice #:", rightStart, 72);
    doc.text("Place of Supply:", rightStart, 77);

    doc.setFont("helvetica", "normal");
    doc.text(invoiceDate, rightStart + 30, 62);
    doc.text(customer.customerId || "INV-47", rightStart + 30, 72);

    // === Table ===
    const tableColumn = ["#", "Item", "Application Number", "Rate", "Qty", "Amount"];
    const tableRows = customer.selectedServices.map((s, index) => [
        index + 1,
        s.serviceName,
        s.applicationNumber || "-",
        s.serviceAmount.toLocaleString(),
        s.quantity || 1,
        (s.serviceAmount * (s.quantity || 1)).toLocaleString(),
    ]);

    autoTable(doc, {
        startY: 90,
        head: [tableColumn],
        body: tableRows,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [40, 60, 150] },
        columnStyles: { 0: { halign: "center", cellWidth: 10 } },
    });

    const finalY = doc.lastAutoTable.finalY + 6;

    // === Totals ===
    const taxableAmount = customer.totalAmount || 0;
    const paidAmount = customer.paidAmount || 0;       // add paid amount
    const dueAmount = taxableAmount - paidAmount;      // calculate due amount

    const total = taxableAmount.toFixed(2);
    const paid = paidAmount.toFixed(2);
    const due = dueAmount.toFixed(2);

    doc.setFont("helvetica", "bold");
    doc.text(`Total: Rs.${total}`, 130, finalY);
    doc.text(`Paid Amount: Rs.${paid}`, 130, finalY + 8);
    doc.text(`Due Amount: Rs.${due}`, 130, finalY + 16);



    // === Notes ===
    doc.setFont("helvetica", "bold");
    doc.text("Notes:", 14, finalY + 30);
    doc.setFont("helvetica", "normal");
    doc.text("Thank you for the business!", 14, finalY + 35);

    // === Footer ===
    doc.line(14, 285, pageWidth - 14, 285);
    doc.setFontSize(8);
    doc.text("This is a digitally signed document", 14, 290);

    // === Save ===
    doc.save(`Invoice_${customer.customerId || customer.fullName}.pdf`);
};
