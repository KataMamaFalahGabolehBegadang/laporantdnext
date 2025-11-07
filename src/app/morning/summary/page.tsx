'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface FormData {
  pduStaff: string;
  tdStaff: string;
  transmisiStaff: string[];
  buktiStudio: string;
  buktiStreaming: string;
  buktiSubcontrol: string;
  selectedEvents: { time: string; name: string; type: string }[];
  kendalas: { id: string; nama: string; waktu: string; buktiKendala: string }[];
  customDate: string;
}

export default function MorningSummary() {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('morningFormData');
    if (storedData) {
      setFormData(JSON.parse(storedData));
    }
  }, []);

  const handleSubmitToSheets = async () => {
    if (!formData) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/submit-morning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('Report submitted successfully to Google Sheets!');
      } else {
        setSubmitStatus('Failed to submit report. Please try again.');
      }
    } catch (error) {
      setSubmitStatus('Error submitting report. Please check your configuration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generatePDF = async () => {
    if (!formData) return;

    const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape orientation for more width
    const pageWidth = pdf.internal.pageSize.getWidth();

    // Add logo at top right
    try {
      const logoResponse = await fetch('/logo-tvri.png');
      const logoBlob = await logoResponse.blob();
      const logoBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(logoBlob);
      });
      pdf.addImage(logoBase64, 'PNG', pageWidth - 30, 10, 18, 15);
    } catch (error) {
      console.error('Error loading logo:', error);
    }

    let yPosition = 20;

    // Title
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(20);
    pdf.setTextColor(0, 0, 0);
    const title = 'Laporan TD Pagi';
    const titleWidth = pdf.getTextWidth(title);
    const xPosition = (pageWidth - titleWidth) / 2;
    pdf.text(title, xPosition, yPosition);
    yPosition += 20;

    // Tanggal
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    const tanggal = formData.customDate || new Date().toISOString().split('T')[0];
    pdf.text(`Tanggal: ${tanggal}`, 20, yPosition);
    yPosition += 15;

    // Staff Selection Table
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 255); // Blue
    pdf.text('Staff Selection', 20, yPosition);
    yPosition += 10;

    autoTable(pdf, {
      startY: yPosition,
      head: [['Field', 'Value']],
      body: [
        ['PETUGAS PDU', formData.pduStaff || 'Not selected'],
        ['PETUGAS TD', formData.tdStaff || 'Not selected'],
        ['PETUGAS TRANSMISI', formData.transmisiStaff.length > 0 ? formData.transmisiStaff.join(', ') : 'None selected'],
      ],
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [0, 0, 255], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });
    yPosition = (pdf as any).lastAutoTable.finalY + 20;

    // Evidence Upload Table
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.setTextColor(0, 128, 0); // Green
    pdf.text('Evidence Upload', 20, yPosition);
    yPosition += 10;

    autoTable(pdf, {
      startY: yPosition,
      head: [['Field', 'Link']],
      body: [
        ['BUKTI STUDIO', formData.buktiStudio || 'No file uploaded'],
        ['BUKTI STREAMING', formData.buktiStreaming || 'No file uploaded'],
        ['BUKTI SUBCONTROL', formData.buktiSubcontrol || 'No file uploaded'],
      ],
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 3, overflow: 'linebreak' },
      headStyles: { fillColor: [0, 128, 0], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      columnStyles: {
        1: { cellWidth: 200 } // Make the link column much wider
      },
    });
    yPosition = (pdf as any).lastAutoTable.finalY + 20;

    // ACARA Selection Table
    if (yPosition > 150) {
      pdf.addPage();
      yPosition = 20;
    }
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.setTextColor(255, 0, 0); // Red
    pdf.text('ACARA Selection', 20, yPosition);
    yPosition += 10;

    const acaraBody = formData.selectedEvents.length > 0
      ? formData.selectedEvents.map(event => [event.time, event.name, event.type])
      : [['', 'No events selected', '']];

    autoTable(pdf, {
      startY: yPosition,
      head: [['Time', 'Name', 'Type']],
      body: acaraBody,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [255, 0, 0], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });
    yPosition = (pdf as any).lastAutoTable.finalY + 20;

    // KENDALA Table
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.setTextColor(255, 165, 0); // Orange
    pdf.text('KENDALA', 20, yPosition);
    yPosition += 10;

    const kendalaBody = formData.kendalas.length > 0
      ? formData.kendalas.map(kendala => [kendala.nama || 'Not specified', kendala.waktu || 'Not specified', kendala.buktiKendala || 'No file uploaded'])
      : [['No kendalas reported', '', '']];

    autoTable(pdf, {
      startY: yPosition,
      head: [['Nama Kendala', 'Waktu Kendala', 'Bukti Kendala']],
      body: kendalaBody,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 3, overflow: 'linebreak' },
      headStyles: { fillColor: [255, 165, 0], textColor: 0 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      columnStyles: {
        2: { cellWidth: 150 } // Make the bukti column wider
      },
    });

    pdf.save('morning-report-summary.pdf');
  };

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-black mb-4">No Data Submitted</h1>
          <p className="text-gray-600 mb-6">Please complete the form first.</p>
          <Link href="/morning" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200">
            Go to Form
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-black mb-8">Morning Report Summary</h1>

        {/* Download PDF */}
        <div className="mb-8 text-center">
          <button
            onClick={generatePDF}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
          >
            Download PDF
          </button>
        </div>

        <div className="flex justify-center">
          <Link href="/" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
