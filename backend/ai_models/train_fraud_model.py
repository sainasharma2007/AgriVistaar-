"""
Fraud Detection Model — Improved Version
Features: 8 (was 3)
Algorithm: Isolation Forest + better training data
Run: python backend/ai_models/train_fraud_model.py
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import joblib
import os
import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "fraud_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "scaler.pkl")

np.random.seed(42)

# ── Feature Engineering (8 features) ────────────────────────
# 1. price_anomaly          — normalized field area (proxy for value)
# 2. ownership_velocity     — days since creation (fast = suspicious)
# 3. hash_validity          — is farmerId a valid ObjectId
# 4. scan_frequency         — how many scans in short time
# 5. area_price_ratio       — area vs expected price ratio
# 6. location_consistency   — district/state mismatch score
# 7. request_time_pattern   — odd hours = suspicious (0=normal, 1=odd)
# 8. repeat_flag            — same farmer repeated requests

print("Generating training data with 8 features...")

N_NORMAL = 800
N_FRAUD = 200

# ── Normal transactions ───────────────────────────────────────
normal = np.column_stack([
    np.random.uniform(0.1, 0.5, N_NORMAL),   # price_anomaly — low
    np.random.uniform(60, 365, N_NORMAL),     # ownership_velocity — slow (normal)
    np.ones(N_NORMAL),                        # hash_validity — valid
    np.random.uniform(1, 3, N_NORMAL),        # scan_frequency — normal
    np.random.uniform(0.8, 1.2, N_NORMAL),    # area_price_ratio — normal
    np.random.uniform(0.0, 0.2, N_NORMAL),    # location_consistency — consistent
    np.random.choice([0, 1], N_NORMAL, p=[0.85, 0.15]),  # request_time_pattern
    np.random.uniform(0.0, 0.3, N_NORMAL),    # repeat_flag — low
])

# ── Fraudulent transactions ───────────────────────────────────
fraud = np.column_stack([
    np.random.uniform(0.7, 1.0, N_FRAUD),    # price_anomaly — HIGH
    np.random.uniform(1, 15, N_FRAUD),        # ownership_velocity — very fast
    np.random.choice([0, 1], N_FRAUD, p=[0.7, 0.3]),  # hash_validity — often invalid
    np.random.uniform(5, 15, N_FRAUD),        # scan_frequency — too many
    np.random.uniform(2.0, 5.0, N_FRAUD),     # area_price_ratio — suspicious
    np.random.uniform(0.6, 1.0, N_FRAUD),     # location_consistency — mismatch
    np.random.choice([0, 1], N_FRAUD, p=[0.3, 0.7]),  # request_time_pattern — odd hours
    np.random.uniform(0.6, 1.0, N_FRAUD),     # repeat_flag — high
])

X_train = np.vstack([normal, fraud])

feature_names = [
    "price_anomaly",
    "ownership_velocity",
    "hash_validity",
    "scan_frequency",
    "area_price_ratio",
    "location_consistency",
    "request_time_pattern",
    "repeat_flag"
]

print(f"Training samples: {len(X_train)} ({N_NORMAL} normal + {N_FRAUD} fraud)")

# ── Scale features ────────────────────────────────────────────
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_train)

# ── Train Isolation Forest ────────────────────────────────────
model = IsolationForest(
    n_estimators=200,
    contamination=0.2,   # 20% fraud in training
    max_features=8,
    random_state=42,
    n_jobs=-1
)

print("Training Isolation Forest (8 features, 200 estimators)...")
model.fit(X_scaled)

# ── Save model ────────────────────────────────────────────────
joblib.dump(model, MODEL_PATH)
joblib.dump(scaler, SCALER_PATH)

# Save feature names for reference
meta_path = os.path.join(BASE_DIR, "model_meta.json")
with open(meta_path, "w") as f:
    json.dump({"features": feature_names, "n_features": 8, "version": "v3"}, f, indent=2)

print(f"Model saved: {MODEL_PATH}")
print(f"Scaler saved: {SCALER_PATH}")
print(f"Meta saved: {meta_path}")
print("\nFeature list:")
for i, name in enumerate(feature_names, 1):
    print(f"   {i}. {name}")
print("\nModel training complete!")


# ── Quick prediction test ─────────────────────────────────────
def predict(features_8):
    """
    features_8: list of 8 values
    [price_anomaly, ownership_velocity, hash_validity, scan_frequency,
     area_price_ratio, location_consistency, request_time_pattern, repeat_flag]
    """
    import sys
    arr = np.array([features_8])
    arr_scaled = scaler.transform(arr)
    raw = model.decision_function(arr_scaled)[0]
    import math
    score = round(1 / (1 + math.exp(raw * 3)), 2)
    score = max(0.0, min(1.0, score))
    if score >= 0.7:
        risk = "HIGH"
    elif score >= 0.3:
        risk = "MEDIUM"
    else:
        risk = "LOW"
    return {"fraudRiskScore": score, "riskLevel": risk}

# Test cases
print("\nQuick test:")
normal_case = [0.2, 180, 1, 2, 1.0, 0.1, 0, 0.1]
fraud_case  = [0.9, 3,   0, 10, 3.5, 0.8, 1, 0.9]

r1 = predict(normal_case)
r2 = predict(fraud_case)
print(f"   Normal transaction -> Score: {r1['fraudRiskScore']} | Risk: {r1['riskLevel']}")
print(f"   Fraud transaction ->  Score: {r2['fraudRiskScore']} | Risk: {r2['riskLevel']}")