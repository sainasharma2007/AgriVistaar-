// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useLanguage } from "../context/LanguageContext";

// const ForgotPassword = () => {
//   const { t } = useLanguage();
//   const navigate = useNavigate();
//   const [password, setPassword] = useState("");
//   const [confirm, setConfirm] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!password || !confirm) {
//       setError(t("requiredField"));
//       return;
//     }
//     if (password !== confirm) {
//       setError(t("passwordMismatch"));
//       return;
//     }
//     // demo: overwrite saved password
//     localStorage.setItem("farmerPassword", password);
//     // clear any old auth token
//     localStorage.removeItem("authToken");
//     navigate("/login");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-800 to-lime-500 flex items-center justify-center px-4">
//       <div className="relative w-full max-w-md">
//         <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-500 via-lime-400 to-yellow-300 opacity-40 blur-2xl" />
//         <div className="relative bg-slate-950/95 text-slate-50 rounded-2xl shadow-2xl p-8 space-y-6 border border-emerald-500/40">
//           <div className="space-y-1 text-center">
//             <h1 className="text-2xl font-semibold">
//               {t("forgotPasswordTitle")}
//             </h1>
//             <p className="text-xs text-slate-300">
//               {t("forgotPasswordDesc")}
//             </p>
//           </div>

//           <form className="space-y-4 text-sm" onSubmit={handleSubmit}>
//             <div>
//               <label className="block text-xs mb-1 text-slate-200">
//                 {t("passwordLabel")} <span className="text-red-400">*</span>
//               </label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => {
//                   setPassword(e.target.value);
//                   setError("");
//                 }}
//                 className="w-full rounded-lg bg-slate-900/70 border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime-400 border-slate-600"
//                 placeholder={t("passwordSignupPlaceholder")}
//               />
//             </div>
//             <div>
//               <label className="block text-xs mb-1 text-slate-200">
//                 {t("confirmPasswordLabel")}{" "}
//                 <span className="text-red-400">*</span>
//               </label>
//               <input
//                 type="password"
//                 value={confirm}
//                 onChange={(e) => {
//                   setConfirm(e.target.value);
//                   setError("");
//                 }}
//                 className="w-full rounded-lg bg-slate-900/70 border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime-400 border-slate-600"
//                 placeholder={t("confirmPasswordPlaceholder")}
//               />
//             </div>

//             {error && (
//               <p className="text-[11px] text-red-400 mt-1 text-center">
//                 {error}
//               </p>
//             )}

//             <button
//               type="submit"
//               className="w-full py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-lime-400 via-yellow-300 to-emerald-400 text-slate-900 shadow-md hover:brightness-110 transition"
//             >
//               {t("saveNewPassword")}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;

