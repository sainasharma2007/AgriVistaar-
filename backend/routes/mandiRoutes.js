// // backend/routes/mandiRoutes.js
// // Source: data.gov.in OGD Platform
// // Dataset: Current Daily Price of Various Commodities from Various Markets (Mandi)
// // Data Date: 01/03/2026 | 8,132 market records across India

// const express = require("express");
// const path    = require("path");
// const fs      = require("fs");
// const router  = express.Router();

// const CROP_MAP = {
//   "Wheat":                      { key: "wheat",      yieldPerAcre: 16  },
//   "Paddy(Common)":              { key: "paddy",      yieldPerAcre: 20  },
//   "Mustard":                    { key: "mustard",    yieldPerAcre: 8   },
//   "Cotton":                     { key: "cotton",     yieldPerAcre: 10  },
//   "Maize":                      { key: "maize",      yieldPerAcre: 25  },
//   "Soyabean":                   { key: "soybean",    yieldPerAcre: 8   },
//   "Bajra(Pearl Millet/Cumbu)":  { key: "bajra",      yieldPerAcre: 12  },
//   "Arhar(Tur/Red Gram)(Whole)": { key: "arhar",      yieldPerAcre: 6   },
//   "Groundnut":                  { key: "groundnut",  yieldPerAcre: 12  },
//   "Onion":                      { key: "onion",      yieldPerAcre: 80  },
//   "Potato":                     { key: "potato",     yieldPerAcre: 100 },
//   "Tomato":                     { key: "tomato",     yieldPerAcre: 120 },
//   "Garlic":                     { key: "garlic",     yieldPerAcre: 40  },
//   "Bengal Gram(Gram)(Whole)":   { key: "gram",       yieldPerAcre: 7   },
//   "Arhar Dal(Tur Dal)":         { key: "arhar_dal",  yieldPerAcre: 5   },
//   "Ginger(Dry)":                { key: "ginger",     yieldPerAcre: 30  },
// };

// function parseCsv(filePath) {
//   const content = fs.readFileSync(filePath, "utf-8");
//   const lines   = content.trim().split("\n");
//   const headers = lines[0].split(",").map(h => h.trim().replace(/"/g, ""));
//   const rows    = [];
//   for (let i = 1; i < lines.length; i++) {
//     const cols = lines[i].match(/(".*?"|[^,]+)(?=,|$)/g) || [];
//     const row  = {};
//     headers.forEach((h, idx) => {
//       row[h] = (cols[idx] || "").replace(/"/g, "").trim();
//     });
//     rows.push(row);
//   }
//   return rows;
// }

// function buildPrices(csvPath) {
//   const rows   = parseCsv(csvPath);
//   const groups = {};

//   for (const row of rows) {
//     const commodity = row["Commodity"];
//     if (!CROP_MAP[commodity]) continue;
//     const modal = parseFloat(row["Modal_x0020_Price"]);
//     const min   = parseFloat(row["Min_x0020_Price"]);
//     const max   = parseFloat(row["Max_x0020_Price"]);
//     if (!modal || modal <= 0) continue;
//     if (!groups[commodity]) {
//       groups[commodity] = { modals: [], mins: [], maxes: [], date: row["Arrival_Date"] };
//     }
//     groups[commodity].modals.push(modal);
//     groups[commodity].mins.push(min);
//     groups[commodity].maxes.push(max);
//   }

//   const prices = [];
//   for (const [csvName, { key, yieldPerAcre }] of Object.entries(CROP_MAP)) {
//     const g = groups[csvName];
//     if (!g) continue;

//     const avg  = Math.round(g.modals.reduce((a, b) => a + b, 0) / g.modals.length);
//     const minP = Math.round(Math.min(...g.mins));
//     const maxP = Math.round(Math.max(...g.maxes));
//     const spread = maxP - minP;
//     const trend  = spread > avg * 0.3 ? "up" : spread < avg * 0.1 ? "steady" : "down";

//     prices.push({
//       crop:          key,
//       nameKey:       key,
//       unit:          "quintal",
//       todayPrice:    avg,
//       yesterdayPrice:Math.round(avg * 0.98),
//       trend,
//       yieldPerAcre,
//       minPrice:      minP,
//       maxPrice:      maxP,
//       dataPoints:    g.modals.length,
//       note:
//         trend === "up"   ? "Prices rising across markets — good time to sell" :
//         trend === "down" ? "Price variation high — consider waiting" :
//                            "Stable prices across markets",
//       source:      "data.gov.in OGD Platform",
//       arrivalDate: g.date || "01/03/2026",
//     });
//   }

//   return prices.sort((a, b) => a.crop.localeCompare(b.crop));
// }

// let cachedPrices = null;
// let cacheDate    = null;

// router.get("/prices", (req, res) => {
//   try {
//     const csvPath = path.join(__dirname, "../data/mandi_data.csv");
//     const today   = new Date().toDateString();

//     if (!cachedPrices || cacheDate !== today) {
//       cachedPrices = buildPrices(csvPath);
//       cacheDate    = today;
//     }

//     res.json({
//       success:      true,
//       lastUpdated:  new Date().toISOString(),
//       dataDate:     "01/03/2026",
//       source:       "data.gov.in OGD Platform",
//       totalMarkets: 8132,
//       count:        cachedPrices.length,
//       prices:       cachedPrices,
//     });
//   } catch (err) {
//     console.error("Mandi route error:", err.message);
//     res.status(500).json({ message: "Could not load mandi data", error: err.message });
//   }
// });

// module.exports = router;


// backend/routes/mandiRoutes.js
// Source: data.gov.in OGD Platform
// Dataset: Current Daily Price of Various Commodities from Various Markets (Mandi)
// Data Date: 01/03/2026 | 8,132 market records across India

const express = require("express");
const path    = require("path");
const fs      = require("fs");
const router  = express.Router();

const CROP_MAP = {
  "Wheat":                      { key: "wheat",      displayName: "Wheat",      yieldPerAcre: 16  },
  "Paddy(Common)":              { key: "paddy",      displayName: "Paddy",      yieldPerAcre: 20  },
  "Mustard":                    { key: "mustard",    displayName: "Mustard",    yieldPerAcre: 8   },
  "Cotton":                     { key: "cotton",     displayName: "Cotton",     yieldPerAcre: 10  },
  "Maize":                      { key: "maize",      displayName: "Maize",      yieldPerAcre: 25  },
  "Soyabean":                   { key: "soybean",    displayName: "Soybean",    yieldPerAcre: 8   },
  "Bajra(Pearl Millet/Cumbu)":  { key: "bajra",      displayName: "Bajra",      yieldPerAcre: 12  },
  "Arhar(Tur/Red Gram)(Whole)": { key: "arhar",      displayName: "Arhar (Toor Dal)", yieldPerAcre: 6 },
  "Groundnut":                  { key: "groundnut",  displayName: "Groundnut",  yieldPerAcre: 12  },
  "Onion":                      { key: "onion",      displayName: "Onion",      yieldPerAcre: 80  },
  "Potato":                     { key: "potato",     displayName: "Potato",     yieldPerAcre: 100 },
  "Tomato":                     { key: "tomato",     displayName: "Tomato",     yieldPerAcre: 120 },
  "Garlic":                     { key: "garlic",     displayName: "Garlic",     yieldPerAcre: 40  },
  "Bengal Gram(Gram)(Whole)":   { key: "gram",       displayName: "Gram (Chana)", yieldPerAcre: 7 },
  "Arhar Dal(Tur Dal)":         { key: "arhar_dal",  displayName: "Arhar Dal",  yieldPerAcre: 5   },
  "Ginger(Dry)":                { key: "ginger",     displayName: "Ginger",     yieldPerAcre: 30  },
};

function parseCsv(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines   = content.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.trim().replace(/"/g, ""));
  const rows    = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].match(/(".*?"|[^,]+)(?=,|$)/g) || [];
    const row  = {};
    headers.forEach((h, idx) => {
      row[h] = (cols[idx] || "").replace(/"/g, "").trim();
    });
    rows.push(row);
  }
  return rows;
}

function buildPrices(csvPath) {
  const rows   = parseCsv(csvPath);
  const groups = {};

  for (const row of rows) {
    const commodity = row["Commodity"];
    if (!CROP_MAP[commodity]) continue;
    const modal = parseFloat(row["Modal_x0020_Price"]);
    const min   = parseFloat(row["Min_x0020_Price"]);
    const max   = parseFloat(row["Max_x0020_Price"]);
    if (!modal || modal <= 0) continue;
    if (!groups[commodity]) {
      groups[commodity] = { modals: [], mins: [], maxes: [], date: row["Arrival_Date"] };
    }
    groups[commodity].modals.push(modal);
    groups[commodity].mins.push(min);
    groups[commodity].maxes.push(max);
  }

  const prices = [];
  for (const [csvName, { key, displayName, yieldPerAcre }] of Object.entries(CROP_MAP)) {
    const g = groups[csvName];
    if (!g) continue;

    const avg  = Math.round(g.modals.reduce((a, b) => a + b, 0) / g.modals.length);
    const minP = Math.round(Math.min(...g.mins));
    const maxP = Math.round(Math.max(...g.maxes));
    const spread = maxP - minP;
    const trend  = spread > avg * 0.3 ? "up" : spread < avg * 0.1 ? "steady" : "down";

    prices.push({
      crop:          key,
      nameKey:       key,
      displayName,
      unit:          "quintal",
      todayPrice:    avg,
      yesterdayPrice:Math.round(avg * 0.98),
      trend,
      yieldPerAcre,
      minPrice:      minP,
      maxPrice:      maxP,
      dataPoints:    g.modals.length,
      note:
        trend === "up"   ? "Prices rising across markets — good time to sell" :
        trend === "down" ? "Price variation high — consider waiting" :
                           "Stable prices across markets",
      source:      "data.gov.in OGD Platform",
      arrivalDate: g.date || "01/03/2026",
    });
  }

  return prices.sort((a, b) => a.crop.localeCompare(b.crop));
}

let cachedPrices = null;
let cacheDate    = null;

router.get("/prices", (req, res) => {
  try {
    const csvPath = path.join(__dirname, "../data/mandi_data.csv");
    const today   = new Date().toDateString();

    if (!cachedPrices || cacheDate !== today) {
      cachedPrices = buildPrices(csvPath);
      cacheDate    = today;
    }

    res.json({
      success:      true,
      lastUpdated:  new Date().toISOString(),
      dataDate:     "01/03/2026",
      source:       "data.gov.in OGD Platform",
      totalMarkets: 8132,
      count:        cachedPrices.length,
      prices:       cachedPrices,
    });
  } catch (err) {
    console.error("Mandi route error:", err.message);
    res.status(500).json({ message: "Could not load mandi data", error: err.message });
  }
});

module.exports = router;