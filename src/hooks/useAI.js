import { useState } from "react";
import { CLAUDE_KEY } from "../config";

export function useAI() {
  const [loading, setLoading] = useState(false);

  const analyzeCheckin = async (log, userConfig) => {
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `คุณคือ Personal Trainer และนักโภชนาการผู้เชี่ยวชาญ วิเคราะห์ข้อมูลสุขภาพเป็นภาษาไทยกระชับ:

ผู้ใช้: ${userConfig.name} | อายุ ${userConfig.age} ปี | สูง ${userConfig.height} cm | น้ำหนักเป้า ${userConfig.targetWeight} kg
น้ำหนักวันนี้: ${log.weight} kg
การนอน: ${log.bed || '-'} → ${log.wake || '-'} (${log.sleepHrs || '-'} ชม.)
เช้า: ${log.breakfast || '-'}
กลางวัน: ${log.lunch || '-'}
เย็น: ${log.dinner || '-'}
ของว่าง: ${log.snack || '-'}
ออกกำลังกาย: ${log.workout || 'ไม่ได้ออก'}
น้ำ: ${log.water || '-'}
ความรู้สึก: ${log.mood || '-'}

ประเมินและตอบใน format นี้:
📊 แคล: ~XXX kcal | โปรตีน: ~XXg
✅ จุดเด่น: (1-2 ข้อ)
⚠️ ปรับได้: (1-2 ข้อ)
🎯 โจทย์พรุ่งนี้: (1 ข้อ)`
          }]
        })
      });
      const data = await res.json();
      return data.content?.[0]?.text || "วิเคราะห์ไม่ได้ครับ";
    } catch (e) {
      return "❌ AI ไม่ตอบตอนนี้ครับ ลองใหม่ทีหลัง";
    } finally {
      setLoading(false);
    }
  };

  const analyzeFood = async (imageBase64, mediaType) => {
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 800,
          messages: [{
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: mediaType, data: imageBase64 } },
              { type: "text", text: `วิเคราะห์อาหารในรูปเป็นภาษาไทย:
🍽️ เมนู: (ชื่ออาหาร)
🔥 แคล: ~XXX kcal
💪 โปรตีน: ~XXg | คาร์บ: ~XXg | ไขมัน: ~XXg
⭐ คะแนน: X/10 (สำหรับคนลดน้ำหนัก)
💡 เคล็ดลับ: (1 ประโยค)` }
            ]
          }]
        })
      });
      const data = await res.json();
      return data.content?.[0]?.text || "วิเคราะห์ไม่ได้ครับ";
    } catch (e) {
      return "❌ AI ไม่ตอบตอนนี้ครับ";
    } finally {
      setLoading(false);
    }
  };

  const weeklyReport = async (logs, userConfig) => {
    setLoading(true);
    try {
      const summary = logs.slice(-7).map(l =>
        `${l.date}: ${l.weight}kg | ${l.workout || 'พัก'} | น้ำ:${l.water || '-'}`
      ).join('\n');
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `วิเคราะห์สรุปรายสัปดาห์ภาษาไทยสำหรับ ${userConfig.name}:

${summary}

สรุป:
📈 แนวโน้มน้ำหนัก
💪 ความสม่ำเสมอออกกำลังกาย
🏆 จุดเด่นของสัปดาห์
⚡ สิ่งที่ต้องโฟกัสสัปดาห์หน้า`
          }]
        })
      });
      const data = await res.json();
      return data.content?.[0]?.text || "วิเคราะห์ไม่ได้ครับ";
    } catch (e) {
      return "❌ ไม่สามารถสรุปได้ตอนนี้";
    } finally {
      setLoading(false);
    }
  };

  return { loading, analyzeCheckin, analyzeFood, weeklyReport };
}
