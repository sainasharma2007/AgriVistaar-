
// // src/components/Navbar.jsx
// import { Link, NavLink } from "react-router-dom";
// import { useAuth0 } from "@auth0/auth0-react";
// import { useLanguage } from "../context/LanguageContext";
// import Agrilogo from "../assets/Agrilogo.png";
// import { LogOut } from "lucide-react";

// const Navbar = () => {
//   const { t, language, setLanguage } = useLanguage();
//   const { logout } = useAuth0();

//   const handleLogout = () => {
//     logout({
//       logoutParams: {
//         returnTo: window.location.origin,
//         federated: true,
//       },
//     });
//   };

//   const languages = [
//     { code: "en", label: "EN" },
//     { code: "hi", label: "हिं" },
//     { code: "mr", label: "मरा" },
//     { code: "ta", label: "தமி" },
//     { code: "bn", label: "বা" },
//     { code: "te", label: "తెలు" },
//   ];

//   const navLinkStyle = ({ isActive }) => ({
//     padding: "7px 14px",
//     borderRadius: 50,
//     fontSize: 12,
//     fontWeight: 600,
//     textDecoration: "none",
//     transition: "all 0.2s",
//     background: isActive ? "rgba(34,197,94,0.2)" : "transparent",
//     color: isActive ? "#86efac" : "rgba(200,240,210,0.75)",
//     border: `1px solid ${isActive ? "rgba(74,222,128,0.4)" : "transparent"}`,
//   });

//   return (
//     <>
//       <style>{`
//         .agri-nav-link:hover {
//           background: rgba(34,197,94,0.12) !important;
//           color: #86efac !important;
//           border-color: rgba(34,197,94,0.3) !important;
//         }
//         .agri-logout-btn:hover {
//           background: rgba(239,68,68,0.12) !important;
//           color: #fca5a5 !important;
//           border-color: rgba(248,113,113,0.5) !important;
//         }
//         .agri-logo-wrap:hover .agri-logo-box {
//           box-shadow: 0 0 20px rgba(74,222,128,0.4), inset 0 1px 0 rgba(255,255,255,0.1) !important;
//           border-color: rgba(74,222,128,0.6) !important;
//         }
//       `}</style>

//       <nav style={{
//         position: "sticky",
//         top: 0,
//         zIndex: 50,
//         /* ✅ Lighter background — was rgba(10,26,15,0.92) */
//         background: "rgba(22, 52, 28, 0.96)",
//         backdropFilter: "blur(20px)",
//         WebkitBackdropFilter: "blur(20px)",
//         /* ✅ More visible border + subtle glow */
//         borderBottom: "1px solid rgba(74,222,128,0.3)",
//         boxShadow: "0 2px 20px rgba(0,0,0,0.25), 0 1px 0 rgba(74,222,128,0.1)",
//         padding: "0 20px",
//         fontFamily: "'Sora', 'DM Sans', sans-serif",
//       }}>
//         <div style={{
//           maxWidth: 1100,
//           margin: "0 auto",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           height: 64,
//         }}>

//           {/* ✅ Logo — with glowing container for visibility */}
//           <Link
//             to="/home"
//             className="agri-logo-wrap"
//             style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}
//           >
//             {/* Glowing box around logo image */}
//             <div
//               className="agri-logo-box"
//               style={{
//                 width: 46,
//                 height: 46,
//                 borderRadius: 12,
//                 background: "rgba(34,197,94,0.15)",
//                 border: "1.5px solid rgba(74,222,128,0.45)",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 boxShadow: "0 0 14px rgba(34,197,94,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
//                 flexShrink: 0,
//                 transition: "all 0.25s ease",
//                 overflow: "hidden",
//               }}
//             >
//               <img
//                 src={Agrilogo}
//                 alt="AgriVistaar"
//                 style={{
//                   height: 38,
//                   width: 38,
//                   objectFit: "contain",
//                   /* ✅ Brighter + green glow on logo */
//                   filter: "drop-shadow(0 0 8px rgba(74,222,128,0.55)) brightness(1.15)",
//                 }}
//               />
//             </div>

//             <div>
//               <div style={{
//                 fontSize: 16,
//                 fontWeight: 800,
//                 color: "#e8f5e9",
//                 letterSpacing: "-0.3px",
//                 /* ✅ Subtle text glow */
//                 textShadow: "0 0 20px rgba(74,222,128,0.25)",
//               }}>
//                 {t("appName")}
//               </div>
//               <div style={{
//                 fontSize: 10,
//                 color: "#4ade80",
//                 fontWeight: 500,
//                 letterSpacing: "0.4px",
//                 opacity: 0.9,
//               }}>
//                 {t("tagline")}
//               </div>
//             </div>
//           </Link>

//           {/* Nav Links + Controls */}
//           <div style={{ display: "flex", alignItems: "center", gap: 8 }}>

//             {/* Dashboard link */}
//             <NavLink to="/home" className="agri-nav-link" style={navLinkStyle}>
//               {t("dashboard")}
//             </NavLink>

//             {/* Upload link */}
//             <NavLink to="/upload" className="agri-nav-link" style={navLinkStyle}>
//               {t("droneUpload")}
//             </NavLink>

//             {/* Language selector */}
//             <select
//               value={language}
//               onChange={e => setLanguage(e.target.value)}
//               style={{
//                 background: "rgba(255,255,255,0.08)",
//                 border: "1px solid rgba(74,222,128,0.35)",
//                 borderRadius: 8,
//                 padding: "5px 8px",
//                 fontSize: 12,
//                 color: "#c8f5d4",
//                 cursor: "pointer",
//                 outline: "none",
//                 fontFamily: "'Sora', sans-serif",
//                 transition: "border-color 0.2s",
//               }}
//             >
//               {languages.map(lng => (
//                 <option
//                   key={lng.code}
//                   value={lng.code}
//                   style={{ background: "#162d1c", color: "#e8f5e9" }}
//                 >
//                   {lng.label}
//                 </option>
//               ))}
//             </select>

//             {/* Logout */}
//             <button
//               onClick={handleLogout}
//               className="agri-logout-btn"
//               style={{
//                 display: "inline-flex",
//                 alignItems: "center",
//                 gap: 6,
//                 padding: "7px 14px",
//                 borderRadius: 50,
//                 fontSize: 12,
//                 fontWeight: 600,
//                 background: "transparent",
//                 border: "1px solid rgba(248,113,113,0.3)",
//                 color: "rgba(252,165,165,0.85)",
//                 cursor: "pointer",
//                 transition: "all 0.2s",
//                 fontFamily: "'Sora', sans-serif",
//               }}
//               title={t("logout")}
//             >
//               <LogOut style={{ width: 14, height: 14 }} />
//               <span>{t("logout")}</span>
//             </button>

//           </div>
//         </div>
//       </nav>
//     </>
//   );
// };

// export default Navbar;

// src/components/Navbar.jsx
import { Link, NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useLanguage } from "../context/LanguageContext";
import Agrilogo from "../assets/Agrilogo.png";
import { LogOut } from "lucide-react";

const Navbar = () => {
  const { t, language, setLanguage } = useLanguage();
  const { logout } = useAuth0();

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
        federated: true,
      },
    });
  };

  const languages = [
    { code: "en", label: "EN" },
    { code: "hi", label: "हिं" },
    { code: "mr", label: "मरा" },
    { code: "ta", label: "தமி" },
    { code: "bn", label: "বা" },
    { code: "te", label: "తెలు" },
  ];

  const navLinkStyle = ({ isActive }) => ({
    padding: "7px 14px",
    borderRadius: 50,
    fontSize: 12,
    fontWeight: 600,
    textDecoration: "none",
    transition: "all 0.2s",
    background: isActive ? "rgba(34,197,94,0.2)" : "transparent",
    color: isActive ? "#86efac" : "rgba(200,240,210,0.75)",
    border: `1px solid ${isActive ? "rgba(74,222,128,0.4)" : "transparent"}`,
  });

  return (
    <>
      <style>{`
        .agri-nav-link:hover {
          background: rgba(34,197,94,0.12) !important;
          color: #86efac !important;
          border-color: rgba(34,197,94,0.3) !important;
        }
        .agri-logout-btn:hover {
          background: rgba(239,68,68,0.12) !important;
          color: #fca5a5 !important;
          border-color: rgba(248,113,113,0.5) !important;
        }
        .agri-logo-wrap:hover .agri-logo-box {
          box-shadow: 0 0 20px rgba(74,222,128,0.4), inset 0 1px 0 rgba(255,255,255,0.1) !important;
          border-color: rgba(74,222,128,0.6) !important;
        }
      `}</style>

      <nav style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        /* ✅ Lighter background — was rgba(10,26,15,0.92) */
        background: "rgba(22, 52, 28, 0.96)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        /* ✅ More visible border + subtle glow */
        borderBottom: "1px solid rgba(74,222,128,0.3)",
        boxShadow: "0 2px 20px rgba(0,0,0,0.25), 0 1px 0 rgba(74,222,128,0.1)",
        padding: "0 20px",
        fontFamily: "'Sora', 'DM Sans', sans-serif",
      }}>
        <div style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
        }}>

          {/* ✅ Logo — with glowing container for visibility */}
          <Link
            to="/home"
            className="agri-logo-wrap"
            style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}
          >
            {/* Glowing box around logo image */}
            <div
              className="agri-logo-box"
              style={{
                width: 46,
                height: 46,
                borderRadius: 12,
                background: "rgba(34,197,94,0.15)",
                border: "1.5px solid rgba(74,222,128,0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 14px rgba(34,197,94,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
                flexShrink: 0,
                transition: "all 0.25s ease",
                overflow: "hidden",
              }}
            >
              <img
                src={Agrilogo}
                alt="AgriVistaar"
                style={{
                  height: 38,
                  width: 38,
                  objectFit: "contain",
                  /* ✅ Brighter + green glow on logo */
                  filter: "drop-shadow(0 0 8px rgba(74,222,128,0.55)) brightness(1.15)",
                }}
              />
            </div>

            <div>
              <div style={{
                fontSize: 16,
                fontWeight: 800,
                color: "#e8f5e9",
                letterSpacing: "-0.3px",
                /* ✅ Subtle text glow */
                textShadow: "0 0 20px rgba(74,222,128,0.25)",
              }}>
                {t("appName")}
              </div>
              <div style={{
                fontSize: 10,
                color: "#4ade80",
                fontWeight: 500,
                letterSpacing: "0.4px",
                opacity: 0.9,
              }}>
                {t("tagline")}
              </div>
            </div>
          </Link>

          {/* Nav Links + Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>

            {/* Dashboard link */}
            <NavLink to="/home" className="agri-nav-link" style={navLinkStyle}>
              {t("dashboard")}
            </NavLink>

            {/* Language selector */}
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(74,222,128,0.35)",
                borderRadius: 8,
                padding: "5px 8px",
                fontSize: 12,
                color: "#c8f5d4",
                cursor: "pointer",
                outline: "none",
                fontFamily: "'Sora', sans-serif",
                transition: "border-color 0.2s",
              }}
            >
              {languages.map(lng => (
                <option
                  key={lng.code}
                  value={lng.code}
                  style={{ background: "#162d1c", color: "#e8f5e9" }}
                >
                  {lng.label}
                </option>
              ))}
            </select>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="agri-logout-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 14px",
                borderRadius: 50,
                fontSize: 12,
                fontWeight: 600,
                background: "transparent",
                border: "1px solid rgba(248,113,113,0.3)",
                color: "rgba(252,165,165,0.85)",
                cursor: "pointer",
                transition: "all 0.2s",
                fontFamily: "'Sora', sans-serif",
              }}
              title={t("logout")}
            >
              <LogOut style={{ width: 14, height: 14 }} />
              <span>{t("logout")}</span>
            </button>

          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;