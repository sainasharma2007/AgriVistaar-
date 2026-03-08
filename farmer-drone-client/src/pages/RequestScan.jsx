// // // src/pages/RequestScan.jsx
// // import { useState, useEffect } from "react";
// // import { useNavigate, useSearchParams } from "react-router-dom";
// // import { useLanguage } from "../context/LanguageContext";
// // import axios from "axios";

// // // BUG FIX 1: api object banao axios se — pehle api undefined tha
// // const api = axios.create({
// //   baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
// // });

// // const RequestScan = () => {
// //   const { t } = useLanguage();
// //   const navigate = useNavigate();
// //   const [params] = useSearchParams();

// //   const fieldIdFromUrl = params.get("field") || "";

// //   const [fieldName, setFieldName] = useState("");
// //   const [stage, setStage] = useState("");
// //   const [date, setDate] = useState("");
// //   const [notes, setNotes] = useState("");
// //   const [errors, setErrors] = useState({});
// //   const [submitting, setSubmitting] = useState(false);
// //   const [success, setSuccess] = useState(false);

// //   // Field ID se naam fetch karo dikhane ke liye
// //   useEffect(() => {
// //     if (!fieldIdFromUrl) return;
// //     const fetchField = async () => {
// //       try {
// //         const token = localStorage.getItem("authToken");
// //         const headers = token ? { Authorization: `Bearer ${token}` } : {};
// //         const res = await api.get(`/api/fields/${fieldIdFromUrl}`, { headers });
// //         setFieldName(res.data.field?.name || fieldIdFromUrl);
// //       } catch {
// //         // BUG FIX 2: Field fetch fail hone pe sirf ID dikhao, koi error mat dikhao
// //         setFieldName(fieldIdFromUrl);
// //       }
// //     };
// //     fetchField();
// //   }, [fieldIdFromUrl]);

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     const newErrors = {};
// //     if (!fieldIdFromUrl) newErrors.field = t("fieldRequired");
// //     if (!stage) newErrors.stage = t("stageRequired");
// //     if (!date) newErrors.date = t("dateRequired");

// //     setErrors(newErrors);
// //     if (Object.keys(newErrors).length > 0) return;

// //     try {
// //       setSubmitting(true);
// //       const token = localStorage.getItem("authToken");
// //       const headers = token ? { Authorization: `Bearer ${token}` } : {};

// //       await api.post(
// //         "/api/drone-jobs",
// //         { fieldId: fieldIdFromUrl, stage, preferredDate: date, notes },
// //         { headers }
// //       );

// //       setSuccess(true);
// //       setTimeout(() => navigate("/home"), 2000);
// //     } catch (err) {
// //       console.error("RequestScan submit error:", err);
// //       // BUG FIX 3: Sahi error message — "loadError" ki jagah "scanSubmitError" use karo
// //       // Agar backend down hai toh alag message, warna generic
// //       const msg =
// //         err?.response?.status === 401
// //           ? t("loginFailed")
// //           : t("scanSubmitError") || "Scan request failed. Please try again.";
// //       setErrors({ submit: msg });
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   };

// //   if (success) {
// //     return (
// //       <div className="p-4 max-w-md mx-auto">
// //         <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-2">
// //           <p className="text-3xl">✅</p>
// //           <p className="text-sm font-medium text-emerald-800">
// //             {t("scanRequestSuccess")}
// //           </p>
// //           <p className="text-xs text-slate-400">{t("loading")}</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="p-4 max-w-md mx-auto bg-white rounded-2xl shadow-sm">

// //       <button
// //         onClick={() => navigate(-1)}
// //         className="text-sm text-slate-500 hover:text-slate-800 mb-3 block"
// //       >
// //         ‹ {t("dashboard")}
// //       </button>

// //       <h1 className="text-lg font-semibold mb-4">{t("requestScanTitle")}</h1>

// //       <form onSubmit={handleSubmit} className="space-y-3 text-sm">

// //         <div>
// //           <label className="block mb-1">{t("fieldLabel")}</label>
// //           {fieldIdFromUrl ? (
// //             <div className="w-full border rounded px-3 py-2 text-sm bg-slate-50 text-slate-700">
// //               {fieldName || "..."}
// //             </div>
// //           ) : (
// //             <input
// //               type="text"
// //               className="w-full border rounded px-3 py-2 text-sm"
// //               value={fieldName}
// //               onChange={(e) => {
// //                 setFieldName(e.target.value);
// //                 setErrors((prev) => ({ ...prev, field: "" }));
// //               }}
// //               placeholder={t("selectFieldPlaceholder")}
// //             />
// //           )}
// //           {errors.field && (
// //             <p className="text-xs text-red-600 mt-0.5">{errors.field}</p>
// //           )}
// //         </div>

// //         <div>
// //           <label className="block mb-1">{t("stageLabel")}</label>
// //           <select
// //             value={stage}
// //             onChange={(e) => {
// //               setStage(e.target.value);
// //               setErrors((prev) => ({ ...prev, stage: "" }));
// //             }}
// //             className="w-full border rounded px-3 py-2 text-sm"
// //           >
// //             <option value="">{t("selectStagePlaceholder")}</option>
// //             <option value="early">{t("stageEarly")}</option>
// //             <option value="mid">{t("stageMid")}</option>
// //             <option value="pre-harvest">{t("stagePreHarvest")}</option>
// //           </select>
// //           {errors.stage && (
// //             <p className="text-xs text-red-600 mt-0.5">{errors.stage}</p>
// //           )}
// //         </div>

// //         <div>
// //           <label className="block mb-1">{t("dateLabel")}</label>
// //           <input
// //             type="date"
// //             className="w-full border rounded px-3 py-2 text-sm"
// //             value={date}
// //             onChange={(e) => {
// //               setDate(e.target.value);
// //               setErrors((prev) => ({ ...prev, date: "" }));
// //             }}
// //           />
// //           {errors.date && (
// //             <p className="text-xs text-red-600 mt-0.5">{errors.date}</p>
// //           )}
// //         </div>

// //         <div>
// //           <label className="block mb-1">{t("notesLabel")}</label>
// //           <textarea
// //             className="w-full border rounded px-3 py-2 text-sm"
// //             rows={3}
// //             value={notes}
// //             onChange={(e) => setNotes(e.target.value)}
// //             placeholder={t("notesPlaceholder")}
// //           />
// //         </div>

// //         {errors.submit && (
// //           <p className="text-xs text-red-600">{errors.submit}</p>
// //         )}

// //         <button
// //           type="submit"
// //           disabled={submitting}
// //           className="w-full bg-emerald-600 disabled:bg-gray-400 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors"
// //         >
// //           {submitting ? t("loading") : t("submitScanRequest")}
// //         </button>
// //       </form>
// //     </div>
// //   );
// // };

// // export default RequestScan;








// // src/pages/RequestScan.jsx
// import { useState, useEffect } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { useLanguage } from "../context/LanguageContext";
// import axios from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
// });

// const RequestScan = () => {
//   const { t } = useLanguage();
//   const navigate = useNavigate();
//   const [params] = useSearchParams();

//   const fieldIdFromUrl = params.get("field") || "";

//   const [fields, setFields] = useState([]);
//   const [selectedFieldId, setSelectedFieldId] = useState(fieldIdFromUrl || "");
//   const [fieldName, setFieldName] = useState("");
//   const [stage, setStage] = useState("");
//   const [date, setDate] = useState("");
//   const [notes, setNotes] = useState("");
//   const [errors, setErrors] = useState({});
//   const [submitting, setSubmitting] = useState(false);
//   const [success, setSuccess] = useState(false);

//   // Saari fields fetch karo dropdown ke liye
//   useEffect(() => {
//     const fetchFields = async () => {
//       try {
//         const token = localStorage.getItem("authToken");
//         const headers = token ? { Authorization: `Bearer ${token}` } : {};
//         const res = await api.get("/api/fields/my", { headers });
//         setFields(res.data.fields || []);
//       } catch (err) {
//         console.error("Fields fetch error:", err);
//       }
//     };
//     fetchFields();
//   }, []);

//   // Agar fieldId URL mein hai toh naam fetch karo
//   useEffect(() => {
//     if (!fieldIdFromUrl) return;
//     const fetchField = async () => {
//       try {
//         const token = localStorage.getItem("authToken");
//         const headers = token ? { Authorization: `Bearer ${token}` } : {};
//         const res = await api.get(`/api/fields/${fieldIdFromUrl}`, { headers });
//         setFieldName(res.data.field?.name || fieldIdFromUrl);
//       } catch {
//         setFieldName(fieldIdFromUrl);
//       }
//     };
//     fetchField();
//   }, [fieldIdFromUrl]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const finalFieldId = fieldIdFromUrl || selectedFieldId;

//     const newErrors = {};
//     if (!finalFieldId) newErrors.field = t("fieldRequired");
//     if (!stage) newErrors.stage = t("stageRequired");
//     if (!date) newErrors.date = t("dateRequired");

//     setErrors(newErrors);
//     if (Object.keys(newErrors).length > 0) return;

//     try {
//       setSubmitting(true);
//       const token = localStorage.getItem("authToken");
//       const headers = token ? { Authorization: `Bearer ${token}` } : {};

//       await api.post(
//         "/api/drone-jobs",
//         { fieldId: finalFieldId, stage, preferredDate: date, notes },
//         { headers }
//       );

//       setSuccess(true);
//       setTimeout(() => navigate("/home"), 2000);
//     } catch (err) {
//       console.error("RequestScan submit error:", err);
//       const msg =
//         err?.response?.status === 401
//           ? t("loginFailed")
//           : t("scanSubmitError") || "Scan request failed. Please try again.";
//       setErrors({ submit: msg });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (success) {
//     return (
//       <div className="p-4 max-w-md mx-auto">
//         <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-2">
//           <p className="text-3xl">✅</p>
//           <p className="text-sm font-medium text-emerald-800">
//             {t("scanRequestSuccess")}
//           </p>
//           <p className="text-xs text-slate-400">{t("loading")}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 max-w-md mx-auto bg-white rounded-2xl shadow-sm">

//       <button
//         onClick={() => navigate(-1)}
//         className="text-sm text-slate-500 hover:text-slate-800 mb-3 block"
//       >
//         ‹ {t("dashboard")}
//       </button>

//       <h1 className="text-lg font-semibold mb-4">{t("requestScanTitle")}</h1>

//       <form onSubmit={handleSubmit} className="space-y-3 text-sm">

//         {/* Field select */}
//         <div>
//           <label className="block mb-1">{t("fieldLabel")}</label>
//           {fieldIdFromUrl ? (
//             // URL se fieldId aayi — sirf naam dikhao
//             <div className="w-full border rounded px-3 py-2 text-sm bg-slate-50 text-slate-700">
//               {fieldName || "..."}
//             </div>
//           ) : (
//             // URL se fieldId nahi aayi — dropdown dikhao
//             <select
//               value={selectedFieldId}
//               onChange={(e) => {
//                 setSelectedFieldId(e.target.value);
//                 setErrors((prev) => ({ ...prev, field: "" }));
//               }}
//               className="w-full border rounded px-3 py-2 text-sm"
//             >
//               <option value="">-- Field select karo --</option>
//               {fields.map((f) => (
//                 <option key={f._id} value={f._id}>
//                   {f.name}
//                 </option>
//               ))}
//             </select>
//           )}
//           {errors.field && (
//             <p className="text-xs text-red-600 mt-0.5">{errors.field}</p>
//           )}
//         </div>

//         {/* Growth stage */}
//         <div>
//           <label className="block mb-1">{t("stageLabel")}</label>
//           <select
//             value={stage}
//             onChange={(e) => {
//               setStage(e.target.value);
//               setErrors((prev) => ({ ...prev, stage: "" }));
//             }}
//             className="w-full border rounded px-3 py-2 text-sm"
//           >
//             <option value="">{t("selectStagePlaceholder")}</option>
//             <option value="early">{t("stageEarly")}</option>
//             <option value="mid">{t("stageMid")}</option>
//             <option value="pre-harvest">{t("stagePreHarvest")}</option>
//           </select>
//           {errors.stage && (
//             <p className="text-xs text-red-600 mt-0.5">{errors.stage}</p>
//           )}
//         </div>

//         {/* Preferred date */}
//         <div>
//           <label className="block mb-1">{t("dateLabel")}</label>
//           <input
//             type="date"
//             className="w-full border rounded px-3 py-2 text-sm"
//             value={date}
//             onChange={(e) => {
//               setDate(e.target.value);
//               setErrors((prev) => ({ ...prev, date: "" }));
//             }}
//           />
//           {errors.date && (
//             <p className="text-xs text-red-600 mt-0.5">{errors.date}</p>
//           )}
//         </div>

//         {/* Notes */}
//         <div>
//           <label className="block mb-1">{t("notesLabel")}</label>
//           <textarea
//             className="w-full border rounded px-3 py-2 text-sm"
//             rows={3}
//             value={notes}
//             onChange={(e) => setNotes(e.target.value)}
//             placeholder={t("notesPlaceholder")}
//           />
//         </div>

//         {errors.submit && (
//           <p className="text-xs text-red-600">{errors.submit}</p>
//         )}

//         <button
//           type="submit"
//           disabled={submitting}
//           className="w-full bg-emerald-600 disabled:bg-gray-400 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors"
//         >
//           {submitting ? t("loading") : t("submitScanRequest")}
//         </button>

//       </form>
//     </div>
//   );
// };

// export default RequestScan;


// src/pages/RequestScan.jsx
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import api from "../api"; // ✅ Use shared api instance (token auto-attached by App.jsx)

const RequestScan = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const fieldIdFromUrl = params.get("field") || "";

  const [fields, setFields] = useState([]);
  const [selectedFieldId, setSelectedFieldId] = useState(fieldIdFromUrl || "");
  const [fieldName, setFieldName] = useState("");
  const [stage, setStage] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // ✅ Fetch all fields - no manual token needed
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

  // ✅ Fetch field name if fieldId in URL - no manual token needed
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
    if (!stage) newErrors.stage = t("stageRequired");
    if (!date) newErrors.date = t("dateRequired");

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setSubmitting(true);

      // ✅ No manual token needed - axios interceptor handles it
      await api.post("/api/drone-jobs", {
        fieldId: finalFieldId,
        stage,
        preferredDate: date,
        notes,
      });

      setSuccess(true);
      setTimeout(() => navigate("/home"), 2000);
    } catch (err) {
      console.error("RequestScan submit error:", err);
      const msg =
        err?.response?.status === 401
          ? t("loginFailed")
          : t("scanSubmitError") || "Scan request failed. Please try again.";
      setErrors({ submit: msg });
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-2">
          <p className="text-3xl">✅</p>
          <p className="text-sm font-medium text-emerald-800">
            {t("scanRequestSuccess")}
          </p>
          <p className="text-xs text-slate-400">{t("loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-2xl shadow-sm">

      <button
        onClick={() => navigate(-1)}
        className="text-sm text-slate-500 hover:text-slate-800 mb-3 block"
      >
        ‹ {t("dashboard")}
      </button>

      <h1 className="text-lg font-semibold mb-4">{t("requestScanTitle")}</h1>

      <form onSubmit={handleSubmit} className="space-y-3 text-sm">

        {/* Field select */}
        <div>
          <label className="block mb-1">{t("fieldLabel")}</label>
          {fieldIdFromUrl ? (
            <div className="w-full border rounded px-3 py-2 text-sm bg-slate-50 text-slate-700">
              {fieldName || "..."}
            </div>
          ) : (
            <select
              value={selectedFieldId}
              onChange={(e) => {
                setSelectedFieldId(e.target.value);
                setErrors((prev) => ({ ...prev, field: "" }));
              }}
              className="w-full border rounded px-3 py-2 text-sm"
            >
              <option value="">-- Field select karo --</option>
              {fields.map((f) => (
                <option key={f._id} value={f._id}>
                  {f.name}
                </option>
              ))}
            </select>
          )}
          {errors.field && (
            <p className="text-xs text-red-600 mt-0.5">{errors.field}</p>
          )}
        </div>

        {/* Growth stage */}
        <div>
          <label className="block mb-1">{t("stageLabel")}</label>
          <select
            value={stage}
            onChange={(e) => {
              setStage(e.target.value);
              setErrors((prev) => ({ ...prev, stage: "" }));
            }}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value="">{t("selectStagePlaceholder")}</option>
            <option value="early">{t("stageEarly")}</option>
            <option value="mid">{t("stageMid")}</option>
            <option value="pre-harvest">{t("stagePreHarvest")}</option>
          </select>
          {errors.stage && (
            <p className="text-xs text-red-600 mt-0.5">{errors.stage}</p>
          )}
        </div>

        {/* Preferred date */}
        <div>
          <label className="block mb-1">{t("dateLabel")}</label>
          <input
            type="date"
            className="w-full border rounded px-3 py-2 text-sm"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setErrors((prev) => ({ ...prev, date: "" }));
            }}
          />
          {errors.date && (
            <p className="text-xs text-red-600 mt-0.5">{errors.date}</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block mb-1">{t("notesLabel")}</label>
          <textarea
            className="w-full border rounded px-3 py-2 text-sm"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t("notesPlaceholder")}
          />
        </div>

        {errors.submit && (
          <p className="text-xs text-red-600">{errors.submit}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-emerald-600 disabled:bg-gray-400 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors"
        >
          {submitting ? t("loading") : t("submitScanRequest")}
        </button>

      </form>
    </div>
  );
};

export default RequestScan;