
// // src/pages/LastScanReport.jsx
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useLanguage } from "../context/LanguageContext";
// import api from "../api";

// const LastScanReport = () => {
//   const { t, language } = useLanguage();
//   const navigate = useNavigate();

//   const [latestJob, setLatestJob] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchLatest = async () => {
//       try {
//         const token = localStorage.getItem("authToken");
//         if (!token) return;
//         const res = await api.get("/api/drone-jobs/my", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const jobs = res.data.jobs || [];
//         // Sirf last COMPLETED scan — pending wale nahi
//         const completed = jobs.find((j) => j.status === "completed");
//         setLatestJob(completed || null);
//       } catch (err) {
//         console.error("LastScanReport fetch error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchLatest();
//   }, []);

//   const getHealthStyle = (analysis) => {
//     const a = (analysis || "").toLowerCase();
//     if (!analysis) return { bg: "bg-slate-50 border-slate-200", text: "text-slate-600", emoji: "⏳" };
//     if (a.includes("no issues") || a.includes("healthy")) return { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-800", emoji: "✅" };
//     if (a.includes("mild")) return { bg: "bg-amber-50 border-amber-200", text: "text-amber-800", emoji: "⚠️" };
//     return { bg: "bg-red-50 border-red-200", text: "text-red-800", emoji: "🔴" };
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[50vh]">
//         <div className="w-7 h-7 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   if (!latestJob) {
//     return (
//       <div className="p-4 max-w-xl mx-auto bg-white rounded-2xl shadow-sm space-y-3 mt-8 text-center">
//         <p className="text-3xl">📭</p>
//         <p className="text-sm text-slate-600 font-medium">
//           {language === "hi"
//             ? "अभी तक कोई पूर्ण स्कैन रिपोर्ट नहीं है।"
//             : "No completed scan report yet."}
//         </p>
//         <p className="text-xs text-slate-400">
//           {language === "hi"
//             ? "स्कैन पूरा होने के बाद रिपोर्ट यहाँ दिखेगी।"
//             : "Report will appear here once a scan is completed."}
//         </p>
//         <button
//           onClick={() => navigate("/home")}
//           className="text-sm text-emerald-700 hover:underline font-medium"
//         >
//           ← {t("myFields")}
//         </button>
//       </div>
//     );
//   }

//   const health = getHealthStyle(latestJob.analysis);

//   return (
//     <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-4">

//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <h1 className="text-xl font-bold text-slate-900">
//           {t("lastScanTitle")}
//         </h1>
//         <button
//           onClick={() => navigate("/home")}
//           className="text-sm text-slate-500 hover:text-slate-800"
//         >
//           ← {t("myFields")}
//         </button>
//       </div>

//       {/* "Last completed scan only" label */}
//       <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 flex items-center gap-2">
//         <span className="text-emerald-600 text-sm">✅</span>
//         <p className="text-xs text-emerald-700 font-medium">
//           {language === "hi"
//             ? "यह सिर्फ आपकी सबसे हाल की पूर्ण हुई स्कैन रिपोर्ट है।"
//             : "Showing your most recent completed scan report only."}
//         </p>
//       </div>

//       {/* Field info */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
//         <p className="font-semibold text-gray-900">
//           {t("lastScanField")} {latestJob.field?.name || t("fieldFallback")}
//         </p>
//         {latestJob.field?.cropType && (
//           <p className="text-xs text-emerald-700 mt-0.5">
//             🌾 {latestJob.field.cropType}
//           </p>
//         )}
//         <p className="text-xs text-gray-500 mt-1">
//           {t("lastScanDate")}{" "}
//           {new Date(latestJob.createdAt).toLocaleString()}
//         </p>
//         <span className="inline-flex mt-2 items-center px-2 py-0.5 rounded-full border text-[11px] font-medium bg-emerald-100 text-emerald-800 border-emerald-300">
//           ✅ {t("completed")}
//         </span>
//       </div>

//       {/* Health summary */}
//       <div className={`rounded-2xl border p-4 space-y-3 ${health.bg}`}>
//         <div className="flex items-center justify-between">
//           <h2 className={`text-base font-semibold ${health.text}`}>
//             {health.emoji} {t("healthSummaryTitle")}
//           </h2>
//           <span className="text-xs text-slate-400">
//             {new Date(latestJob.createdAt).toLocaleDateString()}
//           </span>
//         </div>

//         <p className={`text-sm leading-relaxed ${health.text}`}>
//           {latestJob.analysis || t("analysisPendingLong")}
//         </p>

//         {/* Action tips */}
//         {latestJob.analysis && (
//           <div className="bg-white/70 rounded-xl p-3 space-y-2">
//             {latestJob.analysis.toLowerCase().includes("nitrogen") && (
//               <div className="flex items-start gap-2">
//                 <span>💧</span>
//                 <div>
//                   <p className="text-xs font-semibold text-gray-800">
//                     {language === "hi" ? "नाइट्रोजन स्प्रे करें" : "Apply Nitrogen spray"}
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     {language === "hi" ? "यूरिया या DAP 3 दिनों में।" : "Urea or DAP within 3 days."}
//                   </p>
//                 </div>
//               </div>
//             )}
//             {latestJob.analysis.toLowerCase().includes("pest") && (
//               <div className="flex items-start gap-2">
//                 <span>🐛</span>
//                 <div>
//                   <p className="text-xs font-semibold text-gray-800">
//                     {language === "hi" ? "कीटनाशक लगाएं" : "Apply pesticide"}
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     {language === "hi" ? "प्रभावित हिस्से पर।" : "Target affected area."}
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Yield prediction */}
//       {latestJob.analysis?.toLowerCase().includes("yield") && (
//         <div className="bg-white shadow-sm rounded-2xl border border-gray-100 p-4">
//           <h2 className="font-semibold text-sm mb-1">{t("yieldPredictionTitle")}</h2>
//           <p className="text-sm text-gray-600">{latestJob.analysis}</p>
//           <p className="text-xs text-gray-400 mt-2">{t("profitHint")}</p>
//         </div>
//       )}

//       {/* Action buttons */}
//       <div className="flex gap-3">
//         {latestJob.field?._id && (
//           <button
//             onClick={() => navigate(`/fields/${latestJob.field._id}`)}
//             className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-3 rounded-xl transition-colors"
//           >
//             {language === "hi" ? "इस खेत की सारी स्कैन देखें" : "View All Scans for this Field"} →
//           </button>
//         )}
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

// export default LastScanReport;



// src/pages/LastScanReport.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import api from "../api";

/* ── Style tokens (matching FieldDetail dark theme) ── */
const S = {
  card: {
    background: "rgba(20,45,28,0.85)",
    border: "1px solid rgba(74,222,128,0.2)",
    borderRadius: 20,
    backdropFilter: "blur(16px)",
    padding: "18px 20px",
  },
  muted: { fontSize: 11, color: "rgba(200,240,210,0.6)" },
};

const badge = (type) => {
  const map = {
    green:  { color: "#86efac", background: "rgba(74,222,128,0.12)",  border: "1px solid rgba(74,222,128,0.3)" },
    amber:  { color: "#fcd34d", background: "rgba(251,191,36,0.12)",  border: "1px solid rgba(251,191,36,0.3)" },
    red:    { color: "#fca5a5", background: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.3)" },
    slate:  { color: "rgba(200,240,210,0.55)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" },
  };
  return { display:"inline-flex", alignItems:"center", padding:"3px 10px", borderRadius:50, fontSize:11, fontWeight:600, ...map[type] };
};

const healthCard = (type) => {
  const map = {
    green: { bg: "rgba(74,222,128,0.08)",  border: "rgba(74,222,128,0.25)",  color: "#86efac" },
    amber: { bg: "rgba(251,191,36,0.08)",  border: "rgba(251,191,36,0.25)",  color: "#fcd34d" },
    red:   { bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.25)", color: "#fca5a5" },
    slate: { bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.1)",  color: "rgba(200,240,210,0.6)" },
  };
  return map[type] || map.slate;
};

const getHealthStyle = (analysis) => {
  const a = (analysis || "").toLowerCase();
  if (!analysis) return { type: "slate", emoji: "⏳" };
  if (a.includes("no issues") || a.includes("healthy")) return { type: "green", emoji: "✅" };
  if (a.includes("mild") || a.includes("moderate"))     return { type: "amber", emoji: "⚠️" };
  return { type: "red", emoji: "🔴" };
};

/* ── Fraud Check Component (dark theme) ── */
const FRAUD_TEXT = {
  en: { title:"AI Fraud Analysis", subtitle:"Isolation Forest Model v2", runBtn:"Run Fraud Check", analyzing:"Analyzing...", rerun:"Re-run", scoreLabel:"Fraud Risk Score", safe:"0 — Safe", highRisk:"1 — High Risk", cropHealth:"Crop Health", flagged:"🚨 This transaction has been flagged for review", infoText:"Run AI fraud analysis to check for suspicious activity.", HIGH:"HIGH RISK", MEDIUM:"MEDIUM RISK", LOW:"LOW RISK", analysisComplete:"Analysis complete" },
  hi: { title:"AI धोखाधड़ी विश्लेषण", subtitle:"आइसोलेशन फॉरेस्ट मॉडल v2", runBtn:"धोखाधड़ी जांच", analyzing:"जाँच हो रही है...", rerun:"फिर से जांचें", scoreLabel:"धोखाधड़ी जोखिम स्कोर", safe:"0 — सुरक्षित", highRisk:"1 — उच्च जोखिम", cropHealth:"फसल स्वास्थ्य", flagged:"🚨 इस लेनदेन को समीक्षा के लिए फ्लैग किया गया", infoText:"संदिग्ध गतिविधि की जांच के लिए AI विश्लेषण चलाएं।", HIGH:"उच्च जोखिम", MEDIUM:"मध्यम जोखिम", LOW:"कम जोखिम", analysisComplete:"विश्लेषण पूरा हुआ" },
  ta: { title:"AI மோசடி பகுப்பாய்வு", subtitle:"ஐசோலேஷன் ஃபாரெஸ்ட் மாடல் v2", runBtn:"மோசடி சரிபார்", analyzing:"பகுப்பாய்வு...", rerun:"மீண்டும்", scoreLabel:"மோசடி ஆபத்து", safe:"0 — பாதுகாப்பு", highRisk:"1 — அதிக ஆபத்து", cropHealth:"பயிர் ஆரோக்கியம்", flagged:"🚨 கொடியிடப்பட்டது", infoText:"AI பகுப்பாய்வை இயக்கவும்.", HIGH:"அதிக ஆபத்து", MEDIUM:"நடுத்தர ஆபத்து", LOW:"குறைந்த ஆபத்து", analysisComplete:"பகுப்பாய்வு முடிந்தது" },
  bn: { title:"AI জালিয়াতি বিশ্লেষণ", subtitle:"আইসোলেশন ফরেস্ট মডেল v2", runBtn:"জালিয়াতি পরীক্ষা", analyzing:"বিশ্লেষণ...", rerun:"আবার", scoreLabel:"জালিয়াতি ঝুঁকি", safe:"0 — নিরাপদ", highRisk:"1 — উচ্চ ঝুঁকি", cropHealth:"ফসলের স্বাস্থ্য", flagged:"🚨 চিহ্নিত করা হয়েছে", infoText:"AI বিশ্লেষণ চালান।", HIGH:"উচ্চ ঝুঁকি", MEDIUM:"মাঝারি ঝুঁকি", LOW:"কম ঝুঁকি", analysisComplete:"বিশ্লেষণ সম্পন্ন" },
  te: { title:"AI మోసం విశ్లేషణ", subtitle:"ఐసోలేషన్ ఫారెస్ట్ మోడల్ v2", runBtn:"మోసం తనిఖీ", analyzing:"విశ్లేషిస్తోంది...", rerun:"మళ్లీ", scoreLabel:"మోసం ప్రమాద స్కోర్", safe:"0 — సురక్షితం", highRisk:"1 — అధిక ప్రమాదం", cropHealth:"పంట ఆరోగ్యం", flagged:"🚨 ఫ్లాగ్ చేయబడింది", infoText:"AI విశ్లేషణ నడపండి.", HIGH:"అధిక ప్రమాదం", MEDIUM:"మధ్యస్థ ప్రమాదం", LOW:"తక్కువ ప్రమాదం", analysisComplete:"విశ్లేషణ పూర్తైంది" },
  mr: { title:"AI फसवणूक विश्लेषण", subtitle:"आयसोलेशन फॉरेस्ट मॉडेल v2", runBtn:"फसवणूक तपासणी", analyzing:"तपासत आहे...", rerun:"पुन्हा तपासा", scoreLabel:"फसवणूक जोखीम", safe:"0 — सुरक्षित", highRisk:"1 — उच्च जोखीम", cropHealth:"पीक आरोग्य", flagged:"🚨 फ्लॅग केला", infoText:"AI विश्लेषण चालवा.", HIGH:"उच्च जोखीम", MEDIUM:"मध्यम जोखीम", LOW:"कमी जोखीम", analysisComplete:"विश्लेषण पूर्ण झाले" },
};

const FraudCheckInReport = ({ droneJobId, fieldId, language = "en" }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState(null);
  const tx = FRAUD_TEXT[language] || FRAUD_TEXT.en;

  const runFraudCheck = async () => {
    setLoading(true); setError(null);
    try {
      const res = await api.post("/api/fraud/detect-fraud", { droneJobId, fieldId });
      setResult(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Fraud check failed. Try again.");
    } finally { setLoading(false); }
  };

  const getRiskConfig = (riskLevel, isFlagged) => {
    if (isFlagged || riskLevel === "HIGH") return { type:"red",   icon:"🚨", key:"HIGH" };
    if (riskLevel === "MEDIUM")            return { type:"amber", icon:"⚠️", key:"MEDIUM" };
    return { type:"green", icon:"✅", key:"LOW" };
  };

  const config = result ? getRiskConfig(result.riskLevel, result.isFlagged) : null;
  const hc = config ? healthCard(config.type) : null;

  return (
    <div style={S.card}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:20 }}>🤖</span>
          <div>
            <p style={{ fontSize:13, fontWeight:700, color:"#e8f5e9", margin:0 }}>{tx.title}</p>
            <p style={{ fontSize:10, color:"rgba(200,240,210,0.5)", margin:0 }}>{tx.subtitle}</p>
          </div>
        </div>
        {!result ? (
          <button onClick={runFraudCheck} disabled={loading}
            style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, fontWeight:700, padding:"7px 14px", borderRadius:50, background:"linear-gradient(135deg,#4ade80,#22c55e)", color:"#0a1a0f", border:"none", cursor:"pointer", fontFamily:"'Sora',sans-serif", opacity:loading?0.6:1 }}>
            {loading ? (<><span style={{ width:12, height:12, border:"2px solid #0a1a0f", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.7s linear infinite", display:"inline-block" }} />{tx.analyzing}</>) : <>🔍 {tx.runBtn}</>}
          </button>
        ) : (
          <button onClick={() => { setResult(null); setError(null); }}
            style={{ fontSize:11, color:"rgba(200,240,210,0.45)", background:"transparent", border:"1px solid rgba(255,255,255,0.1)", borderRadius:50, padding:"5px 12px", cursor:"pointer", fontFamily:"'Sora',sans-serif" }}>
            {tx.rerun}
          </button>
        )}
      </div>

      {error && (
        <div style={{ background:"rgba(248,113,113,0.08)", border:"1px solid rgba(248,113,113,0.25)", borderRadius:12, padding:"10px 14px" }}>
          <p style={{ fontSize:12, color:"#fca5a5", margin:0 }}>{error}</p>
        </div>
      )}

      {result && config && hc && (
        <div style={{ background:hc.bg, border:`1px solid ${hc.border}`, borderRadius:14, padding:14, display:"flex", flexDirection:"column", gap:10 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:20 }}>{config.icon}</span>
              <span style={{ ...badge(config.type), fontSize:12, fontWeight:700 }}>{tx[config.key]}</span>
            </div>
            <span style={{ fontSize:16, fontWeight:800, color:hc.color }}>{Math.round(result.fraudRiskScore * 100)}%</span>
          </div>
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
              <span style={S.muted}>{tx.scoreLabel}</span>
              <span style={{ fontSize:11, fontWeight:700, color:"#e8f5e9" }}>{result.fraudRiskScore?.toFixed(2)}</span>
            </div>
            <div style={{ height:8, background:"rgba(255,255,255,0.1)", borderRadius:50, overflow:"hidden" }}>
              <div style={{ height:"100%", borderRadius:50, background: config.type==="red" ? "#ef4444" : config.type==="amber" ? "#fbbf24" : "#4ade80", width:`${Math.round(result.fraudRiskScore * 100)}%`, transition:"width 0.7s ease" }} />
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:3 }}>
              <span style={{ fontSize:9, color:"rgba(200,240,210,0.35)" }}>{tx.safe}</span>
              <span style={{ fontSize:9, color:"rgba(200,240,210,0.35)" }}>{tx.highRisk}</span>
            </div>
          </div>
          <div style={{ background:"rgba(0,0,0,0.15)", borderRadius:10, padding:"10px 12px" }}>
            <p style={{ fontSize:12, color:hc.color, fontWeight:600, margin:"0 0 4px" }}>{result.details || tx.analysisComplete}</p>
            {result.cropHealthStatus && (
              <p style={{ fontSize:11, color:"rgba(200,240,210,0.6)", margin:0 }}>🌾 {tx.cropHealth}: <strong>{result.cropHealthStatus}</strong></p>
            )}
            {result.isFlagged && (
              <p style={{ fontSize:11, color:"#fca5a5", fontWeight:700, margin:"6px 0 0" }}>{tx.flagged}</p>
            )}
          </div>
        </div>
      )}
      {!result && !loading && !error && (
        <p style={{ fontSize:11, color:"rgba(200,240,210,0.4)", fontStyle:"italic" }}>{tx.infoText}</p>
      )}
    </div>
  );
};

/* ── Crop Health Card ── */
const CropHealthInReport = ({ cropAnalysis }) => {
  if (!cropAnalysis?.results) return null;
  const { results, model_used, confidence } = cropAnalysis;
  const { cropHealthStatus, diseaseDetected, recommendation, ndviScore, affectedArea, riskLevel } = results;
  const isHealthy  = cropHealthStatus === "healthy";
  const isDiseased = cropHealthStatus === "diseased";
  const cfg = isDiseased
    ? { type:"red",   label:"DISEASED", icon:"🦠", bar:"#ef4444" }
    : isHealthy
    ? { type:"green", label:"HEALTHY",  icon:"✅", bar:"#4ade80" }
    : { type:"amber", label:"MODERATE", icon:"⚠️", bar:"#fbbf24" };
  const hc = healthCard(cfg.type);
  return (
    <div style={S.card}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:20 }}>🌿</span>
          <div>
            <p style={{ fontSize:13, fontWeight:700, color:"#e8f5e9", margin:0 }}>Crop Health Report</p>
            <p style={{ fontSize:10, color:"rgba(200,240,210,0.5)", margin:0 }}>{model_used || "crop_health_v1"}</p>
          </div>
        </div>
        <span style={{ fontSize:11, color:"rgba(200,240,210,0.5)" }}>{confidence ? `${Math.round(confidence*100)}% confident` : ""}</span>
      </div>
      <div style={{ background:hc.bg, border:`1px solid ${hc.border}`, borderRadius:14, padding:14, display:"flex", flexDirection:"column", gap:12 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:20 }}>{cfg.icon}</span>
            <span style={{ ...badge(cfg.type), fontSize:12, fontWeight:700 }}>{cfg.label}</span>
          </div>
          {riskLevel && <span style={{ fontSize:11, fontWeight:700, color:hc.color }}>Risk: {riskLevel.toUpperCase()}</span>}
        </div>
        {ndviScore !== undefined && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
              <span style={{ fontSize:11, color:"rgba(200,240,210,0.5)" }}>NDVI Score</span>
              <span style={{ fontSize:11, fontWeight:700, color:"#e8f5e9" }}>{ndviScore?.toFixed(2)}</span>
            </div>
            <div style={{ height:8, background:"rgba(255,255,255,0.1)", borderRadius:50, overflow:"hidden" }}>
              <div style={{ height:"100%", borderRadius:50, background:cfg.bar, width:`${Math.round(ndviScore*100)}%`, transition:"width 0.7s ease" }} />
            </div>
          </div>
        )}
        {diseaseDetected?.length > 0 && (
          <div style={{ background:"rgba(0,0,0,0.15)", borderRadius:10, padding:"10px 12px" }}>
            <p style={{ fontSize:11, fontWeight:700, color:"#fca5a5", marginBottom:6 }}>🦠 Disease Detected:</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {diseaseDetected.map((d, i) => <span key={i} style={badge("red")}>{d}</span>)}
            </div>
          </div>
        )}
        {affectedArea !== undefined && affectedArea > 0 && (
          <div style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(0,0,0,0.12)", borderRadius:10, padding:"8px 12px" }}>
            <span>📐</span>
            <p style={{ fontSize:12, color:"#e8f5e9", margin:0 }}>Affected Area: <strong>{affectedArea}%</strong></p>
          </div>
        )}
        {recommendation && (
          <div style={{ background:"rgba(0,0,0,0.12)", borderRadius:10, padding:"10px 12px" }}>
            <p style={{ fontSize:11, fontWeight:700, color:"rgba(200,240,210,0.8)", marginBottom:4 }}>💡 Recommendation</p>
            <p style={{ fontSize:12, color:"rgba(200,240,210,0.7)", margin:0, lineHeight:1.5 }}>{recommendation}</p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Main Component ── */
const LastScanReport = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [latestJob, setLatestJob]       = useState(null);
  const [cropAnalysis, setCropAnalysis] = useState(null);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await api.get("/api/drone-jobs/my");
        const jobs = res.data.jobs || [];
        const completed = jobs.find((j) => j.status === "completed");
        setLatestJob(completed || null);
        if (completed?.aiAnalysisId) setCropAnalysis(completed.aiAnalysisId);
      } catch (err) {
        console.error("LastScanReport fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  if (loading) {
    return (
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"50vh" }}>
        <div style={{ width:28, height:28, border:"2px solid #4ade80", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!latestJob) {
    return (
      <div style={{ padding:"32px 20px", maxWidth:480, margin:"0 auto", display:"flex", flexDirection:"column", alignItems:"center", gap:12, fontFamily:"'Sora','DM Sans',sans-serif", textAlign:"center" }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ fontSize:40 }}>📭</p>
        <p style={{ fontSize:14, color:"#e8f5e9", fontWeight:600 }}>
          {language === "hi" ? "अभी तक कोई पूर्ण स्कैन रिपोर्ट नहीं है।" : "No completed scan report yet."}
        </p>
        <p style={{ fontSize:12, color:"rgba(200,240,210,0.5)" }}>
          {language === "hi" ? "खेत पर जाकर ड्रोन इमेज अपलोड करें।" : "Go to your field and upload a drone image to get started."}
        </p>
        <button onClick={() => navigate("/home")}
          style={{ fontSize:12, color:"#86efac", background:"none", border:"none", cursor:"pointer", fontFamily:"'Sora',sans-serif" }}>
          ← {t("myFields")}
        </button>
      </div>
    );
  }

  const health = getHealthStyle(latestJob.analysis);
  const hc     = healthCard(health.type);

  return (
    <div style={{ fontFamily:"'Sora','DM Sans',sans-serif", padding:"24px 16px 48px", maxWidth:680, margin:"0 auto", display:"flex", flexDirection:"column", gap:16 }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <h1 style={{ fontSize:20, fontWeight:800, color:"#f0fdf4", margin:0, letterSpacing:"-0.3px" }}>
          {t("lastScanTitle")}
        </h1>
        <button onClick={() => navigate("/home")}
          style={{ fontSize:12, color:"rgba(200,240,210,0.55)", background:"none", border:"none", cursor:"pointer", fontFamily:"'Sora',sans-serif" }}>
          ‹ {t("myFields")}
        </button>
      </div>

      {/* Badge */}
      <div style={{ background:"rgba(74,222,128,0.08)", border:"1px solid rgba(74,222,128,0.2)", borderRadius:12, padding:"10px 14px", display:"flex", alignItems:"center", gap:8 }}>
        <span>✅</span>
        <p style={{ fontSize:12, color:"#86efac", fontWeight:600, margin:0 }}>
          {language === "hi" ? "सबसे हाल की पूर्ण हुई स्कैन रिपोर्ट" : "Most recent completed scan report"}
        </p>
      </div>

      {/* Field Info */}
      <div style={S.card}>
        <p style={{ fontSize:16, fontWeight:700, color:"#f0fdf4", margin:"0 0 4px" }}>
          {t("lastScanField")} {latestJob.field?.name || t("fieldFallback")}
        </p>
        {latestJob.field?.cropType && (
          <p style={{ fontSize:12, color:"#4ade80", fontWeight:600, margin:"2px 0" }}>🌾 {latestJob.field.cropType}</p>
        )}
        <p style={{ fontSize:11, color:"rgba(200,240,210,0.5)", margin:"4px 0 10px" }}>
          {t("lastScanDate")} {new Date(latestJob.createdAt).toLocaleString()}
        </p>
        <span style={{ ...badge("green"), fontSize:11 }}>✅ {t("completed")}</span>
      </div>

      {/* ── Health Summary ── */}
      <div style={{ background:hc.bg, border:`1px solid ${hc.border}`, borderRadius:20, padding:"18px 20px", display:"flex", flexDirection:"column", gap:12 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <h2 style={{ fontSize:14, fontWeight:700, color:hc.color, margin:0 }}>
            {health.emoji} {t("healthSummaryTitle")}
          </h2>
          <span style={{ fontSize:11, color:"rgba(200,240,210,0.45)" }}>
            {new Date(latestJob.createdAt).toLocaleDateString()}
          </span>
        </div>
        <p style={{ fontSize:13, color:hc.color, margin:0, lineHeight:1.6 }}>
          {latestJob.analysis || t("analysisPendingLong")}
        </p>
        {latestJob.analysis && (
          <div style={{ background:"rgba(0,0,0,0.15)", borderRadius:12, padding:"12px 14px", display:"flex", flexDirection:"column", gap:10 }}>
            {latestJob.analysis.toLowerCase().includes("nitrogen") && (
              <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                <span style={{ fontSize:16 }}>💧</span>
                <div>
                  <p style={{ fontSize:12, fontWeight:700, color:"#e8f5e9", margin:0 }}>
                    {language === "hi" ? "नाइट्रोजन स्प्रे करें" : "Apply Nitrogen spray"}
                  </p>
                  <p style={{ fontSize:11, color:"rgba(200,240,210,0.6)", margin:0 }}>
                    {language === "hi" ? "यूरिया या DAP 3 दिनों में।" : "Urea or DAP within 3 days."}
                  </p>
                </div>
              </div>
            )}
            {latestJob.analysis.toLowerCase().includes("pest") && (
              <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                <span style={{ fontSize:16 }}>🐛</span>
                <div>
                  <p style={{ fontSize:12, fontWeight:700, color:"#e8f5e9", margin:0 }}>
                    {language === "hi" ? "कीटनाशक लगाएं" : "Apply pesticide"}
                  </p>
                  <p style={{ fontSize:11, color:"rgba(200,240,210,0.6)", margin:0 }}>
                    {language === "hi" ? "प्रभावित हिस्से पर।" : "Target affected area."}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Crop Health CNN Card ── */}
      {cropAnalysis && <CropHealthInReport cropAnalysis={cropAnalysis} />}

      {/* ── Fraud Detection Card ── */}
      {latestJob._id && (
        <FraudCheckInReport
          droneJobId={latestJob._id}
          fieldId={latestJob.field?._id}
          language={language}
        />
      )}

      {/* Yield prediction */}
      {latestJob.analysis?.toLowerCase().includes("yield") && (
        <div style={S.card}>
          <h2 style={{ fontSize:13, fontWeight:700, color:"#e8f5e9", margin:"0 0 8px" }}>{t("yieldPredictionTitle")}</h2>
          <p style={{ fontSize:12, color:"rgba(200,240,210,0.7)", margin:0 }}>{latestJob.analysis}</p>
          <p style={{ fontSize:10, color:"rgba(200,240,210,0.4)", marginTop:6 }}>{t("profitHint")}</p>
        </div>
      )}

      {/* Navigation */}
      <div style={{ display:"flex", gap:12 }}>
        {latestJob.field?._id && (
          <button onClick={() => navigate(`/fields/${latestJob.field._id}`)}
            style={{ flex:1, background:"linear-gradient(135deg,#4ade80,#22c55e)", color:"#0a1a0f", border:"none", borderRadius:50, padding:"13px 0", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Sora',sans-serif", boxShadow:"0 4px 20px rgba(74,222,128,0.3)" }}>
            {language === "hi" ? "इस खेत की सारी स्कैन देखें" : "View All Scans for this Field"} →
          </button>
        )}
      </div>
    </div>
  );
};

export default LastScanReport;