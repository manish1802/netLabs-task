import React from 'react';
import { Button } from 'react-bootstrap';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function ExportButtons() {
  const downloadPDF = () => {
    const report = document.getElementById('report');
    html2canvas(report).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 0, 0);
      pdf.save('report.pdf');
    });
  };

  return <Button variant="danger" onClick={downloadPDF} className="mt-3">Download Entire Report as PDF</Button>;
}

export default ExportButtons;
