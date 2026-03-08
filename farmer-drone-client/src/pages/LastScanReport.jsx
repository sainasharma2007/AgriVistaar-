
// src/pages/LastScanReport.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import api from "../api";

const LastScanReport = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [latestJob, setLatestJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;
        const res = await api.get("/api/drone-jobs/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const jobs = res.data.jobs || [];
        // Sirf last COMPLETED scan — pending wale nahi
        const completed = jobs.find((j) => j.status === "completed");
        setLatestJob(completed || null);
      } catch (err) {
        console.error("LastScanReport fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  const getHealthStyle = (analysis) => {
    const a = (analysis || "").toLowerCase();
    if (!analysis) return { bg: "bg-slate-50 border-slate-200", text: "text-slate-600", emoji: "⏳" };
    if (a.includes("no issues") || a.includes("healthy")) return { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-800", emoji: "✅" };
    if (a.includes("mild")) return { bg: "bg-amber-50 border-amber-200", text: "text-amber-800", emoji: "⚠️" };
    return { bg: "bg-red-50 border-red-200", text: "text-red-800", emoji: "🔴" };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-7 h-7 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!latestJob) {
    return (
      <div className="p-4 max-w-xl mx-auto bg-white rounded-2xl shadow-sm space-y-3 mt-8 text-center">
        <p className="text-3xl">📭</p>
        <p className="text-sm text-slate-600 font-medium">
          {language === "hi"
            ? "अभी तक कोई पूर्ण स्कैन रिपोर्ट नहीं है।"
            : "No completed scan report yet."}
        </p>
        <p className="text-xs text-slate-400">
          {language === "hi"
            ? "स्कैन पूरा होने के बाद रिपोर्ट यहाँ दिखेगी।"
            : "Report will appear here once a scan is completed."}
        </p>
        <button
          onClick={() => navigate("/home")}
          className="text-sm text-emerald-700 hover:underline font-medium"
        >
          ← {t("myFields")}
        </button>
      </div>
    );
  }

  const health = getHealthStyle(latestJob.analysis);

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">
          {t("lastScanTitle")}
        </h1>
        <button
          onClick={() => navigate("/home")}
          className="text-sm text-slate-500 hover:text-slate-800"
        >
          ← {t("myFields")}
        </button>
      </div>

      {/* "Last completed scan only" label */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 flex items-center gap-2">
        <span className="text-emerald-600 text-sm">✅</span>
        <p className="text-xs text-emerald-700 font-medium">
          {language === "hi"
            ? "यह सिर्फ आपकी सबसे हाल की पूर्ण हुई स्कैन रिपोर्ट है।"
            : "Showing your most recent completed scan report only."}
        </p>
      </div>

      {/* Field info */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <p className="font-semibold text-gray-900">
          {t("lastScanField")} {latestJob.field?.name || t("fieldFallback")}
        </p>
        {latestJob.field?.cropType && (
          <p className="text-xs text-emerald-700 mt-0.5">
            🌾 {latestJob.field.cropType}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          {t("lastScanDate")}{" "}
          {new Date(latestJob.createdAt).toLocaleString()}
        </p>
        <span className="inline-flex mt-2 items-center px-2 py-0.5 rounded-full border text-[11px] font-medium bg-emerald-100 text-emerald-800 border-emerald-300">
          ✅ {t("completed")}
        </span>
      </div>

      {/* Health summary */}
      <div className={`rounded-2xl border p-4 space-y-3 ${health.bg}`}>
        <div className="flex items-center justify-between">
          <h2 className={`text-base font-semibold ${health.text}`}>
            {health.emoji} {t("healthSummaryTitle")}
          </h2>
          <span className="text-xs text-slate-400">
            {new Date(latestJob.createdAt).toLocaleDateString()}
          </span>
        </div>

        <p className={`text-sm leading-relaxed ${health.text}`}>
          {latestJob.analysis || t("analysisPendingLong")}
        </p>

        {/* Action tips */}
        {latestJob.analysis && (
          <div className="bg-white/70 rounded-xl p-3 space-y-2">
            {latestJob.analysis.toLowerCase().includes("nitrogen") && (
              <div className="flex items-start gap-2">
                <span>💧</span>
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
            {latestJob.analysis.toLowerCase().includes("pest") && (
              <div className="flex items-start gap-2">
                <span>🐛</span>
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
          </div>
        )}
      </div>

      {/* Yield prediction */}
      {latestJob.analysis?.toLowerCase().includes("yield") && (
        <div className="bg-white shadow-sm rounded-2xl border border-gray-100 p-4">
          <h2 className="font-semibold text-sm mb-1">{t("yieldPredictionTitle")}</h2>
          <p className="text-sm text-gray-600">{latestJob.analysis}</p>
          <p className="text-xs text-gray-400 mt-2">{t("profitHint")}</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        {latestJob.field?._id && (
          <button
            onClick={() => navigate(`/fields/${latestJob.field._id}`)}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-3 rounded-xl transition-colors"
          >
            {language === "hi" ? "इस खेत की सारी स्कैन देखें" : "View All Scans for this Field"} →
          </button>
        )}
        <button
          onClick={() => navigate("/profit")}
          className="flex-1 bg-white border border-emerald-300 text-emerald-700 text-sm font-semibold py-3 rounded-xl hover:bg-emerald-50 transition-colors"
        >
          {t("openProfitCalculator")}
        </button>
      </div>
    </div>
  );
};

export default LastScanReport;
