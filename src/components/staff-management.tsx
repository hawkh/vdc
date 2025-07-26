"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Phone, Mail, Calendar, Clock } from "lucide-react";

const staff = [
  {
    id: 1,
    name: "Dr. Rakesh Gupta",
    role: "Chief Dentist",
    phone: "9676118880",
    email: "dr.rakesh@vasavi.com",
    schedule: "Mon-Sat 10:00-19:00",
    status: "Available",
    patients: 12
  },
  {
    id: 2,
    name: "Nurse Priya",
    role: "Dental Assistant",
    phone: "9876543210",
    email: "priya@vasavi.com",
    schedule: "Mon-Fri 09:00-18:00",
    status: "Busy",
    patients: 8
  },
  {
    id: 3,
    name: "Receptionist Raj",
    role: "Front Desk",
    phone: "9876543211",
    email: "raj@vasavi.com",
    schedule: "Mon-Sat 09:00-20:00",
    status: "Available",
    patients: 0
  }
];

export function StaffManagement({ staff = [] }: { staff?: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {staff.map((member) => (
            <div key={member.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm">
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {member.phone}
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {member.email}
                      </div>
                    </div>
                    <div className="flex items-center mt-1 text-sm">
                      <Clock className="h-3 w-3 mr-1" />
                      {member.schedule}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={member.status === 'Available' ? 'default' : 'secondary'}>
                    {member.status}
                  </Badge>
                  {member.patients > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {member.patients} patients today
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}