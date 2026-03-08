// // src/pages/Login.jsx
// import { useAuth0 } from "@auth0/auth0-react";
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useLanguage } from "../context/LanguageContext";

// const Login = () => {
//   const { t } = useLanguage();
//   const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (isAuthenticated) navigate("/home");
//   }, [isAuthenticated]);

//   if (isLoading) return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-800 to-lime-500 flex items-center justify-center">
//       <p className="text-white text-lg">Loading...</p>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-800 to-lime-500 flex items-center justify-center px-4">
//       <div className="relative w-full max-w-md">
//         <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-500 via-lime-400 to-yellow-300 opacity-40 blur-2xl" />
//         <div className="relative bg-slate-950/95 text-slate-50 rounded-2xl shadow-2xl p-8 space-y-6 border border-emerald-500/40">

//           <div className="space-y-1 text-center">
//             <h1 className="text-2xl font-semibold">
//               {t("loginTo")}{" "}
//               <span className="text-yellow-300">{t("appName")}</span>
//             </h1>
//             <p className="text-xs text-slate-300">{t("loginDesc")}</p>
//           </div>

//           {/* Login Button */}
//           <button
//             onClick={() => loginWithRedirect()}
//             className="w-full py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-lime-400 via-yellow-300 to-emerald-400 text-slate-900 shadow-md hover:brightness-110 transition"
//           >
//             {t("login")}
//           </button>

//           <div className="h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

//           {/* Signup link — Auth0 handles signup on its own screen */}
//           <p className="text-xs text-center text-slate-200">
//             {t("newTo")}{" "}
//             <span className="font-semibold">{t("appName")}</span>?{" "}
//             <button
//               onClick={() => loginWithRedirect({
//                 authorizationParams: { screen_hint: "signup" }
//               })}
//               className="text-yellow-300 font-semibold hover:text-emerald-300"
//             >
//               {t("signup")}
//             </button>
//           </p>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

// src/pages/Login.jsx
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const Login = () => {
  const { t } = useLanguage();
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/home");
  }, [isAuthenticated, navigate]); // ✅ fixed: navigate added to deps

  if (isLoading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-800 to-lime-500 flex items-center justify-center">
      <p className="text-white text-lg">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-800 to-lime-500 flex items-center justify-center px-4">
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-500 via-lime-400 to-yellow-300 opacity-40 blur-2xl" />
        <div className="relative bg-slate-950/95 text-slate-50 rounded-2xl shadow-2xl p-8 space-y-6 border border-emerald-500/40">

          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-semibold">
              {t("loginTo")}{" "}
              <span className="text-yellow-300">{t("appName")}</span>
            </h1>
            <p className="text-xs text-slate-300">{t("loginDesc")}</p>
          </div>

          {/* Login Button */}
          <button
            onClick={() => loginWithRedirect()}
            className="w-full py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-lime-400 via-yellow-300 to-emerald-400 text-slate-900 shadow-md hover:brightness-110 transition"
          >
            {t("login")}
          </button>

          <div className="h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

          {/* Signup link — Auth0 handles signup on its own screen */}
          <p className="text-xs text-center text-slate-200">
            {t("newTo")}{" "}
            <span className="font-semibold">{t("appName")}</span>?{" "}
            <button
              onClick={() => loginWithRedirect({
                authorizationParams: { screen_hint: "signup" }
              })}
              className="text-yellow-300 font-semibold hover:text-emerald-300"
            >
              {t("signup")}
            </button>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;