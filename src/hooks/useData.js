import { useState, useEffect, useCallback } from "react";
import { SHEET_URL } from "../config";

export function useData(user) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = useCallback(async () => {
    if (!SHEET_URL) {
      // Load from localStorage if no sheet configured
      const stored = JSON.parse(localStorage.getItem(`fitcoach_${user}`) || "[]");
      setLogs(stored);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${SHEET_URL}?user=${user}&limit=60`);
      const data = await res.json();
      if (data.success) setLogs(data.data);
    } catch (e) {
      const stored = JSON.parse(localStorage.getItem(`fitcoach_${user}`) || "[]");
      setLogs(stored);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const saveLog = async (log) => {
    const newLog = { ...log, user, timestamp: Date.now() };
    // Always save to localStorage as backup
    const stored = JSON.parse(localStorage.getItem(`fitcoach_${user}`) || "[]");
    const updated = [...stored.filter(l => l.date !== log.date), newLog].sort((a,b) => a.timestamp - b.timestamp);
    localStorage.setItem(`fitcoach_${user}`, JSON.stringify(updated));
    setLogs(updated);
    // Try to save to Sheets
    if (SHEET_URL) {
      try {
        await fetch(SHEET_URL, { method: "POST", body: JSON.stringify(newLog) });
      } catch (e) { console.log("Sheet save failed, using localStorage"); }
    }
    return newLog;
  };

  const getTodayLog = () => {
    const today = new Date().toLocaleDateString("th-TH");
    return logs.find(l => l.date === today);
  };

  const getLatestWeight = () => logs.length ? logs[logs.length - 1].weight : null;
  const getWeekLogs = () => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return logs.filter(l => l.timestamp > weekAgo);
  };

  return { logs, loading, saveLog, fetchLogs, getTodayLog, getLatestWeight, getWeekLogs };
}
