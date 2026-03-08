import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const ChatFloat = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <button
      onClick={() => navigate("/chat")}
      className="fixed bottom-4 right-4 z-30 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg px-4 py-3 flex items-center gap-2"
    >
      <span className="text-sm font-semibold">{t("askSathi")}</span>
      <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
    </button>
  );
};

export default ChatFloat;

