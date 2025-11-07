import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const CREDENTIALS = {
  type: "service_account",
  project_id: process.env.GOOGLE_SHEETS_PROJECT_ID,
  private_key_id: process.env.GOOGLE_SHEETS_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_SHEETS_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.GOOGLE_SHEETS_CLIENT_X509_CERT_URL,
};

export async function appendToSheet(sheetName: string, data: any[]) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: CREDENTIALS,
      scopes: SCOPES,
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Get the current data to determine the next row
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:A`,
    });

    const nextRow = (response.data.values?.length || 0) + 1;

    // Append the new data
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A${nextRow}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [data],
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error appending to Google Sheets:', error);
    return { success: false, error };
  }
}

export async function submitMorningReport(formData: any) {
  const timestamp = new Date().toISOString();
  const tanggal = formData.customDate || new Date().toISOString().split('T')[0];
  const data = [
    timestamp, // Timestamp
    formData.pduStaff || '',
    formData.tdStaff || '',
    formData.transmisiStaff?.map((name: string) => name.replace(/^Transmisi\s+/, '')).join(', ') || '',
    formData.buktiStudio || '',
    formData.buktiStreaming || '',
    formData.buktiSubcontrol || '',
    formData.selectedEvents?.map((e: any) => `${e.time}: ${e.name} (${e.type})`).join('; ') || '',
    formData.kendalas?.map((k: any) => `${k.nama} - ${k.waktu}`).join('; ') || '',
    tanggal, // Tanggal
  ];

  return await appendToSheet('MORNING', data);
}

export async function submitAfternoonReport(formData: any) {
  const timestamp = new Date().toISOString();
  const tanggal = formData.customDate || new Date().toISOString().split('T')[0];
  const data = [
    timestamp, // Timestamp
    formData.pduStaff || '',
    formData.tdStaff || '',
    formData.transmisiStaff?.map((name: string) => name.replace(/^Transmisi\s+/, '')).join(', ') || '',
    formData.buktiStudio || '',
    formData.buktiStreaming || '',
    formData.buktiSubcontrol || '',
    formData.selectedEvents?.map((e: any) => `${e.time}: ${e.name} (${e.type})`).join('; ') || '',
    formData.kendalas?.map((k: any) => `${k.nama} - ${k.waktu}`).join('; ') || '',
    tanggal, // Tanggal
  ];

  return await appendToSheet('AFTERNOON', data);
}

export async function deleteFromSheet(sheetName: string, timestamp: string) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: CREDENTIALS,
      scopes: SCOPES,
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Get all data from the sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:A`,
    });

    const values = response.data.values || [];
    const rowIndex = values.findIndex((row) => row[0] === timestamp);

    if (rowIndex === -1) {
      console.warn('Row not found in sheet for deletion');
      return { success: true }; // Not an error if not found
    }

    // Row numbers are 1-indexed, and we need to delete the row (rowIndex + 1)
    const deleteRow = rowIndex + 1;

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [
          {
            deleteRange: {
              range: {
                sheetId: 0, // Assuming first sheet, but need to get sheetId properly
                startRowIndex: deleteRow - 1,
                endRowIndex: deleteRow,
                startColumnIndex: 0,
                endColumnIndex: 10, // Assuming 10 columns
              },
              shiftDimension: 'ROWS',
            },
          },
        ],
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting from Google Sheets:', error);
    return { success: false, error };
  }
}
