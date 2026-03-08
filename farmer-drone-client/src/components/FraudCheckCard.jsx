// src/components/FraudCheckCard.jsx
import { useState } from "react";
import api from "../api";

// ── Multi-language translations ──────────────────────────────
const FRAUD_TEXT = {
  en: {
    title: "AI Fraud Analysis",
    subtitle: "Isolation Forest Model v2",
    runBtn: "Run Check",
    analyzing: "Analyzing...",
    rerun: "Re-run",
    scoreLabel: "Fraud Risk Score",
    safe: "0 — Safe",
    highRisk: "1 — High Risk",
    cropHealth: "Crop Health",
    flagged: "🚨 This transaction has been flagged for review",
    infoText: "Run AI fraud analysis to check for suspicious activity on this drone job.",
    HIGH: "HIGH RISK",
    MEDIUM: "MEDIUM RISK",
    LOW: "LOW RISK",
    analysisComplete: "Analysis complete",
  },
  hi: {
    title: "AI धोखाधड़ी विश्लेषण",
    subtitle: "आइसोलेशन फॉरेस्ट मॉडल v2",
    runBtn: "जांच करें",
    analyzing: "विश्लेषण हो रहा है...",
    rerun: "फिर से जांचें",
    scoreLabel: "धोखाधड़ी जोखिम स्कोर",
    safe: "0 — सुरक्षित",
    highRisk: "1 — उच्च जोखिम",
    cropHealth: "फसल स्वास्थ्य",
    flagged: "🚨 इस लेनदेन को समीक्षा के लिए फ्लैग किया गया है",
    infoText: "इस ड्रोन जॉब पर संदिग्ध गतिविधि की जांच के लिए AI विश्लेषण चलाएं।",
    HIGH: "उच्च जोखिम",
    MEDIUM: "मध्यम जोखिम",
    LOW: "कम जोखिम",
    analysisComplete: "विश्लेषण पूरा हुआ",
  },
  ta: {
    title: "AI மோசடி பகுப்பாய்வு",
    subtitle: "ஐசோலேஷன் ஃபாரெஸ்ட் மாடல் v2",
    runBtn: "சரிபார்க்கவும்",
    analyzing: "பகுப்பாய்வு நடக்கிறது...",
    rerun: "மீண்டும் சரிபார்க்கவும்",
    scoreLabel: "மோசடி ஆபத்து மதிப்பெண்",
    safe: "0 — பாதுகாப்பானது",
    highRisk: "1 — அதிக ஆபத்து",
    cropHealth: "பயிர் ஆரோக்கியம்",
    flagged: "🚨 இந்த பரிவர்த்தனை மதிப்பாய்வுக்கு கொடியிடப்பட்டது",
    infoText: "இந்த ட்ரோன் வேலையில் சந்தேகத்திற்குரிய செயல்பாட்டை சரிபார்க்க AI பகுப்பாய்வை இயக்கவும்.",
    HIGH: "அதிக ஆபத்து",
    MEDIUM: "நடுத்தர ஆபத்து",
    LOW: "குறைந்த ஆபத்து",
    analysisComplete: "பகுப்பாய்வு முடிந்தது",
  },
  bn: {
    title: "AI জালিয়াতি বিশ্লেষণ",
    subtitle: "আইসোলেশন ফরেস্ট মডেল v2",
    runBtn: "পরীক্ষা করুন",
    analyzing: "বিশ্লেষণ চলছে...",
    rerun: "আবার পরীক্ষা করুন",
    scoreLabel: "জালিয়াতি ঝুঁকি স্কোর",
    safe: "0 — নিরাপদ",
    highRisk: "1 — উচ্চ ঝুঁকি",
    cropHealth: "ফসলের স্বাস্থ্য",
    flagged: "🚨 এই লেনদেন পর্যালোচনার জন্য চিহ্নিত করা হয়েছে",
    infoText: "এই ড্রোন জবে সন্দেহজনক কার্যকলাপ পরীক্ষা করতে AI বিশ্লেষণ চালান।",
    HIGH: "উচ্চ ঝুঁকি",
    MEDIUM: "মাঝারি ঝুঁকি",
    LOW: "কম ঝুঁকি",
    analysisComplete: "বিশ্লেষণ সম্পন্ন",
  },
  te: {
    title: "AI మోసం విశ్లేషణ",
    subtitle: "ఐసోలేషన్ ఫారెస్ట్ మోడల్ v2",
    runBtn: "తనిఖీ చేయండి",
    analyzing: "విశ్లేషిస్తోంది...",
    rerun: "మళ్లీ తనిఖీ చేయండి",
    scoreLabel: "మోసం ప్రమాద స్కోర్",
    safe: "0 — సురక్షితం",
    highRisk: "1 — అధిక ప్రమాదం",
    cropHealth: "పంట ఆరోగ్యం",
    flagged: "🚨 ఈ లావాదేవీ సమీక్షకు ఫ్లాగ్ చేయబడింది",
    infoText: "ఈ డ్రోన్ జాబ్‌లో అనుమానాస్పద కార్యకలాపాలను తనిఖీ చేయడానికి AI విశ్లేషణ నడపండి.",
    HIGH: "అధిక ప్రమాదం",
    MEDIUM: "మధ్యస్థ ప్రమాదం",
    LOW: "తక్కువ ప్రమాదం",
    analysisComplete: "విశ్లేషణ పూర్తైంది",
  },
  mr: {
    title: "AI फसवणूक विश्लेषण",
    subtitle: "आयसोलेशन फॉरेस्ट मॉडेल v2",
    runBtn: "तपासा",
    analyzing: "विश्लेषण सुरू आहे...",
    rerun: "पुन्हा तपासा",
    scoreLabel: "फसवणूक जोखीम स्कोर",
    safe: "0 — सुरक्षित",
    highRisk: "1 — उच्च जोखीम",
    cropHealth: "पीक आरोग्य",
    flagged: "🚨 हा व्यवहार पुनरावलोकनासाठी फ्लॅग केला आहे",
    infoText: "या ड्रोन जॉबवर संशयास्पद क्रियाकलाप तपासण्यासाठी AI विश्लेषण चालवा.",
    HIGH: "उच्च जोखीम",
    MEDIUM: "मध्यम जोखीम",
    LOW: "कमी जोखीम",
    analysisComplete: "विश्लेषण पूर्ण झाले",
  },
};

const getRiskConfig = (riskLevel, isFlagged) => {
  if (isFlagged || riskLevel === "HIGH") {
    return { bg: "bg-red-50 border-red-300", badge: "bg-red-100 text-red-700 border-red-300", icon: "🚨", barColor: "bg-red-500", textColor: "text-red-800", key: "HIGH" };
  }
  if (riskLevel === "MEDIUM") {
    return { bg: "bg-amber-50 border-amber-300", badge: "bg-amber-100 text-amber-700 border-amber-300", icon: "⚠️", barColor: "bg-amber-400", textColor: "text-amber-800", key: "MEDIUM" };
  }
  return { bg: "bg-emerald-50 border-emerald-200", badge: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: "✅", barColor: "bg-emerald-500", textColor: "text-emerald-800", key: "LOW" };
};

const FraudCheckCard = ({ droneJobId, fieldId, language = "en" }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const tx = FRAUD_TEXT[language] || FRAUD_TEXT.en;

  const runFraudCheck = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      const res = await api.post(
        "/api/ai/detect-fraud",
        { droneJobId, fieldId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Fraud check failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const config = result ? getRiskConfig(result.riskLevel, result.isFlagged) : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🤖</span>
          <div>
            <p className="text-sm font-semibold text-gray-900">{tx.title}</p>
            <p className="text-xs text-gray-400">{tx.subtitle}</p>
          </div>
        </div>

        {!result && (
          <button
            onClick={runFraudCheck}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-emerald-600 disabled:bg-gray-300 text-white hover:bg-emerald-700 transition-colors"
          >
            {loading ? (
              <>
                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {tx.analyzing}
              </>
            ) : (
              <>🔍 {tx.runBtn}</>
            )}
          </button>
        )}

        {result && (
          <button
            onClick={() => { setResult(null); setError(null); }}
            className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-50"
          >
            {tx.rerun}
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {/* Result */}
      {result && config && (
        <div className={`rounded-xl border p-3 space-y-3 ${config.bg}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{config.icon}</span>
              <span className={`text-xs font-bold border px-2 py-0.5 rounded-full ${config.badge}`}>
                {tx[config.key]}
              </span>
            </div>
            <span className={`text-lg font-bold ${config.textColor}`}>
              {Math.round(result.fraudRiskScore * 100)}%
            </span>
          </div>

          {/* Score bar */}
          <div>
            <div className="flex justify-between text-[10px] text-gray-400 mb-1">
              <span>{tx.scoreLabel}</span>
              <span>{result.fraudRiskScore?.toFixed(2)}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${config.barColor}`}
                style={{ width: `${Math.round(result.fraudRiskScore * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-gray-300 mt-0.5">
              <span>{tx.safe}</span>
              <span>{tx.highRisk}</span>
            </div>
          </div>

          {/* Details */}
          <div className="bg-white/70 rounded-lg px-3 py-2 space-y-1">
            <p className="text-xs font-medium text-gray-700">
              {result.details || tx.analysisComplete}
            </p>
            {result.cropHealthStatus && (
              <p className="text-[11px] text-gray-500">
                🌾 {tx.cropHealth}: <span className="font-medium">{result.cropHealthStatus}</span>
              </p>
            )}
            {result.isFlagged && (
              <p className="text-[11px] text-red-600 font-semibold">{tx.flagged}</p>
            )}
          </div>
        </div>
      )}

      {/* Info text */}
      {!result && !loading && !error && (
        <p className="text-xs text-gray-400 italic">{tx.infoText}</p>
      )}
    </div>
  );
};

export default FraudCheckCard;