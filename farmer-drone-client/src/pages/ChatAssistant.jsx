// src/Pages/ChatAssistant.jsx
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";

// ══════════════════════════════════════════════
// Gemini API Configuration
// ══════════════════════════════════════════════
const API_KEY = "AIzaSyBOTxlK7PdmaMEfHq5XLd6-j2eyhDylfwQ";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

const LANG_NAMES = {
  en: "English", hi: "Hindi", ta: "Tamil",
  te: "Telugu", mr: "Marathi", bn: "Bengali", pa: "Punjabi",
};

const getSystemPrompt = (lang) => {
  const langName = LANG_NAMES[lang] || "English";
  return `You are Sathi — an expert AI farming assistant for the AgriVistaar app.

LANGUAGE RULE (MOST IMPORTANT):
- The user's selected language is: ${langName}
- You MUST write your ENTIRE response in ${langName} only.
- Do NOT use English if language is Hindi, Tamil, Telugu, etc.
- Do NOT mix languages. Pure ${langName} only.

YOUR EXPERTISE — answer ONLY:
1. Agriculture & Farming: crops, soil, irrigation, fertilizers, pesticides, crop diseases, harvesting, organic farming, seeds, livestock.
2. Drone Scan Reports: NDVI scores, stress zones, moisture levels, pest detection.
3. Mandi Prices & Selling: best time to sell, MSP rates, market trends.
4. AgriVistaar App Help: add fields, book drone scans, view reports.
5. Government Schemes: PM-Kisan, crop insurance, farmer subsidies.

For any other topic, refuse politely in ${langName} only.
Be friendly, practical, concise. Use emojis.`;
};

const QUICK_SUGGESTIONS = {
  en: ["How do I add a new field?", "How to book a drone scan?", "My wheat has yellow leaves?", "When should I sell wheat?"],
  hi: ["नया खेत कैसे जोड़ें?", "ड्रोन स्कैन कैसे बुक करें?", "गेहूं की पत्तियां पीली हो रही हैं?", "गेहूं कब बेचूं?"],
  ta: ["புதிய நிலம் எப்படி சேர்ப்பது?", "ட்ரோன் ஸ்கேன் எப்படி?", "பயிர் நோய் உதவி?", "கோதுமை எப்போது விற்பது?"],
  te: ["కొత్త పొలం ఎలా జోడించాలి?", "డ్రోన్ స్కాన్ ఎలా?", "పంట వ్యాధి సహాయం?", "గోధుమ ఎప్పుడు అమ్మాలి?"],
  mr: ["नवीन शेत कसे जोडायचे?", "ड्रोन स्कॅन कसे बुक करायचे?", "पीक रोग मदत?", "गहू कधी विकायचा?"],
  bn: ["নতুন জমি কিভাবে যোগ করবো?", "ড্রোন স্ক্যান কিভাবে বুক করবো?", "গমের পাতা হলুদ?", "গম কখন বিক্রি করবো?"],
  pa: ["ਨਵਾਂ ਖੇਤ ਕਿਵੇਂ ਜੋੜੀਏ?", "ਡਰੋਨ ਸਕੈਨ ਕਿਵੇਂ ਕਰੀਏ?", "ਫਸਲ ਦੀ ਬਿਮਾਰੀ?", "ਕਣਕ ਕਦੋਂ ਵੇਚੀਏ?"],
};

const WELCOME = {
  en: "Hello! 🙏 I am Sathi — your AI farming assistant.\n\nI can help with:\n🌾 Crop health & pest problems\n📊 Drone scan reports\n💰 Mandi prices & best time to sell\n📱 How to use AgriVistaar app\n🏛️ Government schemes for farmers\n\nAsk me anything!",
  hi: "नमस्ते! 🙏 मैं साथी हूं — आपका AI खेती सहायक।\n\nमैं इनमें मदद करता हूं:\n🌾 फसल स्वास्थ्य और कीट समस्याएं\n📊 ड्रोन स्कैन रिपोर्ट\n💰 मंडी भाव और बेचने का सही समय\n📱 AgriVistaar ऐप उपयोग\n🏛️ किसान सरकारी योजनाएं\n\nकोई भी सवाल पूछें!",
  ta: "வணக்கம்! 🙏 நான் சாத்தி — உங்கள் AI விவசாய உதவியாளர்.\n\nவிவசாயம், பயிர் நோய்கள், மண்டி விலைகள், ஆப் பயன்பாடு — எதுவேனும் கேளுங்கள்!",
  te: "నమస్కారం! 🙏 నేను సాథీ — మీ AI వ్యవసాయ సహాయకుడు.\n\nవ్యవసాయం, పంట వ్యాధులు, మండి ధరలు, యాప్ వాడకం — ఏదైనా అడగండి!",
  mr: "नमस्कार! 🙏 मी साथी — तुमचा AI शेती सहाय्यक.\n\nशेती, पीक रोग, मंडी भाव, अ‍ॅप वापर — काहीही विचारा!",
  bn: "নমস্কার! 🙏 আমি সাথী — আপনার AI কৃষি সহায়ক।\n\nচাষ, ফসলের রোগ, বাজার মূল্য — যেকোনো প্রশ্ন করুন!",
  pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! 🙏 ਮੈਂ ਸਾਥੀ ਹਾਂ — ਤੁਹਾਡਾ AI ਖੇਤੀ ਸਹਾਇਕ।\n\nਖੇਤੀ, ਫਸਲ ਰੋਗ, ਮੰਡੀ ਭਾਅ — ਕੁਝ ਵੀ ਪੁੱਛੋ!",
};

const PLACEHOLDERS = {
  en: "Ask anything about farming or app...",
  hi: "खेती या ऐप के बारे में कुछ भी पूछें...",
  ta: "விவசாயம் பற்றி கேளுங்கள்...",
  te: "వ్యవసాయం గురించి అడగండి...",
  mr: "शेतीबद्दल विचारा...",
  bn: "কৃষি সম্পর্কে জিজ্ঞাসা করুন...",
  pa: "ਖੇਤੀ ਬਾਰੇ ਪੁੱਛੋ...",
};

const VOICE_LANG_MAP = {
  en: "en-IN", hi: "hi-IN", ta: "ta-IN",
  te: "te-IN", mr: "mr-IN", bn: "bn-IN", pa: "pa-IN",
};

async function askGemini(userText, chatHistory, lang) {
  const contents = [
    ...chatHistory
      .filter((_, i) => i > 0)
      .map((m) => ({
        role: m.from === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      })),
    { role: "user", parts: [{ text: userText }] },
  ];

  const response = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: getSystemPrompt(lang) }] },
      contents,
      generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Error ${response.status}`);
  }

  const data = await response.json();
  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Sorry, no response received. Please try again."
  );
}

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

const Bubble = ({ msg }) => {
  const isUser = msg.from === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm mr-2 flex-shrink-0 mt-1">
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
        {msg.errorDetail && (
          <p className="text-xs text-red-400 mt-1">⚠️ {msg.errorDetail}</p>
        )}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm ml-2 flex-shrink-0 mt-1">
          👨‍🌾
        </div>
      )}
    </div>
  );
};

const ChatAssistant = () => {
  // ✅ Fixed: useLanguage called properly, no try/catch needed
  const { language = "en" } = useLanguage();

  const [messages, setMessages] = useState([
    { from: "bot", text: WELCOME[language] || WELCOME.en },
  ]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceOk, setVoiceOk]     = useState(false);

  const bottomRef   = useRef(null);
  const textareaRef = useRef(null);
  const recogRef    = useRef(null);

  useEffect(() => {
    setVoiceOk(!!(window.SpeechRecognition || window.webkitSpeechRecognition));
  }, []);

  useEffect(() => {
    setMessages([{ from: "bot", text: WELCOME[language] || WELCOME.en }]);
    setInput("");
  }, [language]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (override) => {
    const text = (override ?? input).trim();
    if (!text || loading) return;

    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    setMessages((prev) => [...prev, { from: "user", text }]);
    setLoading(true);

    try {
      const reply = await askGemini(text, messages, language);
      setMessages((prev) => [...prev, { from: "bot", text: reply }]);
    } catch (error) { // ✅ Fixed: renamed from 'err' and used
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: language === "hi"
            ? "❌ जवाब नहीं मिला। इंटरनेट जांचें और दोबारा कोशिश करें।"
            : "❌ Could not get a response. Please try again.",
          errorDetail: error.message,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleVoice = async () => {
    if (!voiceOk) return;

    if (listening) {
      recogRef.current?.stop();
      setListening(false);
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      alert("Microphone access denied! Please allow microphone in browser settings.");
      return;
    }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const r  = new SR();
    r.lang           = VOICE_LANG_MAP[language] || "hi-IN";
    r.continuous     = false;
    r.interimResults = true;
    recogRef.current = r;

    r.onstart  = () => setListening(true);
    r.onresult = (e) => {
      const transcript = Array.from(e.results).map((x) => x[0].transcript).join("");
      setInput(transcript);
      if (e.results[e.results.length - 1].isFinal) sendMessage(transcript);
    };
    r.onend   = () => setListening(false);
    r.onerror = (e) => {
      console.error("Voice error:", e.error);
      setListening(false);
      if (e.error === "not-allowed") {
        alert("Microphone blocked! Chrome mein address bar ke paas lock icon click karke microphone Allow karo.");
      }
    };
    r.start();
  };

  const suggestions     = QUICK_SUGGESTIONS[language] || QUICK_SUGGESTIONS.en;
  const showSuggestions = messages.length <= 2 && !loading;
  const placeholder     = listening ? "🎤 Listening..." : (PLACEHOLDERS[language] || PLACEHOLDERS.en);

  const onlineLabel = {
    hi: "ऑनलाइन • Gemini AI • हिंदी में जवाब",
    ta: "ஆன்லைன் • Gemini AI • தமிழில் பதில்",
    te: "ఆన్‌లైన్ • Gemini AI • తెలుగులో జవాబు",
    mr: "ऑनलाइन • Gemini AI • मराठीत उत्तर",
    bn: "অনলাইন • Gemini AI • বাংলায় উত্তর",
    pa: "ਆਨਲਾਈਨ • Gemini AI • ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ",
    en: "Online • Gemini AI • All languages",
  }[language] || "Online • Gemini AI";

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-2xl mx-auto px-3 pb-4">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3 mb-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xl">
          🌾
        </div>
        <div>
          <h1 className="text-base font-bold text-gray-900">Sathi — AI Farming Assistant</h1>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <p className="text-xs text-emerald-600 font-medium">{onlineLabel}</p>
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
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm mr-2 flex-shrink-0 mt-1">
              🌾
            </div>
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-bl-sm">
              <TypingDots />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick Suggestions */}
      {showSuggestions && (
        <div className="mb-3">
          <p className="text-xs text-gray-400 mb-2 px-1">
            {language === "hi" ? "जल्दी पूछें:" :
             language === "ta" ? "விரைவு கேள்விகள்:" :
             language === "te" ? "త్వరిత ప్రశ్నలు:" :
             language === "mr" ? "लवकर विचारा:" :
             language === "bn" ? "দ্রুত প্রশ্ন:" :
             language === "pa" ? "ਜਲਦੀ ਪੁੱਛੋ:" : "Quick questions:"}
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
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

      {/* Input Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex items-end gap-2 px-3 py-2">
        <textarea
          ref={textareaRef}
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
          placeholder={placeholder}
          className="flex-1 resize-none outline-none text-sm text-gray-800 placeholder-gray-400 leading-relaxed"
          style={{ minHeight: "24px", maxHeight: "100px" }}
          disabled={loading}
        />

        {voiceOk && (
          <button
            type="button"
            onClick={toggleVoice}
            title={listening ? "Stop listening" : "Voice input"}
            className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              listening
                ? "bg-red-500 text-white animate-pulse shadow-lg"
                : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
            }`}
          >
            {listening ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )}
          </button>
        )}

        <button
          type="button"
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          className="flex-shrink-0 w-9 h-9 bg-emerald-600 disabled:bg-gray-300 text-white rounded-full flex items-center justify-center hover:bg-emerald-700 transition-colors"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </div>

      <p className="text-[10px] text-gray-400 text-center mt-2">
        {language === "hi"
          ? "साथी Gemini AI पर चलता है — गंभीर समस्या के लिए Krishi Vigyan Kendra से मिलें।"
          : "Sathi runs on Gemini AI — for serious issues, consult your local Krishi Vigyan Kendra."}
      </p>
    </div>
  );
};

export default ChatAssistant;