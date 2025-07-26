
import { google } from 'googleapis';
import { getGoogleAuth } from './google-auth';

const sheets = google.sheets('v4');

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEET_NAME = 'Appointments'; // Or whatever you name your sheet/tab

export async function appendToSheet(rowData: any[]) {
    const auth = getGoogleAuth();
    if (!auth || !SPREADSHEET_ID) {
        console.warn('Google Sheets not configured. Skipping append.');
        return;
    }

    try {
        const response = await sheets.spreadsheets.values.append({
            auth,
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_NAME}!A1`, // Append after the last row in the sheet
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [rowData],
            },
        });
        console.log('Appended to sheet:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error appending to Google Sheet:', error);
        throw new Error('Failed to update the spreadsheet.');
    }
}

export interface AppointmentFromSheet {
    rowIndex: number;
    timestamp: string;
    name: string;
    phone: string;
    email: string;
    treatment: string;
    date: string;
    time: string;
    notes: string;
    status: string;
    paymentProofUrl: string;
}

export async function getAppointmentsFromSheet(): Promise<AppointmentFromSheet[]> {
    const auth = getGoogleAuth();

    if (!auth || !SPREADSHEET_ID) {
        console.warn('Google Sheets not configured. Skipping fetch.');
        return [];
    }

    try {
        const response = await sheets.spreadsheets.values.get({
            auth,
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_NAME}!A:J`, // Assuming up to column J
        });

        const rows = response.data.values;

        if (rows && rows.length > 1) {
            // Skip header row (index 0)
            const dataRows = rows.slice(1);
            return dataRows.map((row, index) => ({
                rowIndex: index + 2, // +2 because sheets are 1-indexed and we skipped the header
                timestamp: row[0] || '',
                name: row[1] || '',
                phone: row[2] || '',
                email: row[3] || '',
                treatment: row[4] || '',
                date: row[5] || '',
                time: row[6] || '',
                notes: row[7] || '',
                status: row[8] || 'Booked', // Default status
                paymentProofUrl: row[9] || '',
            })).reverse(); // Reverse after mapping to keep correct rowIndex
        }

        return [];
    } catch (error) {
        console.error('Error fetching from Google Sheet:', error);
        throw new Error('Failed to fetch data from the spreadsheet.');
    }
}


export async function updateSheetRow(rowIndex: number, cellIndex: number, value: string) {
    const auth = getGoogleAuth();

    if (!auth || !SPREADSHEET_ID) {
        console.warn('Google Sheets not configured. Skipping update.');
        return;
    }
    
    // Convert 0-indexed cellIndex to A1 notation for the column
    const column = String.fromCharCode('A'.charCodeAt(0) + cellIndex);
    const range = `${SHEET_NAME}!${column}${rowIndex}`; 

    try {
        const response = await sheets.spreadsheets.values.update({
            auth,
            spreadsheetId: SPREADSHEET_ID,
            range: range,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[value]],
            },
        });
        console.log(`Updated sheet at ${range}:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Error updating Google Sheet at ${range}:`, error);
        throw new Error('Failed to update the spreadsheet.');
    }
}
