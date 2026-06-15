// Google Apps Script — วางใน Extensions > Apps Script
// แล้ว Deploy เป็น Web App (Anyone can access)

const SHEET_NAME = "logs";

function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  const user = e.parameter.user || "ninoo";
  const limit = parseInt(e.parameter.limit) || 30;
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1)
    .filter(r => r[1] === user)
    .slice(-limit)
    .map(r => {
      const obj = {};
      headers.forEach((h, i) => obj[h] = r[i]);
      return obj;
    });
  
  return ContentService
    .createTextOutput(JSON.stringify({ success: true, data: rows }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  const payload = JSON.parse(e.postData.contents);
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const row = headers.map(h => payload[h] !== undefined ? payload[h] : "");
  sheet.appendRow(row);
  
  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
