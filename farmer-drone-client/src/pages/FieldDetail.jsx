// // src/pages/FieldDetail.jsx
// import FraudCheckCard from "../components/FraudCheckCard";
// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useLanguage } from "../context/LanguageContext";
// import api from "../api";

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
//       [/yield estimated at ([\d–-]+)/gi, (_, y) => `अनुमानित उपज: ${y} क्विंटल/एकड़`],
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

// /* ── Shared style tokens ── */
// const S = {
//   card: {
//     background: "rgba(20,45,28,0.85)",
//     border: "1px solid rgba(74,222,128,0.2)",
//     borderRadius: 20,
//     backdropFilter: "blur(16px)",
//     padding: "18px 20px",
//   },
//   cardWhite: {
//     background: "rgba(255,255,255,0.04)",
//     border: "1px solid rgba(74,222,128,0.15)",
//     borderRadius: 16,
//     padding: "12px 14px",
//   },
//   label: { fontSize: 10, fontWeight: 600, color: "rgba(200,240,210,0.55)", letterSpacing: "0.4px", textTransform: "uppercase" },
//   value: { fontSize: 13, fontWeight: 600, color: "#e8f5e9" },
//   muted: { fontSize: 11, color: "rgba(200,240,210,0.6)" },
// };

// const badge = (type) => {
//   const map = {
//     green:  { color: "#86efac", background: "rgba(74,222,128,0.12)",  border: "1px solid rgba(74,222,128,0.3)" },
//     amber:  { color: "#fcd34d", background: "rgba(251,191,36,0.12)",  border: "1px solid rgba(251,191,36,0.3)" },
//     blue:   { color: "#93c5fd", background: "rgba(96,165,250,0.12)",  border: "1px solid rgba(96,165,250,0.3)" },
//     red:    { color: "#fca5a5", background: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.3)" },
//     slate:  { color: "rgba(200,240,210,0.55)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" },
//   };
//   return { display:"inline-flex", alignItems:"center", padding:"3px 10px", borderRadius:50, fontSize:11, fontWeight:600, ...map[type] };
// };

// const StatusBadge = ({ status, t }) => {
//   if (status === "completed")      return <span style={badge("green")}>{t("completed")}</span>;
//   if (status === "images_uploaded" || status === "scheduled") return <span style={badge("blue")}>{t("imagesUploaded")}</span>;
//   return <span style={badge("amber")}>{t("requested")}</span>;
// };

// function getHealthStyle(analysis) {
//   const a = (analysis || "").toLowerCase();
//   if (!analysis) return { type: "slate",  emoji: "⏳" };
//   if (a.includes("no issues") || a.includes("healthy")) return { type: "green", emoji: "✅" };
//   if (a.includes("mild") || a.includes("moderate"))     return { type: "amber", emoji: "⚠️" };
//   return { type: "red", emoji: "🔴" };
// }

// const healthCard = (type) => {
//   const map = {
//     green: { bg: "rgba(74,222,128,0.08)",  border: "rgba(74,222,128,0.25)",  color: "#86efac" },
//     amber: { bg: "rgba(251,191,36,0.08)",  border: "rgba(251,191,36,0.25)",  color: "#fcd34d" },
//     red:   { bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.25)", color: "#fca5a5" },
//     slate: { bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.1)",  color: "rgba(200,240,210,0.6)" },
//   };
//   return map[type] || map.slate;
// };

// /* ── Crop Health CNN Card ── */
// const CropHealthCard = ({ cropAnalysis }) => {
//   if (!cropAnalysis?.results) return null;
//   const { results, model_used, confidence } = cropAnalysis;
//   const { cropHealthStatus, diseaseDetected, recommendation, ndviScore, affectedArea, riskLevel } = results;
//   const isHealthy  = cropHealthStatus === "healthy";
//   const isDiseased = cropHealthStatus === "diseased";
//   const cfg = isDiseased
//     ? { type: "red",   label: "DISEASED", icon: "🦠", bar: "#ef4444" }
//     : isHealthy
//     ? { type: "green", label: "HEALTHY",  icon: "✅", bar: "#4ade80" }
//     : { type: "amber", label: "MODERATE", icon: "⚠️", bar: "#fbbf24" };
//   const hc = healthCard(cfg.type);

//   return (
//     <div style={S.card}>
//       <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
//         <div style={{ display:"flex", alignItems:"center", gap:10 }}>
//           <span style={{ fontSize:20 }}>🌿</span>
//           <div>
//             <p style={{ fontSize:13, fontWeight:700, color:"#e8f5e9", margin:0 }}>Crop Health Report</p>
//             <p style={{ fontSize:10, color:"rgba(200,240,210,0.5)", margin:0 }}>{model_used || "crop_health_v1"}</p>
//           </div>
//         </div>
//         <span style={{ fontSize:11, color:"rgba(200,240,210,0.5)" }}>{confidence ? `${Math.round(confidence*100)}% confident` : ""}</span>
//       </div>

//       <div style={{ background: hc.bg, border: `1px solid ${hc.border}`, borderRadius:14, padding:14, display:"flex", flexDirection:"column", gap:12 }}>
//         <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
//           <div style={{ display:"flex", alignItems:"center", gap:8 }}>
//             <span style={{ fontSize:20 }}>{cfg.icon}</span>
//             <span style={{ ...badge(cfg.type), fontSize:12, fontWeight:700 }}>{cfg.label}</span>
//           </div>
//           {riskLevel && <span style={{ fontSize:11, fontWeight:700, color: hc.color }}>Risk: {riskLevel.toUpperCase()}</span>}
//         </div>

//         {ndviScore !== undefined && (
//           <div>
//             <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
//               <span style={S.muted}>NDVI Score (Vegetation Index)</span>
//               <span style={{ fontSize:11, fontWeight:700, color:"#e8f5e9" }}>{ndviScore?.toFixed(2)}</span>
//             </div>
//             <div style={{ height:8, background:"rgba(255,255,255,0.1)", borderRadius:50, overflow:"hidden" }}>
//               <div style={{ height:"100%", borderRadius:50, background: cfg.bar, width:`${Math.round(ndviScore*100)}%`, transition:"width 0.7s ease" }} />
//             </div>
//             <div style={{ display:"flex", justifyContent:"space-between", marginTop:3 }}>
//               <span style={{ fontSize:9, color:"rgba(200,240,210,0.35)" }}>0 — Dead</span>
//               <span style={{ fontSize:9, color:"rgba(200,240,210,0.35)" }}>1 — Healthy</span>
//             </div>
//           </div>
//         )}

//         {diseaseDetected?.length > 0 && (
//           <div style={{ background:"rgba(0,0,0,0.15)", borderRadius:10, padding:"10px 12px" }}>
//             <p style={{ fontSize:11, fontWeight:700, color:"#fca5a5", marginBottom:6 }}>🦠 Disease Detected:</p>
//             <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
//               {diseaseDetected.map((d, i) => <span key={i} style={badge("red")}>{d}</span>)}
//             </div>
//           </div>
//         )}

//         {affectedArea !== undefined && affectedArea > 0 && (
//           <div style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(0,0,0,0.12)", borderRadius:10, padding:"8px 12px" }}>
//             <span>📐</span>
//             <p style={{ fontSize:12, color:"#e8f5e9", margin:0 }}>Affected Area: <strong>{affectedArea}%</strong> of field</p>
//           </div>
//         )}

//         {recommendation && (
//           <div style={{ background:"rgba(0,0,0,0.12)", borderRadius:10, padding:"10px 12px" }}>
//             <p style={{ fontSize:11, fontWeight:700, color:"rgba(200,240,210,0.8)", marginBottom:4 }}>💡 Recommendation</p>
//             <p style={{ fontSize:12, color:"rgba(200,240,210,0.7)", margin:0, lineHeight:1.5 }}>{recommendation}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// /* ── Modals ── */
// const ConfirmDeleteScanModal = ({ scanNumber, onConfirm, onCancel }) => (
//   <div style={{ position:"fixed", inset:0, zIndex:50, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.7)", backdropFilter:"blur(6px)", padding:16 }}>
//     <div style={{ background:"#172d1f", border:"1px solid rgba(74,222,128,0.2)", borderRadius:24, width:"100%", maxWidth:360, padding:28, textAlign:"center", boxShadow:"0 24px 80px rgba(0,0,0,0.5)" }}>
//       <div style={{ fontSize:40, marginBottom:12 }}>🗑️</div>
//       <h2 style={{ fontSize:16, fontWeight:700, color:"#e8f5e9", marginBottom:8 }}>Delete Scan?</h2>
//       <p style={{ fontSize:13, color:"rgba(200,240,210,0.55)", marginBottom:24, lineHeight:1.6 }}>
//         <strong style={{ color:"#c8f5d4" }}>Scan {scanNumber}</strong> permanently delete ho jayega.
//       </p>
//       <div style={{ display:"flex", gap:10 }}>
//         <button onClick={onCancel} style={{ flex:1, background:"transparent", border:"1px solid rgba(74,222,128,0.3)", color:"#c8f5d4", borderRadius:50, padding:"10px 0", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"'Sora',sans-serif" }}>Cancel</button>
//         <button onClick={onConfirm} style={{ flex:1, background:"linear-gradient(135deg,#ef4444,#dc2626)", color:"#fff", border:"none", borderRadius:50, padding:"10px 0", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Sora',sans-serif" }}>Yes, Delete</button>
//       </div>
//     </div>
//   </div>
// );

// const INSPECTION_LABELS = {
//   en: { btnStart:"Start Drone Inspection", modalTitle:"Start Drone Inspection?", modalDesc:"Drone inspection will begin for", area:"Area", crop:"Crop", notSet:"Not set", estTime:"Est. Time", cancel:"Cancel", starting:"Starting...", confirm:"🚁 Start Inspection", successMsg:"✅ Drone inspection complete! Sensor data saved.", errorMsg:"❌ Inspection failed. Please try again." },
//   hi: { btnStart:"ड्रोन निरीक्षण शुरू करें", modalTitle:"ड्रोन निरीक्षण शुरू करें?", modalDesc:"के लिए ड्रोन निरीक्षण शुरू होगी", area:"क्षेत्र", crop:"फसल", notSet:"सेट नहीं", estTime:"अनुमानित समय", cancel:"रद्द करें", starting:"शुरू हो रहा है...", confirm:"🚁 निरीक्षण शुरू करें", successMsg:"✅ ड्रोन निरीक्षण पूर्ण! सेंसर डेटा सेव हो गया।", errorMsg:"❌ निरीक्षण विफल। कृपया पुनः प्रयास करें।" },
//   ta: { btnStart:"ட்ரோன் ஆய்வு தொடங்கு", modalTitle:"ட்ரோன் ஆய்வு தொடங்கவா?", modalDesc:"க்கான ட்ரோன் ஆய்வு தொடங்கும்", area:"பரப்பு", crop:"பயிர்", notSet:"அமைக்கப்படவில்லை", estTime:"மதிப்பிடப்பட்ட நேரம்", cancel:"ரத்து செய்", starting:"தொடங்குகிறது...", confirm:"🚁 ஆய்வு தொடங்கு", successMsg:"✅ ட்ரோன் ஆய்வு முடிந்தது!", errorMsg:"❌ ஆய்வு தோல்வியடைந்தது." },
//   te: { btnStart:"డ్రోన్ తనిఖీ ప్రారంభించు", modalTitle:"డ్రోన్ తనిఖీ ప్రారంభించాలా?", modalDesc:"కోసం డ్రోన్ తనిఖీ మొదలవుతుంది", area:"విస్తీర్ణం", crop:"పంట", notSet:"సెట్ కాలేదు", estTime:"అంచనా సమయం", cancel:"రద్దు చేయి", starting:"ప్రారంభమవుతోంది...", confirm:"🚁 తనిఖీ ప్రారంభించు", successMsg:"✅ డ్రోన్ తనిఖీ పూర్తైంది!", errorMsg:"❌ తనిఖీ విఫలమైంది." },
//   mr: { btnStart:"ड्रोन तपासणी सुरू करा", modalTitle:"ड्रोन तपासणी सुरू करायची?", modalDesc:"साठी ड्रोन तपासणी सुरू होईल", area:"क्षेत्र", crop:"पीक", notSet:"सेट नाही", estTime:"अंदाजे वेळ", cancel:"रद्द करा", starting:"सुरू होत आहे...", confirm:"🚁 तपासणी सुरू करा", successMsg:"✅ ड्रोन तपासणी पूर्ण!", errorMsg:"❌ तपासणी अयशस्वी." },
//   bn: { btnStart:"ড্রোন পরিদর্শন শুরু করুন", modalTitle:"ড্রোন পরিদর্শন শুরু করবেন?", modalDesc:"এর জন্য ড্রোন পরিদর্শন শুরু হবে", area:"এলাকা", crop:"ফসল", notSet:"সেট করা নেই", estTime:"আনুমানিক সময়", cancel:"বাতিল করুন", starting:"শুরু হচ্ছে...", confirm:"🚁 পরিদর্শন শুরু করুন", successMsg:"✅ ড্রোন পরিদর্শন সম্পন্ন!", errorMsg:"❌ পরিদর্শন ব্যর্থ।" },
// };

// const StartInspectionModal = ({ field, onConfirm, onCancel, loading, language }) => {
//   const L = INSPECTION_LABELS[language] || INSPECTION_LABELS.en;
//   return (
//     <div style={{ position:"fixed", inset:0, zIndex:50, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.7)", backdropFilter:"blur(6px)", padding:16 }}>
//       <div style={{ background:"#172d1f", border:"1px solid rgba(74,222,128,0.22)", borderRadius:24, width:"100%", maxWidth:380, padding:28, boxShadow:"0 24px 80px rgba(0,0,0,0.5)" }}>
//         <div style={{ textAlign:"center", marginBottom:18 }}>
//           <div style={{ fontSize:40, marginBottom:8 }}>🚁</div>
//           <h2 style={{ fontSize:16, fontWeight:700, color:"#e8f5e9", margin:0 }}>{L.modalTitle}</h2>
//           <p style={{ fontSize:12, color:"rgba(200,240,210,0.55)", marginTop:6 }}><strong style={{ color:"#c8f5d4" }}>"{field?.name}"</strong> {L.modalDesc}.</p>
//         </div>
//         <div style={{ background:"rgba(74,222,128,0.08)", border:"1px solid rgba(74,222,128,0.2)", borderRadius:12, padding:"12px 14px", marginBottom:18, display:"flex", flexDirection:"column", gap:6 }}>
//           <p style={{ fontSize:12, color:"#86efac", margin:0 }}>📐 {L.area}: <strong>{field?.areaInAcre} acres</strong></p>
//           <p style={{ fontSize:12, color:"#86efac", margin:0 }}>🌾 {L.crop}: <strong>{field?.cropType || L.notSet}</strong></p>
//           <p style={{ fontSize:12, color:"#86efac", margin:0 }}>⏱️ {L.estTime}: <strong>~3-5 min</strong></p>
//         </div>
//         <div style={{ display:"flex", gap:10 }}>
//           <button onClick={onCancel} disabled={loading} style={{ flex:1, background:"transparent", border:"1px solid rgba(74,222,128,0.3)", color:"#c8f5d4", borderRadius:50, padding:"10px 0", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"'Sora',sans-serif", opacity: loading?0.5:1 }}>{L.cancel}</button>
//           <button onClick={onConfirm} disabled={loading} style={{ flex:1, background:"linear-gradient(135deg,#4ade80,#22c55e)", color:"#0a1a0f", border:"none", borderRadius:50, padding:"10px 0", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Sora',sans-serif", opacity: loading?0.6:1 }}>
//             {loading ? L.starting : L.confirm}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ── Main Component ── */
// const FieldDetail = () => {
//   const { t, language } = useLanguage();
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const [field, setField]               = useState(null);
//   const [scans, setScans]               = useState([]);
//   const [selectedScan, setSelectedScan] = useState(null);
//   const [loading, setLoading]           = useState(true);
//   const [error, setError]               = useState(null);
//   const [scanToDelete, setScanToDelete] = useState(null);
//   const [deletingId, setDeletingId]     = useState(null);
//   const [showInspectionModal, setShowInspectionModal] = useState(false);
//   const [inspectionLoading, setInspectionLoading]     = useState(false);
//   const [inspectionStatus, setInspectionStatus]       = useState(null);
//   const [cropAnalysis, setCropAnalysis] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [fieldRes, jobsRes] = await Promise.all([
//           api.get(`/api/fields/${id}`),
//           api.get("/api/drone-jobs/my"),
//         ]);
//         setField(fieldRes.data.field);
//         const fieldScans = (jobsRes.data.jobs || []).filter(j => j.field?._id === id || j.field === id);
//         setScans(fieldScans);
//         const latestCompleted = fieldScans.find(j => j.status === "completed");
//         if (latestCompleted) {
//           setSelectedScan(latestCompleted);
//           setCropAnalysis(latestCompleted.aiAnalysisId || null);
//         }
//       } catch (err) {
//         console.error("FieldDetail fetch error:", err);
//         setError(t("fieldNotFound"));
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [id, t]);

//   const handleStartInspection = async () => {
//     setInspectionLoading(true);
//     try {
//       const inspRes = await api.post("/api/inspections/start", { jobId: scans[0]?._id || id });
//       const inspectionId = inspRes.data.inspectionId;
//       await new Promise(resolve => setTimeout(resolve, 3000));
//       await api.patch(`/api/inspections/${inspectionId}/complete`, {
//         flightPath: [
//           { lat:27.5706, lng:80.6982, alt:30 }, { lat:27.5710, lng:80.6982, alt:30 },
//           { lat:27.5710, lng:80.6990, alt:30 }, { lat:27.5706, lng:80.6990, alt:30 },
//         ],
//         sensorData: {
//           ndviValue:    +(Math.random()*0.5+0.35).toFixed(2),
//           soilMoisture: +(Math.random()*30+30).toFixed(1),
//           temperature:  +(Math.random()*10+24).toFixed(1),
//           humidity:     +(Math.random()*30+45).toFixed(1),
//         },
//       });
//       try {
//         const cropRes = await api.post("/api/ai/analyze-crop", {
//           jobId: inspectionId,
//           imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Sunflower_from_Silesia2.jpg/800px-Sunflower_from_Silesia2.jpg",
//         });
//         if (cropRes.data?.analysis) setCropAnalysis(cropRes.data.analysis);
//       } catch (cropErr) {
//         console.log("Crop analysis skipped:", cropErr.message);
//       }
//       const L = INSPECTION_LABELS[language] || INSPECTION_LABELS.en;
//       setInspectionStatus({ type:"success", message: L.successMsg });
//       setShowInspectionModal(false);
//       const jobsRes = await api.get("/api/drone-jobs/my");
//       const fieldScans = (jobsRes.data.jobs || []).filter(j => j.field?._id === id || j.field === id);
//       setScans(fieldScans);
//     } catch (err) {
//       console.error("Inspection error:", err);
//       const L = INSPECTION_LABELS[language] || INSPECTION_LABELS.en;
//       setInspectionStatus({ type:"error", message: L.errorMsg });
//       setShowInspectionModal(false);
//     } finally {
//       setInspectionLoading(false);
//       setTimeout(() => setInspectionStatus(null), 4000);
//     }
//   };

//   const handleSelectScan = (scan) => {
//     setSelectedScan(scan);
//     setCropAnalysis(scan.aiAnalysisId || null);
//   };

//   const handleDeleteScanConfirm = async () => {
//     if (!scanToDelete) return;
//     const { scan } = scanToDelete;
//     setDeletingId(scan._id);
//     try {
//       await api.delete(`/api/drone-jobs/${scan._id}`);
//       setScans(prev => prev.filter(s => s._id !== scan._id));
//       if (selectedScan?._id === scan._id) {
//         const remaining = scans.filter(s => s._id !== scan._id);
//         setSelectedScan(remaining.find(s => s.status === "completed") || null);
//         setCropAnalysis(null);
//       }
//     } catch {
//       alert("Could not delete scan. Please try again.");
//     } finally {
//       setDeletingId(null);
//       setScanToDelete(null);
//     }
//   };

//   if (loading) {
//     return (
//       <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"50vh" }}>
//         <div style={{ width:28, height:28, border:"2px solid #4ade80", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
//         <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//       </div>
//     );
//   }

//   if (error || !field) {
//     return (
//       <div style={{ padding:20, maxWidth:480, margin:"0 auto", ...S.card }}>
//         <p style={S.muted}>{error || t("fieldNotFound")}</p>
//         <button onClick={() => navigate("/home")} style={{ fontSize:12, color:"#86efac", background:"none", border:"none", cursor:"pointer", marginTop:8 }}>← {t("myFields")}</button>
//       </div>
//     );
//   }

//   const completedScans = scans.filter(s => s.status === "completed");
//   const pendingScans   = scans.filter(s => s.status !== "completed");
//   const health         = getHealthStyle(selectedScan?.analysis || null);
//   const hc             = healthCard(health.type);
//   const L              = INSPECTION_LABELS[language] || INSPECTION_LABELS.en;

//   return (
//     <div style={{ fontFamily:"'Sora','DM Sans',sans-serif", padding:"24px 16px 48px", maxWidth:680, margin:"0 auto", display:"flex", flexDirection:"column", gap:16 }}>
//       <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes pulse-dot { 0%,100%{box-shadow:0 0 0 0 rgba(74,222,128,0.6)} 50%{box-shadow:0 0 0 6px rgba(74,222,128,0)} }`}</style>

//       {scanToDelete && <ConfirmDeleteScanModal scanNumber={scans.length - scanToDelete.index} onConfirm={handleDeleteScanConfirm} onCancel={() => setScanToDelete(null)} />}
//       {showInspectionModal && <StartInspectionModal field={field} onConfirm={handleStartInspection} onCancel={() => setShowInspectionModal(false)} loading={inspectionLoading} language={language} />}

//       {/* Back */}
//       <button onClick={() => navigate(-1)} style={{ fontSize:12, color:"rgba(200,240,210,0.55)", background:"none", border:"none", cursor:"pointer", textAlign:"left", fontFamily:"'Sora',sans-serif" }}>
//         ‹ {t("myFields")}
//       </button>

//       {/* Inspection status toast */}
//       {inspectionStatus && (
//         <div style={{ borderRadius:12, padding:"12px 16px", fontSize:13, fontWeight:600, background: inspectionStatus.type==="success" ? "rgba(74,222,128,0.12)" : "rgba(248,113,113,0.12)", border: `1px solid ${inspectionStatus.type==="success" ? "rgba(74,222,128,0.3)" : "rgba(248,113,113,0.3)"}`, color: inspectionStatus.type==="success" ? "#86efac" : "#fca5a5" }}>
//           {inspectionStatus.message}
//         </div>
//       )}

//       {/* ── Field Info Card ── */}
//       <div style={S.card}>
//         <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12, marginBottom:16 }}>
//           <div>
//             <h1 style={{ fontSize:22, fontWeight:800, color:"#f0fdf4", margin:0, letterSpacing:"-0.3px" }}>{field.name}</h1>
//             {field.cropType && <p style={{ fontSize:13, color:"#4ade80", marginTop:4, fontWeight:600 }}>🌾 {field.cropType}</p>}
//             {field.village && <p style={{ fontSize:11, color:"rgba(200,240,210,0.55)", marginTop:2 }}>📍 {[field.village, field.district, field.state].filter(Boolean).join(", ")}</p>}
//           </div>
//           <div style={{ textAlign:"right", flexShrink:0 }}>
//             {field.areaInAcre && <p style={{ fontSize:11, color:"rgba(200,240,210,0.6)", margin:0 }}>📐 {field.areaInAcre} acres</p>}
//             {field.season     && <p style={{ fontSize:11, color:"rgba(200,240,210,0.6)", margin:0 }}>🌱 {field.season}</p>}
//           </div>
//         </div>

//         {/* Stat pills */}
//         <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:16 }}>
//           {[
//             { value: completedScans.length, label: t("completed"), color:"#86efac", bg:"rgba(74,222,128,0.1)", border:"rgba(74,222,128,0.2)" },
//             { value: pendingScans.length,   label: t("requested"), color:"#fcd34d", bg:"rgba(251,191,36,0.1)", border:"rgba(251,191,36,0.2)" },
//             { value: scans.length,          label: "Total",        color:"#93c5fd", bg:"rgba(96,165,250,0.1)", border:"rgba(96,165,250,0.2)" },
//           ].map((s, i) => (
//             <div key={i} style={{ background:s.bg, border:`1px solid ${s.border}`, borderRadius:14, padding:"12px 10px", textAlign:"center" }}>
//               <p style={{ fontSize:26, fontWeight:800, color:s.color, margin:0, lineHeight:1 }}>{s.value}</p>
//               <p style={{ fontSize:10, color:s.color, margin:"4px 0 0", opacity:0.8, fontWeight:600 }}>{s.label}</p>
//             </div>
//           ))}
//         </div>

//         {/* Start Inspection button */}
//         <button
//           onClick={() => setShowInspectionModal(true)}
//           style={{ width:"100%", background:"linear-gradient(135deg,#4ade80,#22c55e)", color:"#0a1a0f", border:"none", borderRadius:50, padding:"12px 0", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Sora',sans-serif", boxShadow:"0 4px 20px rgba(74,222,128,0.3)", transition:"all 0.2s" }}
//           onMouseEnter={e => e.currentTarget.style.boxShadow="0 6px 28px rgba(74,222,128,0.45)"}
//           onMouseLeave={e => e.currentTarget.style.boxShadow="0 4px 20px rgba(74,222,128,0.3)"}
//         >
//           🚁 {L.btnStart}
//         </button>
//       </div>

//       {/* ── Health Summary ── */}
//       {selectedScan ? (
//         <div style={{ background: hc.bg, border:`1px solid ${hc.border}`, borderRadius:20, padding:"18px 20px", display:"flex", flexDirection:"column", gap:12 }}>
//           <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
//             <h2 style={{ fontSize:14, fontWeight:700, color: hc.color, margin:0 }}>{health.emoji} {t("healthSummaryTitle")}</h2>
//             <span style={{ fontSize:11, color:"rgba(200,240,210,0.45)" }}>{new Date(selectedScan.createdAt).toLocaleDateString()}</span>
//           </div>
//           <p style={{ fontSize:13, color: hc.color, margin:0, lineHeight:1.6 }}>
//             {translateAnalysis(selectedScan.analysis, language) || t("analysisPendingLong")}
//           </p>
//           {selectedScan.analysis && (
//             <div style={{ background:"rgba(0,0,0,0.15)", borderRadius:12, padding:"12px 14px", display:"flex", flexDirection:"column", gap:10 }}>
//               {selectedScan.analysis.toLowerCase().includes("nitrogen") && (
//                 <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
//                   <span style={{ fontSize:16 }}>💧</span>
//                   <div>
//                     <p style={{ fontSize:12, fontWeight:700, color:"#e8f5e9", margin:0 }}>{language==="hi" ? "नाइट्रोजन स्प्रे करें" : "Apply Nitrogen spray"}</p>
//                     <p style={{ fontSize:11, color:"rgba(200,240,210,0.6)", margin:0 }}>{language==="hi" ? "यूरिया या DAP 3 दिनों में।" : "Urea or DAP within 3 days."}</p>
//                   </div>
//                 </div>
//               )}
//               {selectedScan.analysis.toLowerCase().includes("pest") && (
//                 <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
//                   <span style={{ fontSize:16 }}>🐛</span>
//                   <div>
//                     <p style={{ fontSize:12, fontWeight:700, color:"#e8f5e9", margin:0 }}>{language==="hi" ? "कीटनाशक लगाएं" : "Apply pesticide"}</p>
//                     <p style={{ fontSize:11, color:"rgba(200,240,210,0.6)", margin:0 }}>{language==="hi" ? "प्रभावित हिस्से पर।" : "Target affected area."}</p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       ) : (
//         <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:"24px 20px", textAlign:"center" }}>
//           <p style={S.muted}>{t("noScans")}</p>
//         </div>
//       )}

//       {/* ── Crop Health CNN Card ── */}
//       {selectedScan?.status === "completed" && <CropHealthCard cropAnalysis={cropAnalysis} />}

//       {/* ── Fraud Check Card ── */}
//       {selectedScan?.status === "completed" && (
//         <FraudCheckCard droneJobId={selectedScan._id} fieldId={field._id} language={language} />
//       )}

//       {/* ── Scan List ── */}
//       {scans.length > 0 && (
//         <div style={S.card}>
//           <div style={{ marginBottom:14 }}>
//             <h3 style={{ fontSize:14, fontWeight:700, color:"#e8f5e9", margin:0 }}>{t("myScansTitle")}</h3>
//             <p style={{ fontSize:11, color:"rgba(200,240,210,0.5)", marginTop:4 }}>
//               {language==="hi" ? "किसी स्कैन पर टैप करके रिपोर्ट देखें • × से डिलीट करें" : "Tap any scan to view its report • × to delete"}
//             </p>
//           </div>
//           <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
//             {scans.map((scan, idx) => {
//               const isSelected = selectedScan?._id === scan._id;
//               const isDeleting = deletingId === scan._id;
//               const h = getHealthStyle(scan.analysis);
//               return (
//                 <div key={scan._id} style={{ background: isSelected ? "rgba(74,222,128,0.1)" : "rgba(255,255,255,0.03)", border:`1px solid ${isSelected ? "rgba(74,222,128,0.3)" : "rgba(255,255,255,0.07)"}`, borderRadius:14, padding:"12px 14px", opacity: isDeleting?0.4:1, pointerEvents: isDeleting?"none":"auto", transition:"all 0.2s" }}>
//                   <div style={{ display:"flex", alignItems:"center", gap:10 }}>
//                     <div style={{ flex:1, display:"flex", alignItems:"center", gap:10, cursor:"pointer", minWidth:0 }} onClick={() => handleSelectScan(scan)}>
//                       <span style={{ fontSize:18, flexShrink:0 }}>{h.emoji}</span>
//                       <div style={{ minWidth:0 }}>
//                         <p style={{ fontSize:13, fontWeight:700, color:"#f0fdf4", margin:0 }}>{language==="hi" ? `स्कैन ${scans.length-idx}` : `Scan ${scans.length-idx}`}</p>
//                         <p style={{ fontSize:10, color:"rgba(200,240,210,0.45)", margin:0 }}>{new Date(scan.createdAt).toLocaleDateString()}</p>
//                       </div>
//                     </div>
//                     <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0, cursor:"pointer" }} onClick={() => handleSelectScan(scan)}>
//                       <StatusBadge status={scan.status} t={t} />
//                       {isSelected && <span style={{ color:"#4ade80", fontWeight:700, fontSize:14 }}>✓</span>}
//                     </div>
//                     <button onClick={e => { e.stopPropagation(); setScanToDelete({ scan, index: idx }); }}
//                       style={{ background:"none", border:"none", color:"rgba(200,240,210,0.2)", fontSize:20, cursor:"pointer", lineHeight:1, padding:"0 4px", transition:"color 0.2s" }}
//                       onMouseEnter={e => e.currentTarget.style.color="#fca5a5"}
//                       onMouseLeave={e => e.currentTarget.style.color="rgba(200,240,210,0.2)"}
//                     >×</button>
//                   </div>
//                   {scan.analysis && (
//                     <p style={{ fontSize:11, color:"rgba(200,240,210,0.55)", marginTop:8, marginLeft:28, lineHeight:1.5, cursor:"pointer" }} onClick={() => handleSelectScan(scan)}>
//                       {translateAnalysis(scan.analysis, language)}
//                     </p>
//                   )}
//                   {!scan.analysis && scan.status !== "completed" && (
//                     <p style={{ fontSize:11, color:"#fcd34d", marginTop:6, marginLeft:28 }}>{t("analysisPendingShort")}</p>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {/* Request Scan CTA */}
//       <button
//         onClick={() => navigate(`/request-scan?field=${field._id}`)}
//         style={{ width:"100%", background:"linear-gradient(135deg,#4ade80,#22c55e)", color:"#0a1a0f", border:"none", borderRadius:50, padding:"13px 0", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Sora',sans-serif", boxShadow:"0 4px 20px rgba(74,222,128,0.3)" }}
//       >
//         {t("requestScanButton")}
//       </button>
//     </div>
//   );
// };

// export default FieldDetail;



// src/pages/FieldDetail.jsx
import FraudCheckCard from "../components/FraudCheckCard";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import api from "../api";

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
      [/yield estimated at ([\d–-]+)/gi, (_, y) => `अनुमानित उपज: ${y} क्विंटल/एकड़`],
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

/* ── Shared style tokens ── */
const S = {
  card: {
    background: "rgba(20,45,28,0.85)",
    border: "1px solid rgba(74,222,128,0.2)",
    borderRadius: 20,
    backdropFilter: "blur(16px)",
    padding: "18px 20px",
  },
  cardWhite: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(74,222,128,0.15)",
    borderRadius: 16,
    padding: "12px 14px",
  },
  label: { fontSize: 10, fontWeight: 600, color: "rgba(200,240,210,0.55)", letterSpacing: "0.4px", textTransform: "uppercase" },
  value: { fontSize: 13, fontWeight: 600, color: "#e8f5e9" },
  muted: { fontSize: 11, color: "rgba(200,240,210,0.6)" },
};

const badge = (type) => {
  const map = {
    green:  { color: "#86efac", background: "rgba(74,222,128,0.12)",  border: "1px solid rgba(74,222,128,0.3)" },
    amber:  { color: "#fcd34d", background: "rgba(251,191,36,0.12)",  border: "1px solid rgba(251,191,36,0.3)" },
    blue:   { color: "#93c5fd", background: "rgba(96,165,250,0.12)",  border: "1px solid rgba(96,165,250,0.3)" },
    red:    { color: "#fca5a5", background: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.3)" },
    slate:  { color: "rgba(200,240,210,0.55)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" },
  };
  return { display:"inline-flex", alignItems:"center", padding:"3px 10px", borderRadius:50, fontSize:11, fontWeight:600, ...map[type] };
};

const StatusBadge = ({ status, t }) => {
  if (status === "completed")      return <span style={badge("green")}>{t("completed")}</span>;
  if (status === "images_uploaded" || status === "scheduled") return <span style={badge("blue")}>{t("imagesUploaded")}</span>;
  return <span style={badge("amber")}>{t("requested")}</span>;
};

function getHealthStyle(analysis) {
  const a = (analysis || "").toLowerCase();
  if (!analysis) return { type: "slate",  emoji: "⏳" };
  if (a.includes("no issues") || a.includes("healthy")) return { type: "green", emoji: "✅" };
  if (a.includes("mild") || a.includes("moderate"))     return { type: "amber", emoji: "⚠️" };
  return { type: "red", emoji: "🔴" };
}

const healthCard = (type) => {
  const map = {
    green: { bg: "rgba(74,222,128,0.08)",  border: "rgba(74,222,128,0.25)",  color: "#86efac" },
    amber: { bg: "rgba(251,191,36,0.08)",  border: "rgba(251,191,36,0.25)",  color: "#fcd34d" },
    red:   { bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.25)", color: "#fca5a5" },
    slate: { bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.1)",  color: "rgba(200,240,210,0.6)" },
  };
  return map[type] || map.slate;
};

/* ── Crop Health CNN Card ── */
const CropHealthCard = ({ cropAnalysis }) => {
  if (!cropAnalysis?.results) return null;
  const { results, model_used, confidence } = cropAnalysis;
  const { cropHealthStatus, diseaseDetected, recommendation, ndviScore, affectedArea, riskLevel } = results;
  const isHealthy  = cropHealthStatus === "healthy";
  const isDiseased = cropHealthStatus === "diseased";
  const cfg = isDiseased
    ? { type: "red",   label: "DISEASED", icon: "🦠", bar: "#ef4444" }
    : isHealthy
    ? { type: "green", label: "HEALTHY",  icon: "✅", bar: "#4ade80" }
    : { type: "amber", label: "MODERATE", icon: "⚠️", bar: "#fbbf24" };
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

      <div style={{ background: hc.bg, border: `1px solid ${hc.border}`, borderRadius:14, padding:14, display:"flex", flexDirection:"column", gap:12 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:20 }}>{cfg.icon}</span>
            <span style={{ ...badge(cfg.type), fontSize:12, fontWeight:700 }}>{cfg.label}</span>
          </div>
          {riskLevel && <span style={{ fontSize:11, fontWeight:700, color: hc.color }}>Risk: {riskLevel.toUpperCase()}</span>}
        </div>

        {ndviScore !== undefined && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
              <span style={S.muted}>NDVI Score (Vegetation Index)</span>
              <span style={{ fontSize:11, fontWeight:700, color:"#e8f5e9" }}>{ndviScore?.toFixed(2)}</span>
            </div>
            <div style={{ height:8, background:"rgba(255,255,255,0.1)", borderRadius:50, overflow:"hidden" }}>
              <div style={{ height:"100%", borderRadius:50, background: cfg.bar, width:`${Math.round(ndviScore*100)}%`, transition:"width 0.7s ease" }} />
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:3 }}>
              <span style={{ fontSize:9, color:"rgba(200,240,210,0.35)" }}>0 — Dead</span>
              <span style={{ fontSize:9, color:"rgba(200,240,210,0.35)" }}>1 — Healthy</span>
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
            <p style={{ fontSize:12, color:"#e8f5e9", margin:0 }}>Affected Area: <strong>{affectedArea}%</strong> of field</p>
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

/* ── Modals ── */
const ConfirmDeleteScanModal = ({ scanNumber, onConfirm, onCancel }) => (
  <div style={{ position:"fixed", inset:0, zIndex:50, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.7)", backdropFilter:"blur(6px)", padding:16 }}>
    <div style={{ background:"#172d1f", border:"1px solid rgba(74,222,128,0.2)", borderRadius:24, width:"100%", maxWidth:360, padding:28, textAlign:"center", boxShadow:"0 24px 80px rgba(0,0,0,0.5)" }}>
      <div style={{ fontSize:40, marginBottom:12 }}>🗑️</div>
      <h2 style={{ fontSize:16, fontWeight:700, color:"#e8f5e9", marginBottom:8 }}>Delete Scan?</h2>
      <p style={{ fontSize:13, color:"rgba(200,240,210,0.55)", marginBottom:24, lineHeight:1.6 }}>
        <strong style={{ color:"#c8f5d4" }}>Scan {scanNumber}</strong> permanently delete ho jayega.
      </p>
      <div style={{ display:"flex", gap:10 }}>
        <button onClick={onCancel} style={{ flex:1, background:"transparent", border:"1px solid rgba(74,222,128,0.3)", color:"#c8f5d4", borderRadius:50, padding:"10px 0", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"'Sora',sans-serif" }}>Cancel</button>
        <button onClick={onConfirm} style={{ flex:1, background:"linear-gradient(135deg,#ef4444,#dc2626)", color:"#fff", border:"none", borderRadius:50, padding:"10px 0", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Sora',sans-serif" }}>Yes, Delete</button>
      </div>
    </div>
  </div>
);

const INSPECTION_LABELS = {
  en: { btnStart:"Start Drone Inspection", modalTitle:"Start Drone Inspection?", modalDesc:"Drone inspection will begin for", area:"Area", crop:"Crop", notSet:"Not set", estTime:"Est. Time", cancel:"Cancel", starting:"Starting...", confirm:"🚁 Start Inspection", successMsg:"✅ Drone inspection complete! Sensor data saved.", errorMsg:"❌ Inspection failed. Please try again." },
  hi: { btnStart:"ड्रोन निरीक्षण शुरू करें", modalTitle:"ड्रोन निरीक्षण शुरू करें?", modalDesc:"के लिए ड्रोन निरीक्षण शुरू होगी", area:"क्षेत्र", crop:"फसल", notSet:"सेट नहीं", estTime:"अनुमानित समय", cancel:"रद्द करें", starting:"शुरू हो रहा है...", confirm:"🚁 निरीक्षण शुरू करें", successMsg:"✅ ड्रोन निरीक्षण पूर्ण! सेंसर डेटा सेव हो गया।", errorMsg:"❌ निरीक्षण विफल। कृपया पुनः प्रयास करें।" },
  ta: { btnStart:"ட்ரோன் ஆய்வு தொடங்கு", modalTitle:"ட்ரோன் ஆய்வு தொடங்கவா?", modalDesc:"க்கான ட்ரோன் ஆய்வு தொடங்கும்", area:"பரப்பு", crop:"பயிர்", notSet:"அமைக்கப்படவில்லை", estTime:"மதிப்பிடப்பட்ட நேரம்", cancel:"ரத்து செய்", starting:"தொடங்குகிறது...", confirm:"🚁 ஆய்வு தொடங்கு", successMsg:"✅ ட்ரோன் ஆய்வு முடிந்தது!", errorMsg:"❌ ஆய்வு தோல்வியடைந்தது." },
  te: { btnStart:"డ్రోన్ తనిఖీ ప్రారంభించు", modalTitle:"డ్రోన్ తనిఖీ ప్రారంభించాలా?", modalDesc:"కోసం డ్రోన్ తనిఖీ మొదలవుతుంది", area:"విస్తీర్ణం", crop:"పంట", notSet:"సెట్ కాలేదు", estTime:"అంచనా సమయం", cancel:"రద్దు చేయి", starting:"ప్రారంభమవుతోంది...", confirm:"🚁 తనిఖీ ప్రారంభించు", successMsg:"✅ డ్రోన్ తనిఖీ పూర్తైంది!", errorMsg:"❌ తనిఖీ విఫలమైంది." },
  mr: { btnStart:"ड्रोन तपासणी सुरू करा", modalTitle:"ड्रोन तपासणी सुरू करायची?", modalDesc:"साठी ड्रोन तपासणी सुरू होईल", area:"क्षेत्र", crop:"पीक", notSet:"सेट नाही", estTime:"अंदाजे वेळ", cancel:"रद्द करा", starting:"सुरू होत आहे...", confirm:"🚁 तपासणी सुरू करा", successMsg:"✅ ड्रोन तपासणी पूर्ण!", errorMsg:"❌ तपासणी अयशस्वी." },
  bn: { btnStart:"ড্রোন পরিদর্শন শুরু করুন", modalTitle:"ড্রোন পরিদর্শন শুরু করবেন?", modalDesc:"এর জন্য ড্রোন পরিদর্শন শুরু হবে", area:"এলাকা", crop:"ফসল", notSet:"সেট করা নেই", estTime:"আনুমানিক সময়", cancel:"বাতিল করুন", starting:"শুরু হচ্ছে...", confirm:"🚁 পরিদর্শন শুরু করুন", successMsg:"✅ ড্রোন পরিদর্শন সম্পন্ন!", errorMsg:"❌ পরিদর্শন ব্যর্থ।" },
};

const StartInspectionModal = ({ field, onConfirm, onCancel, loading, language }) => {
  const L = INSPECTION_LABELS[language] || INSPECTION_LABELS.en;
  const [droneFile, setDroneFile] = useState(null);
  const [dronePreview, setDronePreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFilePick = (file) => {
    if (!file) return;
    setDroneFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setDronePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:50, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.7)", backdropFilter:"blur(6px)", padding:16, overflowY:"auto" }}>
      <div style={{ background:"#172d1f", border:"1px solid rgba(74,222,128,0.22)", borderRadius:24, width:"100%", maxWidth:400, padding:28, boxShadow:"0 24px 80px rgba(0,0,0,0.5)", my:16 }}>
        <div style={{ textAlign:"center", marginBottom:16 }}>
          <div style={{ fontSize:38, marginBottom:8 }}>🚁</div>
          <h2 style={{ fontSize:16, fontWeight:700, color:"#e8f5e9", margin:0 }}>{L.modalTitle}</h2>
          <p style={{ fontSize:12, color:"rgba(200,240,210,0.55)", marginTop:6 }}><strong style={{ color:"#c8f5d4" }}>"{field?.name}"</strong> {L.modalDesc}.</p>
        </div>

        {/* Field info */}
        <div style={{ background:"rgba(74,222,128,0.08)", border:"1px solid rgba(74,222,128,0.2)", borderRadius:12, padding:"10px 14px", marginBottom:16, display:"flex", flexDirection:"column", gap:4 }}>
          <p style={{ fontSize:12, color:"#86efac", margin:0 }}>📐 {L.area}: <strong>{field?.areaInAcre} acres</strong></p>
          <p style={{ fontSize:12, color:"#86efac", margin:0 }}>🌾 {L.crop}: <strong>{field?.cropType || L.notSet}</strong></p>
        </div>

        {/* Drone Image Upload */}
        <div style={{ marginBottom:16 }}>
          <p style={{ fontSize:11, fontWeight:700, color:"rgba(200,240,210,0.7)", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.5px" }}>
            📷 {language === "hi" ? "ड्रोन इमेज अपलोड करें" : language === "mr" ? "ड्रोन प्रतिमा अपलोड करा" : "Upload Drone Image"}
          </p>
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display:"none" }}
            onChange={e => handleFilePick(e.target.files[0])} />
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); handleFilePick(e.dataTransfer.files[0]); }}
            onClick={() => !droneFile && fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${dragOver ? "rgba(74,222,128,0.7)" : droneFile ? "rgba(74,222,128,0.5)" : "rgba(74,222,128,0.25)"}`,
              borderRadius:14, padding: droneFile ? "12px" : "20px 16px",
              textAlign:"center", cursor: droneFile ? "default" : "pointer",
              background: dragOver ? "rgba(74,222,128,0.07)" : droneFile ? "rgba(74,222,128,0.05)" : "rgba(255,255,255,0.02)",
              transition:"all 0.2s",
            }}
          >
            {droneFile ? (
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                {dronePreview && <img src={dronePreview} alt="preview" style={{ width:52, height:52, objectFit:"cover", borderRadius:8, border:"1px solid rgba(74,222,128,0.3)", flexShrink:0 }} />}
                <div style={{ textAlign:"left", flex:1, minWidth:0 }}>
                  <p style={{ fontSize:12, fontWeight:700, color:"#86efac", margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{droneFile.name}</p>
                  <p style={{ fontSize:10, color:"rgba(200,240,210,0.45)", margin:"2px 0 6px" }}>{(droneFile.size/1024).toFixed(1)} KB</p>
                  <button onClick={e => { e.stopPropagation(); setDroneFile(null); setDronePreview(null); if(fileInputRef.current) fileInputRef.current.value=""; }}
                    style={{ background:"transparent", border:"1px solid rgba(248,113,113,0.3)", borderRadius:50, padding:"2px 10px", fontSize:10, color:"rgba(252,165,165,0.7)", cursor:"pointer", fontFamily:"'Sora',sans-serif" }}>
                    ✕ {language === "hi" ? "हटाएं" : "Remove"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ fontSize:24, marginBottom:6 }}>🛸</div>
                <p style={{ fontSize:13, fontWeight:600, color:"#e8f5e9", margin:0 }}>
                  {language === "hi" ? "FPO से मिली ड्रोन इमेज यहाँ डालें" : language === "mr" ? "FPO कडून मिळालेली ड्रोन प्रतिमा येथे टाका" : "Drop FPO drone image here"}
                </p>
                <p style={{ fontSize:11, color:"rgba(200,240,210,0.4)", marginTop:4 }}>
                  {language === "hi" ? "या क्लिक करके चुनें" : "or click to browse"}
                </p>
              </>
            )}
          </div>
          {droneFile && (
            <button onClick={() => fileInputRef.current?.click()}
              style={{ width:"100%", marginTop:8, background:"rgba(74,222,128,0.08)", border:"1px solid rgba(74,222,128,0.2)", borderRadius:50, padding:"8px 0", fontSize:11, fontWeight:600, color:"#a7f3c0", cursor:"pointer", fontFamily:"'Sora',sans-serif" }}>
              📁 {language === "hi" ? "दूसरी इमेज चुनें" : "Change Image"}
            </button>
          )}
        </div>

        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onCancel} disabled={loading} style={{ flex:1, background:"transparent", border:"1px solid rgba(74,222,128,0.3)", color:"#c8f5d4", borderRadius:50, padding:"10px 0", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"'Sora',sans-serif", opacity: loading?0.5:1 }}>{L.cancel}</button>
          <button onClick={() => onConfirm(dronePreview)} disabled={loading || !droneFile}
            style={{ flex:1, background: droneFile ? "linear-gradient(135deg,#4ade80,#22c55e)" : "rgba(74,222,128,0.2)", color: droneFile ? "#0a1a0f" : "rgba(200,240,210,0.4)", border:"none", borderRadius:50, padding:"10px 0", fontSize:13, fontWeight:700, cursor: droneFile ? "pointer" : "not-allowed", fontFamily:"'Sora',sans-serif", opacity: loading?0.6:1 }}>
            {loading ? L.starting : L.confirm}
          </button>
        </div>
        {!droneFile && (
          <p style={{ fontSize:10, color:"rgba(200,240,210,0.4)", textAlign:"center", marginTop:8 }}>
            {language === "hi" ? "* पहले ड्रोन इमेज अपलोड करें" : "* Please upload drone image first"}
          </p>
        )}
      </div>
    </div>
  );
};

/* ── Main Component ── */
const FieldDetail = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();

  const [field, setField]               = useState(null);
  const [scans, setScans]               = useState([]);
  const [selectedScan, setSelectedScan] = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [scanToDelete, setScanToDelete] = useState(null);
  const [deletingId, setDeletingId]     = useState(null);
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [inspectionLoading, setInspectionLoading]     = useState(false);
  const [inspectionStatus, setInspectionStatus]       = useState(null);
  const [cropAnalysis, setCropAnalysis] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fieldRes, jobsRes] = await Promise.all([
          api.get(`/api/fields/${id}`),
          api.get("/api/drone-jobs/my"),
        ]);
        setField(fieldRes.data.field);
        const fieldScans = (jobsRes.data.jobs || []).filter(j => j.field?._id === id || j.field === id);
        setScans(fieldScans);
        const latestCompleted = fieldScans.find(j => j.status === "completed");
        if (latestCompleted) {
          setSelectedScan(latestCompleted);
          setCropAnalysis(latestCompleted.aiAnalysisId || null);
        }
      } catch (err) {
        console.error("FieldDetail fetch error:", err);
        setError(t("fieldNotFound"));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, t]);

  const handleStartInspection = async (uploadedImageUrl) => {
    setInspectionLoading(true);
    try {
      const inspRes = await api.post("/api/inspections/start", { jobId: scans[0]?._id || id });
      const inspectionId = inspRes.data.inspectionId;
      await new Promise(resolve => setTimeout(resolve, 2000));
      await api.patch(`/api/inspections/${inspectionId}/complete`, {
        flightPath: [
          { lat:27.5706, lng:80.6982, alt:30 }, { lat:27.5710, lng:80.6982, alt:30 },
          { lat:27.5710, lng:80.6990, alt:30 }, { lat:27.5706, lng:80.6990, alt:30 },
        ],
        sensorData: {
          ndviValue:    +(Math.random()*0.5+0.35).toFixed(2),
          soilMoisture: +(Math.random()*30+30).toFixed(1),
          temperature:  +(Math.random()*10+24).toFixed(1),
          humidity:     +(Math.random()*30+45).toFixed(1),
        },
        farmHealth: "Good",
        alert: false,
        aiQualityScore: Math.floor(Math.random() * 20) + 80,
      });
      let latestCropRes = null;
      try {
        // Use the uploaded drone image for crop analysis
        const imageForAnalysis = uploadedImageUrl || "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Sunflower_from_Silesia2.jpg/800px-Sunflower_from_Silesia2.jpg";
        latestCropRes = await api.post("/api/ai/analyze-crop", {
          jobId: scans[0]?._id || id, // Fix: send the DroneJob ID, not the Inspection ID
          imageUrl: imageForAnalysis,
        });
        if (latestCropRes.data?.analysis) setCropAnalysis(latestCropRes.data.analysis);
      } catch (cropErr) {
        console.log("Crop analysis skipped:", cropErr.message);
      }
      const L = INSPECTION_LABELS[language] || INSPECTION_LABELS.en;
      setInspectionStatus({ type:"success", message: L.successMsg });
      setShowInspectionModal(false);
      const jobsRes = await api.get("/api/drone-jobs/my");
      const fieldScans = (jobsRes.data.jobs || []).filter(j => j.field?._id === id || j.field === id);
      setScans(fieldScans);
      const latestCompleted = fieldScans.find(j => j.status === "completed");
      if (latestCompleted) {
        setSelectedScan(latestCompleted);
        // Correctly update cropAnalysis here so it renders immediately
        if (latestCompleted.aiAnalysisId) {
          setCropAnalysis(latestCompleted.aiAnalysisId);
        } else if (latestCropRes?.data?.analysis) {
          setCropAnalysis(latestCropRes.data.analysis);
        }
      }
    } catch (err) {
      console.error("Inspection error:", err);
      const L = INSPECTION_LABELS[language] || INSPECTION_LABELS.en;
      setInspectionStatus({ type:"error", message: L.errorMsg });
      setShowInspectionModal(false);
    } finally {
      setInspectionLoading(false);
      setTimeout(() => setInspectionStatus(null), 4000);
    }
  };

  const handleSelectScan = (scan) => {
    setSelectedScan(scan);
    setCropAnalysis(scan.aiAnalysisId || null);
  };

  const handleDeleteScanConfirm = async () => {
    if (!scanToDelete) return;
    const { scan } = scanToDelete;
    setDeletingId(scan._id);
    try {
      await api.delete(`/api/drone-jobs/${scan._id}`);
      setScans(prev => prev.filter(s => s._id !== scan._id));
      if (selectedScan?._id === scan._id) {
        const remaining = scans.filter(s => s._id !== scan._id);
        setSelectedScan(remaining.find(s => s.status === "completed") || null);
        setCropAnalysis(null);
      }
    } catch {
      alert("Could not delete scan. Please try again.");
    } finally {
      setDeletingId(null);
      setScanToDelete(null);
    }
  };

  if (loading) {
    return (
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"50vh" }}>
        <div style={{ width:28, height:28, border:"2px solid #4ade80", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !field) {
    return (
      <div style={{ padding:20, maxWidth:480, margin:"0 auto", ...S.card }}>
        <p style={S.muted}>{error || t("fieldNotFound")}</p>
        <button onClick={() => navigate("/home")} style={{ fontSize:12, color:"#86efac", background:"none", border:"none", cursor:"pointer", marginTop:8 }}>← {t("myFields")}</button>
      </div>
    );
  }

  const completedScans = scans.filter(s => s.status === "completed");
  const pendingScans   = scans.filter(s => s.status !== "completed");
  const health         = getHealthStyle(selectedScan?.analysis || null);
  const hc             = healthCard(health.type);
  const L              = INSPECTION_LABELS[language] || INSPECTION_LABELS.en;

  return (
    <div style={{ fontFamily:"'Sora','DM Sans',sans-serif", padding:"24px 16px 48px", maxWidth:680, margin:"0 auto", display:"flex", flexDirection:"column", gap:16 }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes pulse-dot { 0%,100%{box-shadow:0 0 0 0 rgba(74,222,128,0.6)} 50%{box-shadow:0 0 0 6px rgba(74,222,128,0)} }`}</style>

      {scanToDelete && <ConfirmDeleteScanModal scanNumber={scans.length - scanToDelete.index} onConfirm={handleDeleteScanConfirm} onCancel={() => setScanToDelete(null)} />}
      {showInspectionModal && <StartInspectionModal field={field} onConfirm={handleStartInspection} onCancel={() => setShowInspectionModal(false)} loading={inspectionLoading} language={language} />}

      {/* Back */}
      <button onClick={() => navigate(-1)} style={{ fontSize:12, color:"rgba(200,240,210,0.55)", background:"none", border:"none", cursor:"pointer", textAlign:"left", fontFamily:"'Sora',sans-serif" }}>
        ‹ {t("myFields")}
      </button>

      {/* Inspection status toast */}
      {inspectionStatus && (
        <div style={{ borderRadius:12, padding:"12px 16px", fontSize:13, fontWeight:600, background: inspectionStatus.type==="success" ? "rgba(74,222,128,0.12)" : "rgba(248,113,113,0.12)", border: `1px solid ${inspectionStatus.type==="success" ? "rgba(74,222,128,0.3)" : "rgba(248,113,113,0.3)"}`, color: inspectionStatus.type==="success" ? "#86efac" : "#fca5a5" }}>
          {inspectionStatus.message}
        </div>
      )}

      {/* ── Field Info Card ── */}
      <div style={S.card}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12, marginBottom:16 }}>
          <div>
            <h1 style={{ fontSize:22, fontWeight:800, color:"#f0fdf4", margin:0, letterSpacing:"-0.3px" }}>{field.name}</h1>
            {field.cropType && <p style={{ fontSize:13, color:"#4ade80", marginTop:4, fontWeight:600 }}>🌾 {field.cropType}</p>}
            {field.village && <p style={{ fontSize:11, color:"rgba(200,240,210,0.55)", marginTop:2 }}>📍 {[field.village, field.district, field.state].filter(Boolean).join(", ")}</p>}
          </div>
          <div style={{ textAlign:"right", flexShrink:0 }}>
            {field.areaInAcre && <p style={{ fontSize:11, color:"rgba(200,240,210,0.6)", margin:0 }}>📐 {field.areaInAcre} acres</p>}
            {field.season     && <p style={{ fontSize:11, color:"rgba(200,240,210,0.6)", margin:0 }}>🌱 {field.season}</p>}
          </div>
        </div>

        {/* Stat pills */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:16 }}>
          {[
            { value: completedScans.length, label: t("completed"), color:"#86efac", bg:"rgba(74,222,128,0.1)", border:"rgba(74,222,128,0.2)" },
            { value: pendingScans.length,   label: t("requested"), color:"#fcd34d", bg:"rgba(251,191,36,0.1)", border:"rgba(251,191,36,0.2)" },
            { value: scans.length,          label: "Total",        color:"#93c5fd", bg:"rgba(96,165,250,0.1)", border:"rgba(96,165,250,0.2)" },
          ].map((s, i) => (
            <div key={i} style={{ background:s.bg, border:`1px solid ${s.border}`, borderRadius:14, padding:"12px 10px", textAlign:"center" }}>
              <p style={{ fontSize:26, fontWeight:800, color:s.color, margin:0, lineHeight:1 }}>{s.value}</p>
              <p style={{ fontSize:10, color:s.color, margin:"4px 0 0", opacity:0.8, fontWeight:600 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Start Inspection button */}
        <button
          onClick={() => setShowInspectionModal(true)}
          style={{ width:"100%", background:"linear-gradient(135deg,#4ade80,#22c55e)", color:"#0a1a0f", border:"none", borderRadius:50, padding:"12px 0", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Sora',sans-serif", boxShadow:"0 4px 20px rgba(74,222,128,0.3)", transition:"all 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.boxShadow="0 6px 28px rgba(74,222,128,0.45)"}
          onMouseLeave={e => e.currentTarget.style.boxShadow="0 4px 20px rgba(74,222,128,0.3)"}
        >
          🚁 {L.btnStart}
        </button>
      </div>

      {/* ── Health Summary ── */}
      {selectedScan ? (
        <div style={{ background: hc.bg, border:`1px solid ${hc.border}`, borderRadius:20, padding:"18px 20px", display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <h2 style={{ fontSize:14, fontWeight:700, color: hc.color, margin:0 }}>{health.emoji} {t("healthSummaryTitle")}</h2>
            <span style={{ fontSize:11, color:"rgba(200,240,210,0.45)" }}>{new Date(selectedScan.createdAt).toLocaleDateString()}</span>
          </div>
          <p style={{ fontSize:13, color: hc.color, margin:0, lineHeight:1.6 }}>
            {translateAnalysis(selectedScan.analysis, language) || t("analysisPendingLong")}
          </p>
          {selectedScan.analysis && (
            <div style={{ background:"rgba(0,0,0,0.15)", borderRadius:12, padding:"12px 14px", display:"flex", flexDirection:"column", gap:10 }}>
              {selectedScan.analysis.toLowerCase().includes("nitrogen") && (
                <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                  <span style={{ fontSize:16 }}>💧</span>
                  <div>
                    <p style={{ fontSize:12, fontWeight:700, color:"#e8f5e9", margin:0 }}>{language==="hi" ? "नाइट्रोजन स्प्रे करें" : "Apply Nitrogen spray"}</p>
                    <p style={{ fontSize:11, color:"rgba(200,240,210,0.6)", margin:0 }}>{language==="hi" ? "यूरिया या DAP 3 दिनों में।" : "Urea or DAP within 3 days."}</p>
                  </div>
                </div>
              )}
              {selectedScan.analysis.toLowerCase().includes("pest") && (
                <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                  <span style={{ fontSize:16 }}>🐛</span>
                  <div>
                    <p style={{ fontSize:12, fontWeight:700, color:"#e8f5e9", margin:0 }}>{language==="hi" ? "कीटनाशक लगाएं" : "Apply pesticide"}</p>
                    <p style={{ fontSize:11, color:"rgba(200,240,210,0.6)", margin:0 }}>{language==="hi" ? "प्रभावित हिस्से पर।" : "Target affected area."}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:"24px 20px", textAlign:"center" }}>
          <p style={S.muted}>{t("noScans")}</p>
        </div>
      )}

      {/* ── Crop Health CNN Card ── */}
      {selectedScan?.status === "completed" && <CropHealthCard cropAnalysis={cropAnalysis} />}

      {/* ── Fraud Check Card ── */}
      {selectedScan?.status === "completed" && (
        <FraudCheckCard droneJobId={selectedScan._id} fieldId={field._id} language={language} />
      )}

      {/* ── Scan List ── */}
      {scans.length > 0 && (
        <div style={S.card}>
          <div style={{ marginBottom:14 }}>
            <h3 style={{ fontSize:14, fontWeight:700, color:"#e8f5e9", margin:0 }}>{t("myScansTitle")}</h3>
            <p style={{ fontSize:11, color:"rgba(200,240,210,0.5)", marginTop:4 }}>
              {language==="hi" ? "किसी स्कैन पर टैप करके रिपोर्ट देखें • × से डिलीट करें" : "Tap any scan to view its report • × to delete"}
            </p>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {scans.map((scan, idx) => {
              const isSelected = selectedScan?._id === scan._id;
              const isDeleting = deletingId === scan._id;
              const h = getHealthStyle(scan.analysis);
              return (
                <div key={scan._id} style={{ background: isSelected ? "rgba(74,222,128,0.1)" : "rgba(255,255,255,0.03)", border:`1px solid ${isSelected ? "rgba(74,222,128,0.3)" : "rgba(255,255,255,0.07)"}`, borderRadius:14, padding:"12px 14px", opacity: isDeleting?0.4:1, pointerEvents: isDeleting?"none":"auto", transition:"all 0.2s" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ flex:1, display:"flex", alignItems:"center", gap:10, cursor:"pointer", minWidth:0 }} onClick={() => handleSelectScan(scan)}>
                      <span style={{ fontSize:18, flexShrink:0 }}>{h.emoji}</span>
                      <div style={{ minWidth:0 }}>
                        <p style={{ fontSize:13, fontWeight:700, color:"#f0fdf4", margin:0 }}>{language==="hi" ? `स्कैन ${scans.length-idx}` : `Scan ${scans.length-idx}`}</p>
                        <p style={{ fontSize:10, color:"rgba(200,240,210,0.45)", margin:0 }}>{new Date(scan.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0, cursor:"pointer" }} onClick={() => handleSelectScan(scan)}>
                      <StatusBadge status={scan.status} t={t} />
                      {isSelected && <span style={{ color:"#4ade80", fontWeight:700, fontSize:14 }}>✓</span>}
                    </div>
                    <button onClick={e => { e.stopPropagation(); setScanToDelete({ scan, index: idx }); }}
                      style={{ background:"none", border:"none", color:"rgba(200,240,210,0.2)", fontSize:20, cursor:"pointer", lineHeight:1, padding:"0 4px", transition:"color 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.color="#fca5a5"}
                      onMouseLeave={e => e.currentTarget.style.color="rgba(200,240,210,0.2)"}
                    >×</button>
                  </div>
                  {scan.analysis && (
                    <p style={{ fontSize:11, color:"rgba(200,240,210,0.55)", marginTop:8, marginLeft:28, lineHeight:1.5, cursor:"pointer" }} onClick={() => handleSelectScan(scan)}>
                      {translateAnalysis(scan.analysis, language)}
                    </p>
                  )}
                  {!scan.analysis && scan.status !== "completed" && (
                    <p style={{ fontSize:11, color:"#fcd34d", marginTop:6, marginLeft:28 }}>{t("analysisPendingShort")}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Request Scan CTA */}
      <button
        onClick={() => navigate(`/request-scan?field=${field._id}`)}
        style={{ width:"100%", background:"linear-gradient(135deg,#4ade80,#22c55e)", color:"#0a1a0f", border:"none", borderRadius:50, padding:"13px 0", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Sora',sans-serif", boxShadow:"0 4px 20px rgba(74,222,128,0.3)" }}
      >
        {t("requestScanButton")}
      </button>
    </div>
  );
};

export default FieldDetail;