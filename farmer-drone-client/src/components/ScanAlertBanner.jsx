

// src/components/ScanAlertBanner.jsx
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

// ── Next scan recommendation based on last scan date ────────
function getNextScanText(lastScanDate, lang) {
  if (!lastScanDate) return null;
  const daysSince = Math.floor((new Date() - new Date(lastScanDate)) / 86400000);

  // Recommend next scan at ~21 days after last scan
  const daysUntilNext = Math.max(0, 21 - daysSince);
  const nextScanDate = new Date(new Date(lastScanDate).getTime() + 21 * 86400000);
  const dateStr = nextScanDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

  if (daysUntilNext <= 0) {
    return {
      en: `⏱ Next scan overdue — recommend scanning this week`,
      hi: `⏱ अगला स्कैन अब करें — इस हफ्ते स्कैन करें`,
      ta: `⏱ அடுத்த ஸ்கேன் தேவை — இந்த வாரம் ஸ்கேன் செய்க`,
      bn: `⏱ পরবর্তী স্ক্যান এখনই করুন`,
      te: `⏱ తదుపరి స్కాన్ ఇప్పుడు చేయండి`,
      mr: `⏱ पुढील स्कॅन आता करा`,
    }[lang] || `⏱ Next scan overdue — recommend scanning this week`;
  }

  return {
    en: `⏱ Next scan recommended in ~${daysUntilNext} days (around ${dateStr})`,
    hi: `⏱ अगला स्कैन लगभग ${daysUntilNext} दिनों में (${dateStr} के आसपास)`,
    ta: `⏱ அடுத்த ஸ்கேன் ~${daysUntilNext} நாட்களில் (${dateStr} அளவில்)`,
    bn: `⏱ পরবর্তী স্ক্যান ~${daysUntilNext} দিনে (${dateStr} নাগাদ)`,
    te: `⏱ తదుపరి స్కాన్ ~${daysUntilNext} రోజుల్లో (${dateStr} సుమారు)`,
    mr: `⏱ पुढील स्कॅन ~${daysUntilNext} दिवसांत (${dateStr} च्या आसपास)`,
  }[lang] || `⏱ Next scan recommended in ~${daysUntilNext} days (around ${dateStr})`;
}

function getFieldScanAlert(field, jobs) {
  const now = new Date();
  const fieldJobs = jobs.filter(
    (j) => j.field?._id === field._id || j.field === field._id
  );

  // ── No scan at all ───────────────────────────────────────
  if (fieldJobs.length === 0) {
    return {
      priority: 1,
      type: "no_scan",
      colorClass: "border-l-red-500 bg-red-50",
      badgeClass: "border-red-300 text-red-700 bg-white",
      icon: "🔴",
      label:    { en: "No scan yet",       hi: "अभी तक स्कैन नहीं",    ta: "ஸ்கேன் இல்லை",        bn: "স্ক্যান হয়নি",          te: "స్కాన్ లేదు",       mr: "स्कॅन नाही"        },
      detail:   { en: "Book first drone scan to detect pests & estimate yield",
                  hi: "कीट और उपज जानने के लिए पहला स्कैन बुक करें",
                  ta: "பூச்சிகள் மற்றும் விளைச்சல் அறிய முதல் ஸ்கேன் பதிவு செய்க",
                  bn: "প্রথম ড্রোন স্ক্যান বুক করুন — কীটপতঙ্গ ও ফলন জানুন",
                  te: "మొదటి డ్రోన్ స్కాన్ బుక్ చేయండి — పురుగులు & దిగుబడి తెలుసుకోండి",
                  mr: "पहिला ड्रोन स्कॅन बुक करा — किडी व उत्पन्न जाणून घ्या" },
      nextScan: { en: "⏱ Recommended: Book within 1–2 weeks of sowing",
                  hi: "⏱ सुझाव: बुआई के 1–2 हफ्ते में स्कैन करें",
                  ta: "⏱ பரிந்துரை: விதைப்பிற்கு 1–2 வாரத்தில் ஸ்கேன்",
                  bn: "⏱ পরামর্শ: বপনের ১–২ সপ্তাহের মধ্যে স্ক্যান করুন",
                  te: "⏱ సిఫార్సు: విత్తిన 1–2 వారాల్లో స్కాన్ చేయండి",
                  mr: "⏱ सूचना: पेरणीनंतर 1–2 आठवड्यांत स्कॅन करा" },
      cta:      { en: "Book scan →",  hi: "स्कैन बुक करें →",  ta: "ஸ்கேன் பதிவு →", bn: "স্ক্যান বুক করুন →", te: "స్కాన్ బుక్ →", mr: "स्कॅन बुक करा →" },
      ctaRoute: `/request-scan?field=${field._id}`,
    };
  }

  const pendingJobs   = fieldJobs.filter((j) => j.status !== "completed");
  const completedJobs = fieldJobs.filter((j) => j.status === "completed");
  const latestJob     = fieldJobs[0];
  const daysSinceLast = Math.floor((now - new Date(latestJob.createdAt)) / 86400000);
  const lastCompletedJob = completedJobs[0];

  // ── Long pending (3+ days) ───────────────────────────────
  const longPending = pendingJobs.find(
    (j) => Math.floor((now - new Date(j.createdAt)) / 86400000) > 3
  );
  if (longPending) {
    const d = Math.floor((now - new Date(longPending.createdAt)) / 86400000);
    return {
      priority: 2,
      type: "long_pending",
      colorClass: "border-l-orange-500 bg-orange-50",
      badgeClass: "border-orange-300 text-orange-700 bg-white",
      icon: "⚠️",
      label:  { en: `Pending ${d} days`,       hi: `${d} दिन से पेंडिंग`,     ta: `${d} நாட்கள் நிலுவை`,     bn: `${d} দিন ধরে পেন্ডিং`,    te: `${d} రోజులు పెండింగ్`,  mr: `${d} दिवसांपासून प्रलंबित` },
      detail: { en: "Operator hasn't responded — contact FPO or re-request",
                hi: "ऑपरेटर ने जवाब नहीं दिया — FPO से संपर्क करें",
                ta: "இயக்குனர் பதிலளிக்கவில்லை — FPO-ஐ தொடர்பு கொள்ளுங்கள்",
                bn: "অপারেটর সাড়া দেয়নি — FPO-র সাথে যোগাযোগ করুন",
                te: "ఆపరేటర్ స్పందించలేదు — FPO ని సంప్రదించండి",
                mr: "ऑपरेटरने उत्तर दिले नाही — FPO शी संपर्क करा" },
      nextScan: { en: "⏱ Contact FPO or re-request scan as soon as possible",
                  hi: "⏱ जल्द से जल्द FPO से संपर्क करें या फिर से अनुरोध करें",
                  ta: "⏱ விரைவில் FPO-ஐ தொடர்பு கொள்ளுங்கள் அல்லது மீண்டும் கோரவும்",
                  bn: "⏱ দ্রুত FPO-র সাথে যোগাযোগ করুন বা পুনরায় অনুরোধ করুন",
                  te: "⏱ వెంటనే FPO ని సంప్రదించండి లేదా మళ్ళీ అభ్యర్థించండి",
                  mr: "⏱ लवकरात लवकर FPO शी संपर्क करा किंवा पुन्हा विनंती करा" },
      cta:    { en: "View field →", hi: "खेत देखें →", ta: "வயல் காண்க →", bn: "ক্ষেত দেখুন →", te: "పొలం చూడండి →", mr: "शेत पहा →" },
      ctaRoute: `/fields/${field._id}`,
    };
  }

  // ── Scan overdue (>30 days, no pending) ─────────────────
  if (daysSinceLast > 30 && pendingJobs.length === 0) {
    return {
      priority: 3,
      type: "scan_due",
      colorClass: "border-l-amber-500 bg-amber-50",
      badgeClass: "border-amber-300 text-amber-700 bg-white",
      icon: "📅",
      label:  { en: `No scan in ${daysSinceLast}d`,   hi: `${daysSinceLast} दिन से स्कैन नहीं`,  ta: `${daysSinceLast} நாட்களாக இல்லை`, bn: `${daysSinceLast} দিন স্ক্যান নেই`, te: `${daysSinceLast} రోజులుగా స్కాన్ లేదు`, mr: `${daysSinceLast} दिवसांत स्कॅन नाही` },
      detail: { en: "Mid-season or pre-harvest scan recommended this week",
                hi: "इस हफ्ते मध्य-फसल या कटाई से पहले का स्कैन करवाएं",
                ta: "இந்த வாரம் நடு பருவம் அல்லது அறுவடைக்கு முன் ஸ்கேன்",
                bn: "এই সপ্তাহে মধ্য-মৌসুম বা ফসল কাটার আগে স্ক্যান করুন",
                te: "ఈ వారం మధ్య-సీజన్ లేదా పంట కోత ముందు స్కాన్ చేయండి",
                mr: "या आठवड्यात मध्य-हंगाम किंवा कापणीपूर्व स्कॅन करा" },
      nextScan: { en: `⏱ Scan now — last was ${daysSinceLast} days ago (every 3–4 weeks recommended)`,
                  hi: `⏱ अभी स्कैन करें — आखिरी स्कैन ${daysSinceLast} दिन पहले था (हर 3–4 हफ्ते)`,
                  ta: `⏱ இப்போது ஸ்கேன் — கடைசி ${daysSinceLast} நாட்களுக்கு முன் (3–4 வாரம் ஒரு முறை)`,
                  bn: `⏱ এখনই স্ক্যান করুন — শেষ স্ক্যান ${daysSinceLast} দিন আগে`,
                  te: `⏱ ఇప్పుడు స్కాన్ చేయండి — చివరిది ${daysSinceLast} రోజుల క్రితం`,
                  mr: `⏱ आत्ता स्कॅन करा — शेवटचा ${daysSinceLast} दिवसांपूर्वी` },
      cta:    { en: "Request scan →", hi: "स्कैन करें →", ta: "ஸ்கேன் கோரு →", bn: "স্ক্যান করুন →", te: "స్కాన్ కోరండి →", mr: "स्कॅन करा →" },
      ctaRoute: `/request-scan?field=${field._id}`,
    };
  }

  // ── Scan recently requested (waiting) ───────────────────
  if (pendingJobs.length > 0) {
    return {
      priority: 4,
      type: "pending",
      colorClass: "border-l-blue-400 bg-blue-50",
      badgeClass: "border-blue-300 text-blue-700 bg-white",
      icon: "🕐",
      label:  { en: "Scan requested",           hi: "स्कैन अनुरोधित",         ta: "ஸ்கேன் கோரப்பட்டது",   bn: "স্ক্যান অনুরোধ করা হয়েছে", te: "స్కాన్ అభ్యర్థించబడింది",  mr: "स्कॅन विनंती केली"   },
      detail: { en: "Drone scan request submitted, awaiting operator",
                hi: "स्कैन अनुरोध भेजा गया, ऑपरेटर की प्रतीक्षा",
                ta: "ஸ்கேன் கோரிக்கை சமர்ப்பிக்கப்பட்டது, இயக்குனர் எதிர்பார்க்கிறோம்",
                bn: "স্ক্যান অনুরোধ জমা হয়েছে, অপারেটরের অপেক্ষায়",
                te: "స్కాన్ అభ్యర్థన సమర్పించబడింది, ఆపరేటర్ కోసం వేచి ఉంది",
                mr: "स्कॅन विनंती सबमिट झाली, ऑपरेटरची प्रतीक्षा" },
      nextScan: { en: "⏱ Report expected within 2–3 days after operator confirms",
                  hi: "⏱ ऑपरेटर के बाद 2–3 दिनों में रिपोर्ट मिलेगी",
                  ta: "⏱ இயக்குனர் உறுதிப்படுத்திய பிறகு 2–3 நாட்களில் அறிக்கை",
                  bn: "⏱ অপারেটর নিশ্চিত করার ২–৩ দিনের মধ্যে রিপোর্ট",
                  te: "⏱ ఆపరేటర్ నిర్ధారించిన తర్వాత 2–3 రోజుల్లో రిపోర్ట్",
                  mr: "⏱ ऑपरेटर पुष्टी केल्यावर 2–3 दिवसांत अहवाल" },
      cta:    { en: "Track status →", hi: "स्थिति देखें →", ta: "நிலையை காண்க →", bn: "স্ট্যাটাস দেখুন →", te: "స్థితి చూడండి →", mr: "स्थिती पहा →" },
      ctaRoute: `/fields/${field._id}`,
    };
  }

  // ── All good — recent scan ───────────────────────────────
  return {
    priority: 5,
    type: "ok",
    colorClass: "border-l-emerald-500 bg-emerald-50",
    badgeClass: "border-emerald-300 text-emerald-700 bg-white",
    icon: "✅",
    label:  { en: `Scanned ${daysSinceLast}d ago`,  hi: `${daysSinceLast} दिन पहले स्कैन`,  ta: `${daysSinceLast} நாட்களுக்கு முன்`, bn: `${daysSinceLast} দিন আগে স্ক্যান`, te: `${daysSinceLast} రోజుల క్రితం`, mr: `${daysSinceLast} दिवसांपूर्वी` },
    detail: { en: `Monitored. ${completedJobs.length} report(s) ready.`,
              hi: `निगरानी हो रही है। ${completedJobs.length} रिपोर्ट तैयार।`,
              ta: `கண்காணிக்கப்படுகிறது. ${completedJobs.length} அறிக்கை தயார்.`,
              bn: `পর্যবেক্ষণ হচ্ছে। ${completedJobs.length}টি রিপোর্ট তৈরি।`,
              te: `పర్యవేక్షించబడుతోంది. ${completedJobs.length} రిపోర్ట్(లు) సిద్ధం.`,
              mr: `निरीक्षण होत आहे. ${completedJobs.length} अहवाल तयार.` },
    // Dynamic next scan date based on last completed job
    nextScanDynamic: lastCompletedJob ? lastCompletedJob.createdAt : latestJob.createdAt,
    cta:    { en: "View report →", hi: "रिपोर्ट देखें →", ta: "அறிக்கை காண்க →", bn: "রিপোর্ট দেখুন →", te: "రిపోర్ట్ చూడండి →", mr: "अहवाल पहा →" },
    ctaRoute: `/fields/${field._id}`,
  };
}

// ════════════════════════════════════════════════════════════
const ScanAlertBanner = ({ fields, jobs }) => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  if (!fields || fields.length === 0) return null;

  const lang = language || "en";

  // Build + sort by priority
  const fieldAlerts = fields
    .map((field) => ({ field, alert: getFieldScanAlert(field, jobs) }))
    .sort((a, b) => a.alert.priority - b.alert.priority);

  const needsAttention = fieldAlerts.some((fa) => fa.alert.priority <= 3);

  const sectionLabel = {
    en: needsAttention ? "Scan Attention Needed" : "✅ All fields up to date",
    hi: needsAttention ? "स्कैन ध्यान चाहिए" : "✅ सभी खेत ठीक हैं",
    ta: needsAttention ? "ஸ்கேன் தேவை"       : "✅ அனைத்தும் சரி",
    bn: needsAttention ? "স্ক্যান মনোযোগ দরকার" : "✅ সব ঠিক আছে",
    te: needsAttention ? "స్కాన్ శ్రద్ధ అవసరం" : "✅ అన్నీ సరిగ్గా ఉన్నాయి",
    mr: needsAttention ? "स्कॅन लक्ष आवश्यक"   : "✅ सर्व ठीक आहे",
  };

  return (
    <div className="space-y-2">
      {/* Section heading — now clearly visible */}
      <p className={`text-xs font-bold uppercase tracking-wide px-1 flex items-center gap-1.5 ${
        needsAttention ? "text-red-600" : "text-emerald-700"
      }`}>
        {needsAttention && (
          <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        )}
        {sectionLabel[lang] || sectionLabel.en}
      </p>

      {/* One row per field */}
      {fieldAlerts.map(({ field, alert }) => {
        // Get next scan text — dynamic for "ok" type, static for others
        const nextScanText = alert.type === "ok"
          ? getNextScanText(alert.nextScanDynamic, lang)
          : (alert.nextScan?.[lang] || alert.nextScan?.en);

        return (
          <div
            key={field._id}
            className={`border-l-4 ${alert.colorClass} rounded-r-xl px-3 py-2.5 flex items-center gap-3`}
          >
            {/* Priority icon */}
            <span className="text-xl flex-shrink-0 leading-none">{alert.icon}</span>

            {/* Main info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-gray-900 truncate">
                  {field.name}
                </span>
                {field.cropType && (
                  <span className="text-[11px] text-gray-400">🌾 {field.cropType}</span>
                )}
                <span className={`text-[11px] font-medium border px-2 py-0.5 rounded-full flex-shrink-0 ${alert.badgeClass}`}>
                  {alert.label[lang] || alert.label.en}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5 leading-snug">
                {alert.detail[lang] || alert.detail.en}
              </p>
              {/* ✅ Next scan recommendation line */}
              {nextScanText && (
                <p className="text-[11px] text-slate-400 mt-0.5 italic leading-snug">
                  {nextScanText}
                </p>
              )}
            </div>

            {/* CTA */}
            <button
              onClick={() => navigate(alert.ctaRoute)}
              className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors shadow-sm whitespace-nowrap"
            >
              {alert.cta[lang] || alert.cta.en}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ScanAlertBanner;