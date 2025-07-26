
'use server';

import { updateSheetRow } from "@/services/google-sheets";

export async function updateAppointmentStatus(rowIndex: number, status: 'Confirmed' | 'Cancelled') {
    try {
        // Column I is the 9th column (index 8).
        await updateSheetRow(rowIndex, 8, status);
        return { success: true };
    } catch (error) {
        console.error("Error in server action updateAppointmentStatus:", error);
        return { success: false, error: "Failed to update status." };
    }
}

    