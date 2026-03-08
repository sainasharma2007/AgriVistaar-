

// // src/pages/FieldDetail.jsx
// import FraudCheckCard from "../components/FraudCheckCard";
// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useLanguage } from "../context/LanguageContext";
// import api from "../api";

// // ── Analysis translate karo ──────────────────────────────────
// const DIRECTION = {
//   hi: { north: "उत्तर", south: "दक्षिण", east: "पूर्व", west: "पश्चिम" },
//   ta: { north: "வட", south: "தென்", east: "கிழக்கு", west: "மேற்கு" },
//   bn: { north: "উত্তর", south: "দক্ষিণ", east: "পূর্ব", west: "পশ্চিম" },
//   te: { north: "ఉత్తర", south: "దక్షిణ", east: "తూర్పు", west: "పశ్చిమ" },
//   mr: { north: "उत्तर", south: "दक्षिण", east: "पूर्व", west: "पश्चिम" },
// };

// function translateAnalysis(text, lang) {
//   if (!text || lang === "en") return text;
//   const d = DIRECTION[lang] || {};
//   const rules = {
//     hi: [
//       [/mild stress detected in ~?(\d+)% area,?\s*mainly in (north|south|east|west) side\.?/gi, (_, p, dir) => `लगभग ${p}% क्षेत्र में हल्का तनाव, मुख्यतः ${d[dir.toLowerCase()] || dir} हिस्से में।`],
//       [/recommended nitrogen spray within (\d+) days\.?/gi, (_, d) => `${d} दिनों में नाइट्रोजन स्प्रे करें।`],
//       [/no issues detected\.?/gi, () => "कोई समस्या नहीं मिली।"],
//       [/healthy crop\.?/gi, () => "फसल स्वस्थ है।"],
//       [/yield estimated at ([\d–\-]+)/gi, (_, y) => `अनुमानित उपज: ${y} क्विंटल/एकड़`],
//     ],
//     ta: [
//       [/mild stress detected in ~?(\d+)% area,?\s*mainly in (north|south|east|west) side\.?/gi, (_, p, dir) => `சுமார் ${p}% பரப்பில் லேசான அழுத்தம், ${d[dir.toLowerCase()] || dir} பகுதியில்।`],
//       [/recommended nitrogen spray within (\d+) days\.?/gi, (_, day) => `${day} நாட்களுக்குள் நைட்ரஜன் தெளிப்பு।`],
//       [/no issues detected\.?/gi, () => "எந்த பிரச்சினையும் இல்லை।"],
//       [/healthy crop\.?/gi, () => "பயிர் ஆரோக்கியமாக உள்ளது।"],
//     ],
//     bn: [
//       [/mild stress detected in ~?(\d+)% area,?\s*mainly in (north|south|east|west) side\.?/gi, (_, p, dir) => `প্রায় ${p}% এলাকায় হালকা চাপ, ${d[dir.toLowerCase()] || dir} দিকে।`],
//       [/recommended nitrogen spray within (\d+) days\.?/gi, (_, day) => `${day} দিনের মধ্যে নাইট্রোজেন স্প্রে।`],
//       [/no issues detected\.?/gi, () => "কোনো সমস্যা নেই।"],
//       [/healthy crop\.?/gi, () => "ফসল সুস্থ।"],
//     ],
//     te: [
//       [/mild stress detected in ~?(\d+)% area,?\s*mainly in (north|south|east|west) side\.?/gi, (_, p, dir) => `సుమారు ${p}% ప్రాంతంలో స్వల్ప ఒత్తిడి, ${d[dir.toLowerCase()] || dir} వైపు।`],
//       [/recommended nitrogen spray within (\d+) days\.?/gi, (_, day) => `${day} రోజుల్లో నైట్రోజన్ స్ప్రే।`],
//       [/no issues detected\.?/gi, () => "సమస్య లేదు।"],
//       [/healthy crop\.?/gi, () => "పంట ఆరోగ్యంగా ఉంది।"],
//     ],
//     mr: [
//       [/mild stress detected in ~?(\d+)% area,?\s*mainly in (north|south|east|west) side\.?/gi, (_, p, dir) => `सुमारे ${p}% क्षेत्रात सौम्य ताण, ${d[dir.toLowerCase()] || dir} बाजूला।`],
//       [/recommended nitrogen spray within (\d+) days\.?/gi, (_, day) => `${day} दिवसांत नायट्रोजन फवारणी।`],
//       [/no issues detected\.?/gi, () => "कोणतीही समस्या नाही।"],
//       [/healthy crop\.?/gi, () => "पीक निरोगी आहे।"],
//     ],
//   };
//   let result = text;
//   for (const [pattern, replacer] of rules[lang] || []) {
//     result = result.replace(pattern, replacer);
//   }
//   return result;
// }

// // ── Status badge ─────────────────────────────────────────────
// const StatusBadge = ({ status, t }) => {
//   if (status === "completed")
//     return (
//       <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
//         {t("completed")}
//       </span>
//     );
//   if (status === "images_uploaded" || status === "scheduled")
//     return (
//       <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
//         {t("imagesUploaded")}
//       </span>
//     );
//   return (
//     <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
//       {t("requested")}
//     </span>
//   );
// };

// // ── Health color ─────────────────────────────────────────────
// function getHealthStyle(analysis) {
//   const a = (analysis || "").toLowerCase();
//   if (!analysis) return { bg: "bg-slate-50 border-slate-200", text: "text-slate-600", emoji: "⏳" };
//   if (a.includes("no issues") || a.includes("healthy")) return { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-800", emoji: "✅" };
//   if (a.includes("mild")) return { bg: "bg-amber-50 border-amber-200", text: "text-amber-800", emoji: "⚠️" };
//   return { bg: "bg-red-50 border-red-200", text: "text-red-800", emoji: "🔴" };
// }

// // ── Confirm Delete Scan Modal ────────────────────────────────
// const ConfirmDeleteScanModal = ({ scanNumber, onConfirm, onCancel }) => (
//   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
//     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4 text-center">
//       <div className="text-4xl">🗑️</div>
//       <h2 className="text-lg font-bold text-gray-900">Delete Scan?</h2>
//       <p className="text-sm text-gray-500">
//         <span className="font-semibold text-gray-800">Scan {scanNumber}</span> permanently delete ho jayega.
//       </p>
//       <div className="flex gap-3">
//         <button onClick={onCancel} className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">
//           Cancel
//         </button>
//         <button onClick={onConfirm} className="flex-1 bg-red-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors">
//           Yes, Delete
//         </button>
//       </div>
//     </div>
//   </div>
// );

// // ════════════════════════════════════════════════════════════
// const FieldDetail = () => {
//   const { t, language } = useLanguage();
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const [field, setField] = useState(null);
//   const [scans, setScans] = useState([]);
//   const [selectedScan, setSelectedScan] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [scanToDelete, setScanToDelete] = useState(null);
//   const [deletingId, setDeletingId] = useState(null);

//   const getHeaders = () => {
//     const token = localStorage.getItem("authToken");
//     return token ? { Authorization: `Bearer ${token}` } : {};
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const headers = getHeaders();
//         const [fieldRes, jobsRes] = await Promise.all([
//           api.get(`/api/fields/${id}`, { headers }),
//           api.get("/api/drone-jobs/my", { headers }),
//         ]);

//         setField(fieldRes.data.field);

//         const fieldScans = (jobsRes.data.jobs || []).filter(
//           (j) => j.field?._id === id || j.field === id
//         );
//         setScans(fieldScans);

//         const latestCompleted = fieldScans.find((j) => j.status === "completed");
//         if (latestCompleted) setSelectedScan(latestCompleted);
//       } catch (err) {
//         console.error("FieldDetail fetch error:", err);
//         setError(t("fieldNotFound"));
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [id]);

//   const handleDeleteScanConfirm = async () => {
//     if (!scanToDelete) return;
//     const { scan } = scanToDelete;
//     setDeletingId(scan._id);
//     try {
//       const headers = getHeaders();
//       await api.delete(`/api/drone-jobs/${scan._id}`, { headers });
//       setScans((prev) => prev.filter((s) => s._id !== scan._id));
//       if (selectedScan?._id === scan._id) {
//         const remaining = scans.filter((s) => s._id !== scan._id);
//         const nextCompleted = remaining.find((s) => s.status === "completed");
//         setSelectedScan(nextCompleted || null);
//       }
//     } catch (err) {
//       console.error("Delete scan error:", err);
//       alert("Could not delete scan. Please try again.");
//     } finally {
//       setDeletingId(null);
//       setScanToDelete(null);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[50vh]">
//         <div className="w-7 h-7 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   if (error || !field) {
//     return (
//       <div className="p-4 max-w-xl mx-auto bg-white rounded-2xl shadow-sm space-y-3">
//         <p className="text-sm text-slate-600">{error || t("fieldNotFound")}</p>
//         <button onClick={() => navigate("/home")} className="text-sm text-emerald-700 hover:underline">
//           ← {t("myFields")}
//         </button>
//       </div>
//     );
//   }

//   const completedScans = scans.filter((s) => s.status === "completed");
//   const pendingScans = scans.filter((s) => s.status !== "completed");
//   const health = selectedScan ? getHealthStyle(selectedScan.analysis) : getHealthStyle(null);

//   return (
//     <div className="p-4 max-w-2xl mx-auto space-y-4 pb-10">

//       {/* Delete Scan Confirm Modal */}
//       {scanToDelete && (
//         <ConfirmDeleteScanModal
//           scanNumber={scans.length - scanToDelete.index}
//           onConfirm={handleDeleteScanConfirm}
//           onCancel={() => setScanToDelete(null)}
//         />
//       )}

//       {/* Back */}
//       <button onClick={() => navigate(-1)} className="text-sm text-slate-500 hover:text-slate-800 transition-colors">
//         ‹ {t("myFields")}
//       </button>

//       {/* Field Header */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
//         <div className="flex items-start justify-between gap-2">
//           <div>
//             <h1 className="text-xl font-bold text-gray-900">{field.name}</h1>
//             {field.cropType && <p className="text-sm text-emerald-700 mt-0.5">🌾 {field.cropType}</p>}
//             {field.village && (
//               <p className="text-xs text-slate-400 mt-0.5">
//                 📍 {[field.village, field.district, field.state].filter(Boolean).join(", ")}
//               </p>
//             )}
//           </div>
//           <div className="text-right text-xs text-slate-400 flex-shrink-0">
//             {field.areaInAcre && <p>📐 {field.areaInAcre} acres</p>}
//             {field.season && <p>🌱 {field.season}</p>}
//           </div>
//         </div>

//         {/* Scan count summary */}
//         <div className="mt-3 flex gap-3">
//           <div className="flex-1 bg-emerald-50 rounded-xl px-3 py-2 text-center">
//             <p className="text-lg font-bold text-emerald-700">{completedScans.length}</p>
//             <p className="text-xs text-emerald-600">{t("completed")}</p>
//           </div>
//           <div className="flex-1 bg-amber-50 rounded-xl px-3 py-2 text-center">
//             <p className="text-lg font-bold text-amber-700">{pendingScans.length}</p>
//             <p className="text-xs text-amber-600">{t("requested")}</p>
//           </div>
//           <div className="flex-1 bg-blue-50 rounded-xl px-3 py-2 text-center">
//             <p className="text-lg font-bold text-blue-700">{scans.length}</p>
//             <p className="text-xs text-blue-600">Total</p>
//           </div>
//         </div>
//       </div>

//       {/* Selected Scan Report */}
//       {selectedScan ? (
//         <div className={`rounded-2xl border p-4 space-y-3 ${health.bg}`}>
//           <div className="flex items-center justify-between">
//             <h2 className={`text-base font-semibold ${health.text}`}>
//               {health.emoji} {t("healthSummaryTitle")}
//             </h2>
//             <span className="text-xs text-slate-400">
//               {new Date(selectedScan.createdAt).toLocaleDateString()}
//             </span>
//           </div>

//           <p className={`text-sm leading-relaxed ${health.text}`}>
//             {translateAnalysis(selectedScan.analysis, language) || t("analysisPendingLong")}
//           </p>

//           {selectedScan.analysis && (
//             <div className="bg-white/70 rounded-xl p-3 space-y-2">
//               {selectedScan.analysis.toLowerCase().includes("nitrogen") && (
//                 <div className="flex items-start gap-2">
//                   <span className="text-base">💧</span>
//                   <div>
//                     <p className="text-xs font-semibold text-gray-800">
//                       {language === "hi" ? "नाइट्रोजन स्प्रे करें" : "Apply Nitrogen spray"}
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       {language === "hi" ? "यूरिया या DAP 3 दिनों में।" : "Urea or DAP within 3 days."}
//                     </p>
//                   </div>
//                 </div>
//               )}
//               {selectedScan.analysis.toLowerCase().includes("pest") && (
//                 <div className="flex items-start gap-2">
//                   <span className="text-base">🐛</span>
//                   <div>
//                     <p className="text-xs font-semibold text-gray-800">
//                       {language === "hi" ? "कीटनाशक लगाएं" : "Apply pesticide"}
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       {language === "hi" ? "प्रभावित हिस्से पर।" : "Target affected area."}
//                     </p>
//                   </div>
//                 </div>
//               )}
//               {selectedScan.analysis.toLowerCase().includes("yield") && (
//                 <div className="flex items-start gap-2">
//                   <span className="text-base">📊</span>
//                   <div>
//                     <p className="text-xs font-semibold text-gray-800">{t("yieldPredictionTitle")}</p>
//                     <button onClick={() => navigate("/profit")} className="text-xs text-emerald-700 hover:underline">
//                       {t("openProfitCalculator")} →
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       ) : (
//         <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
//           <p className="text-sm text-slate-500">{t("noScans")}</p>
//         </div>
//       )}

//       {/* 🤖 AI Fraud Analysis Card */}
//       {selectedScan && selectedScan.status === "completed" && (
//         <FraudCheckCard
//           droneJobId={selectedScan._id}
//           fieldId={field._id}
//           language={language}
//         />
//       )}

//       {/* 🤖 AI Fraud Analysis Card */}
//       {selectedScan && selectedScan.status === "completed" && (
//         <FraudCheckCard
//           droneJobId={selectedScan._id}
//           fieldId={field._id}
//           language={language}
//         />
//       )}

//       {/* Scan History */}
//       {scans.length > 0 && (
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//           <div className="px-4 pt-4 pb-2">
//             <h3 className="text-base font-semibold text-gray-900">{t("myScansTitle")}</h3>
//             <p className="text-xs text-gray-400 mt-0.5">
//               {language === "hi"
//                 ? "किसी स्कैन पर टैप करके रिपोर्ट देखें • × से डिलीट करें"
//                 : "Tap any scan to view its report • × to delete"}
//             </p>
//           </div>

//           <ul className="divide-y divide-gray-50">
//             {scans.map((scan, idx) => {
//               const isSelected = selectedScan?._id === scan._id;
//               const isDeleting = deletingId === scan._id;
//               const h = getHealthStyle(scan.analysis);

//               return (
//                 <li
//                   key={scan._id}
//                   className={`px-4 py-3 transition-colors ${
//                     isDeleting ? "opacity-40 pointer-events-none" : ""
//                   } ${isSelected ? "bg-emerald-50" : "hover:bg-gray-50"}`}
//                 >
//                   <div className="flex items-center gap-2">
//                     <div
//                       className="flex-1 flex items-center gap-2 cursor-pointer min-w-0"
//                       onClick={() => setSelectedScan(scan)}
//                     >
//                       <span className="text-base flex-shrink-0">{h.emoji}</span>
//                       <div className="min-w-0">
//                         <p className="text-sm font-medium text-gray-900">
//                           {language === "hi" ? `स्कैन ${scans.length - idx}` : `Scan ${scans.length - idx}`}
//                         </p>
//                         <p className="text-xs text-gray-400">
//                           {new Date(scan.createdAt).toLocaleDateString()}
//                         </p>
//                       </div>
//                     </div>

//                     <div
//                       className="flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
//                       onClick={() => setSelectedScan(scan)}
//                     >
//                       <StatusBadge status={scan.status} t={t} />
//                       {isSelected && (
//                         <span className="text-emerald-500 text-sm font-bold">✓</span>
//                       )}
//                     </div>

//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setScanToDelete({ scan, index: idx });
//                       }}
//                       title="Delete this scan"
//                       className="ml-1 flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors text-lg leading-none"
//                     >
//                       ×
//                     </button>
//                   </div>

//                   {scan.analysis && (
//                     <p
//                       className="text-xs text-gray-500 mt-1.5 line-clamp-2 ml-7 cursor-pointer"
//                       onClick={() => setSelectedScan(scan)}
//                     >
//                       {translateAnalysis(scan.analysis, language)}
//                     </p>
//                   )}
//                   {!scan.analysis && scan.status !== "completed" && (
//                     <p className="text-xs text-amber-500 mt-1 ml-7">
//                       {t("analysisPendingShort")}
//                     </p>
//                   )}
//                 </li>
//               );
//             })}
//           </ul>
//         </div>
//       )}

//       {/* Action buttons */}
//       <div className="flex gap-3">
//         <button
//           onClick={() => navigate(`/request-scan?field=${field._id}`)}
//           className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-3 rounded-xl transition-colors"
//         >
//           {t("requestScanButton")}
//         </button>
//         <button
//           onClick={() => navigate("/profit")}
//           className="flex-1 bg-white border border-emerald-300 text-emerald-700 text-sm font-semibold py-3 rounded-xl hover:bg-emerald-50 transition-colors"
//         >
//           {t("openProfitCalculator")}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default FieldDetail;


// // src/pages/FieldDetail.jsx
// import FraudCheckCard from "../components/FraudCheckCard";
// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useLanguage } from "../context/LanguageContext";
// import api from "../api";

// // ── Analysis translate karo ──────────────────────────────────
// const DIRECTION = {
//   hi: { north: "उत्तर", south: "दक्षिण", east: "पूर्व", west: "पश्चिम" },
//   ta: { north: "வட", south: "தென்", east: "கிழக்கு", west: "மேற்கு" },
//   bn: { north: "উত্তর", south: "দক্ষিণ", east: "পূর্ব", west: "পশ্চিম" },
//   te: { north: "ఉత్తర", south: "దక్షిణ", east: "తూర్పు", west: "పశ్చిమ" },
//   mr: { north: "उत्तर", south: "दक्षिण", east: "पूर्व", west: "पश्चिम" },
// };

// function translateAnalysis(text, lang) {
//   if (!text || lang === "en") return text;
//   const d = DIRECTION[lang] || {};
//   const rules = {
//     hi: [
//       [/mild stress detected in ~?(\d+)% area,?\s*mainly in (north|south|east|west) side\.?/gi, (_, p, dir) => `लगभग ${p}% क्षेत्र में हल्का तनाव, मुख्यतः ${d[dir.toLowerCase()] || dir} हिस्से में।`],
//       [/recommended nitrogen spray within (\d+) days\.?/gi, (_, d) => `${d} दिनों में नाइट्रोजन स्प्रे करें।`],
//       [/no issues detected\.?/gi, () => "कोई समस्या नहीं मिली।"],
//       [/healthy crop\.?/gi, () => "फसल स्वस्थ है।"],
//       [/yield estimated at ([\d–\-]+)/gi, (_, y) => `अनुमानित उपज: ${y} क्विंटल/एकड़`],
//     ],
//     ta: [
//       [/mild stress detected in ~?(\d+)% area,?\s*mainly in (north|south|east|west) side\.?/gi, (_, p, dir) => `சுமார் ${p}% பரப்பில் லேசான அழுத்தம், ${d[dir.toLowerCase()] || dir} பகுதியில்।`],
//       [/recommended nitrogen spray within (\d+) days\.?/gi, (_, day) => `${day} நாட்களுக்குள் நைட்ரஜன் தெளிப்பு।`],
//       [/no issues detected\.?/gi, () => "எந்த பிரச்சினையும் இல்லை।"],
//       [/healthy crop\.?/gi, () => "பயிர் ஆரோக்கியமாக உள்ளது।"],
//     ],
//     bn: [
//       [/mild stress detected in ~?(\d+)% area,?\s*mainly in (north|south|east|west) side\.?/gi, (_, p, dir) => `প্রায় ${p}% এলাকায় হালকা চাপ, ${d[dir.toLowerCase()] || dir} দিকে।`],
//       [/recommended nitrogen spray within (\d+) days\.?/gi, (_, day) => `${day} দিনের মধ্যে নাইট্রোজেন স্প্রে।`],
//       [/no issues detected\.?/gi, () => "কোনো সমস্যা নেই।"],
//       [/healthy crop\.?/gi, () => "ফসল সুস্থ।"],
//     ],
//     te: [
//       [/mild stress detected in ~?(\d+)% area,?\s*mainly in (north|south|east|west) side\.?/gi, (_, p, dir) => `సుమారు ${p}% ప్రాంతంలో స్వల్ప ఒత్తిడి, ${d[dir.toLowerCase()] || dir} వైపు।`],
//       [/recommended nitrogen spray within (\d+) days\.?/gi, (_, day) => `${day} రోజుల్లో నైట్రోజన్ స్ప్రే।`],
//       [/no issues detected\.?/gi, () => "సమస్య లేదు।"],
//       [/healthy crop\.?/gi, () => "పంట ఆరోగ్యంగా ఉంది।"],
//     ],
//     mr: [
//       [/mild stress detected in ~?(\d+)% area,?\s*mainly in (north|south|east|west) side\.?/gi, (_, p, dir) => `सुमारे ${p}% क्षेत्रात सौम्य ताण, ${d[dir.toLowerCase()] || dir} बाजूला।`],
//       [/recommended nitrogen spray within (\d+) days\.?/gi, (_, day) => `${day} दिवसांत नायट्रोजन फवारणी।`],
//       [/no issues detected\.?/gi, () => "कोणतीही समस्या नाही।"],
//       [/healthy crop\.?/gi, () => "पीक निरोगी आहे।"],
//     ],
//   };
//   let result = text;
//   for (const [pattern, replacer] of rules[lang] || []) {
//     result = result.replace(pattern, replacer);
//   }
//   return result;
// }

// // ── Status badge ─────────────────────────────────────────────
// const StatusBadge = ({ status, t }) => {
//   if (status === "completed")
//     return <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">{t("completed")}</span>;
//   if (status === "images_uploaded" || status === "scheduled")
//     return <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">{t("imagesUploaded")}</span>;
//   return <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">{t("requested")}</span>;
// };

// // ── Health color ─────────────────────────────────────────────
// function getHealthStyle(analysis) {
//   const a = (analysis || "").toLowerCase();
//   if (!analysis) return { bg: "bg-slate-50 border-slate-200", text: "text-slate-600", emoji: "⏳" };
//   if (a.includes("no issues") || a.includes("healthy")) return { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-800", emoji: "✅" };
//   if (a.includes("mild")) return { bg: "bg-amber-50 border-amber-200", text: "text-amber-800", emoji: "⚠️" };
//   return { bg: "bg-red-50 border-red-200", text: "text-red-800", emoji: "🔴" };
// }

// // ── Confirm Delete Scan Modal ────────────────────────────────
// const ConfirmDeleteScanModal = ({ scanNumber, onConfirm, onCancel }) => (
//   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
//     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4 text-center">
//       <div className="text-4xl">🗑️</div>
//       <h2 className="text-lg font-bold text-gray-900">Delete Scan?</h2>
//       <p className="text-sm text-gray-500">
//         <span className="font-semibold text-gray-800">Scan {scanNumber}</span> permanently delete ho jayega.
//       </p>
//       <div className="flex gap-3">
//         <button onClick={onCancel} className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
//         <button onClick={onConfirm} className="flex-1 bg-red-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors">Yes, Delete</button>
//       </div>
//     </div>
//   </div>
// );

// // ── Start Inspection Modal ───────────────────────────────────
// const StartInspectionModal = ({ field, onConfirm, onCancel, loading }) => (
//   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
//     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
//       <div className="text-center">
//         <div className="text-4xl mb-2">🚁</div>
//         <h2 className="text-lg font-bold text-gray-900">Start Drone Inspection?</h2>
//         <p className="text-sm text-gray-500 mt-1">
//           <span className="font-semibold text-gray-800">"{field?.name}"</span> ke liye drone inspection shuru hogi.
//         </p>
//       </div>

//       <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 space-y-1 text-xs text-emerald-800">
//         <p>📐 Area: <span className="font-semibold">{field?.areaInAcre} acres</span></p>
//         <p>🌾 Crop: <span className="font-semibold">{field?.cropType || "Not set"}</span></p>
//         <p>⏱️ Est. Time: <span className="font-semibold">~3-5 minutes</span></p>
//       </div>

//       <div className="flex gap-3">
//         <button onClick={onCancel} disabled={loading}
//           className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 disabled:opacity-50">
//           Cancel
//         </button>
//         <button onClick={onConfirm} disabled={loading}
//           className="flex-1 bg-emerald-600 disabled:bg-gray-400 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors">
//           {loading ? "Starting..." : "🚁 Start Inspection"}
//         </button>
//       </div>
//     </div>
//   </div>
// );

// // ════════════════════════════════════════════════════════════
// const FieldDetail = () => {
//   const { t, language } = useLanguage();
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const [field, setField]             = useState(null);
//   const [scans, setScans]             = useState([]);
//   const [selectedScan, setSelectedScan] = useState(null);
//   const [loading, setLoading]         = useState(true);
//   const [error, setError]             = useState(null);
//   const [scanToDelete, setScanToDelete] = useState(null);
//   const [deletingId, setDeletingId]   = useState(null);

//   // ── Inspection state ─────────────────────────────────────
//   const [showInspectionModal, setShowInspectionModal] = useState(false);
//   const [inspectionLoading, setInspectionLoading]     = useState(false);
//   const [inspectionStatus, setInspectionStatus]       = useState(null); // success/error message

//   const getHeaders = () => {
//     const token = localStorage.getItem("authToken");
//     return token ? { Authorization: `Bearer ${token}` } : {};
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const headers = getHeaders();
//         const [fieldRes, jobsRes] = await Promise.all([
//           api.get(`/api/fields/${id}`, { headers }),
//           api.get("/api/drone-jobs/my", { headers }),
//         ]);
//         setField(fieldRes.data.field);
//         const fieldScans = (jobsRes.data.jobs || []).filter(
//           (j) => j.field?._id === id || j.field === id
//         );
//         setScans(fieldScans);
//         const latestCompleted = fieldScans.find((j) => j.status === "completed");
//         if (latestCompleted) setSelectedScan(latestCompleted);
//       } catch (err) {
//         console.error("FieldDetail fetch error:", err);
//         setError(t("fieldNotFound"));
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [id]);

//   // ── Start Inspection ─────────────────────────────────────
//   const handleStartInspection = async () => {
//     setInspectionLoading(true);
//     try {
//       const headers = getHeaders();

//       // Step 1: DroneInspection record banao
//       const inspRes = await api.post("/api/inspections/start",
//         { jobId: scans[0]?._id || id },
//         { headers }
//       );

//       const inspectionId = inspRes.data.inspectionId;

//       // Step 2: Simulate 3 second flight
//       await new Promise((resolve) => setTimeout(resolve, 3000));

//       // Step 3: Complete inspection with simulated data
//       await api.patch(`/api/inspections/${inspectionId}/complete`, {
//         flightPath: [
//           { lat: 27.5706, lng: 80.6982, alt: 30 },
//           { lat: 27.5710, lng: 80.6982, alt: 30 },
//           { lat: 27.5710, lng: 80.6990, alt: 30 },
//           { lat: 27.5706, lng: 80.6990, alt: 30 },
//         ],
//         sensorData: {
//           ndviValue:    +(Math.random() * 0.5 + 0.35).toFixed(2),
//           soilMoisture: +(Math.random() * 30 + 30).toFixed(1),
//           temperature:  +(Math.random() * 10 + 24).toFixed(1),
//           humidity:     +(Math.random() * 30 + 45).toFixed(1),
//         },
//       }, { headers });

//       setInspectionStatus({ type: "success", message: "✅ Drone inspection complete! Sensor data saved." });
//       setShowInspectionModal(false);

//       // Refresh scans
//       const jobsRes = await api.get("/api/drone-jobs/my", { headers });
//       const fieldScans = (jobsRes.data.jobs || []).filter(
//         (j) => j.field?._id === id || j.field === id
//       );
//       setScans(fieldScans);

//     } catch (err) {
//       console.error("Inspection error:", err);
//       setInspectionStatus({ type: "error", message: "❌ Inspection failed. Please try again." });
//       setShowInspectionModal(false);
//     } finally {
//       setInspectionLoading(false);
//       // Clear status after 4 seconds
//       setTimeout(() => setInspectionStatus(null), 4000);
//     }
//   };

//   const handleDeleteScanConfirm = async () => {
//     if (!scanToDelete) return;
//     const { scan } = scanToDelete;
//     setDeletingId(scan._id);
//     try {
//       const headers = getHeaders();
//       await api.delete(`/api/drone-jobs/${scan._id}`, { headers });
//       setScans((prev) => prev.filter((s) => s._id !== scan._id));
//       if (selectedScan?._id === scan._id) {
//         const remaining = scans.filter((s) => s._id !== scan._id);
//         setSelectedScan(remaining.find((s) => s.status === "completed") || null);
//       }
//     } catch (err) {
//       alert("Could not delete scan. Please try again.");
//     } finally {
//       setDeletingId(null);
//       setScanToDelete(null);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[50vh]">
//         <div className="w-7 h-7 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   if (error || !field) {
//     return (
//       <div className="p-4 max-w-xl mx-auto bg-white rounded-2xl shadow-sm space-y-3">
//         <p className="text-sm text-slate-600">{error || t("fieldNotFound")}</p>
//         <button onClick={() => navigate("/home")} className="text-sm text-emerald-700 hover:underline">
//           ← {t("myFields")}
//         </button>
//       </div>
//     );
//   }

//   const completedScans = scans.filter((s) => s.status === "completed");
//   const pendingScans   = scans.filter((s) => s.status !== "completed");
//   const health         = selectedScan ? getHealthStyle(selectedScan.analysis) : getHealthStyle(null);

//   return (
//     <div className="p-4 max-w-2xl mx-auto space-y-4 pb-10">

//       {/* Modals */}
//       {scanToDelete && (
//         <ConfirmDeleteScanModal
//           scanNumber={scans.length - scanToDelete.index}
//           onConfirm={handleDeleteScanConfirm}
//           onCancel={() => setScanToDelete(null)}
//         />
//       )}
//       {showInspectionModal && (
//         <StartInspectionModal
//           field={field}
//           onConfirm={handleStartInspection}
//           onCancel={() => setShowInspectionModal(false)}
//           loading={inspectionLoading}
//         />
//       )}

//       {/* Back */}
//       <button onClick={() => navigate(-1)} className="text-sm text-slate-500 hover:text-slate-800 transition-colors">
//         ‹ {t("myFields")}
//       </button>

//       {/* Inspection Status Toast */}
//       {inspectionStatus && (
//         <div className={`rounded-xl px-4 py-3 text-sm font-medium ${
//           inspectionStatus.type === "success"
//             ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
//             : "bg-red-50 border border-red-200 text-red-800"
//         }`}>
//           {inspectionStatus.message}
//         </div>
//       )}

//       {/* Field Header */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
//         <div className="flex items-start justify-between gap-2">
//           <div>
//             <h1 className="text-xl font-bold text-gray-900">{field.name}</h1>
//             {field.cropType && <p className="text-sm text-emerald-700 mt-0.5">🌾 {field.cropType}</p>}
//             {field.village && (
//               <p className="text-xs text-slate-400 mt-0.5">
//                 📍 {[field.village, field.district, field.state].filter(Boolean).join(", ")}
//               </p>
//             )}
//           </div>
//           <div className="text-right text-xs text-slate-400 flex-shrink-0">
//             {field.areaInAcre && <p>📐 {field.areaInAcre} acres</p>}
//             {field.season && <p>🌱 {field.season}</p>}
//           </div>
//         </div>

//         {/* Scan count summary */}
//         <div className="mt-3 flex gap-3">
//           <div className="flex-1 bg-emerald-50 rounded-xl px-3 py-2 text-center">
//             <p className="text-lg font-bold text-emerald-700">{completedScans.length}</p>
//             <p className="text-xs text-emerald-600">{t("completed")}</p>
//           </div>
//           <div className="flex-1 bg-amber-50 rounded-xl px-3 py-2 text-center">
//             <p className="text-lg font-bold text-amber-700">{pendingScans.length}</p>
//             <p className="text-xs text-amber-600">{t("requested")}</p>
//           </div>
//           <div className="flex-1 bg-blue-50 rounded-xl px-3 py-2 text-center">
//             <p className="text-lg font-bold text-blue-700">{scans.length}</p>
//             <p className="text-xs text-blue-600">Total</p>
//           </div>
//         </div>

//         {/* 🚁 Start Inspection Button */}
//         <button
//           onClick={() => setShowInspectionModal(true)}
//           className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
//         >
//           🚁 Start Drone Inspection
//         </button>
//       </div>

//       {/* Selected Scan Report */}
//       {selectedScan ? (
//         <div className={`rounded-2xl border p-4 space-y-3 ${health.bg}`}>
//           <div className="flex items-center justify-between">
//             <h2 className={`text-base font-semibold ${health.text}`}>
//               {health.emoji} {t("healthSummaryTitle")}
//             </h2>
//             <span className="text-xs text-slate-400">
//               {new Date(selectedScan.createdAt).toLocaleDateString()}
//             </span>
//           </div>

//           <p className={`text-sm leading-relaxed ${health.text}`}>
//             {translateAnalysis(selectedScan.analysis, language) || t("analysisPendingLong")}
//           </p>

//           {selectedScan.analysis && (
//             <div className="bg-white/70 rounded-xl p-3 space-y-2">
//               {selectedScan.analysis.toLowerCase().includes("nitrogen") && (
//                 <div className="flex items-start gap-2">
//                   <span className="text-base">💧</span>
//                   <div>
//                     <p className="text-xs font-semibold text-gray-800">
//                       {language === "hi" ? "नाइट्रोजन स्प्रे करें" : "Apply Nitrogen spray"}
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       {language === "hi" ? "यूरिया या DAP 3 दिनों में।" : "Urea or DAP within 3 days."}
//                     </p>
//                   </div>
//                 </div>
//               )}
//               {selectedScan.analysis.toLowerCase().includes("pest") && (
//                 <div className="flex items-start gap-2">
//                   <span className="text-base">🐛</span>
//                   <div>
//                     <p className="text-xs font-semibold text-gray-800">
//                       {language === "hi" ? "कीटनाशक लगाएं" : "Apply pesticide"}
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       {language === "hi" ? "प्रभावित हिस्से पर।" : "Target affected area."}
//                     </p>
//                   </div>
//                 </div>
//               )}
//               {selectedScan.analysis.toLowerCase().includes("yield") && (
//                 <div className="flex items-start gap-2">
//                   <span className="text-base">📊</span>
//                   <div>
//                     <p className="text-xs font-semibold text-gray-800">{t("yieldPredictionTitle")}</p>
//                     <button onClick={() => navigate("/profit")} className="text-xs text-emerald-700 hover:underline">
//                       {t("openProfitCalculator")} →
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       ) : (
//         <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
//           <p className="text-sm text-slate-500">{t("noScans")}</p>
//         </div>
//       )}

//       {/* 🤖 AI Fraud Analysis Card — sirf ek baar ✅ */}
//       {selectedScan && selectedScan.status === "completed" && (
//         <FraudCheckCard
//           droneJobId={selectedScan._id}
//           fieldId={field._id}
//           language={language}
//         />
//       )}

//       {/* Scan History */}
//       {scans.length > 0 && (
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//           <div className="px-4 pt-4 pb-2">
//             <h3 className="text-base font-semibold text-gray-900">{t("myScansTitle")}</h3>
//             <p className="text-xs text-gray-400 mt-0.5">
//               {language === "hi"
//                 ? "किसी स्कैन पर टैप करके रिपोर्ट देखें • × से डिलीट करें"
//                 : "Tap any scan to view its report • × to delete"}
//             </p>
//           </div>

//           <ul className="divide-y divide-gray-50">
//             {scans.map((scan, idx) => {
//               const isSelected = selectedScan?._id === scan._id;
//               const isDeleting = deletingId === scan._id;
//               const h = getHealthStyle(scan.analysis);
//               return (
//                 <li key={scan._id}
//                   className={`px-4 py-3 transition-colors ${isDeleting ? "opacity-40 pointer-events-none" : ""} ${isSelected ? "bg-emerald-50" : "hover:bg-gray-50"}`}>
//                   <div className="flex items-center gap-2">
//                     <div className="flex-1 flex items-center gap-2 cursor-pointer min-w-0" onClick={() => setSelectedScan(scan)}>
//                       <span className="text-base flex-shrink-0">{h.emoji}</span>
//                       <div className="min-w-0">
//                         <p className="text-sm font-medium text-gray-900">
//                           {language === "hi" ? `स्कैन ${scans.length - idx}` : `Scan ${scans.length - idx}`}
//                         </p>
//                         <p className="text-xs text-gray-400">{new Date(scan.createdAt).toLocaleDateString()}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-1.5 flex-shrink-0 cursor-pointer" onClick={() => setSelectedScan(scan)}>
//                       <StatusBadge status={scan.status} t={t} />
//                       {isSelected && <span className="text-emerald-500 text-sm font-bold">✓</span>}
//                     </div>
//                     <button
//                       onClick={(e) => { e.stopPropagation(); setScanToDelete({ scan, index: idx }); }}
//                       className="ml-1 flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors text-lg leading-none">
//                       ×
//                     </button>
//                   </div>
//                   {scan.analysis && (
//                     <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 ml-7 cursor-pointer" onClick={() => setSelectedScan(scan)}>
//                       {translateAnalysis(scan.analysis, language)}
//                     </p>
//                   )}
//                   {!scan.analysis && scan.status !== "completed" && (
//                     <p className="text-xs text-amber-500 mt-1 ml-7">{t("analysisPendingShort")}</p>
//                   )}
//                 </li>
//               );
//             })}
//           </ul>
//         </div>
//       )}

//       {/* Action Buttons */}
//       <div className="flex gap-3">
//         <button
//           onClick={() => navigate(`/request-scan?field=${field._id}`)}
//           className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-3 rounded-xl transition-colors">
//           {t("requestScanButton")}
//         </button>
//         <button
//           onClick={() => navigate("/profit")}
//           className="flex-1 bg-white border border-emerald-300 text-emerald-700 text-sm font-semibold py-3 rounded-xl hover:bg-emerald-50 transition-colors">
//           {t("openProfitCalculator")}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default FieldDetail;



// src/pages/FieldDetail.jsx
import FraudCheckCard from "../components/FraudCheckCard";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import api from "../api";

// ── Analysis translate karo ──────────────────────────────────
const DIRECTION = {
  hi: { north: "उत्तर", south: "दक्षिण", east: "पूर्व", west: "पश्चिम" },
  ta: { north: "வட", south: "தென்", east: "கிழக்கு", west: "மேற்கு" },
  bn: { north: "উত্তর", south: "দক্ষিণ", east: "পূর্ব", west: "পশ্চিম" },
  te: { north: "ఉత్తర", south: "దక్షిణ", east: "తూర్పు", west: "పశ్చిమ" },
  mr: { north: "उत्तर", south: "दक्षिण", east: "पूर्व", west: "पश्चिम" },
};

function translateAnalysis(text, lang) {
  if (!text || lang === "en") return text;
  const d = DIRECTION[lang] || {};
  const rules = {
    hi: [
      [/mild stress detected in ~?(\d+)% area,?\s*mainly in (north|south|east|west) side\.?/gi, (_, p, dir) => `लगभग ${p}% क्षेत्र में हल्का तनाव, मुख्यतः ${d[dir.toLowerCase()] || dir} हिस्से में।`],
      [/recommended nitrogen spray within (\d+) days\.?/gi, (_, d) => `${d} दिनों में नाइट्रोजन स्प्रे करें।`],
      [/no issues detected\.?/gi, () => "कोई समस्या नहीं मिली।"],
      [/healthy crop\.?/gi, () => "फसल स्वस्थ है।"],
      [/yield estimated at ([\d–\-]+)/gi, (_, y) => `अनुमानित उपज: ${y} क्विंटल/एकड़`],
    ],
    ta: [
      [/mild stress detected in ~?(\d+)% area,?\s*mainly in (north|south|east|west) side\.?/gi, (_, p, dir) => `சுமார் ${p}% பரப்பில் லேசான அழுத்தம், ${d[dir.toLowerCase()] || dir} பகுதியில்।`],
      [/recommended nitrogen spray within (\d+) days\.?/gi, (_, day) => `${day} நாட்களுக்குள் நைட்ரஜன் தெளிப்பு।`],
      [/no issues detected\.?/gi, () => "எந்த பிரச்சினையும் இல்லை।"],
      [/healthy crop\.?/gi, () => "பயிர் ஆரோக்கியமாக உள்ளது।"],
    ],
    bn: [
      [/mild stress detected in ~?(\d+)% area,?\s*mainly in (north|south|east|west) side\.?/gi, (_, p, dir) => `প্রায় ${p}% এলাকায় হালকা চাপ, ${d[dir.toLowerCase()] || dir} দিকে।`],
      [/recommended nitrogen spray within (\d+) days\.?/gi, (_, day) => `${day} দিনের মধ্যে নাইট্রোজেন স্প্রে।`],
      [/no issues detected\.?/gi, () => "কোনো সমস্যা নেই।"],
      [/healthy crop\.?/gi, () => "ফসল সুস্থ।"],
    ],
    te: [
      [/mild stress detected in ~?(\d+)% area,?\s*mainly in (north|south|east|west) side\.?/gi, (_, p, dir) => `సుమారు ${p}% ప్రాంతంలో స్వల్ప ఒత్తిడి, ${d[dir.toLowerCase()] || dir} వైపు।`],
      [/recommended nitrogen spray within (\d+) days\.?/gi, (_, day) => `${day} రోజుల్లో నైట్రోజన్ స్ప్రే।`],
      [/no issues detected\.?/gi, () => "సమస్య లేదు।"],
      [/healthy crop\.?/gi, () => "పంట ఆరోగ్యంగా ఉంది।"],
    ],
    mr: [
      [/mild stress detected in ~?(\d+)% area,?\s*mainly in (north|south|east|west) side\.?/gi, (_, p, dir) => `सुमारे ${p}% क्षेत्रात सौम्य ताण, ${d[dir.toLowerCase()] || dir} बाजूला।`],
      [/recommended nitrogen spray within (\d+) days\.?/gi, (_, day) => `${day} दिवसांत नायट्रोजन फवारणी।`],
      [/no issues detected\.?/gi, () => "कोणतीही समस्या नाही।"],
      [/healthy crop\.?/gi, () => "पीक निरोगी आहे।"],
    ],
  };
  let result = text;
  for (const [pattern, replacer] of rules[lang] || []) {
    result = result.replace(pattern, replacer);
  }
  return result;
}

// ── Status badge ─────────────────────────────────────────────
const StatusBadge = ({ status, t }) => {
  if (status === "completed")
    return <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">{t("completed")}</span>;
  if (status === "images_uploaded" || status === "scheduled")
    return <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">{t("imagesUploaded")}</span>;
  return <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">{t("requested")}</span>;
};

// ── Health color ─────────────────────────────────────────────
function getHealthStyle(analysis) {
  const a = (analysis || "").toLowerCase();
  if (!analysis) return { bg: "bg-slate-50 border-slate-200", text: "text-slate-600", emoji: "⏳" };
  if (a.includes("no issues") || a.includes("healthy")) return { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-800", emoji: "✅" };
  if (a.includes("mild")) return { bg: "bg-amber-50 border-amber-200", text: "text-amber-800", emoji: "⚠️" };
  return { bg: "bg-red-50 border-red-200", text: "text-red-800", emoji: "🔴" };
}

// ── Confirm Delete Scan Modal ────────────────────────────────
const ConfirmDeleteScanModal = ({ scanNumber, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4 text-center">
      <div className="text-4xl">🗑️</div>
      <h2 className="text-lg font-bold text-gray-900">Delete Scan?</h2>
      <p className="text-sm text-gray-500">
        <span className="font-semibold text-gray-800">Scan {scanNumber}</span> permanently delete ho jayega.
      </p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
        <button onClick={onConfirm} className="flex-1 bg-red-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors">Yes, Delete</button>
      </div>
    </div>
  </div>
);

// ── Multilingual labels ──────────────────────────────────────
const INSPECTION_LABELS = {
  en: {
    btnStart:    "Start Drone Inspection",
    modalTitle:  "Start Drone Inspection?",
    modalDesc:   "Drone inspection will begin for",
    area:        "Area",
    crop:        "Crop",
    notSet:      "Not set",
    estTime:     "Est. Time",
    cancel:      "Cancel",
    starting:    "Starting...",
    confirm:     "🚁 Start Inspection",
    successMsg:  "✅ Drone inspection complete! Sensor data saved.",
    errorMsg:    "❌ Inspection failed. Please try again.",
  },
  hi: {
    btnStart:    "ड्रोन निरीक्षण शुरू करें",
    modalTitle:  "ड्रोन निरीक्षण शुरू करें?",
    modalDesc:   "के लिए ड्रोन निरीक्षण शुरू होगी",
    area:        "क्षेत्र",
    crop:        "फसल",
    notSet:      "सेट नहीं",
    estTime:     "अनुमानित समय",
    cancel:      "रद्द करें",
    starting:    "शुरू हो रहा है...",
    confirm:     "🚁 निरीक्षण शुरू करें",
    successMsg:  "✅ ड्रोन निरीक्षण पूर्ण! सेंसर डेटा सेव हो गया।",
    errorMsg:    "❌ निरीक्षण विफल। कृपया पुनः प्रयास करें।",
  },
  ta: {
    btnStart:    "ட்ரோன் ஆய்வு தொடங்கு",
    modalTitle:  "ட்ரோன் ஆய்வு தொடங்கவா?",
    modalDesc:   "க்கான ட்ரோன் ஆய்வு தொடங்கும்",
    area:        "பரப்பு",
    crop:        "பயிர்",
    notSet:      "அமைக்கப்படவில்லை",
    estTime:     "மதிப்பிடப்பட்ட நேரம்",
    cancel:      "ரத்து செய்",
    starting:    "தொடங்குகிறது...",
    confirm:     "🚁 ஆய்வு தொடங்கு",
    successMsg:  "✅ ட்ரோன் ஆய்வு முடிந்தது! தரவு சேமிக்கப்பட்டது.",
    errorMsg:    "❌ ஆய்வு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.",
  },
  te: {
    btnStart:    "డ్రోన్ తనిఖీ ప్రారంభించు",
    modalTitle:  "డ్రోన్ తనిఖీ ప్రారంభించాలా?",
    modalDesc:   "కోసం డ్రోన్ తనిఖీ మొదలవుతుంది",
    area:        "విస్తీర్ణం",
    crop:        "పంట",
    notSet:      "సెట్ కాలేదు",
    estTime:     "అంచనా సమయం",
    cancel:      "రద్దు చేయి",
    starting:    "ప్రారంభమవుతోంది...",
    confirm:     "🚁 తనిఖీ ప్రారంభించు",
    successMsg:  "✅ డ్రోన్ తనిఖీ పూర్తైంది! డేటా సేవ్ అయింది.",
    errorMsg:    "❌ తనిఖీ విఫలమైంది. మళ్ళీ ప్రయత్నించండి.",
  },
  mr: {
    btnStart:    "ड्रोन तपासणी सुरू करा",
    modalTitle:  "ड्रोन तपासणी सुरू करायची?",
    modalDesc:   "साठी ड्रोन तपासणी सुरू होईल",
    area:        "क्षेत्र",
    crop:        "पीक",
    notSet:      "सेट नाही",
    estTime:     "अंदाजे वेळ",
    cancel:      "रद्द करा",
    starting:    "सुरू होत आहे...",
    confirm:     "🚁 तपासणी सुरू करा",
    successMsg:  "✅ ड्रोन तपासणी पूर्ण! सेन्सर डेटा जतन झाला.",
    errorMsg:    "❌ तपासणी अयशस्वी. पुन्हा प्रयत्न करा.",
  },
  bn: {
    btnStart:    "ড্রোন পরিদর্শন শুরু করুন",
    modalTitle:  "ড্রোন পরিদর্শন শুরু করবেন?",
    modalDesc:   "এর জন্য ড্রোন পরিদর্শন শুরু হবে",
    area:        "এলাকা",
    crop:        "ফসল",
    notSet:      "সেট করা নেই",
    estTime:     "আনুমানিক সময়",
    cancel:      "বাতিল করুন",
    starting:    "শুরু হচ্ছে...",
    confirm:     "🚁 পরিদর্শন শুরু করুন",
    successMsg:  "✅ ড্রোন পরিদর্শন সম্পন্ন! সেন্সর ডেটা সংরক্ষিত।",
    errorMsg:    "❌ পরিদর্শন ব্যর্থ। আবার চেষ্টা করুন।",
  },
};

// ── Start Inspection Modal ───────────────────────────────────
const StartInspectionModal = ({ field, onConfirm, onCancel, loading, language }) => {
  const L = INSPECTION_LABELS[language] || INSPECTION_LABELS.en;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
        <div className="text-center">
          <div className="text-4xl mb-2">🚁</div>
          <h2 className="text-lg font-bold text-gray-900">{L.modalTitle}</h2>
          <p className="text-sm text-gray-500 mt-1">
            <span className="font-semibold text-gray-800">"{field?.name}"</span> {L.modalDesc}.
          </p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 space-y-1 text-xs text-emerald-800">
          <p>📐 {L.area}: <span className="font-semibold">{field?.areaInAcre} acres</span></p>
          <p>🌾 {L.crop}: <span className="font-semibold">{field?.cropType || L.notSet}</span></p>
          <p>⏱️ {L.estTime}: <span className="font-semibold">~3-5 min</span></p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} disabled={loading}
            className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 disabled:opacity-50">
            {L.cancel}
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 bg-emerald-600 disabled:bg-gray-400 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors">
            {loading ? L.starting : L.confirm}
          </button>
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
const FieldDetail = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();

  const [field, setField]             = useState(null);
  const [scans, setScans]             = useState([]);
  const [selectedScan, setSelectedScan] = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [scanToDelete, setScanToDelete] = useState(null);
  const [deletingId, setDeletingId]   = useState(null);

  // ── Inspection state ─────────────────────────────────────
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [inspectionLoading, setInspectionLoading]     = useState(false);
  const [inspectionStatus, setInspectionStatus]       = useState(null); // success/error message

  const getHeaders = () => {
    const token = localStorage.getItem("authToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = getHeaders();
        const [fieldRes, jobsRes] = await Promise.all([
          api.get(`/api/fields/${id}`, { headers }),
          api.get("/api/drone-jobs/my", { headers }),
        ]);
        setField(fieldRes.data.field);
        const fieldScans = (jobsRes.data.jobs || []).filter(
          (j) => j.field?._id === id || j.field === id
        );
        setScans(fieldScans);
        const latestCompleted = fieldScans.find((j) => j.status === "completed");
        if (latestCompleted) setSelectedScan(latestCompleted);
      } catch (err) {
        console.error("FieldDetail fetch error:", err);
        setError(t("fieldNotFound"));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // ── Start Inspection ─────────────────────────────────────
  const handleStartInspection = async () => {
    setInspectionLoading(true);
    try {
      const headers = getHeaders();

      // Step 1: DroneInspection record banao
      const inspRes = await api.post("/api/inspections/start",
        { jobId: scans[0]?._id || id },
        { headers }
      );

      const inspectionId = inspRes.data.inspectionId;

      // Step 2: Simulate 3 second flight
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Step 3: Complete inspection with simulated data
      await api.patch(`/api/inspections/${inspectionId}/complete`, {
        flightPath: [
          { lat: 27.5706, lng: 80.6982, alt: 30 },
          { lat: 27.5710, lng: 80.6982, alt: 30 },
          { lat: 27.5710, lng: 80.6990, alt: 30 },
          { lat: 27.5706, lng: 80.6990, alt: 30 },
        ],
        sensorData: {
          ndviValue:    +(Math.random() * 0.5 + 0.35).toFixed(2),
          soilMoisture: +(Math.random() * 30 + 30).toFixed(1),
          temperature:  +(Math.random() * 10 + 24).toFixed(1),
          humidity:     +(Math.random() * 30 + 45).toFixed(1),
        },
      }, { headers });

      const L = INSPECTION_LABELS[language] || INSPECTION_LABELS.en;
      setInspectionStatus({ type: "success", message: L.successMsg });
      setShowInspectionModal(false);

      // Refresh scans
      const jobsRes = await api.get("/api/drone-jobs/my", { headers });
      const fieldScans = (jobsRes.data.jobs || []).filter(
        (j) => j.field?._id === id || j.field === id
      );
      setScans(fieldScans);

    } catch (err) {
      console.error("Inspection error:", err);
      const L = INSPECTION_LABELS[language] || INSPECTION_LABELS.en;
      setInspectionStatus({ type: "error", message: L.errorMsg });
      setShowInspectionModal(false);
    } finally {
      setInspectionLoading(false);
      // Clear status after 4 seconds
      setTimeout(() => setInspectionStatus(null), 4000);
    }
  };

  const handleDeleteScanConfirm = async () => {
    if (!scanToDelete) return;
    const { scan } = scanToDelete;
    setDeletingId(scan._id);
    try {
      const headers = getHeaders();
      await api.delete(`/api/drone-jobs/${scan._id}`, { headers });
      setScans((prev) => prev.filter((s) => s._id !== scan._id));
      if (selectedScan?._id === scan._id) {
        const remaining = scans.filter((s) => s._id !== scan._id);
        setSelectedScan(remaining.find((s) => s.status === "completed") || null);
      }
    } catch (err) {
      alert("Could not delete scan. Please try again.");
    } finally {
      setDeletingId(null);
      setScanToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-7 h-7 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !field) {
    return (
      <div className="p-4 max-w-xl mx-auto bg-white rounded-2xl shadow-sm space-y-3">
        <p className="text-sm text-slate-600">{error || t("fieldNotFound")}</p>
        <button onClick={() => navigate("/home")} className="text-sm text-emerald-700 hover:underline">
          ← {t("myFields")}
        </button>
      </div>
    );
  }

  const completedScans = scans.filter((s) => s.status === "completed");
  const pendingScans   = scans.filter((s) => s.status !== "completed");
  const health         = selectedScan ? getHealthStyle(selectedScan.analysis) : getHealthStyle(null);

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4 pb-10">

      {/* Modals */}
      {scanToDelete && (
        <ConfirmDeleteScanModal
          scanNumber={scans.length - scanToDelete.index}
          onConfirm={handleDeleteScanConfirm}
          onCancel={() => setScanToDelete(null)}
        />
      )}
      {showInspectionModal && (
        <StartInspectionModal
          field={field}
          onConfirm={handleStartInspection}
          onCancel={() => setShowInspectionModal(false)}
          loading={inspectionLoading}
          language={language}
        />
      )}

      {/* Back */}
      <button onClick={() => navigate(-1)} className="text-sm text-slate-500 hover:text-slate-800 transition-colors">
        ‹ {t("myFields")}
      </button>

      {/* Inspection Status Toast */}
      {inspectionStatus && (
        <div className={`rounded-xl px-4 py-3 text-sm font-medium ${
          inspectionStatus.type === "success"
            ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
            : "bg-red-50 border border-red-200 text-red-800"
        }`}>
          {inspectionStatus.message}
        </div>
      )}

      {/* Field Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{field.name}</h1>
            {field.cropType && <p className="text-sm text-emerald-700 mt-0.5">🌾 {field.cropType}</p>}
            {field.village && (
              <p className="text-xs text-slate-400 mt-0.5">
                📍 {[field.village, field.district, field.state].filter(Boolean).join(", ")}
              </p>
            )}
          </div>
          <div className="text-right text-xs text-slate-400 flex-shrink-0">
            {field.areaInAcre && <p>📐 {field.areaInAcre} acres</p>}
            {field.season && <p>🌱 {field.season}</p>}
          </div>
        </div>

        {/* Scan count summary */}
        <div className="mt-3 flex gap-3">
          <div className="flex-1 bg-emerald-50 rounded-xl px-3 py-2 text-center">
            <p className="text-lg font-bold text-emerald-700">{completedScans.length}</p>
            <p className="text-xs text-emerald-600">{t("completed")}</p>
          </div>
          <div className="flex-1 bg-amber-50 rounded-xl px-3 py-2 text-center">
            <p className="text-lg font-bold text-amber-700">{pendingScans.length}</p>
            <p className="text-xs text-amber-600">{t("requested")}</p>
          </div>
          <div className="flex-1 bg-blue-50 rounded-xl px-3 py-2 text-center">
            <p className="text-lg font-bold text-blue-700">{scans.length}</p>
            <p className="text-xs text-blue-600">Total</p>
          </div>
        </div>

        {/* 🚁 Start Inspection Button */}
        <button
          onClick={() => setShowInspectionModal(true)}
          className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          🚁 {(INSPECTION_LABELS[language] || INSPECTION_LABELS.en).btnStart}
        </button>
      </div>

      {/* Selected Scan Report */}
      {selectedScan ? (
        <div className={`rounded-2xl border p-4 space-y-3 ${health.bg}`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-base font-semibold ${health.text}`}>
              {health.emoji} {t("healthSummaryTitle")}
            </h2>
            <span className="text-xs text-slate-400">
              {new Date(selectedScan.createdAt).toLocaleDateString()}
            </span>
          </div>

          <p className={`text-sm leading-relaxed ${health.text}`}>
            {translateAnalysis(selectedScan.analysis, language) || t("analysisPendingLong")}
          </p>

          {selectedScan.analysis && (
            <div className="bg-white/70 rounded-xl p-3 space-y-2">
              {selectedScan.analysis.toLowerCase().includes("nitrogen") && (
                <div className="flex items-start gap-2">
                  <span className="text-base">💧</span>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">
                      {language === "hi" ? "नाइट्रोजन स्प्रे करें" : "Apply Nitrogen spray"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {language === "hi" ? "यूरिया या DAP 3 दिनों में।" : "Urea or DAP within 3 days."}
                    </p>
                  </div>
                </div>
              )}
              {selectedScan.analysis.toLowerCase().includes("pest") && (
                <div className="flex items-start gap-2">
                  <span className="text-base">🐛</span>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">
                      {language === "hi" ? "कीटनाशक लगाएं" : "Apply pesticide"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {language === "hi" ? "प्रभावित हिस्से पर।" : "Target affected area."}
                    </p>
                  </div>
                </div>
              )}
              {selectedScan.analysis.toLowerCase().includes("yield") && (
                <div className="flex items-start gap-2">
                  <span className="text-base">📊</span>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{t("yieldPredictionTitle")}</p>
                    <button onClick={() => navigate("/profit")} className="text-xs text-emerald-700 hover:underline">
                      {t("openProfitCalculator")} →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
          <p className="text-sm text-slate-500">{t("noScans")}</p>
        </div>
      )}

      {/* 🤖 AI Fraud Analysis Card — sirf ek baar ✅ */}
      {selectedScan && selectedScan.status === "completed" && (
        <FraudCheckCard
          droneJobId={selectedScan._id}
          fieldId={field._id}
          language={language}
        />
      )}

      {/* Scan History */}
      {scans.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 pt-4 pb-2">
            <h3 className="text-base font-semibold text-gray-900">{t("myScansTitle")}</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {language === "hi"
                ? "किसी स्कैन पर टैप करके रिपोर्ट देखें • × से डिलीट करें"
                : "Tap any scan to view its report • × to delete"}
            </p>
          </div>

          <ul className="divide-y divide-gray-50">
            {scans.map((scan, idx) => {
              const isSelected = selectedScan?._id === scan._id;
              const isDeleting = deletingId === scan._id;
              const h = getHealthStyle(scan.analysis);
              return (
                <li key={scan._id}
                  className={`px-4 py-3 transition-colors ${isDeleting ? "opacity-40 pointer-events-none" : ""} ${isSelected ? "bg-emerald-50" : "hover:bg-gray-50"}`}>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex items-center gap-2 cursor-pointer min-w-0" onClick={() => setSelectedScan(scan)}>
                      <span className="text-base flex-shrink-0">{h.emoji}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {language === "hi" ? `स्कैन ${scans.length - idx}` : `Scan ${scans.length - idx}`}
                        </p>
                        <p className="text-xs text-gray-400">{new Date(scan.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0 cursor-pointer" onClick={() => setSelectedScan(scan)}>
                      <StatusBadge status={scan.status} t={t} />
                      {isSelected && <span className="text-emerald-500 text-sm font-bold">✓</span>}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setScanToDelete({ scan, index: idx }); }}
                      className="ml-1 flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors text-lg leading-none">
                      ×
                    </button>
                  </div>
                  {scan.analysis && (
                    <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 ml-7 cursor-pointer" onClick={() => setSelectedScan(scan)}>
                      {translateAnalysis(scan.analysis, language)}
                    </p>
                  )}
                  {!scan.analysis && scan.status !== "completed" && (
                    <p className="text-xs text-amber-500 mt-1 ml-7">{t("analysisPendingShort")}</p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate(`/request-scan?field=${field._id}`)}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-3 rounded-xl transition-colors">
          {t("requestScanButton")}
        </button>
        <button
          onClick={() => navigate("/profit")}
          className="flex-1 bg-white border border-emerald-300 text-emerald-700 text-sm font-semibold py-3 rounded-xl hover:bg-emerald-50 transition-colors">
          {t("openProfitCalculator")}
        </button>
      </div>
    </div>
  );
};

export default FieldDetail;