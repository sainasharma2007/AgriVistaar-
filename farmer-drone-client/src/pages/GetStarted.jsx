// // src/pages/GetStarted.jsx
// import { Link, useNavigate } from "react-router-dom";
// import {
//   Eye,
//   Calendar,
//   TrendingUp,
//   ArrowRight,
//   Menu,
//   X,
// } from "lucide-react";
// import { useState } from "react";
// import { useLanguage } from "../context/LanguageContext";
// import LanguageDropdown from "../components/LanguageDropdown";
// import Agrilogo from "../assets/Agrilogo.png";

// const GetStarted = () => {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const { t } = useLanguage();
//   const navigate = useNavigate();

//   const handleGetStarted = () => {
//     const token = localStorage.getItem("authToken");
//     if (token) {
//       navigate("/home");
//     } else {
//       navigate("/signup");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-green-700 to-lime-500">
//       {/* Navigation */}
//       <nav className="bg-white/95 backdrop-blur border-b border-emerald-100 shadow-sm">
//         <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-6">
//           {/* Logo */}
//           <div className="flex items-center gap-2">
//             <img
//               src={Agrilogo}
//               alt="AgriVistaar logo"
//               className="h-14 w-14 object-contain"
//             />
//             <div>
//               <div className="text-lg font-bold text-emerald-800">
//                 {t("appName")}
//               </div>
//               <div className="text-xs text-emerald-500 -mt-1">
//                 {t("tagline")}
//               </div>
//             </div>
//           </div>

//           {/* Center greeting */}
//           <p className="hidden md:block text-lg font-semibold text-emerald-700">
//             {t("welcomeFarmer")} 👋
//           </p>

//           {/* Right side */}
//           <div className="hidden md:flex items-center gap-4">
//             <span className="text-xs text-emerald-700 px-3 py-1 rounded-full bg-emerald-50">
//               {t("precisionAg")}
//             </span>
//             <LanguageDropdown />
//           </div>

//           {/* Mobile menu button */}
//           <button
//             className="md:hidden text-emerald-800"
//             onClick={() => setMenuOpen((prev) => !prev)}
//           >
//             {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//           </button>
//         </div>

//         {/* Mobile menu */}
//         {menuOpen && (
//           <div className="md:hidden bg-slate-900/95 px-6 py-4 border-t border-white/10">
//             <div className="flex items-center justify-between">
//               <span className="text-xs text-emerald-200">
//                 {t("precisionAg")}
//               </span>
//               <LanguageDropdown />
//             </div>
//           </div>
//         )}
//       </nav>

//       {/* Hero Section – single centered column */}
//       <div className="max-w-4xl mx-auto px-6 py-20 min-h-[75vh] flex items-center justify-center">
//         <div className="w-full text-center space-y-8">
//           {/* Heading / Tagline */}
//           <div>
//             <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-white">
//               {t("appName")}
//             </h1>
//             <p className="text-2xl md:text-3xl font-bold text-yellow-300 mt-2">
//               {t("tagline")}
//             </p>
//           </div>

//           {/* Optional hero text */}
//           {/* <p className="text-lg md:text-xl text-emerald-50 leading-relaxed">
//             {t("heroText")}
//           </p> */}

//           {/* Buttons */}
//           <div className="flex justify-center">
//             <div className="flex flex-col sm:flex-row gap-6 pt-2">
//               <button
//                 onClick={handleGetStarted}
//                 className="bg-white text-emerald-700 font-semibold px-8 py-4 rounded-lg shadow-xl hover:shadow-2xl transition flex items-center justify-center gap-2"
//               >
//                 {t("getStarted")}
//                 <ArrowRight className="w-5 h-5" />
//               </button>

//               <Link
//                 to="/signup"
//                 className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition text-center"
//               >
//                 {t("createAccount")}
//               </Link>
//             </div>
//           </div>

//           {/* Feature cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
//             <div className="bg-emerald-900/50 backdrop-blur rounded-xl p-4 border border-white/20 text-left">
//               <Eye className="w-8 h-8 text-yellow-300 mb-2" />
//               <h3 className="font-bold text-white text-sm mb-1">
//                 {t("droneInsights")}
//               </h3>
//               <p className="text-xs text-emerald-100">
//                 {t("droneInsightsDesc")}
//               </p>
//             </div>

//             <div className="bg-emerald-900/50 backdrop-blur rounded-xl p-4 border border-white/20 text-left">
//               <Calendar className="w-8 h-8 text-yellow-300 mb-2" />
//               <h3 className="font-bold text-white text-sm mb-1">
//                 {t("mandiTiming")}
//               </h3>
//               <p className="text-xs text-emerald-100">
//                 {t("mandiTimingDesc")}
//               </p>
//             </div>

//             <div className="bg-emerald-900/50 backdrop-blur rounded-xl p-4 border border-white/20 text-left">
//               <TrendingUp className="w-8 h-8 text-yellow-300 mb-2" />
//               <h3 className="font-bold text-white text-sm mb-1">
//                 {t("yieldPrediction")}
//               </h3>
//               <p className="text-xs text-emerald-100">
//                 {t("yieldPredictionDesc")}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Trust indicators in footer */}
//       <footer className="border-t border-white/10 py-10">
//         <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
//           <div>
//             <div className="text-4xl font-bold text-white mb-1">10,000+</div>
//             <div className="text-sm text-emerald-100">
//               {t("farmers")}
//             </div>
//           </div>
//           <div>
//             <div className="text-4xl font-bold text-white mb-1">50,000+</div>
//             <div className="text-sm text-emerald-100">
//               {t("acresMonitored")}
//             </div>
//           </div>
//           <div>
//             <div className="text-4xl font-bold text-white mb-1">95%</div>
//             <div className="text-sm text-emerald-100">
//               {t("accuracy")}
//             </div>
//           </div>
//           <div>
//             <div className="text-4xl font-bold text-white mb-1">24/7</div>
//             <div className="text-sm text-emerald-100">
//               {t("aiSupport")}
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default GetStarted;

// src/pages/GetStarted.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react"; // ✅ ADD
import {
  Eye,
  Calendar,
  TrendingUp,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import LanguageDropdown from "../components/LanguageDropdown";
import Agrilogo from "../assets/Agrilogo.png";

const GetStarted = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth0(); // ✅ ADD

  // ✅ FIXED: replaced localStorage.getItem("authToken") with Auth0
  // const handleGetStarted = () => {
  //   if (isAuthenticated) {
  //     navigate("/home");
  //   } else {
  //     loginWithRedirect();
  //   }
  // };
  const handleGetStarted = () => {
  console.log("clicked!", isAuthenticated);
  if (isAuthenticated) {
    navigate("/home");
  } else {
    loginWithRedirect();
  }
};

  // ✅ FIXED: "Create Account" now opens Auth0 signup screen
  const handleCreateAccount = (e) => {
    e.preventDefault();
    loginWithRedirect({
      authorizationParams: { screen_hint: "signup" }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-green-700 to-lime-500">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur border-b border-emerald-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img
              src={Agrilogo}
              alt="AgriVistaar logo"
              className="h-14 w-14 object-contain"
            />
            <div>
              <div className="text-lg font-bold text-emerald-800">
                {t("appName")}
              </div>
              <div className="text-xs text-emerald-500 -mt-1">
                {t("tagline")}
              </div>
            </div>
          </div>

          {/* Center greeting */}
          <p className="hidden md:block text-lg font-semibold text-emerald-700">
            {t("welcomeFarmer")} 👋
          </p>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            <span className="text-xs text-emerald-700 px-3 py-1 rounded-full bg-emerald-50">
              {t("precisionAg")}
            </span>
            <LanguageDropdown />
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-emerald-800"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-slate-900/95 px-6 py-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-emerald-200">
                {t("precisionAg")}
              </span>
              <LanguageDropdown />
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 py-20 min-h-[75vh] flex items-center justify-center">
        <div className="w-full text-center space-y-8">
          {/* Heading / Tagline */}
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-white">
              {t("appName")}
            </h1>
            <p className="text-2xl md:text-3xl font-bold text-yellow-300 mt-2">
              {t("tagline")}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-center">
            <div className="flex flex-col sm:flex-row gap-6 pt-2">
              {/* ✅ Get Started — Auth0 login */}
              <button
                onClick={handleGetStarted}
                className="bg-white text-emerald-700 font-semibold px-8 py-4 rounded-lg shadow-xl hover:shadow-2xl transition flex items-center justify-center gap-2"
              >
                {t("getStarted")}
                <ArrowRight className="w-5 h-5" />
              </button>

              {/* ✅ Create Account — Auth0 signup screen */}
              <button
                onClick={handleCreateAccount}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition text-center"
              >
                {t("createAccount")}
              </button>
            </div>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="bg-emerald-900/50 backdrop-blur rounded-xl p-4 border border-white/20 text-left">
              <Eye className="w-8 h-8 text-yellow-300 mb-2" />
              <h3 className="font-bold text-white text-sm mb-1">
                {t("droneInsights")}
              </h3>
              <p className="text-xs text-emerald-100">
                {t("droneInsightsDesc")}
              </p>
            </div>

            <div className="bg-emerald-900/50 backdrop-blur rounded-xl p-4 border border-white/20 text-left">
              <Calendar className="w-8 h-8 text-yellow-300 mb-2" />
              <h3 className="font-bold text-white text-sm mb-1">
                {t("mandiTiming")}
              </h3>
              <p className="text-xs text-emerald-100">
                {t("mandiTimingDesc")}
              </p>
            </div>

            <div className="bg-emerald-900/50 backdrop-blur rounded-xl p-4 border border-white/20 text-left">
              <TrendingUp className="w-8 h-8 text-yellow-300 mb-2" />
              <h3 className="font-bold text-white text-sm mb-1">
                {t("yieldPrediction")}
              </h3>
              <p className="text-xs text-emerald-100">
                {t("yieldPredictionDesc")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust indicators footer */}
      <footer className="border-t border-white/10 py-10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-white mb-1">10,000+</div>
            <div className="text-sm text-emerald-100">{t("farmers")}</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-1">50,000+</div>
            <div className="text-sm text-emerald-100">{t("acresMonitored")}</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-1">95%</div>
            <div className="text-sm text-emerald-100">{t("accuracy")}</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-1">24/7</div>
            <div className="text-sm text-emerald-100">{t("aiSupport")}</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GetStarted;




      