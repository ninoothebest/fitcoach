import { useState } from "react";
import { Card, SectionTitle } from "../components/UI";

const FITBIT_SCOPES = "activity heartrate sleep weight profile";

export default function Fitbit({ user, userCfg }) {
  const [fitbitData, setFitbitData] = useState(null);
  const [loading, setLoading] = useState(false);
  const clientId = import.meta.env.VITE_FITBIT_CLIENT_ID;
  const hasFitbit = userCfg.hasFitbit;

  const connectFitbit = () => {
    if (!clientId) {
      alert("กรุณาตั้งค่า VITE_FITBIT_CLIENT_ID ใน Vercel ก่อนครับ");
      return;
    }
    const redirect = encodeURIComponent(window.location.origin + "/fitbit-callback");
    const url = `https://www.fitbit.com/oauth2/authorize?response_type=token&client_id=${clientId}&redirect_uri=${redirect}&scope=${encodeURIComponent(FITBIT_SCOPES)}&expires_in=604800`;
    window.location.href = url;
  };

  const mockData = {
    steps: 8420,
    calories: 2180,
    sleep: { duration: "7ชม.32น.", deep: "1ชม.20น.", rem: "1ชม.45น.", light: "4ชม.27น." },
    heartRate: { resting: 68, avg: 75, max: 142 },
  };

  return (
    <div style={{ padding: "16px 16px 0" }}>

      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg,#00B0B9,#0082C8)", borderRadius: 24, padding: 20, marginBottom: 14, color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }}/>
        <div style={{ fontSize: 10, letterSpacing: 3, opacity: .8, marginBottom: 4, fontWeight: 700 }}>FITBIT INTEGRATION</div>
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>⌚ {userCfg.name}'s Fitbit</div>
        <div style={{ fontSize: 12, opacity: .85 }}>ดึงข้อมูลสุขภาพอัตโนมัติ</div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: hasFitbit ? "rgba(255,255,255,0.25)" : "rgba(255,100,100,0.3)", borderRadius: 20, padding: "5px 12px", fontSize: 11, fontWeight: 700, marginTop: 12 }}>
          {hasFitbit ? "● เชื่อมต่อแล้ว" : "● ยังไม่ได้เชื่อมต่อ"}
        </div>
      </div>

      {!hasFitbit ? (
        <Card>
          <SectionTitle>🔗 เชื่อมต่อ Fitbit</SectionTitle>
          <div style={{ fontSize: 13, color: "#6A5F75", lineHeight: 1.8, marginBottom: 16 }}>
            เชื่อมต่อ Fitbit เพื่อดึงข้อมูลอัตโนมัติ:<br/>
            👟 ก้าวเดินรายวัน<br/>
            🔥 แคลอรี่ที่เผาผลาญ<br/>
            😴 การนอนละเอียด (Deep/REM/Light)<br/>
            ❤️ Heart Rate รายวัน
          </div>
          <div style={{ background: "#FFF8FC", borderRadius: 14, padding: 14, marginBottom: 16, border: "1px solid #FFE8F0", fontSize: 12, color: "#C0B0D0", lineHeight: 1.7 }}>
            ⚙️ ต้องตั้งค่า Fitbit API ก่อนนะครับ:<br/>
            1. ไปที่ dev.fitbit.com<br/>
            2. สร้าง App ใหม่<br/>
            3. Copy Client ID ใส่ใน Vercel Environment Variables<br/>
            ชื่อ: VITE_FITBIT_CLIENT_ID
          </div>
          <button onClick={connectFitbit} style={{ width: "100%", padding: 14, border: "none", borderRadius: 14, background: "linear-gradient(135deg,#00B0B9,#0082C8)", color: "#fff", fontFamily: "Quicksand", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
            ⌚ เชื่อมต่อ Fitbit
          </button>
        </Card>
      ) : (
        <>
          {/* STEPS & CALORIES */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            {[
              { icon: "👟", val: mockData.steps.toLocaleString(), label: "ก้าววันนี้", sub: "เป้า 8,000 ก้าว", color: "#00B0B9", good: mockData.steps >= 8000 },
              { icon: "🔥", val: mockData.calories.toLocaleString(), label: "แคลเบิร์น", sub: "kcal วันนี้", color: "#FF6B6B", good: true },
            ].map((s, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 20, padding: "18px 14px", textAlign: "center", boxShadow: "0 2px 14px rgba(180,150,200,0.1)", border: "1px solid rgba(255,181,200,0.15)" }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: 11, color: "#C0B0D0", marginTop: 2, fontWeight: 600 }}>{s.label}</div>
                <div style={{ fontSize: 10, color: s.good ? "#3DBF8A" : "#E87070", fontWeight: 700, marginTop: 4 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* SLEEP */}
          <Card>
            <SectionTitle>😴 การนอนคืนที่ผ่านมา</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { label: "รวมทั้งหมด", val: mockData.sleep.duration, color: "#C9B8F5" },
                { label: "Deep Sleep", val: mockData.sleep.deep, color: "#7B5FD4" },
                { label: "REM Sleep", val: mockData.sleep.rem, color: "#FFB5C8" },
                { label: "Light Sleep", val: mockData.sleep.light, color: "#A8E6CF" },
              ].map((s, i) => (
                <div key={i} style={{ background: "#FAF5FF", borderRadius: 14, padding: "12px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: "#C0B0D0", marginTop: 3, fontWeight: 600 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* HEART RATE */}
          <Card>
            <SectionTitle>❤️ Heart Rate</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {[
                { label: "ขณะพัก", val: mockData.heartRate.resting, unit: "bpm", color: "#FF6B6B" },
                { label: "เฉลี่ย", val: mockData.heartRate.avg, unit: "bpm", color: "#FFB5C8" },
                { label: "สูงสุด", val: mockData.heartRate.max, unit: "bpm", color: "#E87070" },
              ].map((s, i) => (
                <div key={i} style={{ background: "#FFF5F7", borderRadius: 14, padding: "12px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: 9, color: "#C0B0D0", fontWeight: 600 }}>{s.unit}</div>
                  <div style={{ fontSize: 10, color: "#C0B0D0", marginTop: 3, fontWeight: 600 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </Card>

          <button style={{ width: "100%", padding: 12, border: "1.5px solid #EDE8FF", borderRadius: 14, background: "transparent", color: "#C0B0D0", fontFamily: "Quicksand", fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 16 }}>
            🔄 ซิงค์ข้อมูลล่าสุด
          </button>
        </>
      )}
      <div style={{ height: 16 }} />
    </div>
  );
}
