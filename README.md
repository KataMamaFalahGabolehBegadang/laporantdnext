# Reporting System with Google Sheets & Cloudinary Integration

A Next.js application for collecting morning and afternoon reports with file uploads to Cloudinary and data storage in Google Sheets.

## Features

- Multi-step forms for morning and afternoon reports
- Staff selection (PDU, TD, Transmisi)
- Evidence file uploads to Cloudinary
- ACARA event selection with custom events
- Kendala reporting
- Google Sheets integration for data storage
- Responsive design with Tailwind CSS

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Google Sheets API Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API
4. Create a Service Account:
   - Go to "IAM & Admin" > "Service Accounts"
   - Click "Create Service Account"
   - Give it a name and description
   - Click "Create and Continue"
   - Add the "Editor" role
   - Click "Done"
5. Create a JSON key for the service account:
   - Click on the service account you just created
   - Go to the "Keys" tab
   - Click "Add Key" > "Create new key" > "JSON"
   - Download the JSON file

### 3. Cloudinary Setup

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Go to your Dashboard
4. Note down your Cloud Name, API Key, and API Secret

### 4. Create Google Sheets Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet named "REPORTS"
3. Create two sheets named "MORNING" and "AFTERNOON"
4. Add headers to each sheet:
   - Column A: Timestamp
   - Column B: PDU Staff
   - Column C: TD Staff
   - Column D: Transmisi Staff
   - Column E: Bukti Studio
   - Column F: Bukti Streaming
   - Column G: Bukti Subcontrol
   - Column H: Selected Events
   - Column I: Kendalas

### 5. Share the Spreadsheet

1. Click the "Share" button in Google Sheets
2. Add the service account email (from the JSON key) as an editor
3. Copy the spreadsheet ID from the URL (the long string between `/d/` and `/edit`)

### 6. Environment Variables

Create a `.env.local` file in the root directory and add:

```env
# Google Sheets API Configuration
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id_here
GOOGLE_SHEETS_PROJECT_ID=your_project_id_here
GOOGLE_SHEETS_PRIVATE_KEY_ID=your_private_key_id_here
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key_here\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_CLIENT_EMAIL=your_service_account_email_here
GOOGLE_SHEETS_CLIENT_ID=your_client_id_here
GOOGLE_SHEETS_CLIENT_X509_CERT_URL=your_cert_url_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

Replace the values with the corresponding values from your service account JSON key file and Cloudinary dashboard.

### 7. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. From the home page, choose either "Morning Report" or "Afternoon Report"
2. Fill out the 4-step form:
   - Step 1: Select staff members
   - Step 2: Upload evidence files (automatically uploaded to Cloudinary)
   - Step 3: Select ACARA events
   - Step 4: Report any kendalas
3. Review the summary and click "Submit to Google Sheets" to save the data

## File Upload Process

When users upload files in Step 2:

1. Files are automatically uploaded to Cloudinary via the `/api/upload` endpoint
2. The API returns a secure Cloudinary URL
3. The URL is stored in localStorage and displayed as a clickable link
4. When submitting the form, the Cloudinary URLs are saved to Google Sheets

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── upload/route.ts          # Cloudinary file upload endpoint
│   │   ├── submit-morning/route.ts  # Submit morning reports to Google Sheets
│   │   └── submit-afternoon/route.ts # Submit afternoon reports to Google Sheets
│   ├── morning/
│   │   ├── page.tsx               # Morning form step 1
│   │   ├── step2/page.tsx         # Morning form step 2 (file uploads)
│   │   ├── step3/page.tsx         # Morning form step 3
│   │   ├── step4/page.tsx         # Morning form step 4
│   │   └── summary/page.tsx       # Morning summary with Google Sheets submit
│   ├── afternoon/
│   │   ├── page.tsx               # Afternoon form step 1
│   │   ├── step2/page.tsx         # Afternoon form step 2 (file uploads)
│   │   ├── step3/page.tsx         # Afternoon form step 3
│   │   ├── step4/page.tsx         # Afternoon form step 4
│   │   └── summary/page.tsx       # Afternoon summary with Google Sheets submit
│   ├── page.tsx                   # Landing page
│   ├── layout.tsx                 # Root layout
│   └── globals.css                # Global styles
└── lib/
    ├── cloudinary.ts              # Cloudinary upload functions
    └── googleSheets.ts            # Google Sheets API functions
```

## API Endpoints

- `POST /api/upload` - Upload files to Cloudinary and return secure URLs
- `POST /api/submit-morning` - Submit morning report data to Google Sheets
- `POST /api/submit-afternoon` - Submit afternoon report data to Google Sheets

## Technologies Used

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Google Sheets API
- Cloudinary API
- React Hook Form (for form handling)

## Troubleshooting

- **Authentication errors**: Double-check your environment variables and service account setup
- **Permission errors**: Ensure the service account has editor access to the spreadsheet
- **API errors**: Verify that the Google Sheets API is enabled in your Google Cloud project
- **Upload errors**: Check your Cloudinary credentials and ensure the account has upload permissions

## Security Note

This implementation uses service account authentication for Google Sheets (suitable for server-side applications) and Cloudinary API keys. For production deployments, consider additional security measures like rate limiting and input validation.
