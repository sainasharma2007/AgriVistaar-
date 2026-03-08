// src/components/Navbar.jsx
import { Link, NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useLanguage } from "../context/LanguageContext";
import Agrilogo from "../assets/Agrilogo.png";
import { LogOut } from "lucide-react";

const Navbar = () => {
  const { t, language, setLanguage } = useLanguage();
  const { logout, user } = useAuth0();

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded text-sm font-medium ${
      isActive
        ? "bg-green-600 text-white"
        : "text-gray-800 hover:bg-gray-100"
    }`;

  // ✅ Auth0 logout - replaces localStorage.removeItem("authToken")
  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const languages = [
    { code: "en", label: "EN" },
    { code: "hi", label: "हिं" },
    { code: "mr", label: "मरा" },
    { code: "ta", label: "தமி" },
    { code: "bn", label: "বা" },
    { code: "te", label: "తెలు" },
  ];

  return (
    <nav className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-3 py-2">
        <Link to="/home" className="flex items-center gap-2">
          <img
            src={Agrilogo}
            alt="AgriVistaar logo"
            className="h-14 w-14 object-contain"
            width={56}
            height={56}
          />
          <div className="leading-tight">
            <div className="text-base font-bold text-emerald-800">
              {t("appName")}
            </div>
            <div className="text-[11px] text-yellow-500">
              {t("tagline")}
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <NavLink to="/home" className={linkClass}>
            {t("dashboard")}
          </NavLink>
          <NavLink to="/upload" className={linkClass}>
            {t("droneUpload")}
       </NavLink>

          {/* ✅ Show Auth0 user name if available */}
          {user?.name && (
            <span className="hidden md:inline text-xs text-gray-500 px-2">
              👤 {user.name.split(" ")[0]}
            </span>
          )}

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="ml-1 border border-gray-300 rounded px-2 py-1 text-xs bg-white"
          >
            {languages.map((lng) => (
              <option key={lng.code} value={lng.code}>
                {lng.label}
              </option>
            ))}
          </select>

          {/* ✅ Auth0 logout button */}
          <button
            onClick={handleLogout}
            className="ml-1 inline-flex items-center gap-1 px-3 py-2 rounded text-sm font-medium text-gray-800 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-200"
            title={t("logout")}
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">{t("logout")}</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;









