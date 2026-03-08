// src/utils/cropScanWindows.js
export const cropScanWindows = {
  wheat: [
    { id: "early", labelKey: "stageEarly", start: 15, end: 30 },
    { id: "mid", labelKey: "stageMid", start: 45, end: 70 },
    { id: "preHarvest", labelKey: "stagePreHarvest", start: 100, end: 120 },
  ],
  paddy: [
    { id: "early", labelKey: "stageEarly", start: 10, end: 25 },
    { id: "mid", labelKey: "stageMid", start: 40, end: 65 },
    { id: "preHarvest", labelKey: "stagePreHarvest", start: 90, end: 110 },
  ],
};


