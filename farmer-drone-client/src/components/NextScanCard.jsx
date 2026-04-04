// // src/components/NextScanCard.jsx
// import { useNavigate } from "react-router-dom";
// import { useLanguage } from "../context/LanguageContext";

// /**
//  * Calculates next recommended scan date for a field based on:
//  * - Last completed scan date (if any) → next scan in 21 days
//  * - Pending scan → waiting for current
//  * - No scan ever → scan ASAP
//  */
// function getNextScanInfo(fields, jobs, lang) {
//   if (!fields || fields.length === 0) return null;

//   const now = new Date();
//   const results = [];

//   for (const field of fields) {
//     const fieldJobs = jobs.filter(
//       (j) => j.field?._id === field._id || j.field === field._id
//     );

//     const completedJobs = fieldJobs.filter((j) => j.status === "completed");
//     const pendingJobs = fieldJobs.filter((j) => j.status !== "completed");

//     if (pendingJobs.length > 0) {
//       // Scan is already requested — waiting
//       results.push({
//         field,
//         type: "pending",
//         urgency: 1,
//         nextDate: null,
//         daysUntil: 0,
//       });
//       continue;
//     }

//     if (completedJobs.length === 0) {
//       // Never scanned
//       results.push({
//         field,
//         type: "never",
//         urgency: 0,
//         nextDate: null,
//         daysUntil: 0,
//       });
//       continue;
//     }

//     // Has completed scans — next scan 21 days after last
//     const lastScan = new Date(completedJobs[0].createdAt);
//     const nextScan = new Date(lastScan.getTime() + 21 * 24 * 60 * 60 * 1000);
//     const daysUntil = Math.ceil((nextScan - now) / (24 * 60 * 60 * 1000));

//     results.push({
//       field,
//       type: daysUntil <= 0 ? "overdue" : daysUntil <= 5 ? "soon" : "upcoming",
//       urgency: daysUntil <= 0 ? 0 : daysUntil <= 5 ? 1 : 2,
//       nextDate: nextScan,
//       daysUntil,
//       lastScan,
//     });
//   }

//   // Sort by urgency (most urgent first)
//   results.sort((a, b) => a.urgency - b.urgency);
//   return results;
// }

// function formatDate(date, lang) {
//   if (!date) return "";
//   return date.toLocaleDateString("en-IN", {
//     weekday: "short",
//     day: "numeric",
//     month: "short",
//     year: "numeric",
//   });
// }

// // ── Single field scan schedule row ──────────────────────────
// const ScanScheduleRow = ({ info, lang, navigate }) => {
//   const { field, type, nextDate, daysUntil } = info;

//   const config = {
//     never: {
//       bg: "bg-red-50 border-red-200",
//       icon: "🔴",
//       iconBg: "bg-red-100",
//       badge: "bg-red-100 text-red-700 border-red-300",
//       badgeText: { en: "Book Now", hi: "अभी बुक करें", ta: "இப்போது பதிவு", bn: "এখনই বুক করুন", te: "ఇప్పుడు బుక్", mr: "आता बुक करा" },
//       message: {
//         en: "No scan yet — book your first scan",
//         hi: "अभी तक स्कैन नहीं — पहला स्कैन बुक करें",
//         ta: "ஸ்கேன் இல்லை — முதல் ஸ்கேன் பதிவு செய்க",
//         bn: "স্ক্যান হয়নি — প্রথম স্ক্যান বুক করুন",
//         te: "స్కాన్ లేదు — మొదటి స్కాన్ బుక్ చేయండి",
//         mr: "स्कॅन नाही — पहिला स्कॅन बुक करा",
//       },
//       nextText: {
//         en: "Recommended: within 1–2 weeks of sowing",
//         hi: "सुझाव: बुआई के 1–2 हफ्ते में",
//         ta: "பரிந்துரை: விதைப்பிற்கு 1–2 வாரத்தில்",
//         bn: "পরামর্শ: বপনের ১–২ সপ্তাহের মধ্যে",
//         te: "సిఫార్సు: విత్తిన 1–2 వారాల్లో",
//         mr: "सूचना: पेरणीनंतर 1–2 आठवड्यांत",
//       },
//       ctaRoute: `/request-scan?field=${field._id}`,
//     },
//     pending: {
//       bg: "bg-blue-50 border-blue-200",
//       icon: "🕐",
//       iconBg: "bg-blue-100",
//       badge: "bg-blue-100 text-blue-700 border-blue-300",
//       badgeText: { en: "In Progress", hi: "चल रहा है", ta: "நடக்கிறது", bn: "চলছে", te: "జరుగుతోంది", mr: "सुरू आहे" },
//       message: {
//         en: "Scan requested — awaiting operator",
//         hi: "स्कैन अनुरोधित — ऑपरेटर की प्रतीक्षा",
//         ta: "ஸ்கேன் கோரப்பட்டது — இயக்குனர் எதிர்பார்க்கிறோம்",
//         bn: "স্ক্যান অনুরোধ করা হয়েছে — অপারেটরের অপেক্ষায়",
//         te: "స్కాన్ అభ్యర్థించబడింది — ఆపరేటర్ కోసం వేచి ఉంది",
//         mr: "स्कॅन विनंती केली — ऑपरेटरची प्रतीक्षा",
//       },
//       nextText: {
//         en: "Report expected in 2–3 days after operator confirms",
//         hi: "ऑपरेटर के बाद 2–3 दिनों में रिपोर्ट मिलेगी",
//         ta: "இயக்குனர் உறுதிப்படுத்திய பிறகு 2–3 நாட்களில் அறிக்கை",
//         bn: "অপারেটর নিশ্চিত করার ২–৩ দিনের মধ্যে রিপোর্ট",
//         te: "ఆపరేటర్ నిర్ధారించిన తర్వాత 2–3 రోజుల్లో రిపోర్ట్",
//         mr: "ऑपरेटर पुष्टी केल्यावर 2–3 दिवसांत अहवाल",
//       },
//       ctaRoute: `/fields/${field._id}`,
//     },
//     overdue: {
//       bg: "bg-orange-50 border-orange-200",
//       icon: "⚠️",
//       iconBg: "bg-orange-100",
//       badge: "bg-orange-100 text-orange-700 border-orange-300",
//       badgeText: { en: "Overdue", hi: "देरी हो गई", ta: "தாமதம்", bn: "বিলম্বিত", te: "ఆలస్యం", mr: "उशीर झाला" },
//       message: {
//         en: `Next scan was due ${Math.abs(daysUntil)} day${Math.abs(daysUntil) !== 1 ? "s" : ""} ago`,
//         hi: `अगला स्कैन ${Math.abs(daysUntil)} दिन पहले होना था`,
//         ta: `அடுத்த ஸ்கேன் ${Math.abs(daysUntil)} நாட்களுக்கு முன் வேண்டும்`,
//         bn: `পরবর্তী স্ক্যান ${Math.abs(daysUntil)} দিন আগে হওয়ার কথা ছিল`,
//         te: `తదుపరి స్కాన్ ${Math.abs(daysUntil)} రోజుల క్రితం అవసరమైంది`,
//         mr: `पुढील स्कॅन ${Math.abs(daysUntil)} दिवसांपूर्वी व्हायला हवे होते`,
//       },
//       nextText: {
//         en: `Book immediately — scan every 3 weeks for best results`,
//         hi: `अभी बुक करें — सबसे अच्छे नतीजों के लिए हर 3 हफ्ते में स्कैन`,
//         ta: `உடனடியாக பதிவு செய்க — 3 வாரத்திற்கு ஒரு முறை ஸ்கேன்`,
//         bn: `এখনই বুক করুন — প্রতি ৩ সপ্তাহে একবার স্ক্যান`,
//         te: `వెంటనే బుక్ చేయండి — ప్రతి 3 వారాలకు స్కాన్`,
//         mr: `आत्ता बुक करा — दर 3 आठवड्यांनी स्कॅन`,
//       },
//       ctaRoute: `/request-scan?field=${field._id}`,
//     },
//     soon: {
//       bg: "bg-yellow-50 border-yellow-200",
//       icon: "📅",
//       iconBg: "bg-yellow-100",
//       badge: "bg-yellow-100 text-yellow-700 border-yellow-300",
//       badgeText: {
//         en: `In ${daysUntil} day${daysUntil !== 1 ? "s" : ""}`,
//         hi: `${daysUntil} दिन में`,
//         ta: `${daysUntil} நாட்களில்`,
//         bn: `${daysUntil} দিনে`,
//         te: `${daysUntil} రోజుల్లో`,
//         mr: `${daysUntil} दिवसांत`,
//       },
//       message: {
//         en: `Next scan coming up on ${formatDate(nextDate, lang)}`,
//         hi: `अगला स्कैन ${formatDate(nextDate, lang)} को`,
//         ta: `அடுத்த ஸ்கேன் ${formatDate(nextDate, lang)} அன்று`,
//         bn: `পরবর্তী স্ক্যান ${formatDate(nextDate, lang)} তারিখে`,
//         te: `తదుపరి స్కాన్ ${formatDate(nextDate, lang)} న`,
//         mr: `पुढील स्कॅन ${formatDate(nextDate, lang)} रोजी`,
//       },
//       nextText: {
//         en: "Pre-book now to ensure drone availability on your preferred date",
//         hi: "अपनी पसंदीदा तारीख पर ड्रोन उपलब्धता के लिए अभी बुक करें",
//         ta: "உங்கள் விரும்பிய தேதியில் ட்ரோன் கிடைக்க இப்போதே பதிவு செய்க",
//         bn: "আপনার পছন্দের তারিখে ড্রোন নিশ্চিত করতে এখনই বুক করুন",
//         te: "మీ ఇష్టమైన తేదీన డ్రోన్ అందుబాటు నిర్ధారించడానికి ఇప్పుడే బుక్",
//         mr: "आपल्या पसंतीच्या तारखेला ड्रोन उपलब्धतेसाठी आत्ताच बुक करा",
//       },
//       ctaRoute: `/request-scan?field=${field._id}`,
//     },
//     upcoming: {
//       bg: "bg-emerald-50 border-emerald-200",
//       icon: "✅",
//       iconBg: "bg-emerald-100",
//       badge: "bg-emerald-100 text-emerald-700 border-emerald-300",
//       badgeText: {
//         en: `In ${daysUntil} days`,
//         hi: `${daysUntil} दिन में`,
//         ta: `${daysUntil} நாட்களில்`,
//         bn: `${daysUntil} দিনে`,
//         te: `${daysUntil} రోజుల్లో`,
//         mr: `${daysUntil} दिवसांत`,
//       },
//       message: {
//         en: `Next scan scheduled for ${formatDate(nextDate, lang)}`,
//         hi: `अगला स्कैन ${formatDate(nextDate, lang)} को`,
//         ta: `அடுத்த ஸ்கேன் ${formatDate(nextDate, lang)} அன்று`,
//         bn: `পরবর্তী স্ক্যান ${formatDate(nextDate, lang)} তারিখে`,
//         te: `తదుపరి స్కాన్ ${formatDate(nextDate, lang)} న`,
//         mr: `पुढील स्कॅन ${formatDate(nextDate, lang)} रोजी`,
//       },
//       nextText: {
//         en: "Field is on schedule — keep monitoring for best yield",
//         hi: "खेत समय पर है — सबसे अच्छी फसल के लिए निगरानी जारी रखें",
//         ta: "வயல் அட்டவணையில் உள்ளது — சிறந்த விளைச்சலுக்கு கண்காணியுங்கள்",
//         bn: "জমি সময়মতো আছে — সেরা ফলনের জন্য পর্যবেক্ষণ চালিয়ে যান",
//         te: "పొలం షెడ్యూల్‌లో ఉంది — ఉత్తమ దిగుబడికి పర్యవేక్షించండి",
//         mr: "शेत वेळापत्रकानुसार आहे — सर्वोत्तम उत्पन्नासाठी देखरेख ठेवा",
//       },
//       ctaRoute: `/request-scan?field=${field._id}`,
//     },
//   };

//   const c = config[type] || config.upcoming;
//   const badgeText = typeof c.badgeText === "object" && c.badgeText[lang]
//     ? c.badgeText[lang]
//     : c.badgeText.en;

//   return (
//     <div className={`border rounded-xl px-4 py-3 flex items-center gap-3 ${c.bg}`}>
//       {/* Icon */}
//       <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-lg ${c.iconBg}`}>
//         {c.icon}
//       </div>

//       {/* Info */}
//       <div className="flex-1 min-w-0">
//         <div className="flex items-center gap-2 flex-wrap">
//           <span className="text-sm font-semibold text-gray-900">{field.name}</span>
//           {field.cropType && (
//             <span className="text-[11px] text-gray-400">🌾 {field.cropType}</span>
//           )}
//           <span className={`text-[11px] font-semibold border px-2 py-0.5 rounded-full ${c.badge}`}>
//             {badgeText}
//           </span>
//         </div>
//         <p className="text-xs text-gray-700 font-medium mt-0.5">
//           {c.message[lang] || c.message.en}
//         </p>
//         <p className="text-[11px] text-gray-400 mt-0.5 italic">
//           {c.nextText[lang] || c.nextText.en}
//         </p>
//       </div>

//       {/* CTA */}
//       <button
//         onClick={() => navigate(c.ctaRoute)}
//         className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors shadow-sm whitespace-nowrap"
//       >
//         {type === "never" || type === "overdue" || type === "soon"
//           ? (lang === "hi" ? "स्कैन बुक करें →" : "Book scan →")
//           : (lang === "hi" ? "खेत देखें →" : "View field →")}
//       </button>
//     </div>
//   );
// };

// // ════════════════════════════════════════════════════════════
// const NextScanCard = ({ fields, jobs }) => {
//   const { language } = useLanguage();
//   const navigate = useNavigate();
//   const lang = language || "en";

//   if (!fields || fields.length === 0) return null;

//   const scanInfos = getNextScanInfo(fields, jobs, lang);
//   if (!scanInfos || scanInfos.length === 0) return null;

//   // Find most urgent upcoming scan (not pending, has a date)
//   const withDates = scanInfos.filter((s) => s.nextDate);
//   const mostUrgent = scanInfos[0];

//   const heading = {
//     en: "📅 Scan Schedule",
//     hi: "📅 स्कैन शेड्यूल",
//     ta: "📅 ஸ்கேன் அட்டவணை",
//     bn: "📅 স্ক্যান শিডিউল",
//     te: "📅 స్కాన్ షెడ్యూల్",
//     mr: "📅 स्कॅन वेळापत्रक",
//   };

//   const subheading = {
//     en: "Upcoming drone scans for your fields",
//     hi: "आपके खेतों के लिए आने वाले ड्रोन स्कैन",
//     ta: "உங்கள் வயல்களுக்கான வரவிருக்கும் ட்ரோன் ஸ்கேன்",
//     bn: "আপনার জমির জন্য আসন্ন ড্রোন স্ক্যান",
//     te: "మీ పొలాలకు రానున్న డ్రోన్ స్కాన్‌లు",
//     mr: "तुमच्या शेतांसाठी येणारे ड्रोन स्कॅन",
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-base font-bold text-gray-900">
//             {heading[lang] || heading.en}
//           </h2>
//           <p className="text-xs text-gray-400 mt-0.5">
//             {subheading[lang] || subheading.en}
//           </p>
//         </div>
//         {/* Timeline pill if any upcoming scans */}
//         {withDates.length > 0 && (
//           <div className="text-right flex-shrink-0">
//             <p className="text-[11px] text-gray-400">
//               {lang === "hi" ? "अगला स्कैन" : "Next scan"}
//             </p>
//             <p className="text-sm font-bold text-emerald-700">
//               {withDates[0].daysUntil <= 0
//                 ? (lang === "hi" ? "अभी करें" : "Now")
//                 : `${withDates[0].daysUntil}d`}
//             </p>
//           </div>
//         )}
//       </div>

//       {/* Rows */}
//       <div className="space-y-2">
//         {scanInfos.map(({ field, type, nextDate, daysUntil }) => (
//           <ScanScheduleRow
//             key={field._id}
//             info={{ field, type, nextDate, daysUntil }}
//             lang={lang}
//             navigate={navigate}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default NextScanCard;

// src/components/NextScanCard.jsx
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function getNextScanInfo(fields, jobs) {
  if (!fields || fields.length === 0) return null;
  const now = new Date();
  const results = [];
  for (const field of fields) {
    const fieldJobs = jobs.filter(j => j.field?._id === field._id || j.field === field._id);
    const completedJobs = fieldJobs.filter(j => j.status === "completed");
    const pendingJobs   = fieldJobs.filter(j => j.status !== "completed");
    if (pendingJobs.length > 0) {
      results.push({ field, type: "pending", urgency: 1, nextDate: null, daysUntil: 0 });
      continue;
    }
    if (completedJobs.length === 0) {
      results.push({ field, type: "never", urgency: 0, nextDate: null, daysUntil: 0 });
      continue;
    }
    const lastScan  = new Date(completedJobs[0].createdAt);
    const nextScan  = new Date(lastScan.getTime() + 21 * 24 * 60 * 60 * 1000);
    const daysUntil = Math.ceil((nextScan - now) / (24 * 60 * 60 * 1000));
    results.push({
      field,
      type: daysUntil <= 0 ? "overdue" : daysUntil <= 5 ? "soon" : "upcoming",
      urgency: daysUntil <= 0 ? 0 : daysUntil <= 5 ? 1 : 2,
      nextDate: nextScan,
      daysUntil,
      lastScan,
    });
  }
  results.sort((a, b) => a.urgency - b.urgency);
  return results;
}

function formatDate(date) {
  if (!date) return "";
  return date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

const ScanScheduleRow = ({ info, lang, navigate }) => {
  const { field, type, nextDate, daysUntil } = info;

  // ✅ Dark theme colors matching Home page
  const config = {
    never: {
      bg:       "rgba(239,68,68,0.08)",
      border:   "rgba(239,68,68,0.25)",
      iconBg:   "rgba(239,68,68,0.15)",
      icon:     "🔴",
      badgeBg:  "rgba(239,68,68,0.15)",
      badgeClr: "#fca5a5",
      badgeBdr: "rgba(239,68,68,0.3)",
      badgeText: { en: "Book Now", hi: "अभी बुक करें", ta: "இப்போது பதிவு", bn: "এখনই বুক", te: "ఇప్పుడు బుక్", mr: "आता बुक करा" },
      message:  { en: "No scan yet — book your first scan", hi: "अभी तक स्कैन नहीं — पहला स्कैन बुक करें", ta: "ஸ்கேன் இல்லை — முதல் ஸ்கேன் பதிவு செய்க", bn: "স্ক্যান হয়নি — প্রথম স্ক্যান বুক করুন", te: "స్కాన్ లేదు — మొదటి స్కాన్ బుక్ చేయండి", mr: "स्कॅन नाही — पहिला स्कॅन बुक करा" },
      nextText: { en: "Recommended: within 1–2 weeks of sowing", hi: "सुझाव: बुआई के 1–2 हफ्ते में", ta: "பரிந்துரை: விதைப்பிற்கு 1–2 வாரத்தில்", bn: "পরামর্শ: বপনের ১–২ সপ্তাহের মধ্যে", te: "సిఫార్సు: విత్తిన 1–2 వారాల్లో", mr: "सूचना: पेरणीनंतर 1–2 आठवड्यांत" },
      ctaRoute: `/request-scan?field=${field._id}`,
    },
    pending: {
      bg:       "rgba(96,165,250,0.08)",
      border:   "rgba(96,165,250,0.25)",
      iconBg:   "rgba(96,165,250,0.15)",
      icon:     "🕐",
      badgeBg:  "rgba(96,165,250,0.15)",
      badgeClr: "#93c5fd",
      badgeBdr: "rgba(96,165,250,0.3)",
      badgeText: { en: "In Progress", hi: "चल रहा है", ta: "நடக்கிறது", bn: "চলছে", te: "జరుగుతోంది", mr: "सुरू आहे" },
      message:  { en: "Scan requested — awaiting operator", hi: "स्कैन अनुरोधित — ऑपरेटर की प्रतीक्षा", ta: "ஸ்கேன் கோரப்பட்டது — இயக்குனர் எதிர்பார்க்கிறோம்", bn: "স্ক্যান অনুরোধ করা হয়েছে", te: "స్కాన్ అభ్యర్థించబడింది", mr: "स्कॅन विनंती केली" },
      nextText: { en: "Report expected in 2–3 days after operator confirms", hi: "ऑपरेटर के बाद 2–3 दिनों में रिपोर्ट", ta: "2–3 நாட்களில் அறிக்கை", bn: "২–৩ দিনের মধ্যে রিপোর্ট", te: "2–3 రోజుల్లో రిపోర్ట్", mr: "2–3 दिवसांत अहवाल" },
      ctaRoute: `/fields/${field._id}`,
    },
    overdue: {
      bg:       "rgba(251,146,60,0.08)",
      border:   "rgba(251,146,60,0.25)",
      iconBg:   "rgba(251,146,60,0.15)",
      icon:     "⚠️",
      badgeBg:  "rgba(251,146,60,0.15)",
      badgeClr: "#fdba74",
      badgeBdr: "rgba(251,146,60,0.3)",
      badgeText: { en: "Overdue", hi: "देरी हो गई", ta: "தாமதம்", bn: "বিলম্বিত", te: "ఆలస్యం", mr: "उशीर झाला" },
      message:  { en: `Next scan was due ${Math.abs(daysUntil)} days ago`, hi: `अगला स्कैन ${Math.abs(daysUntil)} दिन पहले होना था`, ta: `${Math.abs(daysUntil)} நாட்களுக்கு முன் வேண்டும்`, bn: `${Math.abs(daysUntil)} দিন আগে হওয়ার কথা ছিল`, te: `${Math.abs(daysUntil)} రోజుల క్రితం అవసరమైంది`, mr: `${Math.abs(daysUntil)} दिवसांपूर्वी व्हायला हवे होते` },
      nextText: { en: "Book immediately — scan every 3 weeks for best results", hi: "अभी बुक करें — हर 3 हफ्ते में स्कैन", ta: "உடனடியாக பதிவு செய்க", bn: "এখনই বুক করুন", te: "వెంటనే బుక్ చేయండి", mr: "आत्ता बुक करा" },
      ctaRoute: `/request-scan?field=${field._id}`,
    },
    soon: {
      bg:       "rgba(251,191,36,0.08)",
      border:   "rgba(251,191,36,0.22)",
      iconBg:   "rgba(251,191,36,0.15)",
      icon:     "📅",
      badgeBg:  "rgba(251,191,36,0.15)",
      badgeClr: "#fcd34d",
      badgeBdr: "rgba(251,191,36,0.3)",
      badgeText: { en: `In ${daysUntil} days`, hi: `${daysUntil} दिन में`, ta: `${daysUntil} நாட்களில்`, bn: `${daysUntil} দিনে`, te: `${daysUntil} రోజుల్లో`, mr: `${daysUntil} दिवसांत` },
      message:  { en: `Next scan on ${formatDate(nextDate)}`, hi: `अगला स्कैन ${formatDate(nextDate)} को`, ta: `${formatDate(nextDate)} அன்று`, bn: `${formatDate(nextDate)} তারিখে`, te: `${formatDate(nextDate)} న`, mr: `${formatDate(nextDate)} रोजी` },
      nextText: { en: "Pre-book now to ensure drone availability", hi: "ड्रोन उपलब्धता के लिए अभी बुक करें", ta: "இப்போதே பதிவு செய்க", bn: "এখনই বুক করুন", te: "ఇప్పుడే బుక్ చేయండి", mr: "आत्ताच बुक करा" },
      ctaRoute: `/request-scan?field=${field._id}`,
    },
    upcoming: {
      bg:       "rgba(34,197,94,0.07)",
      border:   "rgba(34,197,94,0.2)",
      iconBg:   "rgba(34,197,94,0.15)",
      icon:     "✅",
      badgeBg:  "rgba(34,197,94,0.15)",
      badgeClr: "#86efac",
      badgeBdr: "rgba(34,197,94,0.3)",
      badgeText: { en: `In ${daysUntil} days`, hi: `${daysUntil} दिन में`, ta: `${daysUntil} நாட்களில்`, bn: `${daysUntil} দিনে`, te: `${daysUntil} రోజుల్లో`, mr: `${daysUntil} दिवसांत` },
      message:  { en: `Next scan scheduled for ${formatDate(nextDate)}`, hi: `अगला स्कैन ${formatDate(nextDate)} को`, ta: `${formatDate(nextDate)} அன்று`, bn: `${formatDate(nextDate)} তারিখে`, te: `${formatDate(nextDate)} న`, mr: `${formatDate(nextDate)} रोजी` },
      nextText: { en: "Field is on schedule — keep monitoring for best yield", hi: "खेत समय पर है — निगरानी जारी रखें", ta: "வயல் அட்டவணையில் உள்ளது", bn: "জমি সময়মতো আছে", te: "పొలం షెడ్యూల్‌లో ఉంది", mr: "शेत वेळापत्रकानुसार आहे" },
      ctaRoute: `/request-scan?field=${field._id}`,
    },
  };

  const c = config[type] || config.upcoming;
  const badgeText = (typeof c.badgeText === "object" && c.badgeText[lang]) ? c.badgeText[lang] : c.badgeText.en;

  return (
    <div style={{
      background: c.bg,
      border: `1px solid ${c.border}`,
      borderRadius: 14,
      padding: "12px 16px",
      display: "flex",
      alignItems: "center",
      gap: 14,
    }}>
      {/* Icon */}
      <div style={{
        width: 38, height: 38, borderRadius: "50%",
        background: c.iconBg,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18, flexShrink: 0,
      }}>
        {c.icon}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#e8f5e9" }}>{field.name}</span>
          {field.cropType && (
            <span style={{ fontSize: 11, color: "rgba(200,240,210,0.55)" }}>🌾 {field.cropType}</span>
          )}
          <span style={{
            fontSize: 11, fontWeight: 600,
            background: c.badgeBg, color: c.badgeClr,
            border: `1px solid ${c.badgeBdr}`,
            borderRadius: 50, padding: "2px 10px",
          }}>
            {badgeText}
          </span>
        </div>
        <p style={{ fontSize: 12, color: "rgba(220,250,230,0.85)", fontWeight: 500, margin: "3px 0 0" }}>
          {c.message[lang] || c.message.en}
        </p>
        <p style={{ fontSize: 11, color: "rgba(200,240,210,0.45)", margin: "2px 0 0", fontStyle: "italic" }}>
          {c.nextText[lang] || c.nextText.en}
        </p>
      </div>

      {/* CTA */}
      <button
        onClick={() => navigate(c.ctaRoute)}
        style={{
          flexShrink: 0,
          fontSize: 12, fontWeight: 600,
          padding: "7px 14px",
          borderRadius: 50,
          background: "rgba(34,197,94,0.12)",
          border: "1px solid rgba(34,197,94,0.3)",
          color: "#86efac",
          cursor: "pointer",
          whiteSpace: "nowrap",
          transition: "all 0.2s",
          fontFamily: "'Sora', sans-serif",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "rgba(34,197,94,0.22)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "rgba(34,197,94,0.12)"; }}
      >
        {type === "never" || type === "overdue" || type === "soon"
          ? (lang === "hi" ? "स्कैन बुक करें →" : "Book scan →")
          : (lang === "hi" ? "खेत देखें →" : "View field →")}
      </button>
    </div>
  );
};

const NextScanCard = ({ fields, jobs }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const lang = language || "en";

  if (!fields || fields.length === 0) return null;
  const scanInfos = getNextScanInfo(fields, jobs);
  if (!scanInfos || scanInfos.length === 0) return null;

  const withDates  = scanInfos.filter(s => s.nextDate);

  const heading = { en: "📅 Scan Schedule", hi: "📅 स्कैन शेड्यूल", ta: "📅 ஸ்கேன் அட்டவணை", bn: "📅 স্ক্যান শিডিউল", te: "📅 స్కాన్ షెడ్యూల్", mr: "📅 स्कॅन वेळापत्रक" };
  const subheading = { en: "Upcoming drone scans for your fields", hi: "आपके खेतों के लिए आने वाले ड्रोन स्कैन", ta: "உங்கள் வயல்களுக்கான வரவிருக்கும் ட்ரோன் ஸ்கேன்", bn: "আপনার জমির জন্য আসন্ন ড্রোন স্ক্যান", te: "మీ పొలాలకు రానున్న డ్రోన్ స్కాన్‌లు", mr: "तुमच्या शेतांसाठी येणारे ड्रोन स्कॅन" };

  return (
    <div style={{
      background: "rgba(12,30,17,0.93)",
      border: "1px solid rgba(34,197,94,0.18)",
      borderRadius: 24,
      backdropFilter: "blur(16px)",
      padding: "18px 20px",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#e8f5e9", margin: 0 }}>
            {heading[lang] || heading.en}
          </h2>
          <p style={{ fontSize: 11, color: "rgba(200,240,210,0.55)", marginTop: 3 }}>
            {subheading[lang] || subheading.en}
          </p>
        </div>
        {withDates.length > 0 && (
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <p style={{ fontSize: 11, color: "rgba(200,240,210,0.5)", margin: 0 }}>
              {lang === "hi" ? "अगला स्कैन" : "Next scan"}
            </p>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#4ade80", margin: 0 }}>
              {withDates[0].daysUntil <= 0 ? (lang === "hi" ? "अभी करें" : "Now") : `${withDates[0].daysUntil}d`}
            </p>
          </div>
        )}
      </div>

      {/* Rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {scanInfos.map(({ field, type, nextDate, daysUntil }) => (
          <ScanScheduleRow
            key={field._id}
            info={{ field, type, nextDate, daysUntil }}
            lang={lang}
            navigate={navigate}
          />
        ))}
      </div>
    </div>
  );
};

export default NextScanCard;
