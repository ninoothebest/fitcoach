import { useState } from "react";
import { Card, SectionTitle, PrimaryBtn } from "../components/UI";
import { MUSCLE_GROUPS } from "../config";
import { useAI } from "../hooks/useAI";

function ExerciseLogger({ exercise, prevLog, onSave }) {
  const [kg, setKg] = useState("");
  const [sets, setSets] = useState("3");
  const [reps, setReps] = useState("12");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave({ exercise, kg, sets, reps });
    setSaved(true);
  };

  const suggestWeight = () => {
    if (!prevLog) return null;
    const prev = parseFloat(prevLog.kg);
    if (!prev) return null;
    return (prev + (prev < 20 ? 2.5 : prev < 60 ? 5 : 5)).toFixed(1);
  };

  const suggest = suggestWeight();

  return (
    <div style={{ background: saved ? "rgba(168,230,207,0.15)" : "#FAF5FF", borderRadius: 14, padding: 14, marginBottom: 10, border: `1.5px solid ${saved ? "rgba(168,230,207,0.5)" : "#EDE8FF"}`, transition: "all .3s" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#3D3350" }}>{exercise}</div>
        {saved && <div style={{ fontSize: 11, color: "#3DBF8A", fontWeight: 700 }}>✅ บันทึกแล้ว</div>}
      </div>
      {suggest && (
        <div style={{ fontSize: 11, color: "#E8608A", fontWeight: 700, marginBottom: 8 }}>
          💡 ครั้งก่อน {prevLog.kg}kg → แนะนำ {suggest}kg
        </div>
      )}
      {prevLog && (
        <div style={{ fontSize: 11, color: "#C0B0D0", marginBottom: 8 }}>
          Log ล่าสุด: {prevLog.kg}kg × {prevLog.sets}set × {prevLog.reps}rep
        </div>
      )}
      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        {[["น้ำหนัก (kg)", kg, setKg, "0"], ["เซ็ต", sets, setSets, "3"], ["ครั้ง", reps, setReps, "12"]].map(([label, val, setter, ph]) => (
          <div key={label} style={{ flex: 1 }}>
            <div style={{ fontSize: 9, color: "#C0B0D0", fontWeight: 700, marginBottom: 3 }}>{label}</div>
            <input type="number" value={val} onChange={e => setter(e.target.value)} placeholder={ph}
              style={{ width: "100%", padding: "8px 10px", background: "#fff", border: "1.5px solid #EDE8FF", borderRadius: 10, fontFamily: "Quicksand", fontSize: 14, fontWeight: 700, color: "#3D3350", outline: "none", boxSizing: "border-box", textAlign: "center" }} />
          </div>
        ))}
      </div>
      {!saved && (
        <button onClick={handleSave} style={{ width: "100%", padding: "9px 0", border: "none", borderRadius: 10, background: "linear-gradient(135deg,#FFB5C8,#C9B8F5)", color: "#fff", fontFamily: "Quicksand", fontSize: 12, fontWeight: 800, cursor: "pointer" }}>
          💾 บันทึกท่านี้
        </button>
      )}
    </div>
  );
}

export default function WorkoutV2({ logs }) {
  const [step, setStep] = useState("muscle"); // muscle | subgroup | exercises | log
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [savedExercises, setSavedExercises] = useState([]);
  const [aiTip, setAiTip] = useState("");
  const { loading, analyzeCheckin } = useAI();

  const weekLogs = logs.filter(l => l.timestamp > Date.now() - 7*24*60*60*1000);
  const gymDays = weekLogs.filter(l => l.workout && l.workout !== "ไม่ได้ออก");

  const getPrevLog = (exercise) => {
    for (let i = logs.length - 1; i >= 0; i--) {
      const l = logs[i];
      if (l.exercises && l.exercises.includes(exercise)) {
        const match = l.exercises.split(",").find(e => e.includes(exercise));
        if (match) {
          const parts = match.match(/(\d+\.?\d*)kg×(\d+)set×(\d+)rep/);
          if (parts) return { kg: parts[1], sets: parts[2], reps: parts[3] };
        }
      }
    }
    return null;
  };

  const toggleExercise = (ex) => {
    setSelectedExercises(prev =>
      prev.includes(ex) ? prev.filter(e => e !== ex) : [...prev, ex]
    );
  };

  const handleSaveExercise = (data) => {
    setSavedExercises(prev => [...prev.filter(e => e.exercise !== data.exercise), data]);
  };

  const reset = () => {
    setStep("muscle"); setSelectedMuscle(null); setSelectedSub(null);
    setSelectedExercises([]); setSavedExercises([]); setAiTip("");
  };

  return (
    <div style={{ padding: "16px 16px 0" }}>

      {/* WEEK SUMMARY */}
      <Card>
        <SectionTitle>📅 สัปดาห์นี้</SectionTitle>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {gymDays.length === 0
            ? <div style={{ fontSize: 13, color: "#C0B0D0" }}>ยังไม่ได้ออกกำลังกายสัปดาห์นี้ครับ</div>
            : gymDays.map((l, i) => (
              <div key={i} style={{ padding: "6px 14px", borderRadius: 20, background: "linear-gradient(135deg,#A8E6CF,#3DBF8A)", color: "#fff", fontSize: 12, fontWeight: 700 }}>
                {l.workout} ✅
              </div>
            ))
          }
        </div>
        <div style={{ marginTop: 10, fontSize: 12, color: "#C0B0D0" }}>
          ออกไปแล้ว {gymDays.length} วัน / เป้า 3-4 วัน
        </div>
      </Card>

      {/* WORKOUT BUILDER */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <SectionTitle style={{ margin: 0 }}>🏋️ สร้าง Workout วันนี้</SectionTitle>
          {step !== "muscle" && (
            <button onClick={reset} style={{ fontSize: 11, color: "#C0B0D0", background: "none", border: "none", cursor: "pointer", fontFamily: "Quicksand", fontWeight: 700 }}>
              ← เริ่มใหม่
            </button>
          )}
        </div>

        {/* STEP 1 — เลือกกล้ามเนื้อ */}
        {step === "muscle" && (
          <div>
            <div style={{ fontSize: 12, color: "#C0B0D0", marginBottom: 12 }}>กดเลือกกล้ามเนื้อที่อยากเล่นวันนี้ครับ</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {Object.keys(MUSCLE_GROUPS).map(muscle => (
                <button key={muscle} onClick={() => { setSelectedMuscle(muscle); setStep("subgroup"); }}
                  style={{ padding: "14px 16px", borderRadius: 14, border: "1.5px solid #EDE8FF", background: "#FAF5FF", color: "#3D3350", fontFamily: "Quicksand", fontSize: 14, fontWeight: 700, cursor: "pointer", textAlign: "left", transition: "all .2s" }}>
                  {muscle}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 — เลือก subgroup */}
        {step === "subgroup" && selectedMuscle && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#E8608A", marginBottom: 12 }}>{selectedMuscle}</div>
            <div style={{ fontSize: 12, color: "#C0B0D0", marginBottom: 10 }}>เลือกส่วนที่อยากโฟกัสครับ (เลือกได้หลายอัน)</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {Object.keys(MUSCLE_GROUPS[selectedMuscle]).map(sub => (
                <button key={sub} onClick={() => { setSelectedSub(sub); setStep("exercises"); }}
                  style={{ padding: "12px 16px", borderRadius: 14, border: "1.5px solid #EDE8FF", background: "#FAF5FF", color: "#3D3350", fontFamily: "Quicksand", fontSize: 13, fontWeight: 700, cursor: "pointer", textAlign: "left" }}>
                  {sub}
                  <span style={{ fontSize: 11, color: "#C0B0D0", marginLeft: 8 }}>
                    ({MUSCLE_GROUPS[selectedMuscle][sub].length} ท่า)
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3 — เลือกท่า */}
        {step === "exercises" && selectedSub && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#E8608A", marginBottom: 4 }}>{selectedSub}</div>
            <div style={{ fontSize: 12, color: "#C0B0D0", marginBottom: 12 }}>เลือกท่าที่อยากเล่นครับ</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
              {MUSCLE_GROUPS[selectedMuscle][selectedSub].map(ex => {
                const selected = selectedExercises.includes(ex);
                const prev = getPrevLog(ex);
                return (
                  <button key={ex} onClick={() => toggleExercise(ex)} style={{
                    padding: "12px 16px", borderRadius: 14, cursor: "pointer", textAlign: "left",
                    border: selected ? "none" : "1.5px solid #EDE8FF",
                    background: selected ? "linear-gradient(135deg,#FFB5C8,#C9B8F5)" : "#FAF5FF",
                    color: selected ? "#fff" : "#3D3350",
                    fontFamily: "Quicksand", fontSize: 13, fontWeight: 700,
                    boxShadow: selected ? "0 4px 14px rgba(255,181,200,0.4)" : "none",
                    transition: "all .2s",
                  }}>
                    {ex}
                    {prev && <div style={{ fontSize: 10, opacity: .8, marginTop: 2, fontWeight: 600 }}>ล่าสุด: {prev.kg}kg × {prev.sets}×{prev.reps}</div>}
                  </button>
                );
              })}
            </div>
            {selectedExercises.length > 0 && (
              <PrimaryBtn onClick={() => setStep("log")}>
                ✅ เริ่มบันทึก {selectedExercises.length} ท่า
              </PrimaryBtn>
            )}
          </div>
        )}

        {/* STEP 4 — Log น้ำหนัก */}
        {step === "log" && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#E8608A", marginBottom: 4 }}>{selectedSub}</div>
            <div style={{ fontSize: 12, color: "#C0B0D0", marginBottom: 14 }}>กรอกน้ำหนัก เซ็ต และครั้งครับ</div>
            {selectedExercises.map(ex => (
              <ExerciseLogger key={ex} exercise={ex} prevLog={getPrevLog(ex)} onSave={handleSaveExercise} />
            ))}
            {savedExercises.length === selectedExercises.length && (
              <div>
                <div style={{ background: "rgba(168,230,207,0.2)", borderRadius: 14, padding: 14, marginBottom: 12, border: "1px solid rgba(168,230,207,0.4)", fontSize: 13, color: "#3DBF8A", fontWeight: 700, textAlign: "center" }}>
                  🎉 บันทึกครบแล้ว! ดีมากครับ
                </div>
                <button onClick={reset} style={{ width: "100%", padding: 12, borderRadius: 12, border: "1.5px solid #EDE8FF", background: "transparent", color: "#C0B0D0", fontFamily: "Quicksand", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  + เพิ่มกล้ามเนื้ออื่น
                </button>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* HISTORY */}
      {logs.filter(l => l.workout && l.workout !== "ไม่ได้ออก").length > 0 && (
        <Card>
          <SectionTitle>📋 ประวัติ Workout</SectionTitle>
          {logs.filter(l => l.workout && l.workout !== "ไม่ได้ออก").slice(-5).reverse().map((l, i) => (
            <div key={i} style={{ padding: "10px 0", borderBottom: "1px solid #F5EEF8" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: "#3D3350" }}>{l.workout}</span>
                <span style={{ fontSize: 11, color: "#C0B0D0" }}>{l.date}</span>
              </div>
              {l.exercises && <div style={{ fontSize: 11, color: "#B0A0C0", lineHeight: 1.7 }}>{l.exercises}</div>}
            </div>
          ))}
        </Card>
      )}
      <div style={{ height: 16 }} />
    </div>
  );
}
