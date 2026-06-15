import { useState } from "react";
import { Card, SectionTitle, Chip, PrimaryBtn } from "../components/UI";
import { MUSCLE_GROUPS } from "../config";
import { useAI } from "../hooks/useAI";

const WORKOUT_DAYS = ["Push", "Pull", "Leg", "Upper", "ไม่ได้ออก"];

export default function Checkin({ user, userCfg, logs, onSave }) {
  const today = new Date().toLocaleDateString("th-TH");
  const existing = logs.find(l => l.date === today);

  const [logDate, setLogDate] = useState(today);
  const [weight, setWeight] = useState(existing?.weight || "");
  const [bed, setBed] = useState(existing?.bed || "");
  const [wake, setWake] = useState(existing?.wake || "");
  const [breakfast, setBreakfast] = useState(existing?.breakfast || "");
  const [lunch, setLunch] = useState(existing?.lunch || "");
  const [dinner, setDinner] = useState(existing?.dinner || "");
  const [snack, setSnack] = useState(existing?.snack || "");
  const [workout, setWorkout] = useState(existing?.workout || null);
  const [exercises, setExercises] = useState({});
  const [water, setWater] = useState(existing?.water || null);
  const [mood, setMood] = useState(existing?.mood || null);
  const { loading, analyzeCheckin } = useAI();

  const sleepDur = () => {
    if (!bed || !wake) return null;
    const [bh, bm] = bed.split(":").map(Number);
    const [wh, wm] = wake.split(":").map(Number);
    let m = (wh * 60 + wm) - (bh * 60 + bm);
    if (m < 0) m += 1440;
    return `${Math.floor(m / 60)} ชม. ${m % 60 > 0 ? m % 60 + "น." : ""}`;
  };

  const selectWorkout = (day) => {
    setWorkout(day);
    if (day !== "ไม่ได้ออก") {
      const template = {
        Push: ["Bench Press","Incline Dumbbell Press","Shoulder Press","Lateral Raise","Tricep Pushdown"],
        Pull: ["Deadlift","Lat Pulldown","Cable Row","Face Pull","Bicep Curl"],
        Leg: ["Hack Squat","Leg Press","Leg Curl","Leg Extension","Calf Raise"],
        Upper: ["Bench Press","Barbell Row","Shoulder Press","Lat Pulldown","Bicep Curl"],
      };
      if (template[day]) {
        const init = {};
        template[day].forEach((ex, i) => { init[i] = { name: ex, kg: "", sets: "3", reps: "12" }; });
        setExercises(init);
      }
    } else setExercises({});
  };

  const handleSubmit = async () => {
    if (!weight) { alert("กรอกน้ำหนักก่อนนะครับ!"); return; }
    const exList = Object.values(exercises).filter(e => e.kg).map(e => `${e.name} ${e.kg}kg×${e.sets}set×${e.reps}rep`).join(", ");
    const log = {
      date: logDate, weight: parseFloat(weight), bed, wake,
      sleepHrs: sleepDur(), breakfast, lunch, dinner, snack,
      workout: workout || "ไม่ได้ออก", exercises: exList,
      water: water || "ไม่ระบุ", mood: mood || "ไม่ระบุ",
    };
    const analysis = await analyzeCheckin(log, userCfg);
    await onSave({ ...log, analysis });
  };

  const inputStyle = { width: "100%", padding: "11px 14px", background: "#FAF5FF", border: "1.5px solid #EDE8FF", borderRadius: 14, fontFamily: "Quicksand", fontSize: 14, color: "#3D3350", outline: "none", boxSizing: "border-box", colorScheme: "light" };
  const taStyle = { ...inputStyle, resize: "none", height: 68 };

  return (
    <div style={{ padding: "16px 16px 0" }}>
      <Card>
        <SectionTitle>📅 วันที่บันทึก</SectionTitle>
        <input type="date" value={logDate} onChange={e => setLogDate(e.target.value)} style={inputStyle} />
        <div style={{ fontSize: 11, color: "#C0B0D0", marginTop: 6 }}>* กรอกข้อมูลของวันนั้นครับ (ปกติคือเมื่อวาน)</div>
      </Card>

      <Card>
        <SectionTitle>⚖️ น้ำหนัก</SectionTitle>
        <input type="number" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} placeholder="99.5"
          style={{ ...inputStyle, fontSize: 26, fontWeight: 800, textAlign: "center", color: "#E8608A" }} />
      </Card>

      <Card>
        <SectionTitle>😴 การนอน</SectionTitle>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: "#C0B0D0", fontWeight: 700, marginBottom: 5 }}>เข้านอน (คืนนั้น)</div>
            <input type="time" value={bed} onChange={e => setBed(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ color: "#DDD", fontSize: 18, paddingTop: 18 }}>→</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: "#C0B0D0", fontWeight: 700, marginBottom: 5 }}>ตื่นนอน (เช้าวันนั้น)</div>
            <input type="time" value={wake} onChange={e => setWake(e.target.value)} style={inputStyle} />
          </div>
        </div>
        {sleepDur() && <div style={{ textAlign: "center", color: "#3DBF8A", fontWeight: 800, fontSize: 14, marginTop: 10 }}>😴 นอน {sleepDur()}</div>}
      </Card>

      <Card>
        <SectionTitle>🍽️ อาหารวันนั้น</SectionTitle>
        {[["🌅 เช้า", breakfast, setBreakfast], ["☀️ กลางวัน", lunch, setLunch], ["🌙 เย็น", dinner, setDinner], ["🍫 ของว่าง", snack, setSnack]].map(([label, val, setter]) => (
          <div key={label} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 10, color: "#C0B0D0", fontWeight: 700, marginBottom: 5 }}>{label}</div>
            <textarea value={val} onChange={e => setter(e.target.value)} placeholder="พิมเมนูที่กินครับ" style={taStyle} />
          </div>
        ))}
      </Card>

      <Card>
        <SectionTitle>🏋️ ออกกำลังกาย</SectionTitle>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          {WORKOUT_DAYS.map(d => <Chip key={d} label={d} active={workout === d} onClick={() => selectWorkout(d)} color={d === "ไม่ได้ออก" ? "lav" : "pink"} />)}
        </div>
        {workout && workout !== "ไม่ได้ออก" && Object.keys(exercises).length > 0 && (
          <div style={{ background: "#FAF5FF", borderRadius: 14, padding: 14, border: "1px solid #EDE8FF" }}>
            <div style={{ fontSize: 11, color: "#E8608A", fontWeight: 800, marginBottom: 12, letterSpacing: 1 }}>{workout.toUpperCase()} DAY</div>
            {Object.entries(exercises).map(([idx, ex]) => (
              <div key={idx} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#3D3350", marginBottom: 5 }}>{ex.name}</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {[["kg", ex.kg, v => setExercises(p => ({ ...p, [idx]: { ...p[idx], kg: v } }))],
                    ["เซ็ต", ex.sets, v => setExercises(p => ({ ...p, [idx]: { ...p[idx], sets: v } }))],
                    ["ครั้ง", ex.reps, v => setExercises(p => ({ ...p, [idx]: { ...p[idx], reps: v } }))]].map(([label, val, fn]) => (
                    <div key={label} style={{ flex: 1 }}>
                      <div style={{ fontSize: 9, color: "#C0B0D0", marginBottom: 3 }}>{label}</div>
                      <input type="number" value={val} onChange={e => fn(e.target.value)} placeholder={label === "kg" ? "0" : label === "เซ็ต" ? "3" : "12"}
                        style={{ width: "100%", padding: "8px 6px", background: "#fff", border: "1.5px solid #EDE8FF", borderRadius: 10, fontFamily: "Quicksand", fontSize: 14, fontWeight: 700, color: "#3D3350", outline: "none", boxSizing: "border-box", textAlign: "center" }} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <SectionTitle>💧 น้ำเมื่อวาน</SectionTitle>
        <div style={{ display: "flex", gap: 8 }}>
          {["พอแล้ว 💧", "ไม่พอ 😅"].map(w => <Chip key={w} label={w} active={water === w} onClick={() => setWater(w)} color="mint" />)}
        </div>
      </Card>

      <Card>
        <SectionTitle>😊 ความรู้สึก</SectionTitle>
        <div style={{ display: "flex", gap: 8 }}>
          {["ดี 🔥", "โอเค 😐", "แย่ 😔"].map(m => <Chip key={m} label={m} active={mood === m} onClick={() => setMood(m)} color="lav" />)}
        </div>
      </Card>

      <PrimaryBtn onClick={handleSubmit} loading={loading}>✅ บันทึกและให้ AI วิเคราะห์</PrimaryBtn>
      <div style={{ height: 16 }} />
    </div>
  );
}
