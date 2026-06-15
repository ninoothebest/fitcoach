import { useState } from "react";
import { Card, SectionTitle, Chip, Input, Textarea, PrimaryBtn } from "../components/UI";
import { WORKOUT_PLANS } from "../config";
import { useAI } from "../hooks/useAI";

export default function Checkin({ user, userCfg, onSave, logs }) {
  const today = new Date().toLocaleDateString("th-TH");
  const existing = logs.find(l => l.date === today);

  const [weight, setWeight] = useState(existing?.weight || "");
  const [bed, setBed] = useState(existing?.bed || "");
  const [wake, setWake] = useState(existing?.wake || "");
  const [logDate, setLogDate] = useState(today);
  const [breakfast, setBreakfast] = useState(existing?.breakfast || "");
  const [lunch, setLunch] = useState(existing?.lunch || "");
  const [dinner, setDinner] = useState(existing?.dinner || "");
  const [snack, setSnack] = useState(existing?.snack || "");
  const [workout, setWorkout] = useState(existing?.workout || null);
  const [exercises, setExercises] = useState({});
  const [water, setWater] = useState(existing?.water || null);
  const [mood, setMood] = useState(existing?.mood || null);
  const [foodImg, setFoodImg] = useState(null);
  const [foodResult, setFoodResult] = useState("");
  const { loading, analyzeCheckin, analyzeFood } = useAI();

  const sleepDur = () => {
    if (!bed || !wake) return null;
    const [bh, bm] = bed.split(":").map(Number);
    const [wh, wm] = wake.split(":").map(Number);
    let m = (wh*60+wm) - (bh*60+bm);
    if (m < 0) m += 1440;
    return `${Math.floor(m/60)} ชม. ${m%60 > 0 ? m%60+"น." : ""}`;
  };

  const selectWorkout = (day) => {
    setWorkout(day);
    if (WORKOUT_PLANS[day]) {
      const init = {};
      WORKOUT_PLANS[day].forEach((ex, i) => { init[i] = { name: ex, kg: "", sets: "", reps: "" }; });
      setExercises(init);
    } else setExercises({});
  };

  const handleFoodImg = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const b64 = ev.target.result.split(",")[1];
      setFoodImg(ev.target.result);
      setFoodResult("⏳ AI กำลังวิเคราะห์...");
      const result = await analyzeFood(b64, file.type);
      setFoodResult(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!weight) { alert("กรอกน้ำหนักก่อนนะครับ!"); return; }
    const exList = Object.values(exercises)
      .filter(e => e.kg || e.sets)
      .map(e => `${e.name} ${e.kg||"?"}kg×${e.sets||"?"}set×${e.reps||"?"}rep`).join(", ");
    const log = {
      date: logDate, weight: parseFloat(weight), bed, wake,
      sleepHrs: sleepDur(), breakfast, lunch, dinner, snack,
      workout: workout || "ไม่ได้ออก", exercises: exList,
      water: water || "ไม่ระบุ", mood: mood || "ไม่ระบุ",
    };
    const analysis = await analyzeCheckin(log, userCfg);
    await onSave({ ...log, analysis });
  };

  return (
    <div style={{ padding: "16px 16px 0" }}>
      <Card>
        <SectionTitle>📅 วันที่บันทึก (เมื่อวาน)</SectionTitle>
        <Input type="date" value={logDate} onChange={e => setLogDate(e.target.value)} />
        <div style={{ fontSize: 11, color: "#C0B0D0", marginTop: -6 }}>* กรอกข้อมูลของเมื่อวันนั้นครับ</div>
      </Card>

      <Card>
        <SectionTitle>⚖️ น้ำหนัก</SectionTitle>
        <input value={weight} onChange={e => setWeight(e.target.value)} type="number" step="0.1" placeholder="99.5"
          style={{ width: "100%", padding: 14, background: "#FAF5FF", border: "1.5px solid #EDE8FF", borderRadius: 14, fontFamily: "Quicksand", fontSize: 24, color: "#3D3350", outline: "none", textAlign: "center", boxSizing: "border-box" }} />
      </Card>

      <Card>
        <SectionTitle>😴 การนอน</SectionTitle>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: "#C0B0D0", fontWeight: 700, marginBottom: 5 }}>เข้านอน (คืนนั้น)</div>
            <input type="time" value={bed} onChange={e => setBed(e.target.value)}
              style={{ width: "100%", padding: "11px 14px", background: "#FAF5FF", border: "1.5px solid #EDE8FF", borderRadius: 14, fontFamily: "Quicksand", fontSize: 14, color: "#3D3350", outline: "none", boxSizing: "border-box", colorScheme: "light" }} />
          </div>
          <div style={{ color: "#DDD", fontSize: 18, paddingTop: 18 }}>→</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: "#C0B0D0", fontWeight: 700, marginBottom: 5 }}>ตื่นนอน (เช้าวันนั้น)</div>
            <input type="time" value={wake} onChange={e => setWake(e.target.value)}
              style={{ width: "100%", padding: "11px 14px", background: "#FAF5FF", border: "1.5px solid #EDE8FF", borderRadius: 14, fontFamily: "Quicksand", fontSize: 14, color: "#3D3350", outline: "none", boxSizing: "border-box", colorScheme: "light" }} />
          </div>
        </div>
        {sleepDur() && <div style={{ textAlign: "center", color: "#3DBF8A", fontWeight: 800, fontSize: 14, marginTop: 10 }}>😴 นอน {sleepDur()}</div>}
      </Card>

      <Card>
        <SectionTitle>🍽️ อาหารวันนั้น</SectionTitle>
        <Textarea label="🌅 เช้า" value={breakfast} onChange={e => setBreakfast(e.target.value)} placeholder="เช่น ข้าว ไข่ดาว 2 ฟอง อกไก่ 150g" />
        <Textarea label="☀️ กลางวัน" value={lunch} onChange={e => setLunch(e.target.value)} placeholder="เช่น ข้าวอกไก่ย่าง ผัก" />
        <Textarea label="🌙 เย็น" value={dinner} onChange={e => setDinner(e.target.value)} placeholder="เช่น ข้าว กระเพราเนื้อ ไข่ดาว" />
        <Textarea label="🍫 ของว่าง" value={snack} onChange={e => setSnack(e.target.value)} placeholder="เช่น เวย์ 1 สกู้ป ฝรั่ง (ถ้ามี)" />
      </Card>

      <Card>
        <SectionTitle>📸 ถ่ายรูปอาหาร (AI คำนวณ)</SectionTitle>
        <label style={{ display: "block", border: "2px dashed #EDE8FF", borderRadius: 16, padding: 20, textAlign: "center", cursor: "pointer", background: "#FAF5FF" }}>
          {foodImg ? <img src={foodImg} style={{ maxWidth: "100%", borderRadius: 12 }} /> : (
            <><div style={{ fontSize: 36, marginBottom: 8 }}>📷</div>
            <div style={{ fontSize: 13, color: "#C0B0D0" }}>กดเพื่อถ่ายหรืออัพโหลดรูปอาหาร<br/><span style={{ color: "#FFB5C8", fontWeight: 700 }}>AI ประเมินแคล + โปรตีนให้เลย</span></div></>
          )}
          <input type="file" accept="image/*" capture="environment" onChange={handleFoodImg} style={{ display: "none" }} />
        </label>
        {foodResult && (
          <div style={{ marginTop: 12, background: "linear-gradient(135deg,rgba(168,230,207,0.2),rgba(201,184,245,0.2))", borderRadius: 14, padding: 14, fontSize: 13, lineHeight: 1.8, border: "1px solid rgba(168,230,207,0.4)" }}
            dangerouslySetInnerHTML={{ __html: foodResult.replace(/\n/g, "<br/>") }} />
        )}
      </Card>

      <Card>
        <SectionTitle>🏋️ ออกกำลังกาย</SectionTitle>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          {["Push","Pull","Leg","Upper","ไม่ได้ออก"].map(d => (
            <Chip key={d} label={d} active={workout === d} onClick={() => selectWorkout(d)} color={d === "ไม่ได้ออก" ? "lav" : "pink"} />
          ))}
        </div>
        {workout && workout !== "ไม่ได้ออก" && (
          <div style={{ background: "#FAF5FF", borderRadius: 16, padding: 14, border: "1px solid #EDE8FF" }}>
            <div style={{ fontSize: 11, color: "#C9B8F5", fontWeight: 800, marginBottom: 12, letterSpacing: 1 }}>{workout.toUpperCase()} DAY</div>
            {Object.entries(exercises).map(([idx, ex]) => (
              <div key={idx} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#3D3350", marginBottom: 5 }}>{ex.name}</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {[["kg","น้ำหนัก","ex"+idx+"-kg",(v)=>setExercises(p=>({...p,[idx]:{...p[idx],kg:v}}))],
                    ["sets","เซ็ต","ex"+idx+"-s",(v)=>setExercises(p=>({...p,[idx]:{...p[idx],sets:v}}))],
                    ["reps","ครั้ง","ex"+idx+"-r",(v)=>setExercises(p=>({...p,[idx]:{...p[idx],reps:v}}))]]
                    .map(([unit,label,id,fn]) => (
                    <div key={id} style={{ flex: 1 }}>
                      <div style={{ fontSize: 9, color: "#C0B0D0", marginBottom: 3 }}>{label}</div>
                      <input type="number" placeholder={unit === "kg" ? "0" : "3"} onChange={e => fn(e.target.value)}
                        style={{ width: "100%", padding: "8px 10px", background: "#fff", border: "1.5px solid #EDE8FF", borderRadius: 10, fontFamily: "Quicksand", fontSize: 13, color: "#3D3350", outline: "none", boxSizing: "border-box" }} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <SectionTitle>💧 ดื่มน้ำ</SectionTitle>
        <div style={{ display: "flex", gap: 8 }}>
          {["พอแล้ว 💧","ไม่พอ 😅"].map(w => <Chip key={w} label={w} active={water===w} onClick={()=>setWater(w)} color="mint" />)}
        </div>
      </Card>

      <Card>
        <SectionTitle>😊 ความรู้สึก</SectionTitle>
        <div style={{ display: "flex", gap: 8 }}>
          {["ดี 🔥","โอเค 😐","แย่ 😔"].map(m => <Chip key={m} label={m} active={mood===m} onClick={()=>setMood(m)} color="lav" />)}
        </div>
      </Card>

      <PrimaryBtn onClick={handleSubmit} loading={loading}>
        ✅ บันทึกและให้ AI วิเคราะห์
      </PrimaryBtn>
      <div style={{ height: 16 }} />
    </div>
  );
}
