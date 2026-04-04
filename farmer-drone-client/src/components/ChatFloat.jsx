// import { useNavigate } from "react-router-dom";
// import { useLanguage } from "../context/LanguageContext";

// const ChatFloat = () => {
//   const navigate = useNavigate();
//   const { t } = useLanguage();

//   return (
//     <button
//       onClick={() => navigate("/chat")}
//       className="fixed bottom-4 right-4 z-30 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg px-4 py-3 flex items-center gap-2"
//     >
//       <span className="text-sm font-semibold">{t("askSathi")}</span>
//       <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
//     </button>
//   );
// };

// export default ChatFloat;

// src/components/ChatFloat.jsx
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const ChatFloat = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <button
      onClick={() => navigate("/chat")}
      className="fixed bottom-5 right-5 z-30 bg-gradient-to-br from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-full shadow-lg px-5 py-3 flex items-center gap-2 transition-all hover:shadow-xl hover:scale-105 border border-green-500"
    >
      <span className="text-lg">🌾</span>
      <span className="text-sm font-semibold">{t("askSathi")}</span>
      <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
    </button>
  );
};

export default ChatFloat;

