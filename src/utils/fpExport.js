import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import logoUrl from "../assets/Logo.png";

const C_BLUE  = "FF22568F";
const C_WHITE = "FFFFFFFF";
const C_LIGHT = "FFEAF2FF";
const C_GREEN = "FF1a7f3c";
const C_RED   = "FFcc0000";

function styleHeader(cell) {
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C_BLUE } };
  cell.font = { color: { argb: C_WHITE }, bold: true, size: 10, name: "Arial" };
  cell.alignment = { horizontal: "center", vertical: "middle" };
}
function styleSection(cell) {
  cell.font = { bold: true, color: { argb: C_BLUE }, size: 10, name: "Arial" };
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C_LIGHT } };
}
function styleBold(cell) { cell.font = { bold: true, size: 10, name: "Arial" }; }
function numFmt(cell) { cell.numFmt = "#,##0"; }

const DISCLAIMER = "Mutual Fund investments are subject to market risks. Read all scheme related documents carefully. Past performance is not indicative of future returns. This report is for planning purposes only and does not constitute investment advice. Radds Capital is an AMFI-Registered Mutual Fund Distributor (ARN-334716 | ARN-292158 | ARN-124053).";

export async function exportXLSX(data) {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Radds Capital";
  wb.created = new Date();

  const userName  = data.name || "Client";
  const planDate  = new Date().toLocaleDateString("en-IN");
  const salary    = data.salary || 0;
  const salary2   = data.salary2 || 0;
  const otherInc  = data.otherIncome || 0;
  const totalIncome = salary + salary2 + otherInc;

  const expKeys   = ["householdExp","rent","emi","healthInsurance","insurance","bills","schoolFees","fuel","personal","existingSip","addExpenses"];
  const expLabels = ["House Hold Exp","Rent","EMI","Health Insurance","Insurance","Bills","School Fees","Fuel","Personal","Existing SIP","Add Expenses"];
  const childrenTotal = (data.children || []).reduce((s, c) =>
    s + (c.education||0) + (c.allowance||0) + (c.holiday||0) + (c.medical||0), 0);
  const totalExpenses = expKeys.reduce((s, k) => s + (data[k] || 0), 0) + childrenTotal;
  const balance = totalIncome - totalExpenses;

  // Generate 12 monthly headers from current month
  const now = new Date();
  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    return d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
  });

  // ── Sheet 1: Budget Planner ────────────────────────────────────
  const ws1 = wb.addWorksheet("Budget Planner");
  ws1.columns = [{ width: 22 }, ...Array(13).fill({ width: 12 }), { width: 14 }];

  // Logo rows
  const r1 = ws1.addRow(["", "", "Budget Planner"]);
  // Embed logo image
  try {
    const imgResp = await fetch(logoUrl);
    const imgBuf = await imgResp.arrayBuffer();
    const imgId = wb.addImage({ buffer: imgBuf, extension: "png" });
    ws1.addImage(imgId, { tl: { col: 0, row: 0 }, ext: { width: 120, height: 40 } });
  } catch {
    r1.getCell(1).value = "Radds Capital";
    r1.getCell(1).font = { bold: true, size: 14, color: { argb: C_BLUE }, name: "Arial" };
  }
  r1.getCell(3).font = { bold: true, size: 12, name: "Arial" };
  r1.getCell(3).alignment = { horizontal: "right" };
  r1.getCell(3).font = { bold: true, size: 12, name: "Arial" };
  r1.getCell(3).alignment = { horizontal: "right" };
  const r2 = ws1.addRow(["AMFI-Registered Mutual Fund Distributor", "", `Client: ${userName}`]);
  r2.getCell(1).font = { italic: true, size: 9, color: { argb: "FF666666" }, name: "Arial" };
  r2.getCell(3).alignment = { horizontal: "right" };
  ws1.addRow(["", "", `Date: ${planDate}`]).getCell(3).alignment = { horizontal: "right" };
  ws1.addRow([]);

  const fpTitle = ws1.addRow(["Prepared For", userName, ...months.map(() => ""), "Total"]);
  fpTitle.getCell(1).font = { bold: true, size: 11, name: "Arial" };
  fpTitle.getCell(2).font = { bold: true, size: 11, color: { argb: C_BLUE }, name: "Arial" };

  const fpHead = ws1.addRow(["", "Monthly", ...months, "Annual Total"]);
  for (let c = 1; c <= 15; c++) styleHeader(fpHead.getCell(c));
  ws1.addRow([]);

  // Income
  const incSection = ws1.addRow(["INCOME"]);
  styleSection(incSection.getCell(1));
  ws1.addRow([]);
  [["Salary", salary], ["Salary - 2", salary2], ["Other Income", otherInc]].forEach(([label, val]) => {
    const r = ws1.addRow([label, val, ...Array(12).fill(val), val * 12]);
    for (let c = 2; c <= 15; c++) numFmt(r.getCell(c));
  });
  const totIncRow = ws1.addRow(["Total- Income", totalIncome, ...Array(12).fill(totalIncome), totalIncome * 12]);
  styleBold(totIncRow.getCell(1));
  for (let c = 2; c <= 15; c++) { numFmt(totIncRow.getCell(c)); styleBold(totIncRow.getCell(c)); }

  ws1.addRow([]);
  const expSection = ws1.addRow(["EXPENSES"]);
  styleSection(expSection.getCell(1));
  ws1.addRow([]);
  expKeys.forEach((key, idx) => {
    const val = data[key] || 0;
    const r = ws1.addRow([expLabels[idx], val, ...Array(12).fill(val), val * 12]);
    for (let c = 2; c <= 15; c++) numFmt(r.getCell(c));
  });
  if (childrenTotal > 0) {
    const r = ws1.addRow(["Children Expenses", childrenTotal, ...Array(12).fill(childrenTotal), childrenTotal * 12]);
    for (let c = 2; c <= 15; c++) numFmt(r.getCell(c));
  }
  const totExpRow = ws1.addRow(["Total", totalExpenses, ...Array(12).fill(totalExpenses), totalExpenses * 12]);
  styleBold(totExpRow.getCell(1));
  for (let c = 2; c <= 15; c++) { numFmt(totExpRow.getCell(c)); styleBold(totExpRow.getCell(c)); }

  const balRow = ws1.addRow(["Balance", "", ...Array(12).fill(balance), balance * 12]);
  styleBold(balRow.getCell(1));
  for (let c = 3; c <= 15; c++) {
    numFmt(balRow.getCell(c));
    balRow.getCell(c).font = { bold: true, color: { argb: balance >= 0 ? C_GREEN : C_RED }, name: "Arial" };
  }

  ws1.addRow([]);
  ws1.addRow(["Income - Expenses = Saving (Old approach)"]).getCell(1).font = { italic: true, size: 9, name: "Arial" };
  ws1.addRow(["Income - Investment = Expenses (Radds approach)"]).getCell(1).font = { bold: true, size: 9, color: { argb: C_BLUE }, name: "Arial" };
  ws1.addRow([]);
  const dr = ws1.addRow([DISCLAIMER]);
  dr.getCell(1).font = { color: { argb: "FF999999" }, italic: true, size: 8, name: "Arial" };
  dr.getCell(1).alignment = { wrapText: true };

  // ── Sheet 2: Profile Summary ───────────────────────────────────────
  const ws2 = wb.addWorksheet("Profile Summary");
  ws2.columns = [{ width: 30 }, { width: 40 }];
  ws2.addRow(["Radds Capital", ""]).getCell(1).font = { bold: true, size: 14, color: { argb: C_BLUE }, name: "Arial" };
  ws2.addRow(["Client Profile Summary"]).getCell(1).font = { bold: true, size: 12, name: "Arial" };
  ws2.addRow([`Client: ${userName} | Date: ${planDate}`]).getCell(1).font = { italic: true, size: 9, name: "Arial" };
  ws2.addRow([]);

  [
    ["Name", userName],
    ["Email", data.email || ""],
    ["Phone", data.phone || ""],
    ["Age", data.age || ""],
    ["Risk Preference", data.riskPreference || ""],
    ["", ""],
    ["Monthly Income", totalIncome],
    ["Monthly Expenses", totalExpenses],
    ["Investment Capacity", Math.max(0, balance)],
  ].forEach(([k, v]) => {
    if (!k) { ws2.addRow([]); return; }
    const r = ws2.addRow([k, v]);
    r.getCell(1).font = { bold: true, size: 10, name: "Arial" };
    if (typeof v === "number") numFmt(r.getCell(2));
  });

  if (data.children && data.children.length > 0) {
    ws2.addRow([]);
    ws2.addRow(["Children Expenses"]).getCell(1).font = { bold: true, color: { argb: C_BLUE }, size: 10, name: "Arial" };
    data.children.forEach(c => {
      const total = (c.education||0)+(c.allowance||0)+(c.holiday||0)+(c.medical||0);
      ws2.addRow([`${c.name} (Age ${c.age})`, total]).tap && null;
      const r = ws2.lastRow; numFmt(r.getCell(2));
    });
  }

  // Save
  const buf = await wb.xlsx.writeBuffer();
  saveAs(new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
    `Radds_${userName.replace(/\s+/g,"_")}_BudgetPlan_${Date.now()}.xlsx`);
}
