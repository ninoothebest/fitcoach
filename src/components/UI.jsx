// Reusable UI components

export function Card({ children, style = {}, className = "" }) {
  return (
    <div className={className} style={{
      background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)",
      borderRadius: 24, padding: 20,
      boxShadow: "0 4px 24px rgba(180,150,200,0.12)",
      border: "1px solid rgba(255,255,255,0.9)",
      marginBottom: 14, ...style
    }}>{children}</div>
  );
}

export function SectionTitle({ children }) {
  return <div style={{ fontSize: 13, fontWeight: 800, color: "#3D3350", marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>{children}</div>;
}

export function Chip({ label, active, onClick, color = "pink" }) {
  const colors = {
    pink: { active: "linear-gradient(135deg,#FFB5C8,#FF8FAD)", shadow: "rgba(255,181,200,0.4)", text: "#fff", border: "#EDE8FF", bg: "#FAF5FF", idle: "#C0B0D0" },
    mint: { active: "linear-gradient(135deg,#A8E6CF,#3DBF8A)", shadow: "rgba(168,230,207,0.4)", text: "#fff", border: "#D0F5E8", bg: "#F0FAF5", idle: "#C0B0D0" },
    lav:  { active: "linear-gradient(135deg,#C9B8F5,#9B7FE8)", shadow: "rgba(201,184,245,0.4)", text: "#fff", border: "#EDE8FF", bg: "#FAF5FF", idle: "#C0B0D0" },
  };
  const c = colors[color];
  return (
    <button onClick={onClick} style={{
      padding: "8px 16px", borderRadius: 20, cursor: "pointer", transition: "all .2s",
      border: active ? "none" : `1.5px solid ${c.border}`,
      background: active ? c.active : c.bg,
      color: active ? c.text : c.idle,
      fontFamily: "Quicksand", fontSize: 12, fontWeight: 700,
      boxShadow: active ? `0 4px 14px ${c.shadow}` : "none",
      transform: active ? "translateY(-1px)" : "none",
    }}>{label}</button>
  );
}

export function ProgressBar({ label, val, max, gradient, unit = "" }) {
  const pct = Math.min(100, Math.max(0, (val / max) * 100));
  const color = pct >= 100 ? "#3DBF8A" : pct >= 70 ? "#E8608A" : "#E87070";
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
        <span>{label}</span>
        <span style={{ color }}>{val}{unit} / {max}{unit} {pct >= 100 ? "✅" : ""}</span>
      </div>
      <div style={{ height: 10, background: "#F5EEF8", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: gradient, borderRadius: 99, transition: "width .8s cubic-bezier(.4,0,.2,1)" }} />
      </div>
    </div>
  );
}

export function Input({ label, ...props }) {
  return (
    <div style={{ marginBottom: 12 }}>
      {label && <div style={{ fontSize: 10, color: "#C0B0D0", fontWeight: 700, marginBottom: 5, letterSpacing: .5 }}>{label}</div>}
      <input {...props} style={{
        width: "100%", padding: "11px 14px",
        background: "#FAF5FF", border: "1.5px solid #EDE8FF",
        borderRadius: 14, fontFamily: "Quicksand",
        fontSize: props.large ? 22 : 14, color: "#3D3350", outline: "none",
        boxSizing: "border-box", colorScheme: "light",
        textAlign: props.center ? "center" : "left",
        ...props.style
      }} />
    </div>
  );
}

export function Textarea({ label, ...props }) {
  return (
    <div style={{ marginBottom: 12 }}>
      {label && <div style={{ fontSize: 10, color: "#C0B0D0", fontWeight: 700, marginBottom: 5 }}>{label}</div>}
      <textarea {...props} style={{
        width: "100%", padding: "11px 14px", resize: "none", height: 68,
        background: "#FAF5FF", border: "1.5px solid #EDE8FF",
        borderRadius: 14, fontFamily: "Quicksand",
        fontSize: 14, color: "#3D3350", outline: "none", boxSizing: "border-box",
      }} />
    </div>
  );
}

export function PrimaryBtn({ children, onClick, loading = false, style = {} }) {
  return (
    <button onClick={onClick} disabled={loading} style={{
      width: "100%", padding: 16, border: "none", borderRadius: 18,
      background: loading ? "#DDD" : "linear-gradient(135deg,#FFB5C8,#C9B8F5)",
      color: loading ? "#999" : "#fff", fontFamily: "Quicksand", fontSize: 15, fontWeight: 800,
      cursor: loading ? "not-allowed" : "pointer",
      boxShadow: loading ? "none" : "0 6px 20px rgba(255,181,200,0.45)",
      transition: "all .2s", letterSpacing: .5, marginTop: 8, ...style
    }}>{loading ? "⏳ กำลังประมวลผล..." : children}</button>
  );
}

export function Toast({ msg, show }) {
  return (
    <div style={{
      position: "fixed", top: 80, left: "50%", transform: `translateX(-50%) translateY(${show ? 0 : -20}px)`,
      background: "#3D3350", color: "#fff", padding: "10px 20px", borderRadius: 14,
      fontSize: 13, fontWeight: 700, opacity: show ? 1 : 0,
      transition: "all .3s", zIndex: 999, whiteSpace: "nowrap",
      boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    }}>{msg}</div>
  );
}

// ✅ แก้ bug วันที่ใต้กราฟ
function formatDateLabel(dateStr) {
  if (!dateStr) return "";
  // ถ้าเป็น ISO format ให้แปลง
  if (dateStr.includes("T")) {
    const d = new Date(dateStr);
    return `${d.getDate()} มิ.ย.`;
  }
  // ถ้าเป็น th-TH format เช่น "6 มิถุนายน 2569"
  const parts = dateStr.split(" ");
  if (parts.length >= 2) return `${parts[0]} ${parts[1]?.substring(0, 3)}`;
  return dateStr;
}

export function WeightChart({ logs }) {
  if (!logs || logs.length < 2) return (
    <div style={{ textAlign: "center", color: "#C0B0D0", padding: "20px 0", fontSize: 13 }}>
      Check-in อย่างน้อย 2 วันเพื่อดูกราฟครับ 📈
    </div>
  );
  const recent = logs.slice(-7);
  const vals = recent.map(l => parseFloat(l.weight));
  const min = Math.min(...vals) - 0.8, max = Math.max(...vals) + 0.5;
  const W = 300, H = 90, pad = 14;
  const pts = recent.map((l, i) => ({
    x: pad + (i / (recent.length - 1)) * (W - pad * 2),
    y: pad + ((max - parseFloat(l.weight)) / (max - min)) * (H - pad * 2),
    val: l.weight,
    label: formatDateLabel(l.date),
  }));
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const area = line + ` L${pts[pts.length-1].x},${H} L${pts[0].x},${H} Z`;
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 90 }}>
        <defs>
          <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFB5C8" stopOpacity=".5"/>
            <stop offset="100%" stopColor="#FFB5C8" stopOpacity="0"/>
          </linearGradient>
          <filter id="glow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <path d={area} fill="url(#wg)"/>
        <path d={line} fill="none" stroke="#FFB5C8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)"/>
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={i === pts.length-1 ? 6 : 3.5}
              fill={i === pts.length-1 ? "#C9B8F5" : "#FFB5C8"}
              stroke="white" strokeWidth="2" filter={i === pts.length-1 ? "url(#glow)" : ""}/>
            <text x={p.x} y={p.y-8} textAnchor="middle" fontSize="8"
              fill={i === pts.length-1 ? "#9B7FE8" : "#C0B0D0"} fontWeight="700">{p.val}</text>
          </g>
        ))}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#C0B0D0", fontWeight: 600, marginTop: 4 }}>
        {pts.map((p, i) => <span key={i}>{p.label}</span>)}
      </div>
    </div>
  );
}
