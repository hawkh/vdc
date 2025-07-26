"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, FileText, Calendar, Phone, Mail } from "lucide-react";
import { useState } from "react";

const patientRecords = [
  {
    id: "P001",
    name: "Priya Sharma",
    phone: "9876543210",
    email: "priya@email.com",
    lastVisit: "2024-01-15",
    nextAppointment: "2024-01-25",
    treatment: "Root Canal",
    status: "Active",
    totalVisits: 8
  },
  {
    id: "P002", 
    name: "Rajesh Kumar",
    phone: "9876543211",
    email: "rajesh@email.com",
    lastVisit: "2024-01-10",
    nextAppointment: "2024-01-30",
    treatment: "Orthodontics",
    status: "Active",
    totalVisits: 12
  },
  {
    id: "P003",
    name: "Anita Reddy",
    phone: "9876543212", 
    email: "anita@email.com",
    lastVisit: "2024-01-08",
    nextAppointment: null,
    treatment: "Teeth Whitening",
    status: "Completed",
    totalVisits: 3
  }
];

export function PatientRecords() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredPatients = patientRecords.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Patient Records
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Last Visit</TableHead>
              <TableHead>Treatment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="font-medium">{patient.id}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{patient.name}</div>
                    <div className="text-sm text-muted-foreground">{patient.totalVisits} visits</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <Phone className="h-3 w-3 mr-1" />
                      {patient.phone}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Mail className="h-3 w-3 mr-1" />
                      {patient.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{patient.lastVisit}</TableCell>
                <TableCell>{patient.treatment}</TableCell>
                <TableCell>
                  <Badge variant={patient.status === 'Active' ? 'default' : 'secondary'}>
                    {patient.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-1" />
                      Records
                    </Button>
                    <Button size="sm" variant="outline">
                      <Calendar className="h-4 w-4 mr-1" />
                      Schedule
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}