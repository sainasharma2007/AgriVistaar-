// backend/scripts/refreshMandi.js
// Run: node scripts/refreshMandi.js
// Yeh script data.gov.in se fresh mandi CSV download karegi
// Hackathon se 1 din pehle run karo — latest data aa jayega!

const https   = require("https");
const fs      = require("fs");
const path    = require("path");

// data.gov.in dataset URL — no API key needed for direct download
const DATASET_URL = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?format=csv&limit=10000";

const OUTPUT_PATH = path.join(__dirname, "../data/mandi_data.csv");

// Ensure data folder exists
const dataDir = path.join(__dirname, "../data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log("📁 Created backend/data/ folder");
}

function downloadFile(url, dest, redirectCount = 0) {
  if (redirectCount > 5) {
    console.error("❌ Too many redirects");
    process.exit(1);
  }

  return new Promise((resolve, reject) => {
    console.log(`⬇️  Downloading from data.gov.in...`);

    const file = fs.createWriteStream(dest);

    https.get(url, { headers: { "User-Agent": "AgriVistaar/1.0" } }, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        console.log(`↪️  Redirecting...`);
        downloadFile(response.headers.location, dest, redirectCount + 1)
          .then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }

      response.pipe(file);
      file.on("finish", () => {
        file.close();
        resolve();
      });
    }).on("error", (err) => {
      fs.unlinkSync(dest);
      reject(err);
    });
  });
}

function validateCsv(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines   = content.trim().split("\n");

  if (lines.length < 10) return { valid: false, reason: "Too few rows" };

  const headers = lines[0];
  if (!headers.includes("Commodity") || !headers.includes("Modal")) {
    return { valid: false, reason: "Wrong format — not mandi CSV" };
  }

  return { valid: true, rows: lines.length - 1 };
}

async function main() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🌾 AgriVistaar Mandi Data Refresher");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`📅 Date: ${new Date().toLocaleDateString("en-IN")}`);
  console.log(`📂 Output: ${OUTPUT_PATH}`);
  console.log();

  // Backup old file if exists
  if (fs.existsSync(OUTPUT_PATH)) {
    const backupPath = OUTPUT_PATH.replace(".csv", `_backup_${Date.now()}.csv`);
    fs.copyFileSync(OUTPUT_PATH, backupPath);
    console.log(`💾 Old data backed up`);
  }

  const tempPath = OUTPUT_PATH + ".tmp";

  try {
    await downloadFile(DATASET_URL, tempPath);

    // Validate downloaded file
    const validation = validateCsv(tempPath);

    if (!validation.valid) {
      fs.unlinkSync(tempPath);
      console.error(`❌ Invalid CSV: ${validation.reason}`);
      console.log("💡 Using existing mandi_data.csv instead");
      process.exit(1);
    }

    // Replace old file with new
    fs.renameSync(tempPath, OUTPUT_PATH);

    console.log(`✅ Download successful!`);
    console.log(`📊 Records: ${validation.rows.toLocaleString()}`);
    console.log(`📅 Data Date: ${new Date().toLocaleDateString("en-IN")}`);
    console.log();
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ Mandi data refreshed! Restart server.");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  } catch (err) {
    // Cleanup temp file
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);

    console.error(`❌ Download failed: ${err.message}`);
    console.log();
    console.log("💡 Manual fallback:");
    console.log("   1. https://data.gov.in pe jaao");
    console.log('   2. "Current Daily Price Commodities" search karo');
    console.log("   3. CSV download karo");
    console.log("   4. backend/data/mandi_data.csv replace karo");
    process.exit(1);
  }
}

main();