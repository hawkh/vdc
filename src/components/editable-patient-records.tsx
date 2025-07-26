"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, FileText, Calendar, Phone, Mail, Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { EditablePatientDashboard } from "@/components/editable-patient-dashboard";

export function EditablePatientRecords({ patients = [], onUpdate }: { patients?: any[], onUpdate?: (patients: any[]) => void }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingPatient, setEditingPatient] = useState<any>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  const handleSave = (patientData: any) => {
    if (isAddingNew) {
      const newPatient = { ...patientData, id: `P${String(patients.length + 1).padStart(3, '0')}` };
      onUpdate?.([...patients, newPatient]);
    } else {
      onUpdate?.(patients.map(p => p.id === patientData.id ? patientData : p));
    }
    setEditingPatient(null);
    setIsAddingNew(false);
  };

  const handleDelete = (id: string) => {
    onUpdate?.(patients.filter(p => p.id !== id));
  };

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
            <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="h-4 w-4 mr-2" />Add Patient</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Patient</DialogTitle>
                </DialogHeader>
                <PatientForm onSave={handleSave} onCancel={() => setIsAddingNew(false)} />
              </DialogContent>
            </Dialog>
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
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" onClick={() => setEditingPatient(patient)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Patient</DialogTitle>
                        </DialogHeader>
                        <PatientForm patient={editingPatient} onSave={handleSave} onCancel={() => setEditingPatient(null)} />
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="default">
                          <FileText className="h-4 w-4 mr-1" />
                          Manage
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Patient Management - {patient.name}</DialogTitle>
                        </DialogHeader>
                        <EditablePatientDashboard patientId={patient.id} />
                      </DialogContent>
                    </Dialog>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(patient.id)}>
                      <Trash2 className="h-4 w-4" />
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

function PatientForm({ patient, onSave, onCancel }: { patient?: any, onSave: (data: any) => void, onCancel: () => void }) {
  const [formData, setFormData] = useState(patient || {
    name: '', phone: '', email: '', treatment: '', status: 'Active', totalVisits: 1, lastVisit: new Date().toISOString().split('T')[0]
  });

  return (
    <div className="space-y-4">
      <Input placeholder="Patient Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
      <Input placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
      <Input placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
      <Input placeholder="Treatment" value={formData.treatment} onChange={(e) => setFormData({...formData, treatment: e.target.value})} />
      <div className="flex space-x-2">
        <Button onClick={() => onSave(formData)}>Save</Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}