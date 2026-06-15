import { Card, SectionTitle } from "../components/UI";
import { WORKOUT_PLANS } from "../config";

export default function Workout({ logs }) {
  const workoutLogs = logs.filter(l => l.workout && l.workout !== "ไม่ได้ออก").slice(-10).reverse();
  const weekLogs = logs.filter(l => l.timestamp > Date.now()-7*24*60*60*1000);
  const weekWorkouts = weekLogs.filter(l => l.workout && l.workout !== "ไม่ได้ออก").map(l => l.workout);

  return (
    <div style={{ padding: "16px 16px 0" }}>
      <Card>
        <SectionTitle>📅 สัปดาห์นี้</SectionTitle>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["Push","Pull","Leg","Upper"].map(d => {
            const done = weekWorkouts.includes(d);
            return (
              <div key={d} style={{ padding: "8px 16px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: done ? "linear-gradient(135deg,#A8E6CF,#3DBF8A)" : "#FAF5FF", color: done ? "#fff" : "#C0B0D0", border: done ? "none" : "1.5px solid #EDE8FF", boxShadow: done ? "0 4px 12px rgba(168,230,207,0.4)" : "none" }}>
                {d} {done ? "✅" : ""}
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <SectionTitle>💡 Progressive Overload แนะนำ</SectionTitle>
        <div style={{ fontSize: 13, lineHeight: 2, color: "#4A3F55" }}>
          🎯 <strong>Deadlift</strong> — ลอง 60kg ครั้งหน้าได้เลยครับ<br/>
          💪 <strong>Bench Press</strong> — 17.5kg×5×12 → 20kg×4×10<br/>
          ✅ <strong>Leg Press</strong> — 120kg → 130kg ได้เลย<br/>
          📈 <strong>Hack Squat</strong> — 80kg → 85kg สัปดาห์หน้า
        </div>
      </Card>

      {workoutLogs.length > 0 && (
        <Card>
          <SectionTitle>📋 ประวัติ Workout</SectionTitle>
          {workoutLogs.map((l, i) => (
            <div key={i} style={{ padding: "12px 0", borderBottom: i < workoutLogs.length-1 ? "1px solid #F5EEF8" : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: "#3D3350" }}>{l.workout} Day</span>
                <span style={{ fontSize: 11, color: "#C0B0D0" }}>{l.date}</span>
              </div>
              {l.exercises && <div style={{ fontSize: 12, color: "#B0A0C0", lineHeight: 1.6 }}>{l.exercises}</div>}
            </div>
          ))}
        </Card>
      )}

      <Card>
        <SectionTitle>📚 Template ท่าทั้งหมด</SectionTitle>
        {Object.entries(WORKOUT_PLANS).map(([day, exs]) => (
          <div key={day} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#E8608A", marginBottom: 8, letterSpacing: 1 }}>{day.toUpperCase()} DAY</div>
            {exs.map((ex, i) => (
              <div key={i} style={{ fontSize: 13, color: "#4A3F55", padding: "5px 0", borderBottom: "1px solid #F9F4FF", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#F5EEF8", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#C9B8F5", fontWeight: 800, flexShrink: 0 }}>{i+1}</span>
                {ex}
              </div>
            ))}
          </div>
        ))}
      </Card>
      <div style={{ height: 16 }} />
    </div>
  );
}
