"""
Confusion Matrix Generator — v3 (8 features)
Run: python backend/ai_models/generate_confusion_matrix.py
"""

import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from sklearn.metrics import (
    confusion_matrix, classification_report,
    accuracy_score, precision_score, recall_score, f1_score
)
import joblib
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "fraud_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "scaler.pkl")
OUTPUT_PATH = os.path.join(BASE_DIR, "confusion_matrix.png")

np.random.seed(99)

N_NORMAL = 300
N_FRAUD = 100

normal = np.column_stack([
    np.random.uniform(0.1, 0.5, N_NORMAL),
    np.random.uniform(60, 365, N_NORMAL),
    np.ones(N_NORMAL),
    np.random.uniform(1, 3, N_NORMAL),
    np.random.uniform(0.8, 1.2, N_NORMAL),
    np.random.uniform(0.0, 0.2, N_NORMAL),
    np.random.choice([0, 1], N_NORMAL, p=[0.85, 0.15]),
    np.random.uniform(0.0, 0.3, N_NORMAL),
])

fraud = np.column_stack([
    np.random.uniform(0.7, 1.0, N_FRAUD),
    np.random.uniform(1, 15, N_FRAUD),
    np.random.choice([0, 1], N_FRAUD, p=[0.7, 0.3]),
    np.random.uniform(5, 15, N_FRAUD),
    np.random.uniform(2.0, 5.0, N_FRAUD),
    np.random.uniform(0.6, 1.0, N_FRAUD),
    np.random.choice([0, 1], N_FRAUD, p=[0.3, 0.7]),
    np.random.uniform(0.6, 1.0, N_FRAUD),
])

X_test = np.vstack([normal, fraud])
y_true = np.array([0] * N_NORMAL + [1] * N_FRAUD)

print("Loading model...")
model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

X_scaled = scaler.transform(X_test)
raw_scores = model.decision_function(X_scaled)
threshold = np.percentile(raw_scores, 22)
y_pred = (raw_scores < threshold).astype(int)

acc  = accuracy_score(y_true, y_pred)
prec = precision_score(y_true, y_pred, zero_division=0)
rec  = recall_score(y_true, y_pred, zero_division=0)
f1   = f1_score(y_true, y_pred, zero_division=0)
cm   = confusion_matrix(y_true, y_pred)

print("\n📊 Classification Report:")
print(classification_report(y_true, y_pred, target_names=["Normal", "Fraud"]))
print(f"✅ Accuracy:  {acc:.2%}")
print(f"🎯 Precision: {prec:.2%}")
print(f"🔍 Recall:    {rec:.2%}")
print(f"⚖️  F1 Score:  {f1:.2%}")

fig, axes = plt.subplots(1, 2, figsize=(14, 5))
fig.patch.set_facecolor('#0f1117')

ax1 = axes[0]
ax1.set_facecolor('#0f1117')
ax1.imshow(cm, interpolation='nearest', cmap='Greens')
ax1.set_title('Confusion Matrix', color='white', fontsize=14, fontweight='bold', pad=15)
ax1.set_xlabel('Predicted Label', color='#aaaaaa', fontsize=11)
ax1.set_ylabel('True Label', color='#aaaaaa', fontsize=11)
tick_labels = ['Normal (0)', 'Fraud (1)']
ax1.set_xticks([0, 1])
ax1.set_yticks([0, 1])
ax1.set_xticklabels(tick_labels, color='white', fontsize=10)
ax1.set_yticklabels(tick_labels, color='white', fontsize=10)
for i in range(2):
    for j in range(2):
        color = 'white' if cm[i, j] > cm.max() / 2 else '#111'
        ax1.text(j, i, str(cm[i, j]), ha='center', va='center',
                 fontsize=22, fontweight='bold', color=color)
ax1.tick_params(colors='white')
for spine in ax1.spines.values():
    spine.set_edgecolor('#333')

ax2 = axes[1]
ax2.set_facecolor('#0f1117')
metrics = ['Accuracy', 'Precision', 'Recall', 'F1 Score']
values  = [acc, prec, rec, f1]
colors  = ['#00c896', '#00a8ff', '#ffaa00', '#ff6b6b']
bars = ax2.bar(metrics, values, color=colors, width=0.5, edgecolor='none', zorder=3)
ax2.set_ylim(0, 1.15)
ax2.set_title('Model Performance Metrics', color='white', fontsize=14, fontweight='bold', pad=15)
ax2.tick_params(colors='white', labelsize=10)
ax2.grid(axis='y', color='#222', linestyle='--', alpha=0.5, zorder=0)
ax2.set_axisbelow(True)
for spine in ax2.spines.values():
    spine.set_edgecolor('#333')
for bar, val in zip(bars, values):
    ax2.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 0.03,
             f'{val:.1%}', ha='center', va='bottom',
             color='white', fontsize=11, fontweight='bold')

fig.text(0.5, 0.01,
         f'Isolation Forest v3  |  8 Features  |  Test: {len(y_true)} samples  |  Normal: {N_NORMAL}  |  Fraud: {N_FRAUD}',
         ha='center', color='#555', fontsize=9)

plt.tight_layout(rect=[0, 0.04, 1, 1])
plt.savefig(OUTPUT_PATH, dpi=150, bbox_inches='tight', facecolor='#0f1117')
print(f"\n✅ Confusion matrix saved: {OUTPUT_PATH}")