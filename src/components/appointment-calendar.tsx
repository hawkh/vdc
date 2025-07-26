"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Phone } from "lucide-react";

const calendarData = {
  today: "2024-01-24",
  appointments: [
    { time: "09:00", patient: "Priya Sharma", treatment: "Root Canal", phone: "9876543210", status: "Confirmed" },
    { time: "10:30", patient: "Rajesh Kumar", treatment: "Checkup", phone: "9876543211", status: "Pending" },
    { time: "11:00", patient: "Anita Reddy", treatment: "Cleaning", phone: "9876543212", status: "Confirmed" },
    { time: "14:00", patient: "Suresh Patel", treatment: "Filling", phone: "9876543213", status: "Confirmed" },
    { time: "15:30", patient: "Meera Singh", treatment: "Consultation", phone: "9876543214", status: "Pending" },
    { time: "16:00", patient: "Arjun Rao", treatment: "Crown Fitting", phone: "9876543215", status: "Confirmed" },
    { time: "17:00", patient: "Kavya Nair", treatment: "Orthodontic", phone: "9876543216", status: "Confirmed" }
  ]
};

export function AppointmentCalendar({ appointments = [] }: { appointments?: any[] }) {
  const calendarData = { today: new Date().toISOString().split('T')[0], appointments };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Today's Schedule - {calendarData.today}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {calendarData.appointments.map((apt, index) => (
            <div key={index} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center text-sm font-medium">
                    <Clock className="h-4 w-4 mr-1" />
                    {apt.time}
                  </div>
                  <div>
                    <div className="flex items-center font-medium">
                      <User className="h-4 w-4 mr-1" />
                      {apt.patient}
                    </div>
                    <div className="text-sm text-muted-foreground">{apt.treatment}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Phone className="h-3 w-3 mr-1" />
                      {apt.phone}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={apt.status === 'Confirmed' ? 'default' : 'secondary'}>
                    {apt.status}
                  </Badge>
                  <Button size="sm" variant="outline">Call</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}