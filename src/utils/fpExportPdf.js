import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoUrl from "../assets/Logo.png";

const BLUE = [34, 86, 143];
const LIGHT_BLUE = [234, 242, 255];
const GREEN = [26, 127, 60];
const RED = [204, 0, 0];
const GREY = [107, 126, 153];
const WHITE = [255, 255, 255];
const DARK = [13, 27, 46];

const DISCLAIMER = "Mutual Fund investments are subject to market risks. Read all scheme related documents carefully. Past performance is not indicative of future returns. This report is for planning purposes only and does not constitute investment advice. Radds Capital is an AMFI-Registered Mutual Fund Distributor (ARN-334716 | ARN-292158 | ARN-124053).";

function inr(n) { return "Rs. " + Math.round(n || 0).toLocaleString("en-IN"); }

export async function exportPDF(data) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const userName = data.name || "Client";
  const planDate = new Date().toLocaleDateString("en-IN");

  const salary = data.salary || 0;
  const salary2 = data.salary2 || 0;
  const otherInc = data.otherIncome || 0;
  const totalIncome = salary + salary2 + otherInc;

  const expKeys = ["householdExp","rent","healthInsurance","termInsurance","bills","educationFees","fuel","personal","loanEmi","domesticHelp","existingSip","addExpenses"];
const expLabels = ["House Hold Expenses","Rent / EMI","Health Insurance (Monthly)","Term Insurance (Monthly)","Bills (Electricity, Internet, Cable, etc.)","Education Fees (if any)","Fuel","Personal","Other EMIs (Credit Card/Car/Personal)","Domestic Help (Maid/Driver/Cook)","Existing SIP","Additional Expenses"];
  const childrenTotal = (data.children || []).reduce((s, c) =>
    s + (c.schoolFees||0) + (c.tuitionFees||0) + (c.extraCurricular||0) + (c.booksStationary||0) + (c.transport||0), 0);
  const totalExpenses = expKeys.reduce((s, k) => s + (data[k] || 0), 0) + childrenTotal;
  const balance = totalIncome - totalExpenses;

  // ── Page 1: Profile Summary ─────────────────────────────────────
  let y = 0;

  // Top header bar
  doc.setFillColor(255);
  doc.rect(0, 0, W, 22, "F");

  // Logo text
  try {
    doc.addImage(logoUrl, "PNG", 10, 3, 38, 16);
  } catch {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(...WHITE);
    doc.text("RADDS CAPITAL", 14, 13);
  }

  // Right side
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  // doc.text("AMFI-Registered Mutual Fund Distributor", W - 14, 8, { align: "right" });
  doc.text(`Report date: ${planDate}`, W - 14, 14, { align: "right" });

  y = 32;

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...DARK);
  doc.text("Client Profile Summary", 14, y);
  y += 6;

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...GREY);
  const subtitle = [userName, data.email, data.phone, `Plan Date: ${planDate}`].filter(Boolean).join("  •  ");
  doc.text(subtitle, 14, y);
  y += 8;

  // Summary banner (4 metric boxes)
  const metrics = [
    { label: "Monthly Income", value: inr(totalIncome) },
    { label: "Monthly Expenses", value: inr(totalExpenses) },
    { label: "Investment Capacity", value: inr(Math.max(0, balance)) },
    { label: "Net Worth", value: "—" },
  ];
  const boxW = (W - 28 - 9) / 4;
  doc.setFillColor(...BLUE);
  doc.roundedRect(14, y, W - 28, 18, 3, 3, "F");
  metrics.forEach((m, i) => {
    const bx = 14 + i * (boxW + 3);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...WHITE);
    doc.text(m.label, bx + boxW / 2, y + 6, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(m.value, bx + boxW / 2, y + 13, { align: "center" });
  });
  y += 25;

  // Personal Details
  doc.setFillColor(...LIGHT_BLUE);
  doc.rect(14, y, W - 28, 7, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...BLUE);
  doc.text("PERSONAL DETAILS", 17, y + 5);
  y += 11;

  const personalRows = [
    ["Name", userName],
    ["Email", data.email || "—"],
    ["Phone", data.phone || "—"],
    ["Age", data.age ? `${data.age} years` : "—"],
    ["Risk Profile", (data.riskPreference || "Moderate").charAt(0).toUpperCase() + (data.riskPreference || "moderate").slice(1)],
    ["Risk Description",
      data.riskPreference === "conservative" ? "Capital safety; debt/liquid funds recommended."
      : data.riskPreference === "aggressive" ? "Growth-oriented; equity/small-cap funds recommended."
      : "Balanced growth & safety; hybrid funds recommended."
    ],
    ["Date of Plan", planDate],
  ];

  personalRows.forEach(([label, value]) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...GREY);
    doc.text(label, 17, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...DARK);
    doc.text(value, W - 17, y, { align: "right" });
    y += 7;
  });

  y += 4;

  // Monthly Income section
  doc.setFillColor(...LIGHT_BLUE);
  doc.rect(14, y, W - 28, 7, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...BLUE);
  doc.text("MONTHLY INCOME", 17, y + 5);
  y += 11;

  const incomeRows = [
    ["Salary", salary],
    ["Spouse / Secondary Salary", salary2],
    ["Other Income", otherInc],
  ];
  incomeRows.forEach(([label, value]) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...GREY);
    doc.text(label, 17, y);
    doc.setTextColor(...DARK);
    doc.text(`Rs. ${value.toLocaleString("en-IN")}/mo`, W - 17, y, { align: "right" });
    y += 7;
  });

  // Total income
  doc.setDrawColor(220, 230, 240);
  doc.line(17, y - 2, W - 17, y - 2);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...DARK);
  doc.text("Total Monthly Income", 17, y + 3);
  doc.setTextColor(...BLUE);
  doc.text(`Rs. ${totalIncome.toLocaleString("en-IN")}/mo`, W - 17, y + 3, { align: "right" });
  y += 12;

  // Monthly Expenses section
  doc.setFillColor(...LIGHT_BLUE);
  doc.rect(14, y, W - 28, 7, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...BLUE);
  doc.text("MONTHLY EXPENSES", 17, y + 5);
  y += 11;

  expKeys.forEach((key, idx) => {
    const val = data[key] || 0;
    if (val === 0) return;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...GREY);
    doc.text(expLabels[idx], 17, y);
    doc.setTextColor(...DARK);
    doc.text(`Rs. ${val.toLocaleString("en-IN")}/mo`, W - 17, y, { align: "right" });
    y += 7;
  });
  if (childrenTotal > 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...GREY);
    doc.text("Children Expenses", 17, y);
    doc.setTextColor(...DARK);
    doc.text(`Rs. ${childrenTotal.toLocaleString("en-IN")}/mo`, W - 17, y, { align: "right" });
    y += 7;
  }

  doc.setDrawColor(220, 230, 240);
  doc.line(17, y - 2, W - 17, y - 2);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...DARK);
  doc.text("Total Monthly Expenses", 17, y + 3);
  doc.setTextColor(...RED);
  doc.text(`Rs. ${totalExpenses.toLocaleString("en-IN")}/mo`, W - 17, y + 3, { align: "right" });
  y += 7;
  doc.setTextColor(...DARK);
  doc.text("Net Monthly Balance", 17, y + 3);
  doc.setTextColor(balance >= 0 ? GREEN[0] : RED[0], balance >= 0 ? GREEN[1] : RED[1], balance >= 0 ? GREEN[2] : RED[2]);
  doc.text(`Rs. ${balance.toLocaleString("en-IN")}/mo`, W - 17, y + 3, { align: "right" });
  y += 12;

  // Children
  if (data.children && data.children.length > 0) {
    if (y > 230) { doc.addPage(); y = 20; }
    doc.setFillColor(...LIGHT_BLUE);
    doc.rect(14, y, W - 28, 7, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...BLUE);
    doc.text("CHILDREN EXPENSES", 17, y + 5);
    y += 11;

    data.children.forEach(child => {
      const childTotal = (child.schoolFees||0)+(child.tuitionFees||0)+(child.extraCurricular||0)+(child.booksStationary||0)+(child.transport||0);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...DARK);
      doc.text(`${child.name || "Child"} (Age ${child.age || "?"})`, 17, y);
      y += 6;

      [
        ["School Fees", child.schoolFees||0],
        ["Tuition Fees", child.tuitionFees||0],
        ["Extra-Curricular Activities", child.extraCurricular||0],
        ["Books/Stationary", child.booksStationary||0],
        ["Transport", child.transport||0],
      ].filter(([,v]) => v > 0).forEach(([label, val]) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(...GREY);
        doc.text(`  ${label}`, 17, y);
        doc.setTextColor(...DARK);
        doc.text(`Rs. ${val.toLocaleString("en-IN")}`, W - 17, y, { align: "right" });
        y += 6;
      });

      doc.setFont("helvetica", "bold");
      doc.setTextColor(...DARK);
      doc.text("Child Total/mo", 17, y);
      doc.setTextColor(...BLUE);
      doc.text(`Rs. ${childTotal.toLocaleString("en-IN")}`, W - 17, y, { align: "right" });
      y += 10;
    });
  }

  // Disclaimer
  const pageH = doc.internal.pageSize.getHeight();
  doc.setFont("helvetica", "italic");
  doc.setFontSize(6.5);
  doc.setTextColor(...GREY);
  const lines = doc.splitTextToSize(DISCLAIMER, W - 28);
  doc.text(lines, 14, pageH - 10);

  // ── Page 2: Monthly Planning Table ─────────────────────────────────
  doc.addPage("a4", "landscape");
  const LW = doc.internal.pageSize.getWidth();

  // Header bar
  doc.setFillColor(...BLUE);
  doc.rect(0, 0, LW, 18, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...WHITE);
  doc.text("RADDS CAPITAL", 14, 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Budget Plan — ${userName} | ${planDate}`, LW - 14, 12, { align: "right" });

  const now = new Date();
  const monthLabels = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    return d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
  });

  const headers = ["", "Monthly", ...monthLabels, "Annual Total"];

  function makeRows(label, val) {
    return [label, val.toLocaleString("en-IN"), ...Array(12).fill(val.toLocaleString("en-IN")), (val*12).toLocaleString("en-IN")];
  }

  const body = [
    // Income header
    [{ content: "INCOME", colSpan: 15, styles: { fillColor: LIGHT_BLUE, textColor: BLUE, fontStyle: "bold", fontSize: 9 } }],
    makeRows("Salary", salary),
    makeRows("Salary - 2", salary2),
    makeRows("Other Income", otherInc),
    [{ content: "Total Income", styles: { fontStyle: "bold" } },
     { content: totalIncome.toLocaleString("en-IN"), styles: { fontStyle: "bold", textColor: BLUE } },
     ...Array(12).fill({ content: totalIncome.toLocaleString("en-IN"), styles: { fontStyle: "bold", textColor: BLUE } }),
     { content: (totalIncome*12).toLocaleString("en-IN"), styles: { fontStyle: "bold", textColor: BLUE } }],

    // Expenses header
    [{ content: "EXPENSES", colSpan: 15, styles: { fillColor: LIGHT_BLUE, textColor: BLUE, fontStyle: "bold", fontSize: 9 } }],
    ...expKeys.map((key, idx) => makeRows(expLabels[idx], data[key] || 0)),
    ...(childrenTotal > 0 ? [makeRows("Children Expenses", childrenTotal)] : []),
    [{ content: "Total Expenses", styles: { fontStyle: "bold" } },
     { content: totalExpenses.toLocaleString("en-IN"), styles: { fontStyle: "bold", textColor: RED } },
     ...Array(12).fill({ content: totalExpenses.toLocaleString("en-IN"), styles: { fontStyle: "bold", textColor: RED } }),
     { content: (totalExpenses*12).toLocaleString("en-IN"), styles: { fontStyle: "bold", textColor: RED } }],

    // Balance
    [{ content: "Balance", styles: { fontStyle: "bold" } },
     "",
     ...Array(12).fill({ content: balance.toLocaleString("en-IN"), styles: { fontStyle: "bold", textColor: balance >= 0 ? GREEN : RED } }),
     { content: (balance*12).toLocaleString("en-IN"), styles: { fontStyle: "bold", textColor: balance >= 0 ? GREEN : RED } }],
  ];

  autoTable(doc, {
    head: [headers],
    body,
    startY: 24,
    margin: { left: 8, right: 8 },
    styles: { fontSize: 7.5, cellPadding: 2.5, halign: "right", font: "helvetica" },
    headStyles: { fillColor: BLUE, textColor: WHITE, fontStyle: "bold", fontSize: 8 },
    columnStyles: {
      0: { halign: "left", cellWidth: 38, fontStyle: "bold" },
      14: { fontStyle: "bold" },
    },
    alternateRowStyles: { fillColor: [249, 251, 253] },
  });

  // Disclaimer on page 2
  const LH = doc.internal.pageSize.getHeight();
  doc.setFont("helvetica", "italic");
  doc.setFontSize(6);
  doc.setTextColor(...GREY);
  doc.text(doc.splitTextToSize(DISCLAIMER, LW - 16), 8, LH - 8);

  doc.save(`Radds_${userName.replace(/\s+/g,"_")}_BudgetPlan_${Date.now()}.pdf`);
}
