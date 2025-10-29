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
  const data = [
    new Date().toISOString(), // Timestamp
    formData.pduStaff || '',
    formData.tdStaff || '',
    formData.transmisiStaff?.join(', ') || '',
    formData.buktiStudio || '',
    formData.buktiStreaming || '',
    formData.buktiSubcontrol || '',
    formData.selectedEvents?.map((e: any) => `${e.time}: ${e.name} (${e.type})`).join('; ') || '',
    formData.kendalas?.map((k: any) => `${k.nama} - ${k.waktu}`).join('; ') || '',
  ];

  return await appendToSheet('MORNING', data);
}

export async function submitAfternoonReport(formData: any) {
  const data = [
    new Date().toISOString(), // Timestamp
    formData.pduStaff || '',
    formData.tdStaff || '',
    formData.transmisiStaff?.join(', ') || '',
    formData.buktiStudio || '',
    formData.buktiStreaming || '',
    formData.buktiSubcontrol || '',
    formData.selectedEvents?.map((e: any) => `${e.time}: ${e.name} (${e.type})`).join('; ') || '',
    formData.kendalas?.map((k: any) => `${k.nama} - ${k.waktu}`).join('; ') || '',
  ];

  return await appendToSheet('AFTERNOON', data);
}
