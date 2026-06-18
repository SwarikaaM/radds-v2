import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { calculatorRegistry, getDefaultValues } from "../data/calculatorRegistry";
import CalculatorHero from "../components/calculator-detail/CalculatorHero";
import CalculatorInputPanel from "../components/calculator-detail/CalculatorInputPanel";
import CalculatorSummary from "../components/calculator-detail/CalculatorSummary";
import CalculatorChart from "../components/calculator-detail/CalculatorChart";
import CalculatorYearlyTable from "../components/calculator-detail/CalculatorYearlyTable";
import CalculatorAssumptions from "../components/calculator-detail/CalculatorAssumptions";
import RelatedCalculators from "../components/calculator-detail/RelatedCalculators";
import CalculatorDetailFAQ from "../components/calculator-detail/CalculatorDetailFAQ";
import HomeLoanCalc from "../components/calculators/HomeLoanCalc";
import NetWorthCalc from "../components/calculators/NetWorthCalc";
import TermInsuranceCalc from "../components/calculators/TermInsuranceCalc";

const SPECIAL_SLUGS = {
  "home-loan-interest-free": HomeLoanCalc,
  "net-worth": NetWorthCalc,
  "term-insurance": TermInsuranceCalc,
};

export default function CalculatorDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Special standalone calculators
  if (SPECIAL_SLUGS[slug]) {
    const SpecialCalc = SPECIAL_SLUGS[slug];
    return (
      <>
        <div className="bg-lightbg pt-20 pb-0">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm text-[#6B7E99] hover:text-[#22568F] transition-colors mb-2"
            >
              ← Back
            </button>
          </div>
        </div>
        <SpecialCalc />
        <RelatedCalculators currentSlug={slug} />
      </>
    );
  }

  const config = calculatorRegistry[slug];

  const [values, setValues] = useState(() => config ? getDefaultValues(config) : {});

  useEffect(() => {
    if (!config) return;
    document.title = `${config.title} | Radds Capital`;
  }, [config]);

  useEffect(() => {
    if (!config) return;
    setValues(getDefaultValues(config));
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!config) return <Navigate to="/calculators" replace />;

  const results = useMemo(() => config.compute(values), [config, values]);
  const chartData = useMemo(() => config.buildChartData(values), [config, values]);

  return (
    <>
      <div className="bg-lightbg pt-20 pb-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-[#6B7E99] hover:text-[#22568F] transition-colors mb-2"
          >
            ← Back
          </button>
        </div>
      </div>

      <CalculatorHero title={config.title} subtitle={config.shortDescription} />

      <section className="bg-lightbg py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-[#E2EBF5] shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] divide-y lg:divide-y-0 lg:divide-x divide-[#E2EBF5]">
              <div className="p-7 lg:p-8">
                <CalculatorInputPanel
                  inputs={config.inputs}
                  values={values}
                  onChange={setValues}
                />
              </div>
              <div className="p-7 lg:p-8 space-y-7 flex flex-col">
                <CalculatorSummary summaryKeys={config.summaryKeys} results={results} />
                <CalculatorChart chartData={chartData} chartSeries={config.chartSeries} />
                <CalculatorYearlyTable
                  tableColumns={config.tableColumns}
                  tableRowKeys={config.tableRowKeys}
                  chartData={chartData}
                />
                <CalculatorAssumptions />
              </div>
            </div>
          </div>
        </div>
      </section>

      <RelatedCalculators currentSlug={slug} />
      <CalculatorDetailFAQ faqs={config.faqs} calculatorTitle={config.shortTitle} />
    </>
  );
}
