const axios = require('axios');
const AiAnalysis = require('../models/AiAnalysis');

const analyzeCrop = async (req, res) => {
  try {
    const { imageUrl, inspectionId, productId } = req.body;

    // Flask API call
    const flaskResponse = await axios.post('http://TUMHARA_IP:5001/ml/analyze-crop', {
      imageUrl,
      inspectionId
    });

    const aiResult = flaskResponse.data;

    // MongoDB mein ai_analysis save karo
    const analysis = new AiAnalysis({
      inspectionId,
      model_used: aiResult.model_used,
      input_type: aiResult.input_type,
      confidence: aiResult.confidence,
      results: aiResult.results
    });
    await analysis.save();

    res.json({ success: true, data: aiResult });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { analyzeCrop };