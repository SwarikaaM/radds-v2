import { useState, useMemo } from "react";
import { Shield, AlertCircle, Download, FileText } from "lucide-react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoUrl from "../../assets/Logo.png";

function NumInput({ label, value, onChange, prefix = "₹", suffix = "" }) {
  const [raw, setRaw] = useState(value === 0 ? "" : String(value));
  return (
    <div>
      <label className="block text-sm font-medium text-[#3D4F66] mb-1.5">{label}</label>
      <div className="flex items-center border border-[#D1DDE8] rounded-lg bg-white focus-within:border-[#22568F] focus-within:shadow-[0_0_0_3px_rgba(34,86,143,0.08)]">
        {prefix && <span className="pl-3 text-[#6B7E99] text-sm">{prefix}</span>}
        <input
          type="text" inputMode="numeric" value={raw}
          onChange={e => { const v = e.target.value; if (v === "" || /^\d*\.?\d*$/.test(v)) { setRaw(v); onChange(v === "" ? 0 : Number(v)); } }}
          onFocus={e => { if (e.target.value === "0") setRaw(""); }}
          className="w-full bg-transparent outline-none p-3 pl-1.5 text-sm font-semibold text-[#0D1B2E]"
        />
        {suffix && <span className="pr-3 text-[#6B7E99] text-sm">{suffix}</span>}
      </div>
    </div>
  );
}

function inr(n) { return "₹" + Math.round(n || 0).toLocaleString("en-IN"); }

export default function TermInsuranceCalc() {
  const [premium, setPremium] = useState(15000);
  const [sipAmt, setSipAmt] = useState(1500);
  const [tenure, setTenure] = useState(20);
  const [growthRate, setGrowthRate] = useState(12);

  const calc = useMemo(() => {
    const rate = growthRate / 100;
    let corpus = 0;
    const rows = [];
    for (let yr = 1; yr <= tenure; yr++) {
      const annSip = sipAmt * 12;
      const growth = (corpus + annSip) * rate;
      const open = corpus;
      corpus = corpus + annSip + growth;
      rows.push({ yr, premium, open, annSip, growth, close: corpus });
    }
    const totalPremiums = premium * tenure;
    const totalSipInvested = sipAmt * 12 * tenure;
    const net = corpus - totalPremiums;
    return { rows, corpus, totalPremiums, totalSipInvested, net };
  }, [premium, sipAmt, tenure, growthRate]);

  const [exporting, setExporting] = useState(null);

  async function exportXLSX() {
    setExporting("xlsx");
    try {
      const wb = new ExcelJS.Workbook();
      const ws = wb.addWorksheet("Term Insurance Planner");

      // Row 1 — height 35
      const r1 = ws.addRow(["", "Term Insurance Planner — Premium vs SIP Corpus"]);
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
      r1.getCell(2).font = { bold: true, size: 11, name: "Arial" };
      r1.getCell(2).alignment = { vertical: "middle" };

      ws.addRow(["AMFI-Registered Mutual Fund Distributor", `Date: ${new Date().toLocaleDateString("en-IN")}`]).getCell(1).font = { italic: true, size: 9, color: { argb: "FF666666" }, name: "Arial" };
      ws.addRow([`Annual Premium: ₹${premium.toLocaleString("en-IN")}  |  Monthly SIP: ₹${sipAmt.toLocaleString("en-IN")}  |  Tenure: ${tenure} yrs  |  Rate: ${growthRate}%`]).getCell(1).font = { size: 9, name: "Arial" };
      ws.addRow([]);

      // Summary
      const sh = ws.addRow(["SUMMARY"]);
      sh.getCell(1).font = { bold: true, color: { argb: "FF22568F" }, size: 10, name: "Arial" };
      sh.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFEAF2FF" } };
      ws.addRow([]);
      [["Total Premiums Paid", calc.totalPremiums], ["Total SIP Invested", calc.totalSipInvested], ["Final SIP Corpus", calc.corpus], ["Net Benefit (Corpus − Premiums)", calc.net]].forEach(([l, v]) => {
        const r = ws.addRow([l, v]);
        r.getCell(1).font = { bold: true, size: 10, name: "Arial" };
        r.getCell(2).numFmt = "#,##0";
      });
      ws.addRow([]);

      // Table
      const hdr = ws.addRow(["Year", "Annual Premium", "SIP Opening", "Annual SIP", "Growth", "SIP Closing"]);
      hdr.eachCell(c => {
        c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF22568F" } };
        c.font = { color: { argb: "FFFFFFFF" }, bold: true, size: 10, name: "Arial" };
        c.alignment = { horizontal: "center", vertical: "middle" };
      });
      calc.rows.forEach((r, i) => {
        const row = ws.addRow([r.yr, r.premium, r.open, r.annSip, r.growth, r.close]);
        for (let c = 2; c <= 6; c++) row.getCell(c).numFmt = "#,##0";
        if (i % 2 === 1) row.eachCell(c => c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFAFBFD" } });
      });
      ws.addRow([]);

      // Auto-fit all columns
      ws.columns.forEach(col => {
        let maxLen = 10;
        col.eachCell({ includeEmpty: false }, cell => {
          const val = cell.value !== null && cell.value !== undefined ? String(cell.value) : "";
          if (val.length > maxLen) maxLen = val.length;
        });
        col.width = Math.min(maxLen + 4, 40);
      });

      // Disclaimer — fixed wide, no auto-fit
      const dr = ws.addRow(["Mutual Fund investments are subject to market risks. SIP growth is assumed at the specified rate. This is for illustration purposes only and does not constitute investment advice. Radds Capital — AMFI-Registered Mutual Fund Distributor (ARN-334716)."]);
      dr.getCell(1).font = { italic: true, size: 8, color: { argb: "FF999999" }, name: "Arial" };
      dr.getCell(1).alignment = { wrapText: true };
      ws.getRow(ws.rowCount).height = 36;
      ws.getColumn(1).width = Math.max(ws.getColumn(1).width, 30); // don't shrink col1 for disclaimer

      const buf = await wb.xlsx.writeBuffer();
      saveAs(new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), `Radds_TermInsurance_${Date.now()}.xlsx`);
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
      doc.text("Term Insurance Planner", 14, y); y += 7;
      doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(107, 126, 153);
      doc.text(`Premium: Rs.${premium.toLocaleString("en-IN")}/yr  |  SIP: Rs.${sipAmt.toLocaleString("en-IN")}/mo  |  Tenure: ${tenure} yrs  |  Rate: ${growthRate}%`, 14, y); y += 10;

      // Summary boxes
      const boxes = [["Total Premiums", calc.totalPremiums], ["SIP Invested", calc.totalSipInvested], ["Final Corpus", calc.corpus]];
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

      autoTable(doc, {
        startY: y,
        head: [["Year", "Annual Premium", "SIP Opening", "Annual SIP", "Growth", "SIP Closing"]],
        body: calc.rows.map(r => [r.yr, "Rs. "+Math.round(r.premium).toLocaleString("en-IN"), "Rs. "+Math.round(r.open).toLocaleString("en-IN"), "Rs. "+Math.round(r.annSip).toLocaleString("en-IN"), "Rs. "+Math.round(r.growth).toLocaleString("en-IN"), "Rs. "+Math.round(r.close).toLocaleString("en-IN")]),
        styles: { fontSize: 8, cellPadding: 2.5 },
        headStyles: { fillColor: [34, 86, 143], textColor: [255, 255, 255], fontStyle: "bold" },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        margin: { left: 14, right: 14 },
      });

      y = doc.lastAutoTable.finalY + 8;
      const disc = "Mutual Fund investments are subject to market risks. SIP growth at specified rate is an assumption, not a guarantee. This is for illustration only and does not constitute investment advice. Radds Capital — AMFI-Registered MFD.";
      doc.setFont("helvetica", "italic"); doc.setFontSize(7); doc.setTextColor(107, 126, 153);
      if (y + 12 > doc.internal.pageSize.getHeight() - 10) { doc.addPage(); y = 14; }
      doc.text(doc.splitTextToSize(disc, W - 28), 14, y);
      doc.save(`Radds_TermInsurance_${Date.now()}.pdf`);
    } catch (e) { console.error(e); alert("Export failed."); }
    finally { setExporting(null); }
  }

  return (
    <section className="bg-lightbg py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#22568F]/10 rounded-xl flex items-center justify-center">
              <Shield size={20} className="text-[#22568F]" />
            </div>
            <h1 className="font-playfair text-3xl font-bold text-[#0D1B2E]">Term Insurance Planner</h1>
          </div>
          <p className="text-[#6B7E99]">Invest a monthly SIP equal to a portion of your premium. See how the corpus can offset total premiums paid over the policy tenure.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
          {/* Inputs */}
          <div className="bg-white rounded-2xl border border-[#E2EBF5] p-6 space-y-5 h-fit">
            <h2 className="font-semibold text-[#0D1B2E]">Policy Parameters</h2>
            <NumInput label="Annual Premium" value={premium} onChange={setPremium} />
            <NumInput label="Monthly SIP to Offset" value={sipAmt} onChange={setSipAmt} />
            <NumInput label="Policy Tenure" value={tenure} onChange={setTenure} prefix="" suffix=" years" />
            <NumInput label="SIP Growth Rate (p.a.)" value={growthRate} onChange={setGrowthRate} prefix="" suffix="%" />
          </div>

          {/* Results */}
          <div className="space-y-5">
            {/* Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-[#E2EBF5] p-5">
                <p className="text-xs text-[#6B7E99] mb-1">Total Premiums Paid</p>
                <p className="text-2xl font-bold text-red-600">{inr(calc.totalPremiums)}</p>
              </div>
              <div className="bg-white rounded-xl border border-[#E2EBF5] p-5">
                <p className="text-xs text-[#6B7E99] mb-1">Total SIP Invested</p>
                <p className="text-2xl font-bold text-[#6B7E99]">{inr(calc.totalSipInvested)}</p>
              </div>
              <div className="bg-white rounded-xl border border-[#E2EBF5] p-5">
                <p className="text-xs text-[#6B7E99] mb-1">Final SIP Corpus</p>
                <p className="text-2xl font-bold text-[#22568F]">{inr(calc.corpus)}</p>
              </div>
              <div className={`rounded-xl border p-5 ${calc.net >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                <p className="text-xs text-[#6B7E99] mb-1">Net Benefit (Corpus − Premiums)</p>
                <p className={`text-2xl font-bold ${calc.net >= 0 ? "text-green-700" : "text-red-600"}`}>{inr(calc.net)}</p>
              </div>
            </div>

            {/* Year-by-year table */}
            <div className="bg-white rounded-2xl border border-[#E2EBF5] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#E2EBF5]">
                <h3 className="font-semibold text-[#0D1B2E] text-sm">Premium vs SIP Corpus — Year by Year</h3>
              </div>
              <div className="overflow-auto max-h-72">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-[#22568F] text-white">
                    <tr>
                      {["Yr", "Premium Paid", "SIP Opening", "Annual SIP", "Growth", "SIP Closing"].map(h => (
                        <th key={h} className="px-4 py-2.5 text-right first:text-left font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {calc.rows.map((r, i) => (
                      <tr key={r.yr} className={i % 2 === 0 ? "bg-white" : "bg-[#F9FBFD]"}>
                        <td className="px-4 py-2 text-[#6B7E99]">{r.yr}</td>
                        <td className="px-4 py-2 text-right text-red-500">{inr(r.premium)}</td>
                        <td className="px-4 py-2 text-right">{inr(r.open)}</td>
                        <td className="px-4 py-2 text-right text-[#22568F]">{inr(r.annSip)}</td>
                        <td className="px-4 py-2 text-right text-green-600">{inr(r.growth)}</td>
                        <td className="px-4 py-2 text-right font-semibold">{inr(r.close)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Export buttons */}
            <div className="flex flex-wrap gap-2">
              <button onClick={exportXLSX} disabled={!!exporting}
                className="flex items-center gap-1.5 text-sm font-semibold border border-[#22568F] text-[#22568F] px-4 py-2 rounded-lg hover:bg-[#22568F] hover:text-white transition-colors disabled:opacity-50">
                <Download size={14} />{exporting === "xlsx" ? "Generating..." : "Export Excel"}
              </button>
              <button onClick={exportPDF} disabled={!!exporting}
                className="flex items-center gap-1.5 text-sm font-semibold border border-[#22568F] text-[#22568F] px-4 py-2 rounded-lg hover:bg-[#22568F] hover:text-white transition-colors disabled:opacity-50">
                <FileText size={14} />{exporting === "pdf" ? "Generating..." : "Export PDF"}
              </button>
            </div>

            <p className="text-xs text-[#6B7E99] flex gap-1.5">
              <AlertCircle size={13} className="flex-shrink-0 mt-0.5" />
              SIP growth assumed at the specified rate, compounded annually. Mutual fund returns are not guaranteed. This is for planning purposes only and does not constitute investment advice.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
