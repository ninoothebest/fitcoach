// ====== CONFIG ======
export const SHEET_URL = import.meta.env.VITE_SHEET_URL || "";
export const CLAUDE_KEY = import.meta.env.VITE_CLAUDE_KEY || "";

export const USERS = {
  ninoo: {
    name: "Ninoo", emoji: "🧑", age: 30, height: 176,
    weight: 99.5, targetWeight: 85,
    phase1: { start: 100, end: 95, label: "Phase 1 — 100 → 95 kg" },
    targetCalories: 1800, targetProtein: 150, targetCarbs: 150, targetFat: 50,
    color: "#FFB5C8", colorDark: "#E8608A", gradient: "linear-gradient(135deg,#FFB5C8,#FF8FAD)",
  },
  mink: {
    name: "Mink", emoji: "👧", age: 25, height: 160,
    weight: 60, targetWeight: 55,
    phase1: { start: 65, end: 60, label: "Phase 1 — 65 → 60 kg" },
    targetCalories: 1500, targetProtein: 120, targetCarbs: 120, targetFat: 40,
    color: "#C9B8F5", colorDark: "#9B7FE8", gradient: "linear-gradient(135deg,#C9B8F5,#9B7FE8)",
  },
};

export const WORKOUT_PLANS = {
  Push:  ["Bench Press","Incline Dumbbell Press","Shoulder Press","Lateral Raise","Tricep Pushdown","Overhead Tricep Extension"],
  Pull:  ["Deadlift","Lat Pulldown","Barbell Row","Cable Row","Face Pull","Bicep Curl"],
  Leg:   ["Hack Squat","Leg Press","Romanian Deadlift","Leg Curl","Leg Extension","Calf Raise"],
  Upper: ["Bench Press","Barbell Row","Shoulder Press","Lat Pulldown","Lateral Raise","Bicep Curl"],
};

export const KPI = [
  { month: "มิ.ย. 69", target: "~99 kg" },
  { month: "ก.ค. 69", target: "97-98 kg" },
  { month: "ส.ค. 69", target: "94-95 kg" },
  { month: "ก.ย. 69", target: "91-92 kg" },
  { month: "ต.ค. 69", target: "88-89 kg" },
  { month: "พ.ย. 69", target: "85 kg 🎯" },
];
