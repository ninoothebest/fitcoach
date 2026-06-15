import { useState, useEffect } from "react";
import { Card, SectionTitle, Input, PrimaryBtn } from "../components/UI";

function calcTDEE(weight, height, age, gender, activity = 1.375) {
  const bmr = gender === "male"
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;
  return Math.round(bmr * activity);
}

function calcBMI(weight, height) {
  const h = height / 100;
  return (weight / (h * h)).toFixed(1);
}

export default function Profile({ user, logs, onUpdateProfile, userCfg }) {
  const stored = JSON.parse(localStorage.getItem(`fitcoach_profile_${user}`) || "null");

  const [name, setName] = useState(stored?.name || userCfg.name);
  const [age, setAge] = useState(stored?.age || userCfg.age);
  const [height, setHeight] = useState(stored?.height || userCfg.height);
  const [currentWeight, setCurrentWeight] = useState(stored?.currentWeight || userCfg.weight);
  const [targetWeight, setTargetWeight] = useState(stored?.targetWeight || userCfg.targetWeight);
  const [gender, setGender] = useState(stored?.gender || (user === "ninoo" ? "male" : "female"));
  const [limitHealth, setLimitHealth] = useState(stored?.limitHealth || "");
  const [limitFood, setLimitFood] = useState(stored?.limitFood || "");
  const [saved, setSaved] = useState(false);

  const latest = logs.length ? logs[logs.length - 1] : null;
  const w = latest?.weight || parseFloat(currentWeight) || userCfg.weight;
  const h = parseFloat(height) || userCfg.height;
  const a = parseInt(age) || userCfg.age;
  const tw = parseFloat(targetWeight) || userCfg.targetWeight;

  const bmi = calcBMI(w, h);
  const tdee = calcTDEE(w, h, a, gender);
  const targetCal = tdee - 400;
  const targetProtein = Math.round(w * 1.6);
  const toGoal = (w - tw).toFixed(1);
  const weeksToGoal = Math.ceil(toGoal / 0.5);

  const bmiLabel = () => {
    const b = parseFloat(bmi);
    if (b < 18.5) return { label: "ผอมเกิน", color: "#00B0B9" };
    if (b < 23) return { label: "ปกติ ✅", color: "#3DBF8A" };
    if (b < 25) return { label: "น้ำหนักเกินนิดนึง", color: "#FFB5C8" };
    if (b < 30) return { label: "Overweight", color: "#FF8C42" };
    return { label: "Obese", color: "#E87070" };
  };

  const handleSave = () => {
    const profile = { name, age, height, currentWeight, targetWeight, gender, limitHealth, limitFood };
    localStorage.setItem(`fitcoach_profile_${user}`, JSON.stringify(profile));
    if (onUpdateProfile) onUpdateProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ padding: "16px 16px 0" }}>

      {/* HERO */}
      <div style={{ background: userCfg.gradient, borderRadius: 24, padding: 24, textAlign: "center", marginBottom: 14, boxShadow: `0 8px 32px ${userCfg.color}88`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }}/>
        <div style={{ fontSize: 52, marginBottom: 8 }}>{userCfg.emoji}</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>{name}</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", marginTop: 4 }}>{age} ปี • {height} cm</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 14 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{w}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.8)" }}>kg ปัจจุบัน</div>
          </div>
          <div style={{ width: 1, background: "rgba(255,255,255,0.3)" }}/>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{tw}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.8)" }}>kg เป้าหมาย</div>
          </div>
          <div style={{ width: 1, background: "rgba(255,255,255,0.3)" }}/>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{toGoal}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.8)" }}>kg ที่ต้องลด</div>
          </div>
        </div>
      </div>

      {/* CALCULATED STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        {[
          { val: bmi, label: "BMI", sub: bmiLabel().label, color: bmiLabel().color },
          { val: tdee.toLocaleString(), label: "TDEE", sub: "kcal/วัน", color: "#C9B8F5" },
          { val: targetCal.toLocaleString(), label: "เป้าแคล", sub: "kcal/วัน (TDEE-400)", color: "#FFB5C8" },
          { val: `${targetProtein}g`, label: "เป้าโปรตีน", sub: `${(w * 1.6).toFixed(0)}g (1.6×น้ำหนัก)`, color: "#E8608A" },
        ].map((s, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 18, padding: "16px 12px", textAlign: "center", boxShadow: "0 2px 14px rgba(180,150,200,0.1)", border: "1px solid rgba(255,181,200,0.15)" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 11, color: "#3D3350", fontWeight: 700, marginTop: 3 }}>{s.label}</div>
            <div style={{ fontSize: 10, color: "#C0B0D0", marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* TIMELINE */}
      <Card style={{ background: "linear-gradient(135deg,rgba(255,181,200,0.1),rgba(201,184,245,0.1))", border: "1px solid rgba(255,181,200,0.3)" }}>
        <SectionTitle>🎯 Timeline เป้าหมาย</SectionTitle>
        <div style={{ fontSize: 13, lineHeight: 2, color: "#4A3F55" }}>
          ⚖️ ต้องลดอีก <strong>{toGoal} kg</strong><br/>
          📅 ประมาณ <strong>{weeksToGoal} สัปดาห์</strong> (ลด 0.5kg/สัปดาห์)<br/>
          🏁 ถึงเป้าประมาณ <strong>{new Date(Date.now() + weeksToGoal * 7 * 24 * 60 * 60 * 1000).toLocaleDateString("th-TH", { month: "long", year: "numeric" })}</strong>
        </div>
      </Card>

      {/* EDIT PROFILE */}
      <Card>
        <SectionTitle>✏️ แก้ไขข้อมูล</SectionTitle>
        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: "#C0B0D0", fontWeight: 700, marginBottom: 5 }}>ชื่อ</div>
            <input value={name} onChange={e => setName(e.target.value)} style={{ width: "100%", padding: "11px 14px", background: "#FAF5FF", border: "1.5px solid #EDE8FF", borderRadius: 14, fontFamily: "Quicksand", fontSize: 14, color: "#3D3350", outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: "#C0B0D0", fontWeight: 700, marginBottom: 5 }}>เพศ</div>
            <div style={{ display: "flex", gap: 6 }}>
              {[["male","👨 ชาย"],["female","👩 หญิง"]].map(([val, label]) => (
                <button key={val} onClick={() => setGender(val)} style={{ flex: 1, padding: "11px 0", borderRadius: 14, border: "none", background: gender === val ? userCfg.gradient : "#FAF5FF", color: gender === val ? "#fff" : "#C0B0D0", fontFamily: "Quicksand", fontSize: 12, fontWeight: 700, cursor: "pointer", border: gender === val ? "none" : "1.5px solid #EDE8FF" }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
          {[["อายุ (ปี)", age, setAge, "30"], ["ส่วนสูง (cm)", height, setHeight, "176"], ["น้ำหนักเริ่มต้น (kg)", currentWeight, setCurrentWeight, "99"]].map(([label, val, setter, ph]) => (
            <div key={label}>
              <div style={{ fontSize: 10, color: "#C0B0D0", fontWeight: 700, marginBottom: 5 }}>{label}</div>
              <input type="number" value={val} onChange={e => setter(e.target.value)} placeholder={ph}
                style={{ width: "100%", padding: "11px 10px", background: "#FAF5FF", border: "1.5px solid #EDE8FF", borderRadius: 14, fontFamily: "Quicksand", fontSize: 14, fontWeight: 700, color: "#3D3350", outline: "none", boxSizing: "border-box", textAlign: "center" }} />
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: "#C0B0D0", fontWeight: 700, marginBottom: 5 }}>น้ำหนักเป้าหมาย (kg)</div>
          <input type="number" value={targetWeight} onChange={e => setTargetWeight(e.target.value)}
            style={{ width: "100%", padding: "11px 14px", background: "#FAF5FF", border: "1.5px solid #EDE8FF", borderRadius: 14, fontFamily: "Quicksand", fontSize: 18, fontWeight: 800, color: "#E8608A", outline: "none", boxSizing: "border-box", textAlign: "center" }} />
        </div>
        <PrimaryBtn onClick={handleSave}>
          {saved ? "✅ บันทึกแล้ว!" : "💾 บันทึกข้อมูล"}
        </PrimaryBtn>
      </Card>

      {/* CONSTRAINTS */}
      <Card>
        <SectionTitle>⚠️ ข้อจำกัด</SectionTitle>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: "#C0B0D0", fontWeight: 700, marginBottom: 5 }}>สุขภาพ / บาดเจ็บ</div>
          <input value={limitHealth} onChange={e => setLimitHealth(e.target.value)} placeholder="เช่น ปวดเข่า หัวใจ ฯลฯ"
            style={{ width: "100%", padding: "11px 14px", background: "#FAF5FF", border: "1.5px solid #EDE8FF", borderRadius: 14, fontFamily: "Quicksand", fontSize: 14, color: "#3D3350", outline: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: "#C0B0D0", fontWeight: 700, marginBottom: 5 }}>อาหารที่แพ้ / ไม่กิน</div>
          <input value={limitFood} onChange={e => setLimitFood(e.target.value)} placeholder="เช่น แพ้กุ้ง ไม่กินหมู ฯลฯ"
            style={{ width: "100%", padding: "11px 14px", background: "#FAF5FF", border: "1.5px solid #EDE8FF", borderRadius: 14, fontFamily: "Quicksand", fontSize: 14, color: "#3D3350", outline: "none", boxSizing: "border-box" }} />
        </div>
        <PrimaryBtn onClick={handleSave}>💾 บันทึก</PrimaryBtn>
      </Card>

      {/* STATS */}
      <Card>
        <SectionTitle>📊 สถิติรวม</SectionTitle>
        <div style={{ fontSize: 13, lineHeight: 2.2, color: "#4A3F55" }}>
          📅 Check-in ทั้งหมด: <strong>{logs.length} วัน</strong><br/>
          🏋️ ออกกำลังกาย: <strong>{logs.filter(l => l.workout && l.workout !== "ไม่ได้ออก").length} วัน</strong><br/>
          💧 ดื่มน้ำพอ: <strong>{logs.filter(l => l.water?.includes("พอ")).length} วัน</strong><br/>
          📉 น้ำหนักลดรวม: <strong>{logs.length > 1 ? (logs[0].weight - logs[logs.length - 1].weight).toFixed(1) : 0} kg</strong>
        </div>
      </Card>

      <Card>
        <SectionTitle>🗑️ จัดการข้อมูล</SectionTitle>
        <button onClick={() => { if (confirm(`ล้างข้อมูลทั้งหมดของ ${name}?`)) { localStorage.removeItem(`fitcoach_${user}`); window.location.reload(); } }}
          style={{ width: "100%", padding: 14, border: "1.5px solid #EDE8FF", borderRadius: 14, background: "transparent", color: "#C0B0D0", fontFamily: "Quicksand", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          🗑️ ล้างข้อมูลทั้งหมด
        </button>
      </Card>
      <div style={{ height: 16 }} />
    </div>
  );
}
