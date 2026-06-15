export const SHEET_URL = import.meta.env.VITE_SHEET_URL || "";
export const CLAUDE_KEY = import.meta.env.VITE_CLAUDE_KEY || "";
export const FITBIT_CLIENT_ID = import.meta.env.VITE_FITBIT_CLIENT_ID || "";

export const USERS = {
  ninoo: {
    name: "Ninoo", emoji: "🧑", age: 30, height: 176,
    weight: 99.1, targetWeight: 85,
    phase1: { start: 100, end: 95, label: "Phase 1 — 100 → 95 kg" },
    targetCalories: 1800, targetProtein: 150, targetCarbs: 150, targetFat: 50,
    color: "#FFB5C8", colorDark: "#E8608A", gradient: "linear-gradient(135deg,#FFB5C8,#FF8FAD)",
    hasFitbit: false,
  },
  mink: {
    name: "Mink", emoji: "👧", age: 25, height: 160,
    weight: 60, targetWeight: 55,
    phase1: { start: 65, end: 60, label: "Phase 1 — 65 → 60 kg" },
    targetCalories: 1500, targetProtein: 120, targetCarbs: 120, targetFat: 40,
    color: "#C9B8F5", colorDark: "#9B7FE8", gradient: "linear-gradient(135deg,#C9B8F5,#9B7FE8)",
    hasFitbit: true,
  },
};

export const KPI = [
  { month: "มิ.ย. 69", target: "~99 kg" },
  { month: "ก.ค. 69", target: "97-98 kg" },
  { month: "ส.ค. 69", target: "94-95 kg" },
  { month: "ก.ย. 69", target: "91-92 kg" },
  { month: "ต.ค. 69", target: "88-89 kg" },
  { month: "พ.ย. 69", target: "85 kg 🎯" },
];

// Muscle groups → sub groups → exercises
export const MUSCLE_GROUPS = {
  "หน้าอก 💪": {
    "อกบน": ["Incline Bench Press", "Incline Dumbbell Press", "Cable Fly High to Low"],
    "อกกลาง": ["Bench Press", "Dumbbell Press", "Cable Fly", "Push Up"],
    "อกล่าง": ["Decline Bench Press", "Dip", "Cable Fly Low to High"],
  },
  "หลัง 🔙": {
    "หลังบน (Trap)": ["Barbell Row", "Dumbbell Row", "Face Pull", "Shrug"],
    "หลังกลาง (Lat)": ["Lat Pulldown", "Pull Up", "Cable Row", "Seated Row"],
    "หลังล่าง": ["Deadlift", "Romanian Deadlift", "Hyperextension"],
  },
  "ไหล่ 🏔️": {
    "ไหล่หน้า": ["Front Raise", "Shoulder Press", "Arnold Press"],
    "ไหล่ข้าง": ["Lateral Raise", "Upright Row", "Cable Lateral Raise"],
    "ไหล่หลัง": ["Reverse Fly", "Face Pull", "Rear Delt Row"],
  },
  "แขน 💪": {
    "หน้าแขน (Bicep)": ["Barbell Curl", "Dumbbell Curl", "Hammer Curl", "Cable Curl"],
    "หลังแขน (Tricep)": ["Tricep Pushdown", "Overhead Extension", "Skull Crusher", "Dip"],
    "แขนท่อนล่าง": ["Wrist Curl", "Reverse Curl"],
  },
  "ขา 🦵": {
    "หน้าขา (Quad)": ["Squat", "Hack Squat", "Leg Press", "Leg Extension", "Lunge"],
    "หลังขา (Hamstring)": ["Romanian Deadlift", "Leg Curl", "Stiff Leg Deadlift"],
    "น่อง": ["Calf Raise", "Seated Calf Raise", "Donkey Calf Raise"],
    "สะโพก (Glute)": ["Hip Thrust", "Glute Bridge", "Cable Kickback"],
  },
  "ท้อง 🎯": {
    "ท้องบน": ["Crunch", "Cable Crunch", "Sit Up"],
    "ท้องล่าง": ["Leg Raise", "Reverse Crunch", "Hanging Knee Raise"],
    "ท้องข้าง": ["Russian Twist", "Side Plank", "Oblique Crunch"],
  },
};
