


// backend/routes/chatRoutes.js
const express = require("express");
const { auth } = require("../middleware/auth");
const router = express.Router();

// POST /api/chat
router.post("/", auth, async (req, res) => {
  try {
    const { message, language, conversationHistory, fieldContext } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      return res.status(500).json({ message: "OpenAI API key not configured" });
    }

    // System prompt — Sathi persona
    const systemPrompt = `You are Sathi (साथी), an AI farming assistant for AgriVistaar — a drone-based precision agriculture app used by Indian farmers.

YOUR PERSONALITY:
- Warm, patient, simple language like a trusted village elder / agricultural extension officer
- Never use technical jargon without explaining it
- Always relate advice to local Indian farming context
- Be encouraging and positive

WHAT YOU KNOW & CAN HELP WITH:
1. CROP HEALTH: Pests, diseases, nutrient deficiencies, irrigation advice for Indian crops (wheat, paddy, mustard, sugarcane, cotton, pulses, vegetables)
2. MANDI PRICES & SELLING: When to sell, MSP (Minimum Support Price), which mandi to go to, price trends
3. DRONE SCAN REPORTS: Explain what "mild stress in north side" means, what NDVI means, what nitrogen spray to do and when
4. APP USAGE (step-by-step guide for farmers):
   - How to add a new field: Click "+ Add new field" on home page → fill name, village, crop, area → Save
   - How to request a drone scan: Click "Request drone scan" → select your field → choose crop stage → pick a date → submit
   - How to view scan reports: Click on any field card → see completed scans (green "Report ready") → tap to view health summary
   - How to delete a scan: Open field → scroll to "My drone scans" → tap x on the scan you want to remove
   - How to remove a field: On home page, each field card has a x button on the right
   - View last scan: Click "View last scan report" button on home page
   - Profit calculator: Go to "Profit" in navbar → enter area, cost, price, yield
   - Language change: Top navbar has language selector
5. GENERAL FARMING: Sowing dates, fertilizer schedules, weather-based advice for Indian seasons (Kharif/Rabi/Zaid)

LANGUAGE RULES:
- If user writes in Hindi → reply in Hindi (Devanagari script)
- If user writes in Tamil → reply in Tamil
- If user writes in Bengali → reply in Bengali
- If user writes in Telugu → reply in Telugu
- If user writes in Marathi → reply in Marathi
- If user writes in English → reply in English
- Mix Hindi + English (Hinglish) is totally fine if user does it
- ALWAYS match the language the farmer is writing in

FIELD CONTEXT (if available):
${fieldContext ? JSON.stringify(fieldContext, null, 2) : "No specific field data provided"}

FARMER'S LANGUAGE PREFERENCE: ${language || "en"}

RESPONSE STYLE:
- Keep responses SHORT and actionable (3-5 sentences max for simple questions)
- Use emojis sparingly but meaningfully
- For step-by-step instructions, use numbered steps
- End with a helpful follow-up suggestion when relevant
- NEVER give medical advice or diagnose human health issues
- If you do not know something, say "Main is baare mein sure nahi hoon, apne local Krishi Vibhag se poochhen"`;

    // Build messages array
    const messages = [{ role: "system", content: systemPrompt }];

    // Add conversation history (last 10 messages to save tokens)
    if (conversationHistory && Array.isArray(conversationHistory)) {
      const recent = conversationHistory.slice(-10);
      recent.forEach((msg) => {
        messages.push({
          role: msg.from === "user" ? "user" : "assistant",
          content: msg.text,
        });
      });
    }

    // Add current message
    messages.push({ role: "user", content: message });

    // Call OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("OpenAI error:", err);
      return res.status(500).json({ message: "AI service error. Please try again." });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return res.status(500).json({ message: "Empty response from AI" });
    }

    res.json({ reply });
  } catch (err) {
    console.error("Chat route error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;