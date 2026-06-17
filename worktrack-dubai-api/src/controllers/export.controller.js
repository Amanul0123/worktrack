const adminService = require('../services/admin.service');
const asyncHandler = require('../utils/asyncHandler');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

const exportReport = asyncHandler(async (req, res) => {
  const { format = 'xlsx', ...filters } = req.query;
  const users = await adminService.exportData(filters);

  if (format === 'xlsx') {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Users');
    sheet.columns = [
      { header: 'Full Name', key: 'fullName', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Country', key: 'country', width: 15 },
      { header: 'City', key: 'city', width: 15 },
      { header: 'Mobile', key: 'mobile', width: 18 },
      { header: 'Status', key: 'isActive', width: 12 },
      { header: 'Total Tasks', key: 'tasksTotal', width: 13 },
      { header: 'Completed Tasks', key: 'tasksCompleted', width: 17 },
      { header: 'Joined', key: 'createdAt', width: 20 },
    ];

    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFC9A227' } };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0A0E1C' } };

    users.forEach((u) => {
      sheet.addRow({
        ...u,
        isActive: u.isActive ? 'Active' : 'Inactive',
        createdAt: new Date(u.createdAt).toLocaleDateString(),
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="worktrack-users-${Date.now()}.xlsx"`);
    await workbook.xlsx.write(res);
    return res.end();
  }

  if (format === 'pdf') {
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 36 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="worktrack-users-${Date.now()}.pdf"`);
    doc.pipe(res);

    // Title
    doc.fontSize(20).fillColor('#C9A227').text('WorkTrack Dubai — Users Report', { align: 'left' });
    doc.fontSize(10).fillColor('#8B93A7').text(`Generated ${new Date().toLocaleString()}`, { align: 'left' });
    doc.moveDown();

    // Table header
    const headers = ['Full Name', 'Email', 'Country', 'City', 'Status', 'Total Tasks', 'Completed'];
    const colWidths = [130, 170, 80, 80, 60, 80, 80];
    let x = doc.page.margins.left;
    const y = doc.y;

    doc.rect(x, y, colWidths.reduce((a, b) => a + b, 0), 20).fillColor('#0A0E1C').fill();

    headers.forEach((h, i) => {
      doc.fontSize(9).fillColor('#C9A227').text(h, x + 4, y + 6, { width: colWidths[i], lineBreak: false });
      x += colWidths[i];
    });

    doc.y = y + 22;
    doc.x = doc.page.margins.left;

    // Table rows
    users.forEach((u, rowIdx) => {
      const rowY = doc.y;
      if (rowIdx % 2 === 0) {
        doc.rect(doc.page.margins.left, rowY, colWidths.reduce((a, b) => a + b, 0), 18).fillColor('#F9F9F9').fill();
      }
      const cells = [
        u.fullName, u.email, u.country || '-', u.city || '-',
        u.isActive ? 'Active' : 'Inactive', String(u.tasksTotal), String(u.tasksCompleted),
      ];
      let cx = doc.page.margins.left;
      cells.forEach((cell, i) => {
        doc.fontSize(8).fillColor('#131A2C').text(String(cell), cx + 4, rowY + 5, { width: colWidths[i] - 6, lineBreak: false });
        cx += colWidths[i];
      });
      doc.y = rowY + 20;
    });

    doc.end();
    return;
  }

  res.status(400).json({ error: 'Invalid format. Use ?format=xlsx or ?format=pdf' });
});

module.exports = { exportReport };
