// src/utils/calcExport.js
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoUrl from "../assets/Logo.png";

const C_BLUE  = "FF22568F";
const C_WHITE = "FFFFFFFF";
const C_LIGHT = "FFEAF2FF";
const BLUE    = [34, 86, 143];
const LIGHT_BLUE = [234, 242, 255];
const DARK    = [13, 27, 46];
const GREY    = [107, 126, 153];
const WHITE   = [255, 255, 255];

const DISCLAIMER =
  "Mutual Fund investments are subject to market risks. Read all scheme related documents carefully. " +
  "Past performance is not indicative of future returns. These projections are for illustration purposes only " +
  "and do not constitute investment advice. Radds Capital is an AMFI-Registered Mutual Fund Distributor " +
  "(ARN-334716 | ARN-292198 | ARN-124053).";

function fmtINR(n) {
  return "Rs. " + Math.round(n || 0).toLocaleString("en-IN");
}

function styleHeader(cell) {
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C_BLUE } };
  cell.font = { color: { argb: C_WHITE }, bold: true, size: 10, name: "Arial" };
  cell.alignment = { horizontal: "center", vertical: "middle" };
}

function numFmt(cell) { cell.numFmt = "#,##0"; }

// Auto-fit columns by measuring all cell values, skip last column (disclaimer)
function autoFitColumns(ws, skipLastCol = true) {
  const colCount = ws.columnCount;
  ws.columns.forEach((col, i) => {
    if (skipLastCol && i === colCount - 1) return;
    let maxLen = 10;
    col.eachCell({ includeEmpty: false }, cell => {
      const val = cell.value !== null && cell.value !== undefined ? String(cell.value) : "";
      if (val.length > maxLen) maxLen = val.length;
    });
    col.width = Math.min(maxLen + 4, 40);
  });
}

// ─── Excel export ─────────────────────────────────────────────────────────────
export async function exportCalcXLSX({ title, summaryKeys, results, tableColumns, tableRowKeys, chartData }) {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Radds Capital";
  wb.created = new Date();

  const ws = wb.addWorksheet(title.slice(0, 30));

  // Row 1: logo + title — height 35
  const r1 = ws.addRow(["", title]);
  ws.getRow(1).height = 35;
  try {
    const imgResp = await fetch(logoUrl);
    const imgBuf = await imgResp.arrayBuffer();
    const imgId = wb.addImage({ buffer: imgBuf, extension: "png" });
    ws.addImage(imgId, { tl: { col: 0, row: 0 }, ext: { width: 120, height: 40 } });
  } catch {
    r1.getCell(1).value = "Radds Capital";
    r1.getCell(1).font = { bold: true, size: 13, color: { argb: C_BLUE }, name: "Arial" };
  }
  r1.getCell(2).font = { bold: true, size: 12, name: "Arial" };
  r1.getCell(2).alignment = { vertical: "middle" };

  // const r2 = ws.addRow(["AMFI-Registered Mutual Fund Distributor", `Date: ${new Date().toLocaleDateString("en-IN")}`]);
  // r2.getCell(1).font = { italic: true, size: 9, color: { argb: "FF666666" }, name: "Arial" };
  // r2.getCell(2).alignment = { horizontal: "right" };
  ws.addRow([]);

  // Summary section
  const sumHead = ws.addRow(["SUMMARY"]);
  sumHead.getCell(1).font = { bold: true, color: { argb: C_BLUE }, size: 10, name: "Arial" };
  sumHead.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFEAF2FF" } };
  ws.addRow([]);
  summaryKeys.forEach(sk => {
    const r = ws.addRow([sk.label, results[sk.key]]);
    r.getCell(1).font = { bold: true, size: 10, name: "Arial" };
    if (typeof results[sk.key] === "number") numFmt(r.getCell(2));
  });
  ws.addRow([]);

  // Year-wise breakdown
  if (chartData?.length) {
    const tHead = ws.addRow(tableColumns);
    for (let c = 1; c <= tableColumns.length; c++) styleHeader(tHead.getCell(c));
    chartData.forEach((row, i) => {
      const vals = tableRowKeys.map(k => row[k]);
      const tr = ws.addRow(vals);
      tr.eachCell((cell, colNum) => {
        if (colNum > 1 && typeof cell.value === "number") numFmt(cell);
        if (i % 2 === 1) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFAFBFD" } };
      });
    });
  }

  ws.addRow([]);
  // Disclaimer in its own merged-style row — skip auto-fit for this
  const dr = ws.addRow([DISCLAIMER]);
  dr.getCell(1).font = { color: { argb: "FF999999" }, italic: true, size: 8, name: "Arial" };
  dr.getCell(1).alignment = { wrapText: true };
  ws.getRow(ws.rowCount).height = 36;

  // Auto-fit all columns except disclaimer (last row has only col 1 used — we skip last col)
  autoFitColumns(ws, false); // false = don't skip last col, but disclaimer is row not col

  const buf = await wb.xlsx.writeBuffer();
  saveAs(
    new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
    `Radds_${title.replace(/\s+/g, "_")}_${Date.now()}.xlsx`
  );
}

// ─── PDF export (white header) ────────────────────────────────────────────────
export async function exportCalcPDF({ title, summaryKeys, results, tableColumns, tableRowKeys, chartData }) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  let y = 0;

  // White header with logo + blue bottom border line
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, W, 22, "F");
  try {
    doc.addImage(logoUrl, "PNG", 10, 3, 36, 15);
  } catch {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...BLUE);
    doc.text("RADDS CAPITAL", 14, 13);
  }
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...GREY);
  // doc.text("AMFI-Registered Mutual Fund Distributor", W - 14, 9, { align: "right" });
  doc.text(`Generated: ${new Date().toLocaleDateString("en-IN")}`, W - 14, 15, { align: "right" });
  // Blue separator line under header
  doc.setDrawColor(...BLUE);
  doc.setLineWidth(0.5);
  doc.line(0, 22, W, 22);

  y = 32;

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...DARK);
  doc.text(title, 14, y);
  y += 10;

  // Summary boxes
  const cols = Math.min(summaryKeys.length, 3);
  const boxW = (W - 28 - (cols - 1) * 4) / cols;
  summaryKeys.slice(0, cols).forEach((sk, i) => {
    const x = 14 + i * (boxW + 4);
    doc.setFillColor(...LIGHT_BLUE);
    doc.roundedRect(x, y, boxW, 18, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...BLUE);
    doc.text(fmtINR(results[sk.key]), x + boxW / 2, y + 8, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...GREY);
    doc.text(sk.label, x + boxW / 2, y + 14, { align: "center" });
  });
  y += 24;

  // Year-wise table
  if (chartData?.length) {
    const columnStyles = {};
    tableRowKeys.forEach((k, i) => {
      // Set every column to center alignment
      columnStyles[i] = { halign: "center" }; 
    });

    autoTable(doc, {
      startY: y,
      head: [tableColumns],
      body: chartData.map(row => 
        tableRowKeys.map(k => 
          (k === "year" || k === "age") 
            ? row[k] 
            : (typeof row[k] === "number" ? fmtINR(row[k]) : (row[k] ?? "—"))
        )
      ),
      styles: { 
        fontSize: 8, 
        font: "helvetica", 
        cellPadding: 2.5, 
        halign: "center" // Centers the headers and default cell text
      },
      headStyles: { 
        fillColor: BLUE, 
        textColor: WHITE, 
        fontStyle: "bold",
        halign: "center" // Explicitly ensures header text is centered
      },
      columnStyles, // Applies centering to all body data columns
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { left: 14, right: 14 },
      tableWidth: W - 28,
    });

    y = doc.lastAutoTable.finalY + 8;
  }


  // Disclaimer
  const lines = doc.splitTextToSize(DISCLAIMER, W - 28);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(12);
  doc.setTextColor(...GREY);
  if (y + lines.length * 3.5 > doc.internal.pageSize.getHeight() - 10) {
    doc.addPage();
    y = 14;
  }
  doc.text(lines, 14, y);

  doc.save(`Radds_${title.replace(/\s+/g, "_")}_${Date.now()}.pdf`);
}