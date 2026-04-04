// src/pages/DroneUpload.jsx
import { useState, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth0 } from "@auth0/auth0-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const DroneUpload = () => {
  const [file, setFile]         = useState(null);
  const [preview, setPreview]   = useState(null);
  const [status, setStatus]     = useState(""); // "", "analyzing", "done", "error"
  const [result, setResult]     = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);
  const { t } = useLanguage();
  const { getAccessTokenSilently } = useAuth0();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type.startsWith("image/")) loadFile(dropped);
  };

  const handleFileChange = (e) => {
    const picked = e.target.files[0];
    if (picked) loadFile(picked);
  };

  const loadFile = (f) => {
    setFile(f);
    setStatus("");
    setResult(null);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(f);
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setFile(null);
    setPreview(null);
    setStatus("");
    setResult(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleAnalyze = async () => {
    if (!file || status === "analyzing") return;
    setStatus("analyzing");
    setResult(null);

    try {
      const token = await getAccessTokenSilently({
        authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
      });

      const tempJobId = `upload_${Date.now()}`;

      const res = await fetch(`${API_BASE}/api/ai/analyze-crop`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobId:    tempJobId,
          imageUrl: preview, // base64 data URL — Flask handles it
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Analysis failed");

      setResult(data.analysis?.results || data.analysis || {});
      setStatus("done");
    } catch (err) {
      setResult({ error: err.message });
      setStatus("error");
    }
  };

  const renderResult = () => {
    if (!result) return null;
    if (result.error) return (
      <p style={{ fontSize: 13, color: "#fca5a5", margin: 0 }}>{result.error}</p>
    );

    const riskColor = { low: "#4ade80", medium: "#fbbf24", high: "#f87171" }[result.riskLevel?.toLowerCase()] || "#c8f5d4";

    const rows = [
      { key: "cropHealthStatus", label: t("resCropHealth")    || "Crop Health"    },
      { key: "riskLevel",        label: t("resRiskLevel")     || "Risk Level"     },
      { key: "ndviScore",        label: t("resNdvi")          || "NDVI Score"     },
      { key: "affectedArea",     label: t("resAffectedArea")  || "Affected Area"  },
      { key: "recommendation",   label: t("resRecommendation")|| "Recommendation" },
    ];

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {rows.map(({ key, label }) => {
          const val = result[key];
          if (val === undefined || val === null || val === "") return null;
          return (
            <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
              <span style={{ fontSize: 11, color: "rgba(200,240,210,0.5)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", flexShrink: 0 }}>
                {label}
              </span>
              <span style={{ fontSize: 13, color: key === "riskLevel" ? riskColor : "#c8f5d4", fontWeight: key === "recommendation" ? 600 : 400, textAlign: "right", lineHeight: 1.5 }}>
                {key === "ndviScore"     ? Number(val).toFixed(2)
                 : key === "affectedArea" ? `${val}%`
                 : String(val)}
              </span>
            </div>
          );
        })}

        {Array.isArray(result.diseaseDetected) && result.diseaseDetected.length > 0 && (
          <div>
            <span style={{ fontSize: 11, color: "rgba(200,240,210,0.5)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {t("resDiseases") || "Diseases Detected"}
            </span>
            <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", gap: 6 }}>
              {result.diseaseDetected.map((d, i) => (
                <span key={i} style={{ fontSize: 11, background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 20, padding: "2px 10px", color: "#fca5a5" }}>{d}</span>
              ))}
            </div>
          </div>
        )}

        {Array.isArray(result.anomalies) && result.anomalies.length > 0 && (
          <div>
            <span style={{ fontSize: 11, color: "rgba(200,240,210,0.5)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {t("resAnomalies") || "Anomalies"}
            </span>
            <ul style={{ margin: "6px 0 0", paddingLeft: 16 }}>
              {result.anomalies.map((a, i) => (
                <li key={i} style={{ fontSize: 12, color: "#c8f5d4", marginBottom: 2 }}>{a}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const infoCards = [
    { icon: "🌾", labelKey: "infoCropHealth",    descKey: "infoCropHealthDesc"    },
    { icon: "🐛", labelKey: "infoPestDetection",  descKey: "infoPestDetectionDesc" },
    { icon: "💧", labelKey: "infoMoisture",       descKey: "infoMoistureDesc"      },
  ];

  return (
    <div style={{ fontFamily: "'Sora','DM Sans',sans-serif", padding: "28px 16px 48px", maxWidth: 560, margin: "0 auto" }}>
      <style>{`
        @keyframes spin       { to { transform: rotate(360deg); } }
        @keyframes fadeUp     { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse-ring { 0%,100%{box-shadow:0 0 0 0 rgba(74,222,128,0.4)} 50%{box-shadow:0 0 0 8px rgba(74,222,128,0)} }
        .du-upload-btn:hover:not(:disabled) { box-shadow:0 6px 28px rgba(74,222,128,0.45) !important; transform:scale(1.02); }
        .du-upload-btn:disabled  { opacity:0.45; cursor:not-allowed; }
        .du-choose-btn:hover     { background:rgba(74,222,128,0.18) !important; }
        .du-remove-btn:hover     { color:#fca5a5 !important; }
      `}</style>

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f0fdf4", margin: 0, letterSpacing: "-0.4px" }}>
          {t("uploadDroneTitle")}
        </h1>
        <p style={{ fontSize: 13, color: "rgba(200,240,210,0.6)", marginTop: 6, fontWeight: 400 }}>
          {t("uploadDroneDesc")}
        </p>
      </div>

      <div style={{ background: "rgba(20,45,28,0.88)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 24, backdropFilter: "blur(16px)", padding: "28px 24px", boxShadow: "0 8px 40px rgba(0,0,0,0.3)", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? "rgba(74,222,128,0.7)" : file ? "rgba(74,222,128,0.45)" : "rgba(74,222,128,0.2)"}`,
            borderRadius: 18, padding: "36px 20px", textAlign: "center", cursor: "pointer",
            background: dragOver ? "rgba(74,222,128,0.07)" : file ? "rgba(74,222,128,0.05)" : "rgba(255,255,255,0.02)",
            transition: "all 0.2s", animation: "fadeUp 0.4s ease both", position: "relative",
          }}
        >
          <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />

          {file ? (
            <>
              {preview && <img src={preview} alt="preview" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 10, marginBottom: 10, border: "1px solid rgba(74,222,128,0.3)" }} />}
              <p style={{ fontSize: 14, fontWeight: 700, color: "#86efac", margin: 0 }}>{file.name}</p>
              <p style={{ fontSize: 11, color: "rgba(200,240,210,0.5)", marginTop: 4 }}>{(file.size / 1024).toFixed(1)} KB</p>
              <button onClick={removeFile} className="du-remove-btn"
                style={{ marginTop: 10, background: "transparent", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 50, padding: "4px 14px", fontSize: 11, color: "rgba(252,165,165,0.7)", cursor: "pointer", fontFamily: "'Sora',sans-serif", transition: "color 0.2s" }}>
                {t("removeFile")}
              </button>
            </>
          ) : (
            <>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 14px", animation: "pulse-ring 2.5s infinite" }}>📷</div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#e8f5e9", margin: 0 }}>{t("dropImageHere")}</p>
              <p style={{ fontSize: 12, color: "rgba(200,240,210,0.45)", marginTop: 6 }}>
                {t("dropImageOr")}{" "}<span style={{ color: "#4ade80", fontWeight: 600 }}>{t("browseLink")}</span>{" "}{t("dropImageToSelect")}
              </p>
              <p style={{ fontSize: 10, color: "rgba(200,240,210,0.3)", marginTop: 8 }}>{t("supportedFormats")}</p>
            </>
          )}
        </div>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: "rgba(74,222,128,0.1)" }} />
          <span style={{ fontSize: 11, color: "rgba(200,240,210,0.35)", fontWeight: 600 }}>{t("orDivider")}</span>
          <div style={{ flex: 1, height: 1, background: "rgba(74,222,128,0.1)" }} />
        </div>

        <button type="button" className="du-choose-btn" onClick={() => inputRef.current?.click()}
          style={{ width: "100%", background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.25)", borderRadius: 50, padding: "11px 0", fontSize: 13, fontWeight: 600, color: "#a7f3c0", cursor: "pointer", fontFamily: "'Sora',sans-serif", transition: "all 0.2s" }}>
          📁 {t("chooseFileButton")}
        </button>

        <button type="button" onClick={handleAnalyze} disabled={!file || status === "analyzing"} className="du-upload-btn"
          style={{ width: "100%", background: "linear-gradient(135deg,#4ade80,#22c55e)", color: "#0a1a0f", border: "none", borderRadius: 50, padding: "13px 0", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora',sans-serif", boxShadow: "0 4px 20px rgba(74,222,128,0.3)", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {status === "analyzing" ? (
            <><span style={{ width: 16, height: 16, border: "2px solid #0a1a0f", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />{t("analyzingStatus")}</>
          ) : (
            <>🔍 {t("analyzeFieldButton")}</>
          )}
        </button>

        {status === "done" && result && (
          <div style={{ background: "rgba(74,222,128,0.07)", border: "1px solid rgba(74,222,128,0.25)", borderRadius: 14, padding: "16px", animation: "fadeUp 0.4s ease both" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#4ade80", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.6px" }}>{t("analysisResultTitle")}</p>
            {renderResult()}
          </div>
        )}

        {status === "error" && (
          <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10, animation: "fadeUp 0.4s ease both" }}>
            <span style={{ fontSize: 18 }}>⚠️</span>
            <p style={{ fontSize: 13, color: "#fca5a5", margin: 0 }}>{result?.error || t("scanSubmitError")}</p>
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 16 }}>
        {infoCards.map((item, i) => (
          <div key={i} style={{ background: "rgba(20,45,28,0.7)", border: "1px solid rgba(74,222,128,0.15)", borderRadius: 14, padding: "12px 10px", textAlign: "center" }}>
            <p style={{ fontSize: 22, margin: "0 0 6px" }}>{item.icon}</p>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#c8f5d4", margin: 0 }}>{t(item.labelKey)}</p>
            <p style={{ fontSize: 10, color: "rgba(200,240,210,0.45)", marginTop: 2 }}>{t(item.descKey)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DroneUpload;