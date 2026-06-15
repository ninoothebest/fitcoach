import { useState } from "react";
import { Card, SectionTitle, Input, PrimaryBtn } from "../components/UI";
import { USERS } from "../config";

export default function Profile({ user, logs }) {
  const cfg = USERS[user];
  const latest = logs.length ? logs[logs.length-1] : null;
  const h = cfg.height / 100;
  const bmi = latest ? (latest.weight / (h*h)).toFixed(1) : "—";
  const tdee = Math.round(10 * (latest?.weight || cfg.weight) + 6.25 * cfg.height - 5 * cfg.age + (user === "ninoo" ? 5 : -161) + 300);

  return (
    <div style={{ padding: "16px 16px 0" }}>
      <div style={{ borderRadius: 28, background: `linear-gradient(135deg,${cfg.color},${cfg.colorDark})`, padding: 24, textAlign: "center", marginBottom: 14, boxShadow: `0 8px 32px ${cfg.color}88` }}>
        <div style={{ fontSize: 56, marginBottom: 10 }}>{cfg.emoji}</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>{cfg.name}</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", marginTop: 4 }}>{cfg.age} ปี • {cfg.height} cm • เป้า {cfg.targetWeight} kg</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        {[
          { val: bmi, label: "BMI" },
          { val: tdee.toLocaleString(), label: "TDEE (kcal)" },
          { val: cfg.targetCalories.toLocaleString(), label: "เป้าแคล/วัน" },
          { val: `${cfg.targetProtein}g`, label: "เป้าโปรตีน/วัน" },
        ].map((s,i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 18, padding: "16px 12px", textAlign: "center", boxShadow: "0 2px 14px rgba(180,150,200,0.1)", border: "1px solid rgba(255,181,200,0.15)" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#3D3350" }}>{s.val}</div>
            <div style={{ fontSize: 11, color: "#C0B0D0", marginTop: 4, fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <Card>
        <SectionTitle>⚠️ ข้อจำกัด</SectionTitle>
        <Input label="สุขภาพ / บาดเจ็บ" placeholder="เช่น ปวดเข่า หัวใจ ฯลฯ" />
        <Input label="อาหารที่แพ้ / ไม่กิน" placeholder="เช่น แพ้กุ้ง ไม่กินหมู ฯลฯ" />
        <PrimaryBtn>💾 บันทึก</PrimaryBtn>
      </Card>

      <Card>
        <SectionTitle>📊 สถิติรวม</SectionTitle>
        <div style={{ fontSize: 13, lineHeight: 2.2, color: "#4A3F55" }}>
          📅 Check-in ทั้งหมด: <strong>{logs.length} วัน</strong><br/>
          🏋️ ออกกำลังกาย: <strong>{logs.filter(l=>l.workout && l.workout!=="ไม่ได้ออก").length} วัน</strong><br/>
          💧 ดื่มน้ำพอ: <strong>{logs.filter(l=>l.water?.includes("พอ")).length} วัน</strong><br/>
          📉 น้ำหนักลดรวม: <strong>{logs.length > 1 ? (logs[0].weight - logs[logs.length-1].weight).toFixed(1) : 0} kg</strong>
        </div>
      </Card>

      <Card>
        <SectionTitle>🗑️ จัดการข้อมูล</SectionTitle>
        <button onClick={()=>{ if(confirm(`ล้างข้อมูลของ ${cfg.name} ทั้งหมด?`)){ localStorage.removeItem(`fitcoach_${user}`); window.location.reload(); }}} style={{ width: "100%", padding: 14, border: "1.5px solid #EDE8FF", borderRadius: 14, background: "transparent", color: "#C0B0D0", fontFamily: "Quicksand", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          🗑️ ล้างข้อมูลทั้งหมด
        </button>
      </Card>
      <div style={{ height: 16 }} />
    </div>
  );
}
