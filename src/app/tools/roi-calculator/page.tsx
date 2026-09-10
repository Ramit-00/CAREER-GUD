'use client';

import {
  AlertCircle,
  ArrowRight,
  Calculator,
  CheckCircle2,
  DollarSign,
  ExternalLink,
  HelpCircle,
  Info,
  Landmark,
  Percent,
  PiggyBank,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import React, { useMemo, useState } from 'react';

export default function HigherEducationRoiPage() {
  const [tuitionPerYear, setTuitionPerYear] = useState<number>(250000); // 2.5 LPA
  const [livingPerYear, setLivingPerYear] = useState<number>(120000); // 1.2 LPA
  const [durationYears, setDurationYears] = useState<number>(4); // 4 years
  const [prepExpenses, setPrepExpenses] = useState<number>(150000); // 1.5 Lakhs coaching
  const [medianSalaryLPA, setMedianSalaryLPA] = useState<number>(9.5); // 9.5 LPA
  const [loanAmount, setLoanAmount] = useState<number>(1000000); // 10 Lakhs loan
  const [interestRate, setInterestRate] = useState<number>(9.5); // 9.5%
  const [tenureYears, setTenureYears] = useState<number>(7); // 7 years
  const [annualFamilyIncome, setAnnualFamilyIncome] = useState<number>(600000); // 6 LPA

  const calculations = useMemo(() => {
    const totalTuition = tuitionPerYear * durationYears;
    const totalLiving = livingPerYear * durationYears;
    const totalInvestment = totalTuition + totalLiving + prepExpenses;

    // Monthly interest calculation: P * r * (1+r)^n / ((1+r)^n - 1)
    const principal = loanAmount;
    const monthlyRate = interestRate / 12 / 100;
    const totalMonths = tenureYears * 12;

    let emi = 0;
    let totalRepaid = 0;
    let totalInterest = 0;

    if (principal > 0 && monthlyRate > 0) {
      emi = Math.round(
        (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
          (Math.pow(1 + monthlyRate, totalMonths) - 1)
      );
      totalRepaid = emi * totalMonths;
      totalInterest = totalRepaid - principal;
    }

    // Realistic Net Monthly Take-Home (approx 82% of CTC after standard deductions & taxes)
    const annualTakeHome = medianSalaryLPA * 100000 * 0.82;
    const monthlyTakeHome = Math.round(annualTakeHome / 12);

    // Break-even horizon: years needed to recover total investment assuming 40% of salary dedicated to education recovery
    const annualSavingsForRecovery = annualTakeHome * 0.4;
    const breakEvenYears = annualSavingsForRecovery > 0 ? (totalInvestment / annualSavingsForRecovery).toFixed(1) : '10+';

    // CSIS Subsidy Eligibility: Central Sector Interest Subsidy for Economically Weaker Students
    // Eligible if parental annual income <= ₹4.5 Lakhs for professional courses in India
    const isCsisEligible = annualFamilyIncome <= 450000 && loanAmount > 0;

    // ROI Verdict
    const roiRatio = (medianSalaryLPA * 100000) / totalInvestment;
    let verdict: { title: string; color: string; desc: string } = {
      title: 'Healthy Return on Investment',
      color: 'emerald',
      desc: 'Annual starting salary is proportional to total degree investment. Debt repayment is manageable.',
    };

    if (roiRatio < 0.3) {
      verdict = {
        title: 'High Financial Friction / Debt Trap Warning',
        color: 'rose',
        desc: 'Total degree expenditure significantly exceeds realistic starting packages. Monthly EMI will consume over 40% of take-home pay.',
      };
    } else if (roiRatio < 0.5) {
      verdict = {
        title: 'Moderate ROI / Prudent Budgeting Required',
        color: 'amber',
        desc: 'Average break-even horizon of 4-6 years. Scrutinize college NIRF median placements before committing to high private fees.',
      };
    }

    return {
      totalInvestment,
      totalTuition,
      totalLiving,
      emi,
      totalRepaid,
      totalInterest,
      monthlyTakeHome,
      breakEvenYears,
      isCsisEligible,
      verdict,
    };
  }, [
    tuitionPerYear,
    livingPerYear,
    durationYears,
    prepExpenses,
    medianSalaryLPA,
    loanAmount,
    interestRate,
    tenureYears,
    annualFamilyIncome,
  ]);

  return (
    <div className="min-h-screen bg-slate-50 py-10 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300 mb-3">
            <PiggyBank className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            Financial Intelligence & Debt Safeguards
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Higher Education ROI & Education Loan EMI Calculator
          </h1>
          <p className="mt-3 text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
            Private colleges charge ₹15 Lakhs to ₹1 Crore while advertising deceptive maximum packages. Calculate your true break-even horizon against verified NIRF median compensation, EMI obligations, and government interest subsidies.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Form */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            {/* Degree Outlay Inputs */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Landmark className="h-4 w-4 text-[#0B2A4A] dark:text-amber-400" />
                1. Degree Investment Outlay
              </h3>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Annual College Tuition Fee (INR)</span>
                  <span className="text-[#0B2A4A] dark:text-amber-400 font-black">
                    ₹{(tuitionPerYear / 100000).toFixed(2)} Lakhs / yr
                  </span>
                </div>
                <input
                  type="range"
                  min={20000}
                  max={1200000}
                  step={20000}
                  value={tuitionPerYear}
                  onChange={(e) => setTuitionPerYear(Number(e.target.value))}
                  className="w-full accent-[#0B2A4A] dark:accent-amber-400 cursor-pointer h-2 bg-slate-200 rounded-lg dark:bg-slate-700"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Annual Hostel & Living Expenses (INR)</span>
                  <span className="text-[#0B2A4A] dark:text-amber-400 font-black">
                    ₹{(livingPerYear / 100000).toFixed(2)} Lakhs / yr
                  </span>
                </div>
                <input
                  type="range"
                  min={30000}
                  max={350000}
                  step={10000}
                  value={livingPerYear}
                  onChange={(e) => setLivingPerYear(Number(e.target.value))}
                  className="w-full accent-[#0B2A4A] dark:accent-amber-400 cursor-pointer h-2 bg-slate-200 rounded-lg dark:bg-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Degree Duration
                  </label>
                  <select
                    value={durationYears}
                    onChange={(e) => setDurationYears(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value={3}>3 Years (B.Sc / B.Com / BBA)</option>
                    <option value={4}>4 Years (B.Tech / B.Des)</option>
                    <option value={5}>5 Years (Law / IPMAT / B.Arch)</option>
                    <option value={5.5}>5.5 Years (MBBS)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Entrance Coaching Cost
                  </label>
                  <select
                    value={prepExpenses}
                    onChange={(e) => setPrepExpenses(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value={0}>₹0 (Self Study / School)</option>
                    <option value={100000}>₹1 Lakh (Online Coaching)</option>
                    <option value={200000}>₹2 Lakhs (Kota / Hyderabad 1-yr)</option>
                    <option value={400000}>₹4 Lakhs (2-Year Integrated)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Salary & Loan Inputs */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[#0B2A4A] dark:text-amber-400" />
                2. Salary Expectation & Loan Financing
              </h3>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  <span>NIRF Verified Median Package (LPA)</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-black">
                    ₹{medianSalaryLPA} LPA
                  </span>
                </div>
                <input
                  type="range"
                  min={3.5}
                  max={35}
                  step={0.5}
                  value={medianSalaryLPA}
                  onChange={(e) => setMedianSalaryLPA(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg dark:bg-slate-700"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Always use median placement from official NIRF reports, not highest marketing packages.
                </span>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Education Loan Principal Needed (INR)</span>
                  <span className="text-[#0B2A4A] dark:text-amber-400 font-black">
                    ₹{(loanAmount / 100000).toFixed(1)} Lakhs
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={3000000}
                  step={50000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full accent-[#0B2A4A] dark:accent-amber-400 cursor-pointer h-2 bg-slate-200 rounded-lg dark:bg-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Interest Rate (% p.a.)
                  </label>
                  <input
                    type="number"
                    step={0.1}
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 bg-white p-2 text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Repayment Tenure
                  </label>
                  <select
                    value={tenureYears}
                    onChange={(e) => setTenureYears(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 bg-white p-2 text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value={5}>5 Years (60 Months)</option>
                    <option value={7}>7 Years (84 Months)</option>
                    <option value={10}>10 Years (120 Months)</option>
                    <option value={15}>15 Years (180 Months)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Annual Parental / Family Income (INR)
                </label>
                <input
                  type="number"
                  step={50000}
                  value={annualFamilyIncome}
                  onChange={(e) => setAnnualFamilyIncome(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2 text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Used to evaluate Ministry of Education CSIS interest subsidy eligibility (threshold: ₹4.5 Lakhs).
                </span>
              </div>
            </div>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            {/* Financial Verdict Banner */}
            <div
              className={`rounded-2xl p-6 border-2 ${
                calculations.verdict.color === 'emerald'
                  ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 dark:border-emerald-500/60 dark:bg-emerald-950/30 dark:text-emerald-200'
                  : calculations.verdict.color === 'amber'
                  ? 'border-amber-500 bg-amber-50/70 text-amber-950 dark:border-amber-500/60 dark:bg-amber-950/30 dark:text-amber-200'
                  : 'border-rose-500 bg-rose-50/70 text-rose-950 dark:border-rose-500/60 dark:bg-rose-950/30 dark:text-rose-200'
              }`}
            >
              <div className="flex items-center gap-2 font-black text-base mb-1">
                {calculations.verdict.color === 'emerald' ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                )}
                <span>{calculations.verdict.title}</span>
              </div>
              <p className="text-xs font-medium leading-relaxed">
                {calculations.verdict.desc}
              </p>
            </div>

            {/* Key Metric Grids */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <span className="text-xs font-bold text-slate-500 block mb-1">
                  Total Degree Outlay
                </span>
                <span className="text-2xl font-black text-[#0B2A4A] dark:text-white">
                  ₹{(calculations.totalInvestment / 100000).toFixed(2)} Lakhs
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">
                  Tuition (₹{(calculations.totalTuition / 100000).toFixed(1)}L) + Living + Prep
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <span className="text-xs font-bold text-slate-500 block mb-1">
                  Break-Even Horizon
                </span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  ~{calculations.breakEvenYears} Years
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">
                  Assuming 40% salary savings
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <span className="text-xs font-bold text-slate-500 block mb-1">
                  Monthly Education EMI
                </span>
                <span className="text-2xl font-black text-rose-600 dark:text-rose-400">
                  ₹{calculations.emi.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">
                  For {tenureYears} years @ {interestRate}%
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <span className="text-xs font-bold text-slate-500 block mb-1">
                  Est. Net Monthly Take-Home
                </span>
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  ₹{calculations.monthlyTakeHome.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">
                  Post-tax in-hand estimate
                </span>
              </div>
            </div>

            {/* CSIS Scheme & Vidyalakshmi Portal Alert */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
              <div className="flex items-center gap-2">
                <Landmark className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  Central Sector Interest Subsidy Scheme (CSIS)
                </h4>
              </div>

              {calculations.isCsisEligible ? (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 dark:bg-emerald-950/30 dark:border-emerald-900/60 dark:text-emerald-200 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Eligible for 100% Moratorium Interest Waiver!
                  </div>
                  <p>
                    Because your annual family income is below ₹4.5 Lakhs, you qualify under the Ministry of Education CSIS scheme for 100% interest subsidy during the course period + 1 year moratorium.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  The CSIS interest waiver applies to families with annual gross income up to ₹4.5 Lakhs. For general education loans, interest accrues during the course duration unless serviced via partial payments.
                </p>
              )}

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <a
                  href="https://www.vidyalakshmi.co.in/Students/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Apply via Ministry of Finance Vidyalakshmi Portal <ExternalLink className="h-3.5 w-3.5" />
                </a>

                <Link
                  href="/consultants"
                  className="rounded-xl bg-[#0B2A4A] px-4 py-2 text-xs font-bold text-white hover:bg-[#081f37] dark:bg-amber-400 dark:text-slate-950 dark:hover:bg-amber-300 transition"
                >
                  Verify Career Trajectories with Mentors
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
