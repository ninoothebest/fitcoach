# 🌸 FitCoach — Ninoo & Mink Fighting!

Personal Trainer Web App สำหรับ Ninoo & Mink

## Stack
- React + Vite
- Google Sheets API (database)
- Claude API (AI Coach)
- Vercel (hosting)

## วิธี Deploy

### 1. Setup Google Sheets
1. สร้าง Google Sheet ใหม่
2. ตั้งชื่อ sheet: `logs`
3. Row 1 ใส่ headers: `date | user | weight | bed | wake | sleep_hrs | breakfast | lunch | dinner | snack | workout | water | mood | analysis | calories | protein | carbs | fat`
4. ไปที่ Extensions → Apps Script → วางโค้ด `appsscript.gs` แล้ว Deploy เป็น Web App
5. Copy URL ที่ได้มาใส่ใน `.env`

### 2. Setup Claude API
1. ไปที่ console.anthropic.com
2. สร้าง API Key
3. ใส่ใน `.env`

### 3. Deploy บน Vercel
1. Push โค้ดขึ้น GitHub
2. เข้า vercel.com → Import repo
3. ใส่ Environment Variables จาก `.env`
4. กด Deploy

## Environment Variables
```
VITE_SHEET_URL=your_google_apps_script_url
VITE_CLAUDE_KEY=your_claude_api_key
```
