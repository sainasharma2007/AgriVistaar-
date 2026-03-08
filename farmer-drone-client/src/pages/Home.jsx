// src/pages/Home.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useLanguage } from "../context/LanguageContext";
import api from "../api";
import NextScanCard from "../components/NextScanCard";

// ── Add Field Modal ──────────────────────────────────────────
const AddFieldModal = ({ onClose, onAdded, t }) => {
  const [form, setForm] = useState({
    name: "", village: "", district: "", state: "",
    cropType: "", areaInAcre: "", season: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");

  const handle = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError(t("fieldRequired")); return; }
    try {
      setSaving(true);
      // ✅ No manual token needed - api.js handles it via setAuthToken in App.jsx
      const res = await api.post("/api/fields", form);
      onAdded(res.data.field);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add field");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">➕ {t("addNewField")}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">×</button>
        </div>
        <form onSubmit={submit} className="space-y-3 text-sm">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {t("fieldLabel")} Name <span className="text-red-500">*</span>
            </label>
            <input name="name" value={form.name} onChange={handle} placeholder="e.g. North Field"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Village</label>
              <input name="village" value={form.village} onChange={handle} placeholder="Village name"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">{t("district")}</label>
              <input name="district" value={form.district} onChange={handle} placeholder={t("districtPlaceholder")}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">{t("state")}</label>
              <input name="state" value={form.state} onChange={handle} placeholder={t("statePlaceholder")}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Crop Type</label>
              <input name="cropType" value={form.cropType} onChange={handle} placeholder="e.g. Wheat"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Area (acres)</label>
              <input name="areaInAcre" type="number" value={form.areaInAcre} onChange={handle} placeholder="e.g. 2.5"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Season</label>
              <select name="season" value={form.season} onChange={handle}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400">
                <option value="">Select season</option>
                <option value="Rabi">Rabi (Winter)</option>
                <option value="Kharif">Kharif (Monsoon)</option>
                <option value="Zaid">Zaid (Summer)</option>
              </select>
            </div>
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-emerald-600 disabled:bg-gray-400 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors">
              {saving ? t("loading") : "Save Field"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Confirm Delete Modal ─────────────────────────────────────
const ConfirmDeleteModal = ({ field, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4 text-center">
      <div className="text-4xl">🗑️</div>
      <h2 className="text-lg font-bold text-gray-900">Remove Field?</h2>
      <p className="text-sm text-gray-500">
        <span className="font-semibold text-gray-800">"{field.name}"</span> aur usse judi saari scan history hamesha ke liye delete ho jayegi.
      </p>
      <div className="flex gap-3">
        <button onClick={onCancel}
          className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">
          Cancel
        </button>
        <button onClick={onConfirm}
          className="flex-1 bg-red-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors">
          Yes, Remove
        </button>
      </div>
    </div>
  </div>
);

// ── Scan Mini Summary ────────────────────────────────────────
const ScanMiniSummary = ({ fieldId, jobs }) => {
  const fieldJobs = jobs.filter((j) => j.field?._id === fieldId || j.field === fieldId);
  const completed = fieldJobs.filter((j) => j.status === "completed");
  const pending   = fieldJobs.filter((j) => j.status !== "completed");
  if (fieldJobs.length === 0) return null;
  return (
    <div className="flex gap-2 mt-1.5 flex-wrap">
      {completed.length > 0 && (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
          ✅ {completed.length} Report Ready
        </span>
      )}
      {pending.length > 0 && (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
          🕐 {pending.length} Pending
        </span>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════
const Home = () => {
  const { t }    = useLanguage();
  const navigate = useNavigate();

  // ✅ Auth0 - replaces localStorage.getItem("currentUser")
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

  // ✅ REMOVED: getHeaders() function - no longer needed
  // Token is automatically attached by setAuthToken in App.jsx

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ No headers needed - axios interceptor handles token
        const [fieldsRes, jobsRes] = await Promise.all([
          api.get("/api/fields/my"),
          api.get("/api/drone-jobs/my"),
        ]);
        const fetchedJobs = jobsRes.data.jobs || [];
        setBackendFields(fieldsRes.data.fields || []);
        setJobs(fetchedJobs);
        const latestCompleted = fetchedJobs.find((j) => j.status === "completed");
        if (latestCompleted?.field?._id) setLatestScanFieldId(latestCompleted.field._id);
      } catch (err) {
        console.error("Data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch live mandi prices from backend
  useEffect(() => {
    const fetchMandi = async () => {
      try {
        const res = await api.get("/api/mandi/prices");
        setMandiPrices(res.data.prices || []);
        setMandiUpdated(res.data.lastUpdated);
      } catch (err) {
        console.error("Mandi fetch error:", err);
      } finally {
        setMandiLoading(false);
      }
    };
    fetchMandi();
  }, []);

  // Real yield + income from live mandi prices
  const calcYieldAndIncome = () => {
    if (backendFields.length === 0 || mandiPrices.length === 0)
      return { avgYield: null, totalIncome: null };
    let totalWeightedYield = 0, totalArea = 0, totalIncome = 0;
    backendFields.forEach((field) => {
      const area      = parseFloat(field.areaInAcre) || 0;
      const cropKey   = (field.cropType || "").toLowerCase().trim();
      const priceData = mandiPrices.find((p) => p.crop === cropKey || p.nameKey === cropKey);
      const yieldRate = priceData?.yieldPerAcre || 15;
      const price     = priceData?.todayPrice    || 2000;
      totalWeightedYield += yieldRate * area;
      totalArea          += area;
      totalIncome        += yieldRate * area * price;
    });
    return {
      avgYield:    totalArea > 0 ? (totalWeightedYield / totalArea).toFixed(1) : null,
      totalIncome: Math.round(totalIncome),
    };
  };

  const formatIncome = (amt) => {
    if (!amt) return "—";
    if (amt >= 10000000) return `₹${(amt / 10000000).toFixed(1)}Cr`;
    if (amt >= 100000)   return `₹${(amt / 100000).toFixed(1)}L`;
    if (amt >= 1000)     return `₹${(amt / 1000).toFixed(1)}K`;
    return `₹${amt}`;
  };

  const formatTime = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  const { avgYield, totalIncome } = calcYieldAndIncome();

  const getLastJob = (fieldId) =>
    jobs.filter((j) => j.field?._id === fieldId || j.field === fieldId)[0] || null;

  const getStatusBadgeClasses = (status) => {
    if (status === "completed") return "bg-emerald-100 text-emerald-800 border-emerald-300";
    if (status === "requested") return "bg-amber-100 text-amber-800 border-amber-300";
    if (status === "scheduled") return "bg-blue-100 text-blue-800 border-blue-300";
    return "bg-slate-100 text-slate-700 border-slate-300";
  };

  const getStatusLabel = (status) => {
    if (status === "completed") return t("completed");
    if (status === "requested") return t("requested");
    if (status === "scheduled") return "Scheduled";
    return t("unknownStatus");
  };

  const atRiskCount = backendFields.filter((f) => {
    const a = (getLastJob(f._id)?.analysis || "").toLowerCase();
    return a.includes("stress") || a.includes("pest") || a.includes("disease");
  }).length;

  const handleFieldAdded = (newField) => setBackendFields((prev) => [newField, ...prev]);

  const handleDeleteConfirm = async () => {
    if (!fieldToDelete) return;
    setDeletingId(fieldToDelete._id);
    try {
      // ✅ No headers needed - axios interceptor handles token
      await api.delete(`/api/fields/${fieldToDelete._id}`);
      setBackendFields((prev) => prev.filter((f) => f._id !== fieldToDelete._id));
      setJobs((prev) => prev.filter(
        (j) => j.field?._id !== fieldToDelete._id && j.field !== fieldToDelete._id
      ));
    } catch (err) {
      console.error("Delete field error:", err);
      alert("Could not remove field. Please try again.");
    } finally {
      setDeletingId(null);
      setFieldToDelete(null);
    }
  };

  const getCropHealthBadge = (job) => {
    if (!job?.cropHealthStatus) return null;
    const map = {
      healthy:  { label: "🟢 Healthy",  cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
      stressed: { label: "🟡 Stressed", cls: "text-yellow-700 bg-yellow-50 border-yellow-200" },
      diseased: { label: "🔴 Diseased", cls: "text-red-700 bg-red-50 border-red-200" },
    };
    const info = map[job.cropHealthStatus];
    if (!info) return null;
    return (
      <span className={`inline-flex items-center text-[11px] font-medium border px-2 py-0.5 rounded-full w-fit ${info.cls}`}>
        {info.label}
      </span>
    );
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">

      {showAddModal && (
        <AddFieldModal t={t} onClose={() => setShowAddModal(false)} onAdded={handleFieldAdded} />
      )}
      {fieldToDelete && (
        <ConfirmDeleteModal field={fieldToDelete} onConfirm={handleDeleteConfirm} onCancel={() => setFieldToDelete(null)} />
      )}

      {/* ✅ Greeting - now shows real Auth0 user name */}
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
            {t("welcome")}{user?.name ? `, ${user.name.split(" ")[0]}` : ""} 👋
          </h1>
          <p className="text-sm text-slate-700">{t("todaySnapshot")}</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-xl text-xs md:text-sm text-emerald-800">
          {t("droneUpdated")}
        </div>
      </div>

      {!loading && backendFields.length > 0 && (
        <NextScanCard fields={backendFields} jobs={jobs} />
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-emerald-100 border border-emerald-200 p-4 rounded-xl">
          <p className="text-xs text-emerald-800">{t("totalFields")}</p>
          <p className="text-2xl font-bold text-emerald-900">{loading ? "—" : backendFields.length}</p>
        </div>
        <div className="bg-red-100 border border-red-200 p-4 rounded-xl">
          <p className="text-xs text-red-800">{t("atRiskFields")}</p>
          <p className="text-2xl font-bold text-red-900">{loading ? "—" : atRiskCount}</p>
        </div>
        <div className="bg-blue-100 border border-blue-200 p-4 rounded-xl">
          <p className="text-xs text-blue-800">{t("avgYield")}</p>
          <p className="text-2xl font-bold text-blue-900">{loading ? "—" : avgYield ?? "—"}</p>
          {!loading && avgYield && <p className="text-[10px] text-blue-600 mt-0.5">q/acre (est.)</p>}
        </div>
        <div className="bg-yellow-100 border border-yellow-200 p-4 rounded-xl">
          <p className="text-xs text-yellow-800">{t("expectedIncome")}</p>
          <p className="text-2xl font-bold text-yellow-900">{loading ? "—" : formatIncome(totalIncome)}</p>
          {!loading && totalIncome && <p className="text-[10px] text-yellow-600 mt-0.5">estimated total</p>}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button onClick={() => navigate("/request-scan")}
          className="px-4 py-2 rounded-full bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors">
          {t("requestScanButton")}
        </button>
        <button onClick={() => latestScanFieldId ? navigate(`/fields/${latestScanFieldId}`) : alert(t("noScans"))}
          className="px-4 py-2 rounded-full bg-white border border-emerald-600 text-emerald-700 text-sm font-semibold hover:bg-emerald-50 transition-colors">
          {t("viewLastScanButton")}
        </button>
      </div>
      <p className="text-xs text-slate-600 -mt-3">{t("criticalScanTip")}</p>

      {/* Main Grid */}
      <div className="grid md:grid-cols-3 gap-5">

        {/* My Fields */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <div className="flex justify-between items-center mb-1">
              <h2 className="text-lg font-semibold">{t("myFields")}</h2>
              <button onClick={() => setShowAddModal(true)}
                className="text-xs px-3 py-1.5 rounded-full border border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-medium transition-colors">
                + {t("addNewField")}
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-3">{t("myFieldsHelp")}</p>

            {loading ? (
              <p className="text-xs text-gray-400 py-4 text-center">{t("loading")}</p>
            ) : backendFields.length === 0 ? (
              <div className="text-center py-8 space-y-3">
                <p className="text-3xl">🌾</p>
                <p className="text-sm text-gray-500">{t("noFields")}</p>
                <button onClick={() => setShowAddModal(true)}
                  className="text-sm text-emerald-700 font-semibold hover:underline">
                  + Add your first field
                </button>
              </div>
            ) : (
              <ul className="space-y-3">
                {backendFields.map((f) => {
                  const lastJob    = getLastJob(f._id);
                  const isDeleting = deletingId === f._id;
                  return (
                    <li key={f._id}
                      className={`border border-emerald-100 rounded-xl px-3 py-2.5 transition flex flex-col gap-1 ${
                        isDeleting ? "opacity-50 pointer-events-none" : "hover:bg-emerald-50/70"
                      }`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 cursor-pointer min-w-0" onClick={() => navigate(`/fields/${f._id}`)}>
                          <p className="font-semibold text-sm text-gray-900">{f.name}</p>
                          <p className="text-xs text-gray-400">
                            {[f.village, f.district, f.state].filter(Boolean).join(", ")}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={
                            "inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-medium " +
                            (lastJob ? getStatusBadgeClasses(lastJob.status) : "bg-red-50 text-red-600 border-red-200")
                          }>
                            {lastJob ? getStatusLabel(lastJob.status) : t("notScanned")}
                          </span>
                          <button onClick={(e) => { e.stopPropagation(); setFieldToDelete(f); }}
                            className="text-gray-300 hover:text-red-500 transition-colors text-lg leading-none px-1">×</button>
                        </div>
                      </div>

                      {f.cropType && (
                        <p className="text-xs text-gray-500 cursor-pointer" onClick={() => navigate(`/fields/${f._id}`)}>
                          {t("fieldCrop")} {f.cropType}
                        </p>
                      )}

                      {lastJob && getCropHealthBadge(lastJob)}

                      {lastJob?.fraudRiskScore != null && (
                        <span className={`inline-flex items-center text-[11px] font-medium border px-2 py-0.5 rounded-full w-fit ${
                          lastJob.fraudRiskScore > 0.7 ? "text-red-700 bg-red-50 border-red-200"
                          : lastJob.fraudRiskScore > 0.4 ? "text-yellow-700 bg-yellow-50 border-yellow-200"
                          : "text-slate-600 bg-slate-50 border-slate-200"
                        }`}>
                          🛡️ Fraud Risk: {lastJob.fraudRiskScore > 0.7 ? "HIGH" : lastJob.fraudRiskScore > 0.4 ? "MEDIUM" : "LOW"}
                        </span>
                      )}

                      {lastJob ? (
                        <p className="text-[11px] text-gray-400 cursor-pointer" onClick={() => navigate(`/fields/${f._id}`)}>
                          {t("lastScanLabel")} {new Date(lastJob.createdAt).toLocaleDateString()}
                        </p>
                      ) : (
                        <p className="text-[11px] text-gray-400">{t("notScanned")}</p>
                      )}

                      <div className="cursor-pointer" onClick={() => navigate(`/fields/${f._id}`)}>
                        <ScanMiniSummary fieldId={f._id} jobs={jobs} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Live Mandi Signal */}
        <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
          <div>
            <h2 className="text-lg font-semibold">{t("todayMandi")}</h2>
            <p className="text-xs text-slate-500">{t("mandiDesc")}</p>
            {mandiUpdated && (
              <p className="text-[10px] text-emerald-600 mt-0.5 font-medium">
                🟢 Live · Updated {formatTime(mandiUpdated)}
              </p>
            )}
          </div>
          {mandiLoading ? (
            <p className="text-xs text-gray-400 text-center py-4">Loading prices...</p>
          ) : (
            <div className="space-y-2 text-sm max-h-80 overflow-y-auto pr-1">
              {mandiPrices.map((p) => {
                const trendLabel = p.trend === "up" ? t("sellNow") : p.trend === "down" ? t("priceFalling") : t("hold1Week");
                const trendColor = p.trend === "up" ? "text-green-700" : p.trend === "down" ? "text-red-700" : "text-yellow-700";
                return (
                  <div key={p.crop} className="flex justify-between items-center border-b border-gray-50 pb-1.5">
                    <div className="flex flex-col">
                      <span className="font-medium capitalize">{p.displayName || p.crop}</span>
                      <span className="text-[11px] text-slate-500">₹{p.todayPrice.toLocaleString()} / {p.unit}</span>
                    </div>
                    <span className={`${trendColor} font-semibold text-xs text-right`}>{trendLabel}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Home;