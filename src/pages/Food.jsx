import { useState } from "react";
import { Card, SectionTitle, PrimaryBtn } from "../components/UI";
import { useAI } from "../hooks/useAI";

const MEALS = [
  { id: "breakfast", label: "🌅 เช้า", placeholder: "เช่น ข้าว ไข่ดาว อกไก่ 150g" },
  { id: "lunch",     label: "☀️ กลางวัน", placeholder: "เช่น ข้าวอกไก่ย่าง ผัก" },
  { id: "dinner",    label: "🌙 เย็น", placeholder: "เช่น ข้าว กระเพราเนื้อ" },
  { id: "snack",     label: "🍫 ของว่าง", placeholder: "เช่น เวย์ ฝรั่ง (ถ้ามี)" },
];

function MealCard({ meal, onResult }) {
  const [mode, setMode] = useState(null); // 'text' | 'photo'
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [result, setResult] = useState("");
  const { loading, analyzeFood } = useAI();

  const handleImg = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      setImg(ev.target.result);
      const b64 = ev.target.result.split(",")[1];
      setResult("⏳ AI กำลังวิเคราะห์...");
      const r = await analyzeFood(b64, file.type);
      setResult(r);
      onResult(meal.id, r);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card>
      <SectionTitle>{meal.label}</SectionTitle>

      {!mode && (
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setMode("text")} style={{
            flex: 1, padding: "12px 0", borderRadius: 14, border: "1.5px solid #EDE8FF",
            background: "#FAF5FF", color: "#C0B0D0", fontFamily: "Quicksand",
            fontSize: 13, fontWeight: 700, cursor: "pointer"
          }}>✏️ พิมเมนู</button>
          <button onClick={() => setMode("photo")} style={{
            flex: 1, padding: "12px 0", borderRadius: 14, border: "none",
            background: "linear-gradient(135deg,#FFB5C8,#C9B8F5)", color: "#fff",
            fontFamily: "Quicksand", fontSize: 13, fontWeight: 700, cursor: "pointer"
          }}>📸 ถ่ายรูป</button>
        </div>
      )}

      {mode === "text" && (
        <div>
          <textarea value={text} onChange={e => setText(e.target.value)}
            placeholder={meal.placeholder}
            style={{ width: "100%", padding: "11px 14px", resize: "none", height: 80, background: "#FAF5FF", border: "1.5px solid #EDE8FF", borderRadius: 14, fontFamily: "Quicksand", fontSize: 14, color: "#3D3350", outline: "none", boxSizing: "border-box" }} />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button onClick={() => { setMode(null); setText(""); }} style={{ flex: 1, padding: 10, borderRadius: 12, border: "1.5px solid #EDE8FF", background: "transparent", color: "#C0B0D0", fontFamily: "Quicksand", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>← กลับ</button>
            <button onClick={() => onResult(meal.id, text)} style={{ flex: 2, padding: 10, borderRadius: 12, border: "none", background: "linear-gradient(135deg,#FFB5C8,#C9B8F5)", color: "#fff", fontFamily: "Quicksand", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>✅ บันทึก</button>
          </div>
        </div>
      )}

      {mode === "photo" && (
        <div>
          <label style={{ display: "block", border: "2px dashed #EDE8FF", borderRadius: 14, padding: img ? 0 : 20, textAlign: "center", cursor: "pointer", background: "#FAF5FF", overflow: "hidden" }}>
            {img
              ? <img src={img} style={{ width: "100%", borderRadius: 12, display: "block" }} />
              : <><div style={{ fontSize: 32, marginBottom: 6 }}>📷</div><div style={{ fontSize: 12, color: "#C0B0D0" }}>กดเพื่อถ่ายหรืออัพโหลดรูป</div></>
            }
            <input type="file" accept="image/*" capture="environment" onChange={handleImg} style={{ display: "none" }} />
          </label>
          {result && (
            <div style={{ marginTop: 10, background: "linear-gradient(135deg,rgba(168,230,207,0.2),rgba(201,184,245,0.2))", borderRadius: 12, padding: 12, fontSize: 12, lineHeight: 1.8, border: "1px solid rgba(168,230,207,0.4)" }}
              dangerouslySetInnerHTML={{ __html: result.replace(/\n/g, "<br/>") }} />
          )}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button onClick={() => { setMode(null); setImg(null); setResult(""); }} style={{ flex: 1, padding: 10, borderRadius: 12, border: "1.5px solid #EDE8FF", background: "transparent", color: "#C0B0D0", fontFamily: "Quicksand", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>← กลับ</button>
            {img && !loading && <button onClick={() => document.querySelector(`#re-${meal.id}`).click()} style={{ flex: 1, padding: 10, borderRadius: 12, border: "none", background: "#FAF5FF", color: "#C9B8F5", fontFamily: "Quicksand", fontSize: 12, fontWeight: 700, cursor: "pointer", border: "1.5px solid #EDE8FF" }}>🔄 ถ่ายใหม่</button>}
          </div>
          <input id={`re-${meal.id}`} type="file" accept="image/*" capture="environment" onChange={handleImg} style={{ display: "none" }} />
        </div>
      )}
    </Card>
  );
}

export default function Food({ logs }) {
  const [mealResults, setMealResults] = useState({});
  const today = new Date().toLocaleDateString("th-TH");
  const todayLog = logs.find(l => l.date === today);

  const handleResult = (mealId, result) => {
    setMealResults(p => ({ ...p, [mealId]: result }));
  };

  return (
    <div style={{ padding: "16px 16px 0" }}>
      <div style={{ background: "linear-gradient(135deg,rgba(255,181,200,0.2),rgba(201,184,245,0.2))", borderRadius: 20, padding: "14px 16px", marginBottom: 14, border: "1px solid rgba(255,181,200,0.3)", fontSize: 13, color: "#4A3F55", lineHeight: 1.7 }}>
        📸 <strong>ถ่ายรูปหรือพิมเมนูได้เลยครับ</strong><br/>
        AI จะประเมินแคล + โปรตีนให้ทีละมื้อ
      </div>

      {MEALS.map(meal => (
        <MealCard key={meal.id} meal={meal} onResult={handleResult} />
      ))}

      {Object.keys(mealResults).length > 0 && (
        <Card style={{ background: "linear-gradient(135deg,rgba(168,230,207,0.2),rgba(201,184,245,0.2))", border: "1px solid rgba(168,230,207,0.4)" }}>
          <SectionTitle>📊 สรุปวันนี้</SectionTitle>
          {Object.entries(mealResults).map(([id, result]) => {
            const meal = MEALS.find(m => m.id === id);
            return (
              <div key={id} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid rgba(168,230,207,0.3)" }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#4A3F55", marginBottom: 4 }}>{meal?.label}</div>
                <div style={{ fontSize: 12, color: "#6A5F75", lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: (typeof result === 'string' ? result : '').replace(/\n/g, "<br/>") }} />
              </div>
            );
          })}
        </Card>
      )}
      <div style={{ height: 16 }} />
    </div>
  );
}
