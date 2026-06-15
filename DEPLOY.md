# 🚀 วิธี Deploy FitCoach — ทีละขั้น

## ขั้นที่ 1 — Setup Google Sheets (10 นาที)

1. เปิด Google Sheets → สร้างไฟล์ใหม่ ตั้งชื่อ "FitCoach Data"
2. Sheet แรกตั้งชื่อว่า `logs`
3. Row 1 ใส่ headers ตามนี้ (คอลัมน์ A-R):
   ```
   date | user | weight | bed | wake | sleepHrs | breakfast | lunch | dinner | snack | workout | exercises | water | mood | analysis | calories | protein | timestamp
   ```
4. ไปที่ **Extensions → Apps Script**
5. ลบโค้ดเดิม → วางโค้ดจากไฟล์ `appsscript.gs`
6. กด **Deploy → New Deployment**
   - Type: Web App
   - Execute as: Me
   - Who has access: **Anyone**
7. Copy URL ที่ได้

## ขั้นที่ 2 — Setup Claude API (5 นาที)

1. ไปที่ console.anthropic.com
2. API Keys → Create Key
3. Copy key ไว้

## ขั้นที่ 3 — Upload ขึ้น GitHub (10 นาที)

1. เปิด github.com → New Repository → ชื่อ `fitcoach` → Create
2. กด "uploading an existing file"
3. Upload ทุกไฟล์ในโฟลเดอร์นี้
4. Commit changes

## ขั้นที่ 4 — Deploy บน Vercel (5 นาที)

1. เปิด vercel.com → Sign in with GitHub
2. New Project → Import `fitcoach`
3. **Environment Variables** ใส่:
   - `VITE_SHEET_URL` = URL จาก Google Apps Script
   - `VITE_CLAUDE_KEY` = Claude API Key
4. กด **Deploy**
5. ได้ลิงก์ `fitcoach.vercel.app` ใช้งานได้เลย!

## ขั้นที่ 5 — Add to Home Screen (1 นาที)

เปิดลิงก์บนมือถือ → กด Share → Add to Home Screen
→ ได้ไอคอนบนหน้าจอเหมือนแอปเลยครับ 🎉
