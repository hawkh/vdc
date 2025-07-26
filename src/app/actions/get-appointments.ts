
'use server';

import { getAppointmentsFromSheet } from "@/services/google-sheets";

export async function getAppointments() {
    try {
        const appointments = await getAppointmentsFromSheet();
        return appointments;
    } catch (error) {
        console.error("Error in server action getAppointments:", error);
        // In a real app, you might want to handle this more gracefully
        // For now, we return an empty array if there's an error to avoid crashing the page.
        return [];
    }
}

    