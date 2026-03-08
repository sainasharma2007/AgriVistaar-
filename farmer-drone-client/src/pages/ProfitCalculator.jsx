// import { useState } from "react";
// import { useLanguage } from "../context/LanguageContext";

// const ProfitCalculator = () => {
//   const { t } = useLanguage();
//   const [area, setArea] = useState("");
//   const [cost, setCost] = useState("");
//   const [price, setPrice] = useState("");
//   const [yieldPerAcre, setYieldPerAcre] = useState("");
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState("");

//   const handleCalculate = (e) => {
//     e.preventDefault();
//     setError("");

//     // BUG FIX 1: Validation — empty ya zero inputs pe calculate nahi karo
//     if (!area || !cost || !price || !yieldPerAcre) {
//       setError(t("allFieldsRequired") || "Please fill all fields.");
//       setResult(null);
//       return;
//     }

//     const areaNum = Number(area);
//     const costNum = Number(cost);
//     const priceNum = Number(price);
//     const yieldNum = Number(yieldPerAcre);

//     if (areaNum <= 0 || costNum <= 0 || priceNum <= 0 || yieldNum <= 0) {
//       setError(t("positiveValuesRequired") || "All values must be greater than 0.");
//       setResult(null);
//       return;
//     }

//     // Formula is correct — area (acres) * yield (quintal/acre) * price (₹/quintal) - cost (₹)
//     const totalYield = areaNum * yieldNum;           // in quintal
//     const revenue = totalYield * priceNum;           // in ₹
//     const profit = revenue - costNum;                // in ₹

//     setResult({ totalYield, revenue, profit });
//   };

//   return (
//     <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
//       <h1 className="text-2xl font-semibold text-emerald-800">
//         {t("profitCalculatorTitle")}
//       </h1>

//       <p className="text-sm text-slate-600">
//         {t("profitCalculatorDesc")}
//       </p>

//       <form
//         onSubmit={handleCalculate}
//         className="bg-white shadow p-4 rounded-lg space-y-3"
//       >
//         <input
//           type="number"
//           placeholder={t("areaPlaceholder")}
//           value={area}
//           onChange={(e) => setArea(e.target.value)}
//           className="w-full border rounded px-3 py-2"
//           min="0"
//         />
//         <input
//           type="number"
//           placeholder={t("totalCostPlaceholder")}
//           value={cost}
//           onChange={(e) => setCost(e.target.value)}
//           className="w-full border rounded px-3 py-2"
//           min="0"
//         />
//         <input
//           type="number"
//           placeholder={t("expectedPricePlaceholder")}
//           value={price}
//           onChange={(e) => setPrice(e.target.value)}
//           className="w-full border rounded px-3 py-2"
//           min="0"
//         />
//         <input
//           type="number"
//           placeholder={t("predictedYieldPlaceholder")}
//           value={yieldPerAcre}
//           onChange={(e) => setYieldPerAcre(e.target.value)}
//           className="w-full border rounded px-3 py-2"
//           min="0"
//         />

//         {/* BUG FIX 2: Validation error message */}
//         {error && (
//           <p className="text-sm text-red-600">{error}</p>
//         )}

//         {/* BUG FIX 3: Button text was reusing "profitCalculatorTitle" — use correct key */}
//         <button
//           type="submit"
//           className="w-full bg-green-600 text-white py-2 rounded font-semibold"
//         >
//           {t("calculateButton")}
//         </button>
//       </form>

//       {result && (
//         <div className="bg-green-50 border border-green-200 p-4 rounded-lg space-y-2">

//           {/* BUG FIX 4: Result lines were fully commented out — restored and fixed */}
//           <div className="flex justify-between text-sm text-slate-700">
//             <span>{t("totalYieldLabel")}</span>
//             <span className="font-medium">
//               {result.totalYield.toFixed(1)} {t("quintalUnit")}
//             </span>
//           </div>

//           <div className="flex justify-between text-sm text-slate-700">
//             <span>{t("totalRevenueLabel")}</span>
//             <span className="font-medium">₹{result.revenue.toLocaleString("en-IN")}</span>
//           </div>

//           <div className="flex justify-between text-sm text-slate-700">
//             <span>{t("totalCostLabel")}</span>
//             <span className="font-medium text-red-600">
//               ₹{Number(cost).toLocaleString("en-IN")}
//             </span>
//           </div>

//           <hr className="border-green-200" />

//           {/* BUG FIX 5: Profit can be negative — show colour accordingly */}
//           <div className="flex justify-between font-semibold text-base">
//             <span>{t("netProfitLabel")}</span>
//             <span className={result.profit >= 0 ? "text-green-700" : "text-red-600"}>
//               {result.profit >= 0 ? "+" : ""}₹{result.profit.toLocaleString("en-IN")}
//             </span>
//           </div>

//           {/* BUG FIX 6: profitCalculatorHint key was missing translation — now shown only as helper tip */}
//           <p className="text-xs text-amber-700 mt-2">
//             {t("profitCalculatorHint")}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfitCalculator;


