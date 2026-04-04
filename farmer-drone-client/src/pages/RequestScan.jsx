// src/pages/RequestScan.jsx
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import api from "../api";

const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(74,222,128,0.2)",
  borderRadius: 12,
  padding: "11px 14px",
  fontSize: 13,
  color: "#e8f5e9",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "'Sora', sans-serif",
  transition: "border-color 0.2s",
};

const labelStyle = {
  fontSize: 11,
  fontWeight: 600,
  color: "rgba(200,240,210,0.6)",
  letterSpacing: "0.3px",
  display: "block",
  marginBottom: 6,
};

const RequestScan = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const fieldIdFromUrl = params.get("field") || "";

  const [fields, setFields]             = useState([]);
  const [selectedFieldId, setSelectedFieldId] = useState(fieldIdFromUrl || "");
  const [fieldName, setFieldName]       = useState("");
  const [stage, setStage]               = useState("");
  const [date, setDate]                 = useState("");
  const [notes, setNotes]               = useState("");
  const [errors, setErrors]             = useState({});
  const [submitting, setSubmitting]     = useState(false);
  const [success, setSuccess]           = useState(false);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const res = await api.get("/api/fields/my");
        setFields(res.data.fields || []);
      } catch (err) {
        console.error("Fields fetch error:", err);
      }
    };
    fetchFields();
  }, []);

  useEffect(() => {
    if (!fieldIdFromUrl) return;
    const fetchField = async () => {
      try {
        const res = await api.get(`/api/fields/${fieldIdFromUrl}`);
        setFieldName(res.data.field?.name || fieldIdFromUrl);
      } catch {
        setFieldName(fieldIdFromUrl);
      }
    };
    fetchField();
  }, [fieldIdFromUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalFieldId = fieldIdFromUrl || selectedFieldId;
    const newErrors = {};
    if (!finalFieldId) newErrors.field = t("fieldRequired");
    if (!stage)        newErrors.stage = t("stageRequired");
    if (!date)         newErrors.date  = t("dateRequired");
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setSubmitting(true);
      await api.post("/api/drone-jobs", { fieldId: finalFieldId, stage, preferredDate: date, notes });
      setSuccess(true);
      setTimeout(() => navigate("/home"), 2000);
    } catch (err) {
      console.error("RequestScan submit error:", err);
      const msg = err?.response?.status === 401 ? t("loginFailed") : t("scanSubmitError") || "Scan request failed. Please try again.";
      setErrors({ submit: msg });
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div style={{ fontFamily:"'Sora','DM Sans',sans-serif", padding:"32px 16px", maxWidth:480, margin:"0 auto" }}>
        <div style={{ background:"rgba(74,222,128,0.1)", border:"1px solid rgba(74,222,128,0.3)", borderRadius:20, padding:"32px 24px", textAlign:"center" }}>
          <p style={{ fontSize:40, marginBottom:12 }}>✅</p>
          <p style={{ fontSize:14, fontWeight:700, color:"#86efac", margin:0 }}>{t("scanRequestSuccess")}</p>
          <p style={{ fontSize:12, color:"rgba(200,240,210,0.5)", marginTop:8 }}>{t("loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily:"'Sora','DM Sans',sans-serif", padding:"28px 16px 48px", maxWidth:520, margin:"0 auto" }}>
      <style>{`
        .rs-input:focus { border-color: rgba(74,222,128,0.5) !important; }
        .rs-input option { background: #172d1f; color: #e8f5e9; }
        .rs-submit:hover:not(:disabled) { box-shadow: 0 6px 28px rgba(74,222,128,0.45) !important; transform: scale(1.02); }
        .rs-submit:disabled { opacity: 0.55; cursor: not-allowed; }
      `}</style>

      {/* Back */}
      <button onClick={() => navigate(-1)} style={{ fontSize:12, color:"rgba(200,240,210,0.5)", background:"none", border:"none", cursor:"pointer", fontFamily:"'Sora',sans-serif", marginBottom:20, display:"block" }}>
        ‹ {t("dashboard")}
      </button>

      {/* Card */}
      <div style={{ background:"rgba(20,45,28,0.88)", border:"1px solid rgba(74,222,128,0.2)", borderRadius:24, backdropFilter:"blur(16px)", padding:"28px 24px", boxShadow:"0 8px 40px rgba(0,0,0,0.3)" }}>

        <h1 style={{ fontSize:20, fontWeight:800, color:"#f0fdf4", margin:"0 0 24px", letterSpacing:"-0.3px" }}>
          🚁 {t("requestScanTitle")}
        </h1>

        <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:18 }}>

          {/* Field */}
          <div>
            <label style={labelStyle}>{t("fieldLabel")}</label>
            {fieldIdFromUrl ? (
              <div style={{ ...inputStyle, color:"rgba(200,240,210,0.7)", cursor:"default" }}>
                {fieldName || "..."}
              </div>
            ) : (
              <select
                value={selectedFieldId}
                onChange={e => { setSelectedFieldId(e.target.value); setErrors(p => ({ ...p, field:"" })); }}
                className="rs-input"
                style={inputStyle}
              >
                <option value="">-- Field select karo --</option>
                {fields.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
              </select>
            )}
            {errors.field && <p style={{ fontSize:11, color:"#fca5a5", marginTop:4 }}>{errors.field}</p>}
          </div>

          {/* Crop stage */}
          <div>
            <label style={labelStyle}>{t("stageLabel")}</label>
            <select
              value={stage}
              onChange={e => { setStage(e.target.value); setErrors(p => ({ ...p, stage:"" })); }}
              className="rs-input"
              style={inputStyle}
            >
              <option value="">{t("selectStagePlaceholder")}</option>
              <option value="early">{t("stageEarly")}</option>
              <option value="mid">{t("stageMid")}</option>
              <option value="pre-harvest">{t("stagePreHarvest")}</option>
            </select>
            {errors.stage && <p style={{ fontSize:11, color:"#fca5a5", marginTop:4 }}>{errors.stage}</p>}
          </div>

          {/* Preferred date */}
          <div>
            <label style={labelStyle}>{t("dateLabel")}</label>
            <input
              type="date"
              className="rs-input"
              style={{ ...inputStyle, colorScheme:"dark" }}
              value={date}
              onChange={e => { setDate(e.target.value); setErrors(p => ({ ...p, date:"" })); }}
            />
            {errors.date && <p style={{ fontSize:11, color:"#fca5a5", marginTop:4 }}>{errors.date}</p>}
          </div>

          {/* Notes */}
          <div>
            <label style={labelStyle}>{t("notesLabel")}</label>
            <textarea
              rows={3}
              className="rs-input"
              style={{ ...inputStyle, resize:"vertical", minHeight:80, lineHeight:1.5 }}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder={t("notesPlaceholder")}
            />
          </div>

          {errors.submit && <p style={{ fontSize:12, color:"#fca5a5" }}>{errors.submit}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="rs-submit"
            style={{ width:"100%", background:"linear-gradient(135deg,#4ade80,#22c55e)", color:"#0a1a0f", border:"none", borderRadius:50, padding:"13px 0", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Sora',sans-serif", boxShadow:"0 4px 20px rgba(74,222,128,0.3)", transition:"all 0.2s", marginTop:4 }}
          >
            {submitting ? t("loading") : t("submitScanRequest")}
          </button>

        </form>
      </div>
    </div>
  );
};

export default RequestScan;
