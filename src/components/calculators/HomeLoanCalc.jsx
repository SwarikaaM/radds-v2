import { useState, useMemo } from "react";
import { Home, TrendingUp, AlertCircle, Download, FileText } from "lucide-react";
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

function inr(n) { return "₹" + Math.round(n).toLocaleString("en-IN"); }

export default function HomeLoanCalc() {
  const [loanAmt, setLoanAmt] = useState(5000000);
  const [tenure, setTenure] = useState(20);
  const [rate, setRate] = useState(8.5); // Home loan interest rate

  const calc = useMemo(() => {
    // 1. Calculate actual Home Loan EMI dynamically based on user input
    // Formula: EMI = [P x R x (1+R)^N]/[((1+R)^N)-1]
    const monthlyLoanRate = (rate / 100) / 12;
    const totalMonths = tenure * 12;
    
    let calculatedEmi = 0;
    if (loanAmt > 0 && monthlyLoanRate > 0 && totalMonths > 0) {
      calculatedEmi = Math.round(
        (loanAmt * monthlyLoanRate * Math.pow(1 + monthlyLoanRate, totalMonths)) / 
        (Math.pow(1 + monthlyLoanRate, totalMonths) - 1)
      );
    }

    // 2. Total loan payments and total interest payable
    const totalPaid = calculatedEmi * totalMonths;
    const totalInterest = Math.max(0, totalPaid - loanAmt);

    // 3. SIP Math: Fixed 12% p.a. growth assumed for investment
    const sipRate = 0.12 / 12; 
    const sipNeeded = totalInterest > 0 && totalMonths > 0
      ? Math.ceil((totalInterest * sipRate) / ((Math.pow(1 + sipRate, totalMonths) - 1) * (1 + sipRate)))
      : 0;
    const annualSip = sipNeeded * 12;

    // 4. Year-by-year accumulation table (at fixed 12%)
    let sipOpen = 0;
    const rows = [];
    for (let yr = 1; yr <= tenure; yr++) {
      const openingBalance = sipOpen;
      for (let m = 0; m < 12; m++) {
        sipOpen = (sipOpen + sipNeeded) * (1 + sipRate);
      }
      const close = sipOpen;
      const add = annualSip;
      const growth = close - openingBalance - add;
      rows.push({ yr, open: openingBalance, add, growth, close });
    }

    const finalCorpus = sipOpen;
    const net = finalCorpus - totalInterest;

    return { calculatedEmi, totalPaid, totalInterest, sipNeeded, annualSip, rows, finalCorpus, net };
  }, [loanAmt, tenure, rate]);

  const [exporting, setExporting] = useState(null);

  async function exportXLSX() {
    setExporting("xlsx");
    try {
      const wb = new ExcelJS.Workbook();
      const ws = wb.addWorksheet("Home Loan Offset");

      // Row 1 — height 35
      const r1 = ws.addRow(["", "Home Loan Interest Offset Calculator"]);
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
      ws.addRow([`Loan: ₹${loanAmt.toLocaleString("en-IN")}  |  Rate: ${rate}%  |  Tenure: ${tenure} yrs  |  EMI: ₹${calc.calculatedEmi.toLocaleString("en-IN")}/mo`]).getCell(1).font = { size: 9, name: "Arial" };
      ws.addRow([]);

      // Summary
      const sh = ws.addRow(["SUMMARY"]);
      sh.getCell(1).font = { bold: true, color: { argb: "FF22568F" }, size: 10, name: "Arial" };
      sh.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFEAF2FF" } };
      ws.addRow([]);
      [["Total Interest Payable", calc.totalInterest], ["Monthly SIP to Offset Interest", calc.sipNeeded], [`Final SIP Corpus (${tenure} yrs @ 12%)`, calc.finalCorpus], ["Net Benefit (Corpus − Interest)", calc.net]].forEach(([l, v]) => {
        const r = ws.addRow([l, v]);
        r.getCell(1).font = { bold: true, size: 10, name: "Arial" };
        r.getCell(2).numFmt = "#,##0";
      });
      ws.addRow([]);

      // Table
      const hdr = ws.addRow(["Year", "Opening Balance", "Annual SIP", "Growth @12%", "Closing Corpus"]);
      hdr.eachCell(c => {
        c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF22568F" } };
        c.font = { color: { argb: "FFFFFFFF" }, bold: true, size: 10, name: "Arial" };
        c.alignment = { horizontal: "center", vertical: "middle" };
      });
      calc.rows.forEach((r, i) => {
        const row = ws.addRow([r.yr, r.open, r.add, r.growth, r.close]);
        for (let c = 2; c <= 5; c++) row.getCell(c).numFmt = "#,##0";
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

      // Disclaimer row — fixed, not auto-fit-reduced
      const dr = ws.addRow(["Mutual Fund investments are subject to market risks. 12% p.a. is a benchmark assumption for illustration only, not a guarantee of returns. Radds Capital — AMFI-Registered Mutual Fund Distributor (ARN-334716)."]);
      dr.getCell(1).font = { italic: true, size: 8, color: { argb: "FF999999" }, name: "Arial" };
      dr.getCell(1).alignment = { wrapText: true };
      ws.getRow(ws.rowCount).height = 36;

      const buf = await wb.xlsx.writeBuffer();
      saveAs(new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), `Radds_HomeLoanOffset_${Date.now()}.xlsx`);
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
      doc.text("Home Loan Interest Offset Calculator", 14, y); y += 7;
      doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(107, 126, 153);
      doc.text(`Loan: Rs. ${loanAmt.toLocaleString("en-IN")}  |  Rate: ${rate}%  |  Tenure: ${tenure} yrs  |  EMI: Rs. ${calc.calculatedEmi.toLocaleString("en-IN")}/mo`, 14, y); y += 10;

      const boxes = [["Total Interest", calc.totalInterest, [204,0,0]], ["Monthly SIP Needed", calc.sipNeeded, [26,127,60]], ["Final Corpus", calc.finalCorpus, [34,86,143]], ["Net Benefit", calc.net, calc.net >= 0 ? [26,127,60] : [204,0,0]]];
      const bw = (W - 28 - 12) / 4;
      boxes.forEach(([l, v, col], i) => {
        const x = 14 + i * (bw + 4);
        doc.setFillColor(234, 242, 255); doc.roundedRect(x, y, bw, 18, 2, 2, "F");
        doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(...col);
        doc.text("Rs. " + Math.round(v).toLocaleString("en-IN"), x + bw / 2, y + 8, { align: "center" });
        doc.setFont("helvetica", "normal"); doc.setFontSize(7); doc.setTextColor(107, 126, 153);
        doc.text(l, x + bw / 2, y + 14, { align: "center" });
      });
      y += 24;

      autoTable(doc, {
        startY: y,
        head: [["Year", "Opening Balance", "Annual SIP", "Growth @12%", "Closing Corpus"]],
        body: calc.rows.map(r => [r.yr, "Rs. "+Math.round(r.open).toLocaleString("en-IN"), "Rs. "+Math.round(r.add).toLocaleString("en-IN"), "Rs. "+Math.round(r.growth).toLocaleString("en-IN"), "Rs. "+Math.round(r.close).toLocaleString("en-IN")]),
        styles: { fontSize: 8, cellPadding: 2.5 },
        headStyles: { fillColor: [34, 86, 143], textColor: [255, 255, 255], fontStyle: "bold" },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        margin: { left: 14, right: 14 },
      });

      y = doc.lastAutoTable.finalY + 8;
      const disc = "Mutual Fund investments are subject to market risks. 12% p.a. is a benchmark assumption for illustration only. This is not investment advice. Radds Capital — AMFI-Registered Mutual Fund Distributor.";
      doc.setFont("helvetica", "italic"); doc.setFontSize(7); doc.setTextColor(107, 126, 153);
      if (y + 12 > doc.internal.pageSize.getHeight() - 10) { doc.addPage(); y = 14; }
      doc.text(doc.splitTextToSize(disc, W - 28), 14, y);
      doc.save(`Radds_HomeLoanOffset_${Date.now()}.pdf`);
    } catch (e) { console.error(e); alert("Export failed."); }
    finally { setExporting(null); }
  }

  return (
    <section className="bg-lightbg py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#22568F]/10 rounded-xl flex items-center justify-center">
              <Home size={20} className="text-[#22568F]" />
            </div>
            <h1 className="font-playfair text-3xl font-bold text-[#0D1B2E]">Home Loan Interest Offset Calculator</h1>
          </div>
          <p className="text-[#6B7E99]">See how a parallel mutual fund SIP growing at 12% p.a. could potentially offset the total interest burden of your home loan.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
          {/* Inputs */}
          <div className="bg-white rounded-2xl border border-[#E2EBF5] p-6 space-y-5 h-fit">
            <h2 className="font-semibold text-[#0D1B2E]">Loan Parameters</h2>
            <NumInput label="Loan Amount" value={loanAmt} onChange={setLoanAmt} />
            <NumInput label="Home Loan Interest Rate (p.a.)" value={rate} onChange={setRate} prefix="" suffix="%" />
            <NumInput label="Loan Tenure" value={tenure} onChange={setTenure} prefix="" suffix=" years" />
            
            {/* Displaying Auto-Calculated EMI */}
            <div className="pt-3 border-t border-dashed border-[#E2EBF5]">
              <p className="text-xs font-medium text-[#6B7E99] mb-0.5">Calculated Monthly EMI</p>
              <p className="text-xl font-bold text-[#0D1B2E]">{inr(calc.calculatedEmi)}</p>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-5">
            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-[#E2EBF5] p-5">
                <p className="text-xs text-[#6B7E99] mb-1">Total Interest Payable</p>
                <p className="text-2xl font-bold text-red-600">{inr(calc.totalInterest)}</p>
              </div>
              <div className="bg-white rounded-xl border border-[#E2EBF5] p-5">
                <p className="text-xs text-[#6B7E99] mb-1">Monthly SIP to Offset Interest</p>
                <p className="text-2xl font-bold text-green-600">{inr(calc.sipNeeded)}<span className="text-sm font-normal text-[#6B7E99]">/mo</span></p>
              </div>
              <div className="bg-white rounded-xl border border-[#E2EBF5] p-5">
                <p className="text-xs text-[#6B7E99] mb-1">Final SIP Corpus ({tenure} yrs @ 12%)</p>
                <p className="text-2xl font-bold text-[#22568F]">{inr(calc.finalCorpus)}</p>
              </div>
              <div className={`rounded-xl border p-5 ${calc.net >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                <p className="text-xs text-[#6B7E99] mb-1">Net Benefit (Corpus − Interest)</p>
                <p className={`text-2xl font-bold ${calc.net >= 0 ? "text-green-700" : "text-red-600"}`}>{inr(calc.net)}</p>
              </div>
            </div>

            <div className="bg-[#EAF2FF] border border-[#C8DCF5] rounded-xl p-4 flex gap-3">
              <TrendingUp size={18} className="text-[#22568F] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#22568F]">
                By investing <strong>{inr(calc.sipNeeded)}/month</strong> at an assumed 12% p.a. equity return rate, your generated corpus can neutralize the interest costs generated by your <strong>{rate}%</strong> home loan.
              </p>
            </div>

            {/* Year-by-year table */}
            <div className="bg-white rounded-2xl border border-[#E2EBF5] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#E2EBF5]">
                <h3 className="font-semibold text-[#0D1B2E] text-sm">SIP Growth Table ({tenure} Years @ Fixed 12% p.a.)</h3>
              </div>
              <div className="overflow-auto max-h-72">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-[#22568F] text-white">
                    <tr>
                      {["Yr", "Opening", "Annual SIP", "Growth", "Closing"].map(h => (
                        <th key={h} className="px-4 py-2.5 text-right first:text-left font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {calc.rows.map((r, i) => (
                      <tr key={r.yr} className={i % 2 === 0 ? "bg-white" : "bg-[#F9FBFD]"}>
                        <td className="px-4 py-2 text-[#6B7E99]">{r.yr}</td>
                        <td className="px-4 py-2 text-right">{inr(r.open)}</td>
                        <td className="px-4 py-2 text-right text-[#22568F]">{inr(r.add)}</td>
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

            {/* Explicit Clear Disclaimers */}
            <div className="text-xs text-[#6B7E99] space-y-2 bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="flex gap-1.5 font-medium text-gray-700">
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5 text-amber-600" />
                Important Disclaimers:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Home Loan Rate vs. Investment Return:</strong> The Home Loan calculations dynamically adjust based on your current input parameter. The parallel mutual fund SIP growth rate is strictly simulated at a fixed benchmark rate of 12% p.a.</li>
                <li><strong>No Guaranteed Outcomes:</strong> Real-world mutual fund products are subject to market risks. Actual investment returns fluctuate over time and are not guaranteed.</li>
                <li><strong>Taxation Not Included:</strong> This calculation does not factor in components like Capital Gains Tax (LTCG) on investment withdrawals or Income Tax deductions under Section 24(b) for home loan interest payments.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
