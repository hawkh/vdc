import { jest } from '@jest/globals';
import { createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from './google-calendar';
import * as googleAuth from './google-auth';

// Mock the googleapis module
jest.mock('googleapis', () => ({
    google: {
        calendar: jest.fn(() => ({
            events: {
                insert: jest.fn(),
                get: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            },
        })),
    },
}));

// Mock the google-auth module
jest.mock('./google-auth', () => ({
    getGoogleAuth: jest.fn(),
    getCalendarId: jest.fn(),
}));

describe('Google Calendar Service', () => {
    const mockAuth = { credentials: 'mock-auth' };
    const mockCalendarId = 'test-calendar-id';
    const mockCalendar = {
        events: {
            insert: jest.fn(),
            get: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (googleAuth.getGoogleAuth as jest.Mock).mockReturnValue(mockAuth);
        (googleAuth.getCalendarId as jest.Mock).mockReturnValue(mockCalendarId);
        
        const { google } = require('googleapis');
        (google.calendar as jest.Mock).mockReturnValue(mockCalendar);
    });

    describe('createCalendarEvent', () => {
        const mockEventDetails = {
            summary: 'Dental Cleaning',
            description: 'Regular dental cleaning appointment',
            startTime: '2024-01-15T10:00:00Z',
            attendees: [{ email: 'patient@example.com' }],
            duration: 60,
            treatmentType: 'Dental Cleaning',
        };

        it('should create calendar event successfully', async () => {
            const mockResponse = {
                data: {
                    id: 'event-123',
                    htmlLink: 'https://calendar.google.com/event/123',
                    status: 'confirmed',
                },
            };
            mockCalendar.events.insert.mockResolvedValue(mockResponse);

            const result = await createCalendarEvent(mockEventDetails);

            expect(mockCalendar.events.insert).toHaveBeenCalledWith({
                auth: mockAuth,
                calendarId: mockCalendarId,
                requestBody: expect.objectContaining({
                    summary: 'Dental Cleaning',
                    description: 'Regular dental cleaning appointment',
                    start: {
                        dateTime: '2024-01-15T10:00:00Z',
                        timeZone: 'Asia/Kolkata',
                    },
                    end: {
                        dateTime: '2024-01-15T11:00:00.000Z',
                        timeZone: 'Asia/Kolkata',
                    },
                    attendees: [{ email: 'patient@example.com' }],
                    colorId: '1',
                    location: 'Vasavi Dental Care',
                    status: 'confirmed',
                }),
            });

            expect(result).toEqual({
                id: 'event-123',
                htmlLink: 'https://calendar.google.com/event/123',
                status: 'confirmed',
            });
        });

        it('should use default duration of 30 minutes when not specified', async () => {
            const eventWithoutDuration = { ...mockEventDetails };
            delete eventWithoutDuration.duration;

            const mockResponse = {
                data: { id: 'event-123', htmlLink: 'link', status: 'confirmed' },
            };
            mockCalendar.events.insert.mockResolvedValue(mockResponse);

            await createCalendarEvent(eventWithoutDuration);

            expect(mockCalendar.events.insert).toHaveBeenCalledWith(
                expect.objectContaining({
                    requestBody: expect.objectContaining({
                        end: {
                            dateTime: '2024-01-15T10:30:00.000Z',
                            timeZone: 'Asia/Kolkata',
                        },
                    }),
                })
            );
        });

        it('should use default color when treatment type is not recognized', async () => {
            const eventWithUnknownTreatment = {
                ...mockEventDetails,
                treatmentType: 'Unknown Treatment',
            };

            const mockResponse = {
                data: { id: 'event-123', htmlLink: 'link', status: 'confirmed' },
            };
            mockCalendar.events.insert.mockResolvedValue(mockResponse);

            await createCalendarEvent(eventWithUnknownTreatment);

            expect(mockCalendar.events.insert).toHaveBeenCalledWith(
                expect.objectContaining({
                    requestBody: expect.objectContaining({
                        colorId: '7',
                    }),
                })
            );
        });

        it('should return null when auth is not configured', async () => {
            (googleAuth.getGoogleAuth as jest.Mock).mockReturnValue(null);

            const result = await createCalendarEvent(mockEventDetails);

            expect(result).toBeNull();
            expect(mockCalendar.events.insert).not.toHaveBeenCalled();
        });

        it('should return null when calendar ID is not configured', async () => {
            (googleAuth.getCalendarId as jest.Mock).mockReturnValue(null);

            const result = await createCalendarEvent(mockEventDetails);

            expect(result).toBeNull();
            expect(mockCalendar.events.insert).not.toHaveBeenCalled();
        });

        it('should handle API errors gracefully', async () => {
            const apiError = new Error('API Error');
            (apiError as any).response = {
                data: {
                    error: {
                        code: 400,
                        message: 'Invalid request',
                        errors: [{ reason: 'invalid' }],
                    },
                },
            };
            mockCalendar.events.insert.mockRejectedValue(apiError);

            const result = await createCalendarEvent(mockEventDetails);

            expect(result).toBeNull();
        });
    });

    describe('updateCalendarEvent', () => {
        const eventId = 'event-123';
        const updateDetails = {
            summary: 'Updated Appointment',
            startTime: '2024-01-15T11:00:00Z',
            duration: 45,
        };

        it('should update calendar event successfully', async () => {
            const mockExistingEvent = {
                data: { id: eventId, summary: 'Old Summary' },
            };
            const mockUpdateResponse = {
                data: {
                    id: eventId,
                    summary: 'Updated Appointment',
                    htmlLink: 'https://calendar.google.com/event/123',
                    status: 'confirmed',
                },
            };

            mockCalendar.events.get.mockResolvedValue(mockExistingEvent);
            mockCalendar.events.update.mockResolvedValue(mockUpdateResponse);

            const result = await updateCalendarEvent(eventId, updateDetails);

            expect(mockCalendar.events.get).toHaveBeenCalledWith({
                auth: mockAuth,
                calendarId: mockCalendarId,
                eventId: eventId,
            });

            expect(mockCalendar.events.update).toHaveBeenCalledWith({
                auth: mockAuth,
                calendarId: mockCalendarId,
                eventId: eventId,
                requestBody: expect.objectContaining({
                    summary: 'Updated Appointment',
                    start: {
                        dateTime: '2024-01-15T11:00:00Z',
                        timeZone: 'Asia/Kolkata',
                    },
                    end: {
                        dateTime: '2024-01-15T11:45:00.000Z',
                        timeZone: 'Asia/Kolkata',
                    },
                }),
            });

            expect(result).toEqual({
                id: eventId,
                htmlLink: 'https://calendar.google.com/event/123',
                status: 'confirmed',
            });
        });

        it('should return null when event ID is missing', async () => {
            const result = await updateCalendarEvent('', updateDetails);

            expect(result).toBeNull();
            expect(mockCalendar.events.get).not.toHaveBeenCalled();
        });

        it('should handle update errors gracefully', async () => {
            mockCalendar.events.get.mockRejectedValue(new Error('Event not found'));

            const result = await updateCalendarEvent(eventId, updateDetails);

            expect(result).toBeNull();
        });
    });

    describe('deleteCalendarEvent', () => {
        const eventId = 'event-123';

        it('should delete calendar event successfully', async () => {
            mockCalendar.events.delete.mockResolvedValue({});

            const result = await deleteCalendarEvent(eventId);

            expect(mockCalendar.events.delete).toHaveBeenCalledWith({
                auth: mockAuth,
                calendarId: mockCalendarId,
                eventId: eventId,
            });

            expect(result).toBe(true);
        });

        it('should return false when event ID is missing', async () => {
            const result = await deleteCalendarEvent('');

            expect(result).toBe(false);
            expect(mockCalendar.events.delete).not.toHaveBeenCalled();
        });

        it('should handle deletion errors gracefully', async () => {
            mockCalendar.events.delete.mockRejectedValue(new Error('Delete failed'));

            const result = await deleteCalendarEvent(eventId);

            expect(result).toBe(false);
        });
    });

    describe('Treatment Color Mapping', () => {
        it('should map treatment types to correct colors', async () => {
            const treatments = [
                { type: 'Dental Cleaning', expectedColor: '1' },
                { type: 'Root Canal', expectedColor: '11' },
                { type: 'Emergency', expectedColor: '11' },
                { type: 'Follow-up', expectedColor: '9' },
            ];

            const mockResponse = {
                data: { id: 'event-123', htmlLink: 'link', status: 'confirmed' },
            };
            mockCalendar.events.insert.mockResolvedValue(mockResponse);

            for (const treatment of treatments) {
                await createCalendarEvent({
                    summary: 'Test',
                    description: 'Test',
                    startTime: '2024-01-15T10:00:00Z',
                    treatmentType: treatment.type,
                });

                expect(mockCalendar.events.insert).toHaveBeenCalledWith(
                    expect.objectContaining({
                        requestBody: expect.objectContaining({
                            colorId: treatment.expectedColor,
                        }),
                    })
                );
            }
        });
    });
});