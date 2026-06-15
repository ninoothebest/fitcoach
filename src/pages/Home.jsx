import { Card, SectionTitle, ProgressBar, WeightChart } from "../components/UI";
import { KPI, USERS } from "../config";

export default function Home({ user, logs, onCheckin }) {
  const cfg = USERS[user];
  const latest = logs.length ? logs[logs.length - 1] : null;
  const prev = logs.length > 1 ? logs[logs.length - 2] : null;
  const weightDiff = latest && prev ? (latest.weight - prev.weight).toFixed(1) : null;
  const totalDiff = latest ? (latest.weight - (user === "ninoo" ? 102 : 65)).toFixed(1) : null;
  const weekLogs = logs.filter(l => l.timestamp > Date.now() - 7*24*60*60*1000);
  const gymDays = weekLogs.filter(l => l.workout && l.workout !== "ไม่ได้ออก").length;
  const phasePct = latest ? Math.max(0, Math.min(100, ((cfg.phase1.start - latest.weight) / (cfg.phase1.start - cfg.phase1.end)) * 100)) : 0;

  const today = new Date().toLocaleDateString("th-TH", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div style={{ padding: "16px 16px 0" }}>
      {/* HERO */}
      <div style={{ borderRadius: 28, background: "linear-gradient(135deg,#FFB5C8 0%,#E8A0F0 50%,#C9B8F5 100%)", padding: "24px 20px", position: "relative", overflow: "hidden", boxShadow: "0 8px 32px rgba(255,181,200,0.45)", marginBottom: 14 }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }}/>
        <div style={{ position: "absolute", bottom: -30, right: 30, width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }}/>
        <div style={{ fontSize: 10, letterSpacing: 3, color: "rgba(255,255,255,0.8)", marginBottom: 5, fontWeight: 700 }}>GOOD MORNING</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 3 }}>สวัสดีครับ {cfg.name} 👋</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)" }}>{today}</div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.22)", backdropFilter: "blur(10px)", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 700, color: "#fff", marginTop: 14, border: "1px solid rgba(255,255,255,0.3)" }}>
          🎯 {cfg.phase1.label}
        </div>
        {latest && (
          <div style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", textAlign: "center" }}>
            <div style={{ fontSize: 38, fontWeight: 800, color: "#fff", lineHeight: 1, textShadow: "0 2px 12px rgba(0,0,0,0.15)" }}>{latest.weight}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>kg วันนี้</div>
            {weightDiff && <div style={{ fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,0.95)", marginTop: 3 }}>{weightDiff > 0 ? `▲ +${weightDiff}` : `▼ ${weightDiff}`} kg</div>}
          </div>
        )}
      </div>

      {/* STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
        {[
          { icon: "⚖️", val: totalDiff ? `${totalDiff}kg` : "—", label: "รวมลดได้", good: totalDiff < 0 },
          { icon: "🏋️", val: gymDays, label: "ยิมสัปดาห์นี้", good: gymDays >= 3 },
          { icon: "🔥", val: logs.length, label: "วัน Check-in", good: true },
        ].map((s, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 20, padding: "16px 8px", textAlign: "center", boxShadow: "0 2px 14px rgba(180,150,200,0.1)", border: "1px solid rgba(255,181,200,0.15)" }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#3D3350" }}>{s.val}</div>
            <div style={{ fontSize: 10, color: "#C0B0D0", marginTop: 2, fontWeight: 600 }}>{s.label}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: s.good ? "#3DBF8A" : "#E87070", marginTop: 5 }}>{s.good ? "✅ ดีครับ" : "⚠️ ต้องเพิ่ม"}</div>
          </div>
        ))}
      </div>

      {/* AI COACH */}
      <div style={{ background: "linear-gradient(135deg,rgba(168,230,207,0.3),rgba(201,184,245,0.3))", borderRadius: 24, padding: 20, border: "1px solid rgba(168,230,207,0.4)", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 16, background: "linear-gradient(135deg,#A8E6CF,#C9B8F5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🤖</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#3D3350" }}>AI Coach</div>
            <div style={{ fontSize: 11, color: "#8A8AAA" }}>วิเคราะห์รายวัน</div>
          </div>
          <div style={{ background: "#3DBF8A", color: "#fff", padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700 }}>● LIVE</div>
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.9, color: "#4A3F55" }}
          dangerouslySetInnerHTML={{ __html: latest?.analysis
            ? latest.analysis.replace(/\n/g, "<br/>")
            : "กด ✏️ Check-in เพื่อกรอกข้อมูลวันนี้ แล้ว AI จะวิเคราะห์ให้เลยครับ 💪" }}
        />
      </div>

      {/* CHART */}
      <Card>
        <SectionTitle>📈 น้ำหนัก 7 วันล่าสุด</SectionTitle>
        <WeightChart logs={logs} />
      </Card>

      {/* PHASE PROGRESS */}
      <Card>
        <SectionTitle>🎯 Phase Progress</SectionTitle>
        <ProgressBar label={cfg.phase1.label} val={Math.round(phasePct)} max={100} gradient="linear-gradient(90deg,#FFB5C8,#C9B8F5)" unit="%" />
        {latest && <div style={{ fontSize: 12, color: "#C0B0D0", marginTop: 4 }}>น้ำหนักปัจจุบัน {latest.weight} kg → เป้า {cfg.phase1.end} kg</div>}
      </Card>

      {/* KPI */}
      <Card>
        <SectionTitle>📅 KPI รายเดือน</SectionTitle>
        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
          {KPI.map((k, i) => (
            <div key={i} style={{ minWidth: 88, background: "#fff", borderRadius: 18, padding: "13px 10px", textAlign: "center", flexShrink: 0, border: i === 0 ? "2px solid #FFB5C8" : i === KPI.length-1 ? "1px dashed #C9B8F5" : "1px solid #F0E6F6", boxShadow: i === 0 ? "0 4px 14px rgba(255,181,200,0.3)" : "none" }}>
              <div style={{ fontSize: 10, color: "#C0B0D0", fontWeight: 700, marginBottom: 5 }}>{k.month}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: i === 0 ? "#E8608A" : i === KPI.length-1 ? "#9B7FE8" : "#B0A0C0" }}>{k.target}</div>
              <div style={{ width: 8, height: 8, borderRadius: "50%", margin: "7px auto 0", background: i === 0 ? "linear-gradient(135deg,#FFB5C8,#FF8FAD)" : "#EEE8F5" }}/>
            </div>
          ))}
        </div>
      </Card>

      {!latest && (
        <button onClick={onCheckin} style={{ width: "100%", padding: 16, border: "none", borderRadius: 18, background: "linear-gradient(135deg,#FFB5C8,#C9B8F5)", color: "#fff", fontFamily: "Quicksand", fontSize: 15, fontWeight: 800, cursor: "pointer", boxShadow: "0 6px 20px rgba(255,181,200,0.45)", marginBottom: 16 }}>
          ✏️ เริ่ม Check-in วันแรกเลย!
        </button>
      )}
    </div>
  );
}
