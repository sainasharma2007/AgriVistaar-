 


// src/pages/Home.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useLanguage } from "../context/LanguageContext";
import api from "../api";
import NextScanCard from "../components/NextScanCard";

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

    .home-root { font-family: 'Sora', 'DM Sans', sans-serif; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }
    @keyframes pulse-dot {
      0%, 100% { box-shadow: 0 0 0 0 rgba(74,222,128,0.6); }
      50%       { box-shadow: 0 0 0 6px rgba(74,222,128,0); }
    }
    @keyframes grain {
      0%,100%{transform:translate(0,0)} 10%{transform:translate(-2%,-3%)}
      20%{transform:translate(3%,2%)}   30%{transform:translate(-1%,4%)}
      40%{transform:translate(4%,-1%)}  50%{transform:translate(-3%,3%)}
      60%{transform:translate(2%,-4%)}  70%{transform:translate(-4%,1%)}
      80%{transform:translate(1%,-2%)}  90%{transform:translate(3%,4%)}
    }
    .fade-up   { animation: fadeUp 0.6s ease both; }
    .fade-up-1 { animation: fadeUp 0.6s 0.1s ease both; }
    .fade-up-2 { animation: fadeUp 0.6s 0.2s ease both; }
    .fade-up-3 { animation: fadeUp 0.6s 0.3s ease both; }
    .fade-up-4 { animation: fadeUp 0.6s 0.4s ease both; }

    .shimmer-name {
      background: linear-gradient(90deg,#a7f3c0,#ffffff,#6ee7a0,#ffffff,#a7f3c0);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 4s linear infinite;
    }

    .stat-card {
      background: rgba(20, 45, 28, 0.85);
      border: 1px solid rgba(74,222,128,0.22);
      border-radius: 20px;
      padding: 22px 20px;
      transition: transform 0.25s ease, box-shadow 0.25s ease;
      backdrop-filter: blur(16px);
    }
    .stat-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.4); }

    .field-card {
      background: rgba(20, 45, 28, 0.75);
      border: 1px solid rgba(74,222,128,0.18);
      border-radius: 16px;
      padding: 14px 16px;
      transition: background 0.2s ease, transform 0.2s ease;
      cursor: pointer;
    }
    .field-card:hover { background: rgba(30, 65, 38, 0.9); transform: translateX(3px); }
    .field-card.deleting { opacity: 0.4; pointer-events: none; }

    .glass-panel {
      background: rgba(20, 45, 28, 0.82);
      border: 1px solid rgba(74,222,128,0.2);
      border-radius: 24px;
      backdrop-filter: blur(16px);
    }

    .action-btn-primary {
      background: linear-gradient(135deg,#4ade80,#22c55e);
      color:#0a1a0f; border:none; border-radius:50px;
      padding:11px 24px; font-size:13px; font-weight:700;
      cursor:pointer; transition:all 0.2s ease;
      box-shadow:0 4px 20px rgba(74,222,128,0.3);
      font-family:'Sora',sans-serif;
    }
    .action-btn-primary:hover { transform:scale(1.04); box-shadow:0 6px 28px rgba(74,222,128,0.45); }

    .action-btn-secondary {
      background:rgba(20,45,28,0.8);
      color:#c8f5d4; border:1px solid rgba(74,222,128,0.3);
      border-radius:50px; padding:11px 24px;
      font-size:13px; font-weight:600;
      cursor:pointer; transition:all 0.2s ease;
      font-family:'Sora',sans-serif;
    }
    .action-btn-secondary:hover { background:rgba(30,65,38,0.9); transform:scale(1.04); }

    .add-field-btn {
      font-size:12px; padding:7px 14px;
      border-radius:50px;
      border:1px solid rgba(74,222,128,0.35);
      color:#a7f3c0; background:rgba(74,222,128,0.1);
      cursor:pointer; transition:all 0.2s ease;
      font-family:'Sora',sans-serif; font-weight:600;
    }
    .add-field-btn:hover { background:rgba(74,222,128,0.18); }

    .mandi-row { border-bottom: 1px solid rgba(255,255,255,0.07); padding-bottom:12px; }
    .mandi-row:last-child { border-bottom:none; }

    .noise-bg::before {
      content:''; position:fixed; inset:-50%; width:200%; height:200%;
      background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
      opacity:0.02; pointer-events:none; z-index:0; animation:grain 0.5s steps(1) infinite;
    }

    .modal-overlay {
      position:fixed; inset:0; z-index:50;
      display:flex; align-items:center; justify-content:center;
      background:rgba(0,0,0,0.65); backdrop-filter:blur(6px); padding:16px;
    }
    .modal-box {
      background:#172d1f; border:1px solid rgba(74,222,128,0.22);
      border-radius:24px; width:100%; max-width:440px; padding:28px;
      box-shadow:0 24px 80px rgba(0,0,0,0.5);
    }
    .modal-input {
      width:100%; background:rgba(255,255,255,0.06);
      border:1px solid rgba(255,255,255,0.12); border-radius:12px;
      padding:10px 14px; font-size:13px; color:#e8f5e9;
      outline:none; transition:border 0.2s; box-sizing:border-box;
      font-family:'Sora',sans-serif;
    }
    .modal-input:focus { border-color:rgba(74,222,128,0.5); }
    .modal-input option { background:#172d1f; color:#e8f5e9; }
    .modal-label { font-size:11px; font-weight:600; color:rgba(200,240,210,0.6); margin-bottom:5px; display:block; letter-spacing:0.3px; }

    .badge { display:inline-flex; align-items:center; padding:3px 10px; border-radius:50px; font-size:11px; font-weight:600; border:1px solid; }
    .badge-green  { color:#86efac; background:rgba(74,222,128,0.12);  border-color:rgba(74,222,128,0.28); }
    .badge-amber  { color:#fcd34d; background:rgba(251,191,36,0.12); border-color:rgba(251,191,36,0.28); }
    .badge-blue   { color:#93c5fd; background:rgba(96,165,250,0.12); border-color:rgba(96,165,250,0.28); }
    .badge-red    { color:#fca5a5; background:rgba(248,113,113,0.12);border-color:rgba(248,113,113,0.28); }
    .badge-slate  { color:rgba(200,240,210,0.6); background:rgba(255,255,255,0.06); border-color:rgba(255,255,255,0.12); }
  `}</style>
);

const AddFieldModal = ({ onClose, onAdded, t }) => {
  const [form, setForm]   = useState({ name:"", village:"", district:"", state:"", cropType:"", areaInAcre:"", season:"" });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");
  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    if (!form.name.trim()) { setError(t("fieldRequired")); return; }
    try {
      setSaving(true);
      const res = await api.post("/api/fields", form);
      onAdded(res.data.field);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add field");
    } finally { setSaving(false); }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
          <h2 style={{ fontSize:16, fontWeight:700, color:"#e8f5e9", margin:0 }}>🌱 {t("addNewField")}</h2>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"rgba(200,240,210,0.4)", fontSize:22, cursor:"pointer", lineHeight:1 }}>×</button>
        </div>
        <form onSubmit={submit} style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div>
            <label className="modal-label">{t("fieldLabel")} Name <span style={{color:"#fca5a5"}}>*</span></label>
            <input name="name" value={form.name} onChange={handle} placeholder="e.g. North Field" className="modal-input" />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <div>
              <label className="modal-label">Village</label>
              <input name="village" value={form.village} onChange={handle} placeholder="Village name" className="modal-input" />
            </div>
            <div>
              <label className="modal-label">{t("district")}</label>
              <input name="district" value={form.district} onChange={handle} placeholder={t("districtPlaceholder")} className="modal-input" />
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <div>
              <label className="modal-label">{t("state")}</label>
              <input name="state" value={form.state} onChange={handle} placeholder={t("statePlaceholder")} className="modal-input" />
            </div>
            <div>
              <label className="modal-label">Crop Type</label>
              <input name="cropType" value={form.cropType} onChange={handle} placeholder="e.g. Wheat" className="modal-input" />
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <div>
              <label className="modal-label">Area (acres)</label>
              <input name="areaInAcre" type="number" value={form.areaInAcre} onChange={handle} placeholder="e.g. 2.5" className="modal-input" />
            </div>
            <div>
              <label className="modal-label">Season</label>
              <select name="season" value={form.season} onChange={handle} className="modal-input">
                <option value="">Select season</option>
                <option value="Rabi">Rabi (Winter)</option>
                <option value="Kharif">Kharif (Monsoon)</option>
                <option value="Zaid">Zaid (Summer)</option>
              </select>
            </div>
          </div>
          {error && <p style={{ fontSize:12, color:"#fca5a5", margin:0 }}>{error}</p>}
          <div style={{ display:"flex", gap:10, marginTop:4 }}>
            <button type="button" onClick={onClose} className="action-btn-secondary" style={{ flex:1 }}>Cancel</button>
            <button type="submit" disabled={saving} className="action-btn-primary" style={{ flex:1, opacity:saving?0.6:1 }}>
              {saving ? t("loading") : "Save Field"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ConfirmDeleteModal = ({ field, onConfirm, onCancel }) => (
  <div className="modal-overlay">
    <div className="modal-box" style={{ maxWidth:360, textAlign:"center" }}>
      <div style={{ fontSize:40, marginBottom:12 }}>🗑️</div>
      <h2 style={{ fontSize:16, fontWeight:700, color:"#e8f5e9", marginBottom:8 }}>Remove Field?</h2>
      <p style={{ fontSize:13, color:"rgba(200,240,210,0.55)", marginBottom:24, lineHeight:1.6 }}>
        <span style={{ color:"#c8f5d4", fontWeight:600 }}>"{field.name}"</span> aur usse judi saari scan history hamesha ke liye delete ho jayegi.
      </p>
      <div style={{ display:"flex", gap:10 }}>
        <button onClick={onCancel} className="action-btn-secondary" style={{ flex:1 }}>Cancel</button>
        <button onClick={onConfirm} style={{ flex:1, background:"linear-gradient(135deg,#ef4444,#dc2626)", color:"#fff", border:"none", borderRadius:50, padding:"11px 0", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Sora',sans-serif" }}>
          Yes, Remove
        </button>
      </div>
    </div>
  </div>
);

const ScanMiniSummary = ({ fieldId, jobs }) => {
  const fieldJobs = jobs.filter(j => j.field?._id === fieldId || j.field === fieldId);
  const completed = fieldJobs.filter(j => j.status === "completed");
  const pending   = fieldJobs.filter(j => j.status !== "completed");
  if (fieldJobs.length === 0) return null;
  return (
    <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:6 }}>
      {completed.length > 0 && <span className="badge badge-green">✅ {completed.length} Report Ready</span>}
      {pending.length   > 0 && <span className="badge badge-amber">🕐 {pending.length} Pending</span>}
    </div>
  );
};

const Home = () => {
  const { t }    = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth0();

  const [backendFields, setBackendFields] = useState([]);
  const [jobs, setJobs]                   = useState([]);
  const [mandiPrices, setMandiPrices]     = useState([]);
  const [mandiUpdated, setMandiUpdated]   = useState(null);
  const [loading, setLoading]             = useState(true);
  const [mandiLoading, setMandiLoading]   = useState(true);
  const [latestScanFieldId, setLatestScanFieldId] = useState(null);
  const [showAddModal, setShowAddModal]   = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState(null);
  const [deletingId, setDeletingId]       = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fieldsRes, jobsRes] = await Promise.all([
          api.get("/api/fields/my"),
          api.get("/api/drone-jobs/my"),
        ]);
        const fetchedJobs = jobsRes.data.jobs || [];
        setBackendFields(fieldsRes.data.fields || []);
        setJobs(fetchedJobs);
        const latestCompleted = fetchedJobs.find(j => j.status === "completed");
        if (latestCompleted?.field?._id) setLatestScanFieldId(latestCompleted.field._id);
      } catch (err) { console.error("Data fetch error:", err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchMandi = async () => {
      try {
        const res = await api.get("/api/mandi/prices");
        setMandiPrices(res.data.prices || []);
        setMandiUpdated(res.data.lastUpdated);
      } catch (err) { console.error("Mandi fetch error:", err); }
      finally { setMandiLoading(false); }
    };
    fetchMandi();
  }, []);

  const calcYieldAndIncome = () => {
    if (backendFields.length === 0 || mandiPrices.length === 0) return { avgYield:null, totalIncome:null };
    let totalWeightedYield=0, totalArea=0, totalIncome=0;
    backendFields.forEach(field => {
      const area      = parseFloat(field.areaInAcre) || 0;
      const cropKey   = (field.cropType || "").toLowerCase().trim();
      const priceData = mandiPrices.find(p => p.crop === cropKey || p.nameKey === cropKey);
      const yieldRate = priceData?.yieldPerAcre || 15;
      const price     = priceData?.todayPrice    || 2000;
      totalWeightedYield += yieldRate * area;
      totalArea          += area;
      totalIncome        += yieldRate * area * price;
    });
    return { avgYield: totalArea > 0 ? (totalWeightedYield/totalArea).toFixed(1) : null, totalIncome: Math.round(totalIncome) };
  };

  const formatIncome = amt => {
    if (!amt) return "—";
    if (amt >= 10000000) return `₹${(amt/10000000).toFixed(1)}Cr`;
    if (amt >= 100000)   return `₹${(amt/100000).toFixed(1)}L`;
    if (amt >= 1000)     return `₹${(amt/1000).toFixed(1)}K`;
    return `₹${amt}`;
  };

  const formatTime = iso => {
    if (!iso) return "";
    return new Date(iso).toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" });
  };

  const { avgYield, totalIncome } = calcYieldAndIncome();

  const getLastJob = fieldId => {
    const fieldJobs = jobs.filter(j => j.field?._id === fieldId || j.field === fieldId);
    return fieldJobs.find(j => j.status === "completed") || fieldJobs[0] || null;
  };

  const getStatusBadge = status => {
    if (status === "completed") return "badge-green";
    if (status === "requested") return "badge-amber";
    if (status === "scheduled") return "badge-blue";
    return "badge-slate";
  };

  const getStatusLabel = status => {
    if (status === "completed") return t("completed");
    if (status === "requested") return t("requested");
    if (status === "scheduled") return "Scheduled";
    return t("unknownStatus");
  };

  const atRiskCount = backendFields.filter(f => {
    const a = (getLastJob(f._id)?.analysis || "").toLowerCase();
    return a.includes("stress") || a.includes("pest") || a.includes("disease");
  }).length;

  const handleFieldAdded  = newField => setBackendFields(prev => [newField, ...prev]);

  const handleDeleteConfirm = async () => {
    if (!fieldToDelete) return;
    setDeletingId(fieldToDelete._id);
    try {
      await api.delete(`/api/fields/${fieldToDelete._id}`);
      setBackendFields(prev => prev.filter(f => f._id !== fieldToDelete._id));
      setJobs(prev => prev.filter(j => j.field?._id !== fieldToDelete._id && j.field !== fieldToDelete._id));
    } catch (err) {
      console.error("Delete field error:", err);
      alert("Could not remove field. Please try again.");
    } finally { setDeletingId(null); setFieldToDelete(null); }
  };

  const getCropHealthBadge = job => {
    if (!job?.cropHealthStatus) return null;
    const map = {
      healthy:  { label:"🟢 Healthy",  cls:"badge-green" },
      stressed: { label:"🟡 Stressed", cls:"badge-amber" },
      diseased: { label:"🔴 Diseased", cls:"badge-red" },
    };
    const info = map[job.cropHealthStatus];
    if (!info) return null;
    return <span className={`badge ${info.cls}`}>{info.label}</span>;
  };

  const summaryCards = [
    { label: t("totalFields"),    value: loading ? "—" : backendFields.length, icon:"🌾", accent:"#86efac" },
    { label: t("atRiskFields"),   value: loading ? "—" : atRiskCount,           icon:"⚠️", accent:"#fca5a5" },
    { label: t("avgYield"),       value: loading ? "—" : (avgYield ?? "—"),     icon:"📊", accent:"#93c5fd", sub: avgYield ? "q/acre (est.)" : null },
    { label: t("expectedIncome"), value: loading ? "—" : formatIncome(totalIncome), icon:"💰", accent:"#fcd34d", sub: totalIncome ? "estimated total" : null },
  ];

  return (
    <div className="home-root noise-bg" style={{ position:"relative", minHeight:"100vh" }}>
      <GlobalStyles />

      {/* Background mesh */}
      <div style={{
        position:"fixed", inset:0, zIndex:0, pointerEvents:"none",
        background:"radial-gradient(ellipse 70% 50% at 10% 0%, rgba(74,222,128,0.08) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 90% 90%, rgba(52,211,153,0.06) 0%, transparent 60%)"
      }} />

      <div style={{ position:"relative", zIndex:1, padding:"24px 20px 48px", maxWidth:1100, margin:"0 auto" }}>

        {showAddModal  && <AddFieldModal t={t} onClose={() => setShowAddModal(false)} onAdded={handleFieldAdded} />}
        {fieldToDelete && <ConfirmDeleteModal field={fieldToDelete} onConfirm={handleDeleteConfirm} onCancel={() => setFieldToDelete(null)} />}

        {/* Greeting */}
        <div className="fade-up" style={{ display:"flex", flexWrap:"wrap", justifyContent:"space-between", alignItems:"flex-start", gap:16, marginBottom:28 }}>
          <div>
            <h1 style={{ fontSize:"clamp(26px,4vw,38px)", fontWeight:800, margin:0, letterSpacing:"-0.5px", color:"#f0fdf4" }}>
              Namaste, <span className="shimmer-name">{user?.name ? user.name.split(" ")[0] : ""}</span> 🙏
            </h1>
            <p style={{ fontSize:13, color:"rgba(200,240,210,0.7)", marginTop:4, fontWeight:400 }}>{t("todaySnapshot")}</p>
          </div>
          <div style={{
            background:"rgba(74,222,128,0.1)", border:"1px solid rgba(74,222,128,0.25)",
            borderRadius:50, padding:"10px 18px", fontSize:12, color:"#a7f3c0", fontWeight:600,
            display:"flex", alignItems:"center", gap:8, whiteSpace:"nowrap",
          }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:"#4ade80", display:"inline-block", animation:"pulse-dot 2s infinite" }} />
            {t("droneUpdated")}
          </div>
        </div>

        {/* Next Scan Card */}
        {!loading && backendFields.length > 0 && (
          <div className="fade-up-1" style={{ marginBottom:24 }}>
            <NextScanCard fields={backendFields} jobs={jobs} />
          </div>
        )}

        {/* Summary Cards */}
        <div className="fade-up-2" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:14, marginBottom:28 }}>
          {summaryCards.map((c, i) => (
            <div key={i} className="stat-card">
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                <span style={{ fontSize:11, color:"rgba(200,240,210,0.8)", fontWeight:600, letterSpacing:"0.3px", textTransform:"uppercase" }}>{c.label}</span>
                <span style={{ fontSize:20 }}>{c.icon}</span>
              </div>
              <p style={{ fontSize:32, fontWeight:800, color:c.accent, margin:0, letterSpacing:"-1px", lineHeight:1 }}>{c.value}</p>
              {c.sub && <p style={{ fontSize:10, color:"rgba(200,240,210,0.6)", marginTop:5, fontWeight:500 }}>{c.sub}</p>}
            </div>
          ))}
        </div>

        {/* ✅ Action Buttons — marginBottom 36px for breathing room */}
        <div className="fade-up-3" style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:36 }}>
          <button onClick={() => navigate("/request-scan")} className="action-btn-primary">
            🚁 {t("requestScanButton")}
          </button>
          <button onClick={() => latestScanFieldId ? navigate(`/fields/${latestScanFieldId}`) : alert(t("noScans"))} className="action-btn-secondary">
            📋 {t("viewLastScanButton")}
          </button>
        </div>

        {/* ✅ Main Grid — marginTop 8px extra gap from buttons */}
        <div className="fade-up-4" style={{ display:"grid", gridTemplateColumns:"1fr", gap:20, marginTop:8 }}>
          <div style={{ display:"grid", gridTemplateColumns:"minmax(0,2fr) minmax(0,1fr)", gap:20, alignItems:"start" }}>

            {/* My Fields */}
            <div className="glass-panel" style={{ padding:22 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                <h2 style={{ fontSize:15, fontWeight:700, color:"#e8f5e9", margin:0 }}>{t("myFields")}</h2>
                <button onClick={() => setShowAddModal(true)} className="add-field-btn">+ {t("addNewField")}</button>
              </div>
              <p style={{ fontSize:11, color:"rgba(200,240,210,0.65)", marginBottom:18, fontWeight:400 }}>{t("myFieldsHelp")}</p>

              {loading ? (
                <p style={{ fontSize:12, color:"rgba(200,240,210,0.55)", textAlign:"center", padding:"24px 0" }}>{t("loading")}</p>
              ) : backendFields.length === 0 ? (
                <div style={{ textAlign:"center", padding:"32px 0" }}>
                  <p style={{ fontSize:36, marginBottom:10 }}>🌾</p>
                  <p style={{ fontSize:13, color:"rgba(200,240,210,0.6)", marginBottom:12 }}>{t("noFields")}</p>
                  <button onClick={() => setShowAddModal(true)} style={{ fontSize:13, color:"#86efac", background:"none", border:"none", cursor:"pointer", fontWeight:700, fontFamily:"'Sora',sans-serif" }}>
                    + Add your first field
                  </button>
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {backendFields.map(f => {
                    const lastJob    = getLastJob(f._id);
                    const isDeleting = deletingId === f._id;
                    return (
                      <div key={f._id} className={`field-card ${isDeleting ? "deleting" : ""}`}>
                        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:10 }}>
                          <div style={{ flex:1, minWidth:0 }} onClick={() => navigate(`/fields/${f._id}`)}>
                            <p style={{ fontWeight:700, fontSize:14, color:"#f0fdf4", margin:0 }}>{f.name}</p>
                            <p style={{ fontSize:11, color:"rgba(200,240,210,0.7)", marginTop:2 }}>
                              {[f.village, f.district, f.state].filter(Boolean).join(", ")}
                            </p>
                          </div>
                          <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
                            <span className={`badge ${lastJob ? getStatusBadge(lastJob.status) : "badge-red"}`}>
                              {lastJob ? getStatusLabel(lastJob.status) : t("notScanned")}
                            </span>
                            <button onClick={e => { e.stopPropagation(); setFieldToDelete(f); }}
                              style={{ background:"none", border:"none", color:"rgba(200,240,210,0.25)", fontSize:18, cursor:"pointer", lineHeight:1, padding:"0 4px", transition:"color 0.2s" }}
                              onMouseEnter={e => e.currentTarget.style.color="#fca5a5"}
                              onMouseLeave={e => e.currentTarget.style.color="rgba(200,240,210,0.25)"}
                            >×</button>
                          </div>
                        </div>
                        <div onClick={() => navigate(`/fields/${f._id}`)}>
                          {f.cropType && (
                            <p style={{ fontSize:11, color:"rgba(200,240,210,0.65)", marginTop:6 }}>
                              {t("fieldCrop")} {f.cropType}
                            </p>
                          )}
                          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:6 }}>
                            {lastJob && getCropHealthBadge(lastJob)}
                            {lastJob?.fraudRiskScore != null && (
                              <span className={`badge ${lastJob.fraudRiskScore > 0.7 ? "badge-red" : lastJob.fraudRiskScore > 0.4 ? "badge-amber" : "badge-slate"}`}>
                                🛡️ Fraud: {lastJob.fraudRiskScore > 0.7 ? "HIGH" : lastJob.fraudRiskScore > 0.4 ? "MED" : "LOW"}
                              </span>
                            )}
                          </div>
                          {lastJob ? (
                            <p style={{ fontSize:10, color:"rgba(200,240,210,0.55)", marginTop:6 }}>
                              {t("lastScanLabel")} {new Date(lastJob.createdAt).toLocaleDateString()}
                            </p>
                          ) : (
                            <p style={{ fontSize:10, color:"rgba(200,240,210,0.45)", marginTop:6 }}>{t("notScanned")}</p>
                          )}
                          <ScanMiniSummary fieldId={f._id} jobs={jobs} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Live Mandi */}
            <div className="glass-panel" style={{ padding:22 }}>
              <h2 style={{ fontSize:15, fontWeight:700, color:"#e8f5e9", margin:"0 0 4px" }}>{t("todayMandi")}</h2>
              <p style={{ fontSize:11, color:"rgba(200,240,210,0.65)", marginBottom:4, fontWeight:400 }}>{t("mandiDesc")}</p>
              {mandiUpdated && (
                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:16 }}>
                  <span style={{ width:6, height:6, borderRadius:"50%", background:"#4ade80", display:"inline-block", animation:"pulse-dot 2s infinite" }} />
                  <span style={{ fontSize:10, color:"#86efac", fontWeight:600 }}>Live · Updated {formatTime(mandiUpdated)}</span>
                </div>
              )}
              {mandiLoading ? (
                <p style={{ fontSize:12, color:"rgba(200,240,210,0.55)", textAlign:"center", padding:"24px 0" }}>Loading prices...</p>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:12, maxHeight:380, overflowY:"auto" }}>
                  {mandiPrices.map(p => {
                    const trendLabel = p.trend === "up" ? t("sellNow") : p.trend === "down" ? t("priceFalling") : t("hold1Week");
                    const trendColor = p.trend === "up" ? "#86efac" : p.trend === "down" ? "#fca5a5" : "#fcd34d";
                    return (
                      <div key={p.crop} className="mandi-row" style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <div>
                          <p style={{ fontSize:13, fontWeight:600, color:"#e8f5e9", margin:0, textTransform:"capitalize" }}>{p.displayName || p.crop}</p>
                          <p style={{ fontSize:11, color:"rgba(200,240,210,0.65)", margin:"2px 0 0" }}>₹{p.todayPrice.toLocaleString()} / {p.unit}</p>
                        </div>
                        <span style={{ fontSize:11, fontWeight:700, color:trendColor }}>{trendLabel}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;