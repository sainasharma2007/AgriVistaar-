# import sys
# import json
# import numpy as np
# import joblib
# import os
# import math

# sys.stdout.reconfigure(encoding='utf-8')

# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# MODEL_PATH = os.path.join(BASE_DIR, "fraud_model.pkl")
# SCALER_PATH = os.path.join(BASE_DIR, "scaler.pkl")

# # Arguments lao Node.js se
# price    = float(sys.argv[1]) if len(sys.argv) > 1 else 10
# daysHeld = float(sys.argv[2]) if len(sys.argv) > 2 else 30
# hashValid = float(sys.argv[3]) if len(sys.argv) > 3 else 1

# # Model load karo
# model  = joblib.load(MODEL_PATH)
# scaler = joblib.load(SCALER_PATH)

# # 8 features banao
# features = [
#     min(price / 100, 1.0),   # price_anomaly
#     daysHeld,                 # ownership_velocity
#     hashValid,                # hash_validity
#     2.0,                      # scan_frequency (default)
#     1.0,                      # area_price_ratio (default)
#     0.1,                      # location_consistency (default)
#     0,                        # request_time_pattern (default)
#     0.1                       # repeat_flag (default)
# ]

# arr = np.array([features])
# arr_scaled = scaler.transform(arr)
# raw = model.decision_function(arr_scaled)[0]
# score = round(1 / (1 + math.exp(raw * 3)), 2)
# score = max(0.0, min(1.0, score))

# if score >= 0.7:
#     risk = "HIGH"
# elif score >= 0.3:
#     risk = "MEDIUM"
# else:
#     risk = "LOW"

# result = {
#     "fraudRiskScore": score,
#     "riskLevel": risk,
#     "is_fraud": 1 if score >= 0.7 else 0,
#     "details": "High risk detected" if score >= 0.7 else "Moderate risk" if score >= 0.3 else "Normal transaction",
#     "model": "Isolation Forest v3"
# }

# print(json.dumps(result))

import sys
import json
import numpy as np
import joblib
import os
import math
sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH  = os.path.join(BASE_DIR, "fraud_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "scaler.pkl")

# ── 8 arguments lao Node.js se ───────────────────────────
# argv[1] = price / areaInAcre
# argv[2] = daysHeld
# argv[3] = hashValid (1 or 0)
# argv[4] = scanFrequency
# argv[5] = areaPriceRatio
# argv[6] = locationConsistency
# argv[7] = requestTimePattern
# argv[8] = repeatFlag

price               = float(sys.argv[1]) if len(sys.argv) > 1 else 10
daysHeld            = float(sys.argv[2]) if len(sys.argv) > 2 else 30
hashValid           = float(sys.argv[3]) if len(sys.argv) > 3 else 1
scanFrequency       = float(sys.argv[4]) if len(sys.argv) > 4 else 2.0
areaPriceRatio      = float(sys.argv[5]) if len(sys.argv) > 5 else 1.0
locationConsistency = float(sys.argv[6]) if len(sys.argv) > 6 else 0.1
requestTimePattern  = float(sys.argv[7]) if len(sys.argv) > 7 else 0
repeatFlag          = float(sys.argv[8]) if len(sys.argv) > 8 else 0.1

# ── 8 features (model se match karo) ─────────────────────
features = [
    min(price / 100, 1.0),  # price_anomaly
    daysHeld,               # ownership_velocity
    hashValid,              # hash_validity
    scanFrequency,          # scan_frequency
    areaPriceRatio,         # area_price_ratio
    locationConsistency,    # location_consistency
    requestTimePattern,     # request_time_pattern
    repeatFlag,             # repeat_flag
]

model  = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

arr        = np.array([features])
arr_scaled = scaler.transform(arr)
raw        = model.decision_function(arr_scaled)[0]
score      = round(1 / (1 + math.exp(raw * 3)), 2)
score      = max(0.0, min(1.0, score))

if score >= 0.7:
    risk = "HIGH"
elif score >= 0.3:
    risk = "MEDIUM"
else:
    risk = "LOW"

result = {
    "fraudRiskScore": score,
    "riskLevel":      risk,
    "is_fraud":       1 if score >= 0.7 else 0,
    "details":        "High risk detected" if score >= 0.7
                      else "Moderate risk" if score >= 0.3
                      else "Normal transaction",
    "model":          "Isolation Forest v3",
}

print(json.dumps(result))