import { useState } from "react";
import { Card, SectionTitle, WeightChart, ProgressBar } from "../components/UI";
import { useAI } from "../hooks/useAI";
import { KPI } from "../config";

export default function Progress({ logs, userCfg }) {
  const [report, setReport] = useState("");
  const { loading, weeklyReport } = useAI();

  const getReport = async () => {
    const r = await weeklyReport(logs, userCfg);
    setReport(r);
  };

  const latest = logs.length ? logs[logs.length-1] : null;
  const first = logs.length ? logs[0] : null;
  const totalLost = latest && first ? (first.weight - latest.weight).toFixed(1) : 0;
  const phasePct = latest ? Math.max(0, Math.min(100, ((userCfg.phase1.start - latest.weight) / (userCfg.phase1.start - userCfg.phase1.end)) * 100)) : 0;
  const weekGym = logs.filter(l => l.timestamp > Date.now()-7*24*60*60*1000 && l.workout && l.workout !== "ไม่ได้ออก").length;

  return (
    <div style={{ padding: "16px 16px 0" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        {[
          { icon: "📉", val: `${totalLost} kg`, label: "รวมลดได้", color: "#3DBF8A" },
          { icon: "📅", val: logs.length, label: "วัน Check-in", color: "#FFB5C8" },
          { icon: "🏋️", val: `${weekGym}/7`, label: "ยิมสัปดาห์นี้", color: "#C9B8F5" },
          { icon: "🎯", val: `${phasePct.toFixed(0)}%`, label: "Phase Progress", color: "#E8608A" },
        ].map((s,i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 20, padding: "18px 14px", textAlign: "center", boxShadow: "0 2px 14px rgba(180,150,200,0.1)", border: "1px solid rgba(255,181,200,0.15)" }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 11, color: "#C0B0D0", marginTop: 3, fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <Card>
        <SectionTitle>📈 กราฟน้ำหนัก</SectionTitle>
        <WeightChart logs={logs} />
      </Card>

      <Card>
        <SectionTitle>🎯 Phase Progress</SectionTitle>
        <ProgressBar label={userCfg.phase1.label} val={Math.round(phasePct)} max={100} gradient="linear-gradient(90deg,#FFB5C8,#C9B8F5)" unit="%" />
        <div style={{ fontSize: 12, color: "#C0B0D0", marginTop: 4 }}>{latest ? `น้ำหนักปัจจุบัน ${latest.weight} kg → เป้า ${userCfg.phase1.end} kg` : "เริ่ม check-in เพื่อดู progress ครับ"}</div>
      </Card>

      <Card>
        <SectionTitle>⚖️ ประวัติน้ำหนัก</SectionTitle>
        {logs.length === 0 ? (
          <div style={{ textAlign: "center", color: "#C0B0D0", padding: "12px 0", fontSize: 13 }}>ยังไม่มีข้อมูลครับ</div>
        ) : [...logs].reverse().map((l, i, arr) => {
          const prev = arr[i+1];
          const diff = prev ? (l.weight - prev.weight).toFixed(1) : null;
          return (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < arr.length-1 ? "1px solid #F5EEF8" : "none" }}>
              <div>
                <div style={{ fontSize: 11, color: "#C0B0D0", fontWeight: 600 }}>{l.date}</div>
                <div style={{ fontSize: 11, color: "#C0B0D0", marginTop: 2 }}>{l.workout || "-"} • {l.water || "-"}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{l.weight} kg</div>
                {diff && <div style={{ fontSize: 12, fontWeight: 700, color: diff > 0 ? "#E87070" : "#3DBF8A" }}>{diff > 0 ? `▲ +${diff}` : `▼ ${diff}`} kg</div>}
              </div>
            </div>
          );
        })}
      </Card>

      <Card>
        <SectionTitle>📊 KPI รายเดือน</SectionTitle>
        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
          {KPI.map((k, i) => (
            <div key={i} style={{ minWidth: 88, background: "#fff", borderRadius: 18, padding: "13px 10px", textAlign: "center", flexShrink: 0, border: i===0 ? "2px solid #FFB5C8" : "1px solid #F0E6F6" }}>
              <div style={{ fontSize: 10, color: "#C0B0D0", fontWeight: 700, marginBottom: 5 }}>{k.month}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: i===0 ? "#E8608A" : "#B0A0C0" }}>{k.target}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle>🤖 สรุปรายสัปดาห์จาก AI</SectionTitle>
        {report ? (
          <div style={{ fontSize: 13, lineHeight: 1.9, color: "#4A3F55" }} dangerouslySetInnerHTML={{ __html: report.replace(/\n/g,"<br/>") }} />
        ) : (
          <button onClick={getReport} disabled={loading} style={{ width: "100%", padding: 14, border: "none", borderRadius: 14, background: loading ? "#DDD" : "linear-gradient(135deg,#A8E6CF,#C9B8F5)", color: loading ? "#999" : "#fff", fontFamily: "Quicksand", fontSize: 14, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "⏳ AI กำลังวิเคราะห์..." : "🤖 ขอสรุปรายสัปดาห์"}
          </button>
        )}
      </Card>
      <div style={{ height: 16 }} />
    </div>
  );
}
