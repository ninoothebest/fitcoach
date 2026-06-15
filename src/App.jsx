import { useState } from "react";
import { USERS } from "./config";
import { useData } from "./hooks/useData";
import { Toast } from "./components/UI";
import Home from "./pages/Home";
import Checkin from "./pages/Checkin";
import Food from "./pages/Food";
import WorkoutV2 from "./pages/Workout";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";
import Fitbit from "./pages/Fitbit";

const TABS = [
  { id: "home",     icon: "🏠", label: "หน้าหลัก" },
  { id: "checkin",  icon: "✏️", label: "Check-in" },
  { id: "food",     icon: "🍽️", label: "อาหาร" },
  { id: "workout",  icon: "🏋️", label: "ยิม" },
  { id: "progress", icon: "📊", label: "Progress" },
  { id: "more",     icon: "⋯",  label: "เพิ่มเติม" },
];

const MORE_TABS = [
  { id: "fitbit",  icon: "⌚", label: "Fitbit" },
  { id: "profile", icon: "👤", label: "โปรไฟล์" },
];

export default function App() {
  const [user, setUser] = useState("ninoo");
  const [tab, setTab] = useState("home");
  const [showMore, setShowMore] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "" });
  const { logs, saveLog } = useData(user);

  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  };

  const handleSave = async (log) => {
    await saveLog(log);
    showToast("✅ บันทึกแล้วครับ!");
    setTab("home");
  };

  const cfg = USERS[user];

  const handleTab = (id) => {
    if (id === "more") { setShowMore(!showMore); return; }
    setTab(id); setShowMore(false);
  };

  return (
    <div style={{ fontFamily: "Quicksand, Sarabun, sans-serif", background: "linear-gradient(160deg,#FFF5FA 0%,#F8F0FF 100%)", minHeight: "100vh", paddingBottom: 70 }}>

      {/* TOPBAR */}
      <div style={{ background: "rgba(255,255,255,0.88)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,181,200,0.2)", padding: "13px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 200 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 13, background: "linear-gradient(135deg,#FFB5C8,#C9B8F5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, boxShadow: "0 4px 14px rgba(255,181,200,0.45)", flexShrink: 0 }}>🌸</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, background: "linear-gradient(135deg,#FF8FAD,#9B7FE8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>FitCoach</div>
            <div style={{ fontSize: 10, color: "#C0B0D0", fontWeight: 600 }}>Ninoo & Mink Fighting! 💪</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {Object.entries(USERS).map(([key, u]) => (
            <button key={key} onClick={() => setUser(key)} style={{
              padding: "7px 14px", borderRadius: 20, border: "none",
              fontFamily: "Quicksand", fontSize: 12, fontWeight: 700, cursor: "pointer",
              background: user === key ? u.gradient : (key === "ninoo" ? "#FFE8F0" : "#EDE8FF"),
              color: user === key ? "#fff" : u.colorDark,
              boxShadow: user === key ? "0 4px 14px rgba(0,0,0,0.15)" : "none",
              transform: user === key ? "translateY(-1px)" : "none", transition: "all .25s",
            }}>{u.emoji} {u.name}</button>
          ))}
        </div>
      </div>

      {/* MORE MENU */}
      {showMore && (
        <div style={{ position: "fixed", bottom: 70, right: 16, background: "#fff", borderRadius: 20, padding: 12, boxShadow: "0 8px 32px rgba(180,150,200,0.25)", border: "1px solid rgba(255,181,200,0.2)", zIndex: 300 }}>
          {MORE_TABS.map(t => (
            <button key={t.id} onClick={() => handleTab(t.id)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 14px", border: "none", background: tab === t.id ? "#FFF5FA" : "transparent", borderRadius: 12, fontFamily: "Quicksand", fontSize: 13, fontWeight: 700, color: tab === t.id ? "#E8608A" : "#3D3350", cursor: "pointer", marginBottom: 4 }}>
              <span style={{ fontSize: 20 }}>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>
      )}

      {/* PAGES */}
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        {tab === "home"     && <Home user={user} logs={logs} onCheckin={() => setTab("checkin")} />}
        {tab === "checkin"  && <Checkin user={user} userCfg={cfg} logs={logs} onSave={handleSave} />}
        {tab === "food"     && <Food logs={logs} />}
        {tab === "workout"  && <WorkoutV2 logs={logs} />}
        {tab === "progress" && <Progress logs={logs} userCfg={cfg} />}
        {tab === "profile"  && <Profile user={user} logs={logs} userCfg={cfg} />}
        {tab === "fitbit"   && <Fitbit user={user} userCfg={cfg} />}
      </div>

      {/* BOTTOM NAV */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,181,200,0.2)", display: "flex", zIndex: 200 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => handleTab(t.id)} style={{
            flex: 1, border: "none", background: "transparent",
            fontFamily: "Quicksand", fontSize: 9, fontWeight: 700,
            color: (tab === t.id || (t.id === "more" && ["fitbit","profile"].includes(tab))) ? cfg.colorDark : "#C0B0D0",
            cursor: "pointer", padding: "10px 4px 8px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 2, transition: "color .2s",
          }}>
            <span style={{ fontSize: 20 }}>{t.icon}</span>
            {t.label}
            {(tab === t.id || (t.id === "more" && ["fitbit","profile"].includes(tab))) && (
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: cfg.gradient, marginTop: 1 }}/>
            )}
          </button>
        ))}
      </div>

      <Toast msg={toast.msg} show={toast.show} />
    </div>
  );
}
