

// // src/pages/GetStarted.jsx
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth0 } from "@auth0/auth0-react"; // ✅ ADD
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
//   const { isAuthenticated, loginWithRedirect } = useAuth0(); // ✅ ADD

//   // ✅ FIXED: replaced localStorage.getItem("authToken") with Auth0
//   // const handleGetStarted = () => {
//   //   if (isAuthenticated) {
//   //     navigate("/home");
//   //   } else {
//   //     loginWithRedirect();
//   //   }
//   // };
//   const handleGetStarted = () => {
//   console.log("clicked!", isAuthenticated);
//   if (isAuthenticated) {
//     navigate("/home");
//   } else {
//     loginWithRedirect();
//   }
// };

//   // ✅ FIXED: "Create Account" now opens Auth0 signup screen
//   const handleCreateAccount = (e) => {
//     e.preventDefault();
//     loginWithRedirect({
//       authorizationParams: { screen_hint: "signup" }
//     });
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

//       {/* Hero Section */}
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

//           {/* Buttons */}
//           <div className="flex justify-center">
//             <div className="flex flex-col sm:flex-row gap-6 pt-2">
//               {/* ✅ Get Started — Auth0 login */}
//               <button
//                 onClick={handleGetStarted}
//                 className="bg-white text-emerald-700 font-semibold px-8 py-4 rounded-lg shadow-xl hover:shadow-2xl transition flex items-center justify-center gap-2"
//               >
//                 {t("getStarted")}
//                 <ArrowRight className="w-5 h-5" />
//               </button>

//               {/* ✅ Create Account — Auth0 signup screen */}
//               <button
//                 onClick={handleCreateAccount}
//                 className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition text-center"
//               >
//                 {t("createAccount")}
//               </button>
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

//       {/* Trust indicators footer */}
//       <footer className="border-t border-white/10 py-10">
//         <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
//           <div>
//             <div className="text-4xl font-bold text-white mb-1">10,000+</div>
//             <div className="text-sm text-emerald-100">{t("farmers")}</div>
//           </div>
//           <div>
//             <div className="text-4xl font-bold text-white mb-1">50,000+</div>
//             <div className="text-sm text-emerald-100">{t("acresMonitored")}</div>
//           </div>
//           <div>
//             <div className="text-4xl font-bold text-white mb-1">95%</div>
//             <div className="text-sm text-emerald-100">{t("accuracy")}</div>
//           </div>
//           <div>
//             <div className="text-4xl font-bold text-white mb-1">24/7</div>
//             <div className="text-sm text-emerald-100">{t("aiSupport")}</div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default GetStarted;


// src/pages/GetStarted.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Eye, Calendar, TrendingUp, ArrowRight, Menu, X, Leaf, Satellite, BarChart3, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import LanguageDropdown from "../components/LanguageDropdown";
import Agrilogo from "../assets/Agrilogo.png";

const GetStarted = () => {
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) navigate("/home");
    else loginWithRedirect();
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();
    loginWithRedirect({ authorizationParams: { screen_hint: "signup" } });
  };

  const stats = [
    { value: "10,000+", label: t("farmers"), icon: "👨‍🌾" },
    { value: "50,000+", label: t("acresMonitored"), icon: "🌾" },
    { value: "95%", label: t("accuracy"), icon: "🎯" },
    { value: "24/7", label: t("aiSupport"), icon: "🤖" },
  ];

  const features = [
    {
      icon: <Eye className="w-6 h-6" />,
      title: t("droneInsights"),
      desc: t("droneInsightsDesc"),
      color: "#22c55e",
      bg: "rgba(34,197,94,0.12)",
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: t("mandiTiming"),
      desc: t("mandiTimingDesc"),
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.12)",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: t("yieldPrediction"),
      desc: t("yieldPredictionDesc"),
      color: "#06b6d4",
      bg: "rgba(6,182,212,0.12)",
    },
  ];

  return (
    <div style={{ fontFamily: "'Sora', 'DM Sans', sans-serif", background: "#0a1a0f", minHeight: "100vh", overflowX: "hidden" }}>

      {/* Google Font Import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-18px) rotate(3deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(-2deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(34,197,94,0.3); }
          50% { box-shadow: 0 0 50px rgba(34,197,94,0.6), 0 0 80px rgba(34,197,94,0.2); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(120px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(120px) rotate(-360deg); }
        }
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-2%, -3%); }
          20% { transform: translate(3%, 2%); }
          30% { transform: translate(-1%, 4%); }
          40% { transform: translate(4%, -1%); }
          50% { transform: translate(-3%, 3%); }
          60% { transform: translate(2%, -4%); }
          70% { transform: translate(-4%, 1%); }
          80% { transform: translate(1%, -2%); }
          90% { transform: translate(3%, 4%); }
        }
        .hero-title {
          animation: fadeUp 0.9s ease forwards;
        }
        .hero-sub {
          animation: fadeUp 0.9s 0.15s ease both;
        }
        .hero-btns {
          animation: fadeUp 0.9s 0.3s ease both;
        }
        .hero-cards {
          animation: fadeUp 0.9s 0.45s ease both;
        }
        .feature-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .feature-card:hover {
          transform: translateY(-6px);
        }
        .get-started-btn {
          transition: all 0.25s ease;
          animation: pulse-glow 3s ease-in-out infinite;
        }
        .get-started-btn:hover {
          transform: scale(1.04);
          box-shadow: 0 0 60px rgba(34,197,94,0.7) !important;
        }
        .create-btn {
          transition: all 0.25s ease;
        }
        .create-btn:hover {
          background: rgba(255,255,255,0.1);
          transform: scale(1.04);
        }
        .stat-card {
          transition: transform 0.25s ease;
        }
        .stat-card:hover {
          transform: translateY(-4px);
        }
        .shimmer-text {
          background: linear-gradient(90deg, #86efac, #ffffff, #4ade80, #ffffff, #86efac);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        .noise-overlay::before {
          content: '';
          position: fixed;
          inset: -50%;
          width: 200%;
          height: 200%;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.03;
          pointer-events: none;
          z-index: 1;
          animation: grain 0.5s steps(1) infinite;
        }
        .floating-leaf {
          animation: float 6s ease-in-out infinite;
        }
        .floating-leaf2 {
          animation: float2 8s ease-in-out infinite;
        }
      `}</style>

      {/* Noise overlay */}
      <div className="noise-overlay" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }} />

      {/* Background mesh */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 80% 60% at 20% 10%, rgba(34,197,94,0.18) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(16,185,129,0.12) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 60% 20%, rgba(245,158,11,0.07) 0%, transparent 60%)"
      }} />

      {/* Floating decorative circles */}
      <div style={{ position: "fixed", top: "15%", right: "8%", width: 300, height: 300, borderRadius: "50%", border: "1px solid rgba(34,197,94,0.08)", zIndex: 0, pointerEvents: "none" }} />
      <div style={{ position: "fixed", top: "12%", right: "5%", width: 400, height: 400, borderRadius: "50%", border: "1px solid rgba(34,197,94,0.05)", zIndex: 0, pointerEvents: "none" }} />

      {/* Floating emojis */}
      <div className="floating-leaf" style={{ position: "fixed", top: "20%", right: "12%", fontSize: 40, zIndex: 0, opacity: 0.2, pointerEvents: "none" }}>🌿</div>
      <div className="floating-leaf2" style={{ position: "fixed", top: "60%", left: "5%", fontSize: 32, zIndex: 0, opacity: 0.15, pointerEvents: "none" }}>🌾</div>
      <div className="floating-leaf" style={{ position: "fixed", bottom: "25%", right: "6%", fontSize: 28, zIndex: 0, opacity: 0.12, pointerEvents: "none", animationDelay: "2s" }}>🚁</div>

      {/* NAVBAR */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: scrolled ? "rgba(10,26,15,0.92)" : "rgba(10,26,15,0.6)",
        backdropFilter: "blur(20px)",
        borderBottom: scrolled ? "1px solid rgba(34,197,94,0.15)" : "1px solid transparent",
        transition: "all 0.3s ease",
        padding: "0 24px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ position: "relative" }}>
              <img src={Agrilogo} alt="AgriVistaar" style={{ height: 48, width: 48, objectFit: "contain", filter: "drop-shadow(0 0 8px rgba(34,197,94,0.4))" }} />
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", letterSpacing: "-0.3px" }}>AgriVistaar</div>
              <div style={{ fontSize: 11, color: "#4ade80", fontWeight: 500, letterSpacing: "0.3px" }}>{t("tagline")}</div>
            </div>
          </div>

          {/* Center */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: 100, padding: "8px 18px" }}>
            <span style={{ fontSize: 14, color: "#86efac", fontWeight: 500 }}>{t("welcomeFarmer")} 🙏</span>
          </div>

          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", display: "none" }}>{t("precisionAg")}</span>
            <LanguageDropdown />
            <button
              onClick={handleGetStarted}
              style={{
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                color: "#fff", border: "none", borderRadius: 10,
                padding: "9px 20px", fontSize: 13, fontWeight: 700,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                boxShadow: "0 4px 20px rgba(34,197,94,0.35)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >
              {t("getStarted")} <ArrowRight style={{ width: 14, height: 14 }} />
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ position: "relative", zIndex: 2, maxWidth: 900, margin: "0 auto", padding: "100px 24px 60px", textAlign: "center" }}>



        {/* Main heading */}
        <h1 className="hero-title shimmer-text" style={{
          fontSize: "clamp(52px, 8vw, 88px)",
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: "-2px",
          marginBottom: 8,
        }}>
          AgriVistaar
        </h1>

        <p className="hero-sub" style={{
          fontSize: "clamp(22px, 4vw, 32px)",
          fontWeight: 700,
          color: "#fbbf24",
          marginBottom: 16,
          letterSpacing: "-0.5px",
        }}>
          {t("tagline")}
        </p>



        {/* CTA Buttons */}
        <div className="hero-btns" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 80 }}>
          <button
            onClick={handleGetStarted}
            className="get-started-btn"
            style={{
              background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
              color: "#fff", border: "none", borderRadius: 16,
              padding: "18px 40px", fontSize: 16, fontWeight: 700,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
              boxShadow: "0 8px 32px rgba(34,197,94,0.4)",
              letterSpacing: "-0.2px",
            }}
          >
            {t("getStarted")}
            <ArrowRight style={{ width: 20, height: 20 }} />
          </button>

          <button
            onClick={handleCreateAccount}
            className="create-btn"
            style={{
              background: "rgba(255,255,255,0.05)", color: "#fff",
              border: "1px solid rgba(255,255,255,0.15)", borderRadius: 16,
              padding: "18px 40px", fontSize: 16, fontWeight: 600,
              cursor: "pointer", letterSpacing: "-0.2px",
              backdropFilter: "blur(10px)",
            }}
          >
            {t("createAccount")}
          </button>
        </div>

        {/* Feature Cards */}
        <div className="hero-cards" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          {features.map((f, i) => (
            <div key={i} className="feature-card" style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20, padding: "28px 24px", textAlign: "left",
              backdropFilter: "blur(10px)",
              animationDelay: `${0.5 + i * 0.1}s`,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: f.bg, border: `1px solid ${f.color}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: f.color, marginBottom: 16,
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 8, letterSpacing: "-0.2px" }}>
                {f.title}
              </h3>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, margin: 0 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* DIVIDER */}
      <div style={{ position: "relative", zIndex: 2, maxWidth: 1000, margin: "0 auto 0", padding: "0 24px" }}>
        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(34,197,94,0.2), transparent)" }} />
      </div>

      {/* STATS */}
      <div style={{ position: "relative", zIndex: 2, padding: "60px 24px 80px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 20 }}>
          {stats.map((s, i) => (
            <div key={i} className="stat-card" style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 20, padding: "28px 20px", textAlign: "center",
              backdropFilter: "blur(10px)",
            }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>{s.icon}</div>
              <div style={{
                fontSize: 36, fontWeight: 800, color: "#fff",
                letterSpacing: "-1px", marginBottom: 6,
                background: "linear-gradient(135deg, #fff, #86efac)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                {s.value}
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom tagline */}
        <p style={{ textAlign: "center", marginTop: 48, fontSize: 13, color: "rgba(255,255,255,0.25)", letterSpacing: "0.3px" }}>
          {t("footerTagline")}
        </p>
      </div>

    </div>
  );
};

export default GetStarted;

      