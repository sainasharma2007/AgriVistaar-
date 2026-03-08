




// src/pages/ChatAssistant.jsx
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";

// Quick suggestion chips per language
const QUICK_SUGGESTIONS = {
  en: [
    "How do I add a new field?",
    "How to request a drone scan?",
    "My wheat has yellow leaves, what to do?",
    "When should I sell my wheat?",
    "Explain my scan report",
    "How to use this app?",
  ],
  hi: [
    "नया खेत कैसे जोड़ें?",
    "ड्रोन स्कैन कैसे बुक करें?",
    "गेहूं की पत्तियां पीली हो रही हैं, क्या करें?",
    "गेहूं कब बेचूं?",
    "स्कैन रिपोर्ट समझाओ",
    "यह ऐप कैसे use करें?",
  ],
  ta: [
    "புதிய நிலம் எப்படி சேர்ப்பது?",
    "ட்ரோன் ஸ்கேன் எப்படி கோருவது?",
    "கோதுமை இலைகள் மஞ்சளாகின்றன?",
    "கோதுமை எப்போது விற்பது?",
    "இந்த app எப்படி பயன்படுத்துவது?",
  ],
  bn: [
    "নতুন জমি কিভাবে যোগ করবো?",
    "ড্রোন স্ক্যান কিভাবে বুক করবো?",
    "গমের পাতা হলুদ হচ্ছে, কী করবো?",
    "গম কখন বিক্রি করবো?",
    "এই অ্যাপ কিভাবে ব্যবহার করবো?",
  ],
  te: [
    "కొత్త పొలం ఎలా జోడించాలి?",
    "డ్రోన్ స్కాన్ ఎలా అభ్యర్థించాలి?",
    "గోధుమ ఆకులు పసుపు రంగులోకి మారుతున్నాయి?",
    "గోధుమ ఎప్పుడు అమ్మాలి?",
    "ఈ app ఎలా వాడాలి?",
  ],
  mr: [
    "नवीन शेत कसे जोडायचे?",
    "ड्रोन स्कॅन कसे बुक करायचे?",
    "गव्हाची पाने पिवळी होत आहेत?",
    "गहू कधी विकायचा?",
    "हे अ‍ॅप कसे वापरायचे?",
  ],
};

// Demo replies — no API needed
const DEMO_REPLIES = {
  en: {
    "how do i add a new field?": "To add a new field:\n1. Go to Home page\n2. Click '+ Add New Field' button\n3. Fill in field name, village, crop type & area\n4. Click Save ✅\n\nYour field will appear on the dashboard instantly!",
    "how to request a drone scan?": "To request a drone scan:\n1. Click 'Request Drone Scan' on home page\n2. Select your field from the list\n3. Choose crop stage (Early / Mid / Pre-harvest)\n4. Pick your preferred date\n5. Submit the request 🚁\n\nOperator will confirm within 24 hours!",
    "my wheat has yellow leaves, what to do?": "Yellow leaves in wheat usually mean:\n🔴 Nitrogen deficiency — apply Urea (45kg/acre)\n🟡 Rust disease — spray Propiconazole fungicide\n💧 Overwatering — check drainage\n\nBook a drone scan for accurate diagnosis! 📊",
    "when should i sell my wheat?": "Best time to sell wheat:\n📈 Wait 2-3 weeks after harvest when prices peak\n💰 Current MSP is ₹2,275/quintal\n🏪 Check your nearest mandi prices in the Mandi section\n\nAvoid selling immediately after harvest — prices are lowest then!",
    "explain my scan report": "Your scan report shows:\n🌿 NDVI Score — crop health (0.6+ is good)\n⚠️ Stress zones — areas needing attention\n💧 Moisture levels — irrigation needs\n🐛 Pest detection — early warning\n\nGo to Fields → tap any field → View Report for details!",
    "how to use this app?": "AgriVistaar App Guide:\n1. 🏠 Home — see all your fields & alerts\n2. ➕ Add Field — register your farmland\n3. 🚁 Request Scan — book drone survey\n4. 📊 View Reports — see crop health\n5. 💰 Profit Calculator — estimate earnings\n6. 🌾 Mandi Prices — check today's rates\n\nAsk me anything specific!",
    default: "🚧 Full AI assistant coming soon!\n\nFor now I can help with:\n• How to use the app\n• Basic crop problems\n• Mandi price guidance\n\nTry one of the quick questions below, or contact your local Krishi Vigyan Kendra for expert advice! 🌾"
  },
  hi: {
    "नया खेत कैसे जोड़ें?": "नया खेत जोड़ने के लिए:\n1. Home पेज पर जाएं\n2. '+ नया खेत जोड़ें' बटन दबाएं\n3. खेत का नाम, गांव, फसल और क्षेत्र भरें\n4. Save करें ✅\n\nआपका खेत तुरंत डैशबोर्ड पर दिखेगा!",
    "ड्रोन स्कैन कैसे बुक करें?": "ड्रोन स्कैन बुक करने के लिए:\n1. होम पेज पर 'ड्रोन स्कैन बुक करें' दबाएं\n2. अपना खेत चुनें\n3. फसल की अवस्था चुनें (शुरुआती/मध्य/कटाई से पहले)\n4. पसंदीदा तारीख चुनें\n5. Submit करें 🚁\n\nऑपरेटर 24 घंटे में पुष्टि करेगा!",
    "गेहूं की पत्तियां पीली हो रही हैं, क्या करें?": "गेहूं में पीली पत्तियों के कारण:\n🔴 नाइट्रोजन की कमी — यूरिया डालें (45 किग्रा/एकड़)\n🟡 रस्ट रोग — Propiconazole का छिड़काव करें\n💧 ज़्यादा पानी — जल निकासी जांचें\n\nसटीक निदान के लिए ड्रोन स्कैन बुक करें! 📊",
    "गेहूं कब बेचूं?": "गेहूं बेचने का सही समय:\n📈 कटाई के 2-3 हफ्ते बाद जब दाम अच्छे हों\n💰 MSP अभी ₹2,275/क्विंटल है\n🏪 मंडी सेक्शन में आज के भाव देखें\n\nकटाई के तुरंत बाद मत बेचें — तब दाम सबसे कम होते हैं!",
    "स्कैन रिपोर्ट समझाओ": "स्कैन रिपोर्ट में दिखता है:\n🌿 NDVI स्कोर — फसल स्वास्थ्य (0.6+ अच्छा है)\n⚠️ तनाव क्षेत्र — ध्यान देने वाली जगहें\n💧 नमी स्तर — सिंचाई की जरूरत\n🐛 कीट पहचान — शुरुआती चेतावनी\n\nखेत → टैप करें → रिपोर्ट देखें!",
    "यह ऐप कैसे use करें?": "AgriVistaar ऐप गाइड:\n1. 🏠 होम — सभी खेत और अलर्ट देखें\n2. ➕ खेत जोड़ें — अपनी ज़मीन रजिस्टर करें\n3. 🚁 स्कैन बुक करें — ड्रोन सर्वे\n4. 📊 रिपोर्ट देखें — फसल स्वास्थ्य\n5. 💰 मुनाफा कैलकुलेटर — कमाई का अनुमान\n6. 🌾 मंडी भाव — आज के रेट\n\nकोई भी सवाल पूछें!",
    default: "🚧 पूरा AI असिस्टेंट जल्द आ रहा है!\n\nअभी मैं इनमें मदद कर सकता हूं:\n• ऐप का उपयोग कैसे करें\n• बुनियादी फसल समस्याएं\n• मंडी भाव की जानकारी\n\nनीचे दिए त्वरित सवाल पूछें, या अपने स्थानीय कृषि विज्ञान केंद्र से संपर्क करें! 🌾"
  },
  default: "🚧 AI assistant coming soon!\n\nContact your local Krishi Vigyan Kendra for expert farming advice. 🌾"
};

function getDemoReply(text, language) {
  const lang = language || "en";
  const replies = DEMO_REPLIES[lang] || DEMO_REPLIES.en;
  const key = text.toLowerCase().trim();
  return replies[key] || replies.default || DEMO_REPLIES.default;
}

// Typing indicator
const TypingDots = () => (
  <div className="flex items-center gap-1 px-3 py-2">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
        style={{ animationDelay: `${i * 0.15}s` }}
      />
    ))}
  </div>
);

// Message bubble
const Bubble = ({ msg }) => {
  const isUser = msg.from === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-bold mr-2 flex-shrink-0 mt-1">
          🌾
        </div>
      )}
      <div
        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-emerald-600 text-white rounded-br-sm"
            : "bg-white border border-gray-100 shadow-sm text-gray-800 rounded-bl-sm"
        }`}
      >
        {msg.text}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm ml-2 flex-shrink-0 mt-1">
          👨‍🌾
        </div>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════
const ChatAssistant = () => {
  const { t, language } = useLanguage();

  const welcomeMsg = {
    en: "Hello! 🙏 I am Sathi — your AI farming assistant.\n\nI can help you with:\n🌾 Crop health & pest problems\n📊 Understanding drone scan reports\n💰 Mandi price advice & best time to sell\n📱 How to use this app step by step\n\nAsk me anything in English, Hindi, or any Indian language!",
    hi: "नमस्ते! 🙏 मैं साथी हूं — आपका एआई खेती सहायक।\n\nमैं इन विषयों में मदद कर सकता हूं:\n🌾 फसल स्वास्थ्य और कीट समस्याएं\n📊 ड्रोन स्कैन रिपोर्ट को समझना\n💰 मंडी कीमत और बेचने का सही समय\n📱 इस ऐप को चरण दर चरण उपयोग करना\n\nकोई भी सवाल पूछें — हिंदी या किसी भी भाषा में!",
    ta: "வணக்கம்! 🙏 நான் சாத்தி — உங்கள் AI விவசாய உதவியாளர்.\n\nகேள்விகள் கேளுங்கள்!",
    bn: "নমস্কার! 🙏 আমি সাথী — আপনার AI কৃষি সহায়ক।\n\nযেকোনো প্রশ্ন করুন!",
    te: "నమస్కారం! 🙏 నేను సాథీ — మీ AI వ్యవసాయ సహాయకుడు.\n\nఏదైనా అడగండి!",
    mr: "नमस्कार! 🙏 मी साथी — तुमचा AI शेती सहाय्यक.\n\nकाहीही विचारा!",
  };

  const [messages, setMessages] = useState([
    { from: "bot", text: welcomeMsg[language] || welcomeMsg.en },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { from: "user", text: trimmed }]);
    setLoading(true);

    // Simulate typing delay (makes it feel real)
    await new Promise((resolve) => setTimeout(resolve, 900 + Math.random() * 500));

    const reply = getDemoReply(trimmed, language);
    setMessages((prev) => [...prev, { from: "bot", text: reply }]);
    setLoading(false);
    inputRef.current?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const suggestions = QUICK_SUGGESTIONS[language] || QUICK_SUGGESTIONS.en;

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-2xl mx-auto px-3 pb-4">

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3 mb-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xl">
          🌾
        </div>
        <div>
          <h1 className="text-base font-bold text-gray-900">
            {t("aiAssistantTitle")}
          </h1>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <p className="text-xs text-emerald-600 font-medium">
              {language === "hi" ? "ऑनलाइन • सभी भाषाओं में उत्तर देता है" :
               language === "ta" ? "ஆன்லைன் • அனைத்து மொழிகளிலும் பதிலளிக்கிறது" :
               language === "bn" ? "অনলাইন • সব ভাষায় উত্তর দেয়" :
               language === "te" ? "ఆన్‌లైన్ • అన్ని భాషల్లో జవాబిస్తుంది" :
               language === "mr" ? "ऑनलाइन • सर्व भाषांमध्ये उत्तर देतो" :
               "Online • Replies in all languages"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-1 py-2 space-y-1">
        {messages.map((msg, idx) => (
          <Bubble key={idx} msg={msg} />
        ))}
        {loading && (
          <div className="flex justify-start mb-3">
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-bold mr-2 flex-shrink-0 mt-1">
              🌾
            </div>
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-bl-sm">
              <TypingDots />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick suggestions */}
      {messages.length <= 2 && !loading && (
        <div className="mb-3">
          <p className="text-xs text-gray-400 mb-2 px-1">
            {language === "hi" ? "जल्दी पूछें:" : "Quick questions:"}
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.slice(0, 4).map((s, i) => (
              <button
                key={i}
                onClick={() => sendMessage(s)}
                className="text-xs bg-white border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-full hover:bg-emerald-50 transition-colors shadow-sm"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm flex items-end gap-2 px-3 py-2"
      >
        <textarea
          ref={inputRef}
          rows={1}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder={
            language === "hi" ? "अपना सवाल लिखें..." :
            language === "ta" ? "உங்கள் கேள்வியை தட்டச்சு செய்யுங்கள்..." :
            language === "bn" ? "আপনার প্রশ্ন লিখুন..." :
            language === "te" ? "మీ ప్రశ్న టైప్ చేయండి..." :
            language === "mr" ? "तुमचा प्रश्न लिहा..." :
            "Ask anything about farming, crops, or app usage..."
          }
          className="flex-1 resize-none outline-none text-sm text-gray-800 placeholder-gray-400 leading-relaxed"
          style={{ minHeight: "24px", maxHeight: "100px" }}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="flex-shrink-0 w-9 h-9 bg-emerald-600 disabled:bg-gray-300 text-white rounded-full flex items-center justify-center hover:bg-emerald-700 transition-colors"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </form>

      <p className="text-[10px] text-gray-400 text-center mt-2">
        {language === "hi"
          ? "साथी AI है — गंभीर समस्या के लिए अपने Krishi Vigyan Kendra से मिलें।"
          : "Sathi is AI — for serious issues, consult your local Krishi Vigyan Kendra."}
      </p>
    </div>
  );
};

export default ChatAssistant;