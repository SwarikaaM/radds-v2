import { useState, useMemo } from "react";
import { PieChart, Plus, Trash2, Download, FileText } from "lucide-react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoUrl from "../../assets/Logo.png";

const FINANCIAL_TYPES = ["Mutual Funds","Fixed Deposit","PPF / EPF","Stocks / Equity","NPS","Bonds","Cash / Savings","Gold (Financial)","Other Financial"];
const PHYSICAL_TYPES  = ["Own Home","Second Property","Land","Gold (Physical)","Vehicle","Other Physical"];
const LIABILITY_TYPES = ["Home Loan","Car Loan","Personal Loan","Education Loan","Credit Card","Other Loan"];

function inr(n) { return "₹" + Math.round(n || 0).toLocaleString("en-IN"); }

function AssetRow({ row, index, onUpdate, onRemove, typeOptions, isFirst }) {
  return (
    <div className="grid grid-cols-[1fr_1.2fr_1fr_auto] gap-2 items-end">
      <div>
        {isFirst && <p className="text-[10px] text-[#6B7E99] mb-1">Category</p>}
        <select value={row.type} onChange={e => onUpdate("type", e.target.value)}
          className="w-full border border-[#D1DDE8] rounded-lg p-2 text-sm bg-white">
          {typeOptions.map(o => <option key={o}>{o}</option>)}
        </select>
      </div>
      <div>
        {isFirst && <p className="text-[10px] text-[#6B7E99] mb-1">Label</p>}
        <input type="text" placeholder="Description" value={row.label}
          onChange={e => onUpdate("label", e.target.value)}
          className="w-full border border-[#D1DDE8] rounded-lg p-2 text-sm" />
      </div>
      <div>
        {isFirst && <p className="text-[10px] text-[#6B7E99] mb-1">Value (₹)</p>}
        <div className="flex items-center border border-[#D1DDE8] rounded-lg focus-within:border-[#22568F]">
          <span className="pl-2 text-[#6B7E99] text-sm">₹</span>
          <input type="text" inputMode="numeric" value={row.value || ""}
            onChange={e => { const v = e.target.value; if (v === "" || /^\d*$/.test(v)) onUpdate("value", v === "" ? 0 : Number(v)); }}
            className="w-full bg-transparent outline-none p-2 pl-1 text-sm font-semibold" />
        </div>
      </div>
      <button onClick={onRemove} className="p-2 text-red-400 hover:text-red-600 transition-colors mb-0.5">
        <Trash2 size={14} />
      </button>
    </div>
  );
}

function Section({ title, rows, setRows, typeOptions, color }) {
  function update(i, field, val) { setRows(r => r.map((row, idx) => idx === i ? { ...row, [field]: val } : row)); }
  function add() { setRows(r => [...r, { type: typeOptions[0], label: "", value: 0 }]); }
  function remove(i) { setRows(r => r.filter((_, idx) => idx !== i)); }
  const total = rows.reduce((s, r) => s + Number(r.value || 0), 0);

  return (
    <div className="bg-white rounded-2xl border border-[#E2EBF5] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[#0D1B2E]">{title}</h3>
        <span className={`text-sm font-bold ${color}`}>{inr(total)}</span>
      </div>
      <div className="space-y-2">
        {rows.map((row, i) => (
          <AssetRow key={i} row={row} index={i}
            onUpdate={(f, v) => update(i, f, v)}
            onRemove={() => remove(i)}
            typeOptions={typeOptions}
            isFirst={i === 0}
          />
        ))}
      </div>
      <button onClick={add} className="flex items-center gap-1.5 text-sm text-[#22568F] hover:text-[#1a4070] font-medium mt-3">
        <Plus size={14} /> Add row
      </button>
    </div>
  );
}

export default function NetWorthCalc() {
  const [financial, setFinancial] = useState([{ type: "Mutual Funds", label: "", value: 0 }]);
  const [physical, setPhysical] = useState([{ type: "Own Home", label: "", value: 0 }]);
  const [liabilities, setLiabilities] = useState([{ type: "Home Loan", label: "", value: 0 }]);

  const totals = useMemo(() => {
    const fin  = financial.reduce((s, r) => s + Number(r.value || 0), 0);
    const phy  = physical.reduce((s, r) => s + Number(r.value || 0), 0);
    const liab = liabilities.reduce((s, r) => s + Number(r.value || 0), 0);
    return { fin, phy, totalAssets: fin + phy, liab, netWorth: fin + phy - liab };
  }, [financial, physical, liabilities]);

  const [exporting, setExporting] = useState(null);

  async function exportXLSX() {
    setExporting("xlsx");
    try {
      const wb = new ExcelJS.Workbook();
      const ws = wb.addWorksheet("Net Worth");

      // Row 1 — height 35
      const r1 = ws.addRow(["", "Net Worth Statement"]);
      ws.getRow(1).height = 35;
      try {
        const imgResp = await fetch(logoUrl);
        const imgBuf = await imgResp.arrayBuffer();
        const imgId = wb.addImage({ buffer: imgBuf, extension: "png" });
        ws.addImage(imgId, { tl: { col: 0, row: 0 }, ext: { width: 120, height: 40 } });
      } catch {
        r1.getCell(1).value = "Radds Capital";
        r1.getCell(1).font = { bold: true, size: 13, color: { argb: "FF22568F" }, name: "Arial" };
      }
      r1.getCell(2).font = { bold: true, size: 12, name: "Arial" };
      r1.getCell(2).alignment = { vertical: "middle" };
      ws.addRow(["AMFI-Registered Mutual Fund Distributor", `Date: ${new Date().toLocaleDateString("en-IN")}`]).getCell(1).font = { italic: true, size: 9, color: { argb: "FF666666" }, name: "Arial" };
      ws.addRow([]);

      // Summary
      const sh = ws.addRow(["SUMMARY"]);
      sh.getCell(1).font = { bold: true, color: { argb: "FF22568F" }, size: 10, name: "Arial" };
      sh.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFEAF2FF" } };
      ws.addRow([]);
      [["Financial Assets", totals.fin], ["Physical Assets", totals.phy], ["Total Assets", totals.totalAssets], ["Total Liabilities", totals.liab], ["Net Worth", totals.netWorth]].forEach(([l, v]) => {
        const r = ws.addRow([l, v]);
        r.getCell(1).font = { bold: true, size: 10, name: "Arial" };
        r.getCell(2).numFmt = "#,##0";
        if (l === "Net Worth") r.getCell(2).font = { bold: true, size: 11, color: { argb: v >= 0 ? "FF1a7f3c" : "FFcc0000" }, name: "Arial" };
      });
      ws.addRow([]);

      // Asset / Liability detail tables
      const sections = [
        { title: "FINANCIAL ASSETS", rows: financial },
        { title: "PHYSICAL ASSETS", rows: physical },
        { title: "LIABILITIES", rows: liabilities },
      ];
      sections.forEach(({ title, rows }) => {
        if (!rows.length) return;
        const sh2 = ws.addRow([title]);
        sh2.getCell(1).font = { bold: true, color: { argb: "FF22568F" }, size: 10, name: "Arial" };
        sh2.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFEAF2FF" } };
        const hdr = ws.addRow(["Category", "Description", "Value (₹)"]);
        hdr.eachCell(c => {
          c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF22568F" } };
          c.font = { color: { argb: "FFFFFFFF" }, bold: true, size: 10, name: "Arial" };
          c.alignment = { horizontal: "center" };
        });
        rows.forEach((row, i) => {
          const tr = ws.addRow([row.type, row.label || "—", row.value || 0]);
          tr.getCell(3).numFmt = "#,##0";
          if (i % 2 === 1) tr.eachCell(c => c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFAFBFD" } });
        });
        ws.addRow([]);
      });

      // Auto-fit all columns
      ws.columns.forEach(col => {
        let maxLen = 10;
        col.eachCell({ includeEmpty: false }, cell => {
          const val = cell.value !== null && cell.value !== undefined ? String(cell.value) : "";
          if (val.length > maxLen) maxLen = val.length;
        });
        col.width = Math.min(maxLen + 4, 40);
      });

      // Disclaimer
      const dr = ws.addRow(["Mutual Fund investments are subject to market risks. This net worth statement is for informational purposes only. Radds Capital — AMFI-Registered Mutual Fund Distributor (ARN-334716)."]);
      dr.getCell(1).font = { italic: true, size: 8, color: { argb: "FF999999" }, name: "Arial" };
      dr.getCell(1).alignment = { wrapText: true };
      ws.getRow(ws.rowCount).height = 36;

      const buf = await wb.xlsx.writeBuffer();
      saveAs(new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), `Radds_NetWorth_${Date.now()}.xlsx`);
    } catch (e) { console.error(e); alert("Export failed."); }
    finally { setExporting(null); }
  }

  async function exportPDF() {
    setExporting("pdf");
    try {
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const W = doc.internal.pageSize.getWidth();

      // White header
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, W, 22, "F");
      try { doc.addImage(logoUrl, "PNG", 10, 3, 36, 15); }
      catch { doc.setFont("helvetica", "bold"); doc.setFontSize(14); doc.setTextColor(34, 86, 143); doc.text("RADDS CAPITAL", 14, 13); }
      doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(107, 126, 153);
      doc.text("AMFI-Registered Mutual Fund Distributor", W - 14, 9, { align: "right" });
      doc.text(new Date().toLocaleDateString("en-IN"), W - 14, 15, { align: "right" });
      doc.setDrawColor(34, 86, 143); doc.setLineWidth(0.5); doc.line(0, 22, W, 22);

      let y = 32;
      doc.setFont("helvetica", "bold"); doc.setFontSize(16); doc.setTextColor(13, 27, 46);
      doc.text("Net Worth Statement", 14, y); y += 7;
      doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(107, 126, 153);
      doc.text(`As of ${new Date().toLocaleDateString("en-IN")}`, 14, y); y += 10;

      // Summary boxes
      const boxes = [["Financial Assets", totals.fin], ["Physical Assets", totals.phy], ["Liabilities", totals.liab]];
      const bw = (W - 28 - 8) / 3;
      boxes.forEach(([l, v], i) => {
        const x = 14 + i * (bw + 4);
        doc.setFillColor(234, 242, 255); doc.roundedRect(x, y, bw, 18, 2, 2, "F");
        doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(34, 86, 143);
        doc.text("Rs. " + Math.round(v).toLocaleString("en-IN"), x + bw / 2, y + 8, { align: "center" });
        doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(107, 126, 153);
        doc.text(l, x + bw / 2, y + 14, { align: "center" });
      });
      y += 24;

      // Net Worth highlight
      doc.setFillColor(totals.netWorth >= 0 ? 240 : 254, totals.netWorth >= 0 ? 253 : 242, totals.netWorth >= 0 ? 244 : 242);
      doc.roundedRect(14, y, W - 28, 14, 2, 2, "F");
      doc.setFont("helvetica", "bold"); doc.setFontSize(11);
      doc.setTextColor(...(totals.netWorth >= 0 ? [26, 127, 60] : [204, 0, 0]));
      doc.text("Net Worth: Rs. " + Math.round(totals.netWorth).toLocaleString("en-IN"), W / 2, y + 9, { align: "center" });
      y += 20;

      // Detail tables
      const sections = [
        { title: "Financial Assets", rows: financial },
        { title: "Physical Assets", rows: physical },
        { title: "Liabilities", rows: liabilities },
      ];
      for (const { title, rows } of sections) {
        if (!rows.length) continue;
        if (y > doc.internal.pageSize.getHeight() - 40) { doc.addPage(); y = 14; }
        autoTable(doc, {
          startY: y,
          head: [[{ content: title, colSpan: 3, styles: { fillColor: [34, 86, 143], textColor: [255, 255, 255], fontStyle: "bold" } }], ["Category", "Description", "Value (Rs.)"]],
          body: rows.map(r => [r.type, r.label || "—", "Rs. " + Math.round(r.value || 0).toLocaleString("en-IN")]),
          styles: { fontSize: 8, cellPadding: 2.5 },
          headStyles: { fillColor: [234, 242, 255], textColor: [34, 86, 143], fontStyle: "bold" },
          alternateRowStyles: { fillColor: [248, 250, 252] },
          margin: { left: 14, right: 14 },
        });
        y = doc.lastAutoTable.finalY + 6;
      }

      const disc = "Mutual Fund investments are subject to market risks. This net worth statement is for informational purposes only and does not constitute investment advice. Radds Capital — AMFI-Registered Mutual Fund Distributor.";
      doc.setFont("helvetica", "italic"); doc.setFontSize(7); doc.setTextColor(107, 126, 153);
      if (y + 12 > doc.internal.pageSize.getHeight() - 10) { doc.addPage(); y = 14; }
      doc.text(doc.splitTextToSize(disc, W - 28), 14, y);
      doc.save(`Radds_NetWorth_${Date.now()}.pdf`);
    } catch (e) { console.error(e); alert("Export failed."); }
    finally { setExporting(null); }
  }

  return (
    <section className="bg-lightbg py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#22568F]/10 rounded-xl flex items-center justify-center">
              <PieChart size={20} className="text-[#22568F]" />
            </div>
            <h1 className="font-playfair text-3xl font-bold text-[#0D1B2E]">Net Worth Calculator</h1>
          </div>
          <p className="text-[#6B7E99]">Add your assets and subtract liabilities to know exactly where you stand financially.</p>
        </div>

        {/* Net Worth Banner */}
        <div className={`rounded-2xl p-6 mb-6 flex flex-wrap gap-6 items-center ${totals.netWorth >= 0 ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
          <div>
            <p className="text-xs text-[#6B7E99] mb-1">Total Assets</p>
            <p className="text-2xl font-bold text-[#22568F]">{inr(totals.totalAssets)}</p>
          </div>
          <div className="text-2xl text-[#6B7E99]">−</div>
          <div>
            <p className="text-xs text-[#6B7E99] mb-1">Total Liabilities</p>
            <p className="text-2xl font-bold text-red-600">{inr(totals.liab)}</p>
          </div>
          <div className="text-2xl text-[#6B7E99]">=</div>
          <div>
            <p className="text-xs text-[#6B7E99] mb-1">Your Net Worth</p>
            <p className={`text-3xl font-bold ${totals.netWorth >= 0 ? "text-green-700" : "text-red-600"}`}>{inr(totals.netWorth)}</p>
          </div>
          <div className="ml-auto text-right hidden sm:block">
            <p className="text-xs text-[#6B7E99]">Financial Assets</p>
            <p className="text-sm font-semibold text-[#22568F]">{inr(totals.fin)}</p>
            <p className="text-xs text-[#6B7E99] mt-1">Physical Assets</p>
            <p className="text-sm font-semibold text-[#22568F]">{inr(totals.phy)}</p>
          </div>
        </div>

        <div className="space-y-5">
          <Section title="Financial Assets" rows={financial} setRows={setFinancial} typeOptions={FINANCIAL_TYPES} color="text-[#22568F]" />
          <Section title="Physical Assets" rows={physical} setRows={setPhysical} typeOptions={PHYSICAL_TYPES} color="text-[#22568F]" />
          <Section title="Liabilities" rows={liabilities} setRows={setLiabilities} typeOptions={LIABILITY_TYPES} color="text-red-600" />

          {/* Export buttons */}
          <div className="flex flex-wrap gap-2 pt-2">
            <button onClick={exportXLSX} disabled={!!exporting}
              className="flex items-center gap-1.5 text-sm font-semibold border border-[#22568F] text-[#22568F] px-4 py-2 rounded-lg hover:bg-[#22568F] hover:text-white transition-colors disabled:opacity-50">
              <Download size={14} />{exporting === "xlsx" ? "Generating..." : "Export Excel"}
            </button>
            <button onClick={exportPDF} disabled={!!exporting}
              className="flex items-center gap-1.5 text-sm font-semibold border border-[#22568F] text-[#22568F] px-4 py-2 rounded-lg hover:bg-[#22568F] hover:text-white transition-colors disabled:opacity-50">
              <FileText size={14} />{exporting === "pdf" ? "Generating..." : "Export PDF"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
