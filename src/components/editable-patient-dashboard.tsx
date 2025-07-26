"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, FileText, Download, Phone, Mail, MapPin, Clock, User, Heart, Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export function EditablePatientDashboard({ patientId }: { patientId: string }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [patient, setPatient] = useState({
    name: "Priya K.", id: "P001", phone: "9876543210", email: "priya.k@email.com",
    address: "123 Main Street, Kamareddy", bloodGroup: "O+", age: 28, gender: "Female", emergencyContact: "9876543211"
  });
  const [appointments, setAppointments] = useState([
    { id: 1, date: "2024-01-24", time: "10:30 AM", treatment: "Root Canal", status: "Confirmed", doctor: "Dr. Rakesh Gupta" },
    { id: 2, date: "2024-01-10", time: "2:00 PM", treatment: "Checkup", status: "Completed", doctor: "Dr. Rakesh Gupta" }
  ]);
  const [vitals, setVitals] = useState({
    bloodPressure: "120/80", heartRate: "72 bpm", temperature: "98.6°F", weight: "65 kg", height: "5'4\"", lastUpdated: new Date().toISOString().split('T')[0]
  });
  const [medications, setMedications] = useState([
    { id: 1, name: "Amoxicillin 500mg", dosage: "3 times daily", duration: "5 days", prescribed: "2024-01-10" }
  ]);
  const [labResults, setLabResults] = useState([
    { id: 1, test: "Complete Blood Count", result: "Normal", date: "2024-01-15", status: "Completed" }
  ]);
  const [allergies, setAllergies] = useState(["Penicillin", "Latex"]);

  const updatePatient = (updates: any) => setPatient(prev => ({ ...prev, ...updates }));
  const updateVitals = (updates: any) => setVitals(prev => ({ ...prev, ...updates, lastUpdated: new Date().toISOString().split('T')[0] }));
  
  const addAppointment = (apt: any) => setAppointments(prev => [...prev, { ...apt, id: Date.now() }]);
  const updateAppointment = (id: number, updates: any) => setAppointments(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  const deleteAppointment = (id: number) => setAppointments(prev => prev.filter(a => a.id !== id));
  
  const addMedication = (med: any) => setMedications(prev => [...prev, { ...med, id: Date.now() }]);
  const updateMedication = (id: number, updates: any) => setMedications(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  const deleteMedication = (id: number) => setMedications(prev => prev.filter(m => m.id !== id));
  
  const addLabResult = (lab: any) => setLabResults(prev => [...prev, { ...lab, id: Date.now() }]);
  const updateLabResult = (id: number, updates: any) => setLabResults(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  const deleteLabResult = (id: number) => setLabResults(prev => prev.filter(l => l.id !== id));

  return (
    <div className="space-y-6">
      {/* Patient Header - Editable */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">{patient.name}</CardTitle>
                <p className="text-muted-foreground">Patient ID: {patient.id}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm">
                  <span>{patient.age} years • {patient.gender}</span>
                  <Badge variant="outline">{patient.bloodGroup}</Badge>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline"><Edit className="h-4 w-4 mr-2" />Edit Info</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Edit Patient Information</DialogTitle></DialogHeader>
                  <PatientForm patient={patient} onSave={updatePatient} />
                </DialogContent>
              </Dialog>
              <Button onClick={() => console.log('Generate PDF')}>
                <Download className="h-4 w-4 mr-2" />Download Report
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 border-b">
        {["overview", "appointments", "vitals", "medications", "reports"].map((tab) => (
          <Button key={tab} variant={activeTab === tab ? "default" : "ghost"} onClick={() => setActiveTab(tab)} className="capitalize">{tab}</Button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center"><User className="h-5 w-5 mr-2" />Personal Information</span>
                <Dialog>
                  <DialogTrigger asChild><Button size="sm" variant="outline"><Edit className="h-4 w-4" /></Button></DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Edit Personal Information</DialogTitle></DialogHeader>
                    <PatientForm patient={patient} onSave={updatePatient} />
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center"><Phone className="h-4 w-4 mr-2" /><span>{patient.phone}</span></div>
              <div className="flex items-center"><Mail className="h-4 w-4 mr-2" /><span>{patient.email}</span></div>
              <div className="flex items-start"><MapPin className="h-4 w-4 mr-2 mt-1" /><span>{patient.address}</span></div>
              <div className="flex items-center"><Phone className="h-4 w-4 mr-2" /><span>Emergency: {patient.emergencyContact}</span></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center"><Heart className="h-5 w-5 mr-2" />Health Summary</span>
                <Button size="sm" variant="outline" onClick={() => setAllergies([...allergies, "New Allergy"])}>
                  <Plus className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium">Allergies:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {allergies.map((allergy, i) => (
                    <Badge key={i} variant="destructive" className="cursor-pointer" onClick={() => setAllergies(allergies.filter((_, idx) => idx !== i))}>
                      {allergy} ×
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-medium">Current Medications:</p>
                <p className="text-sm text-muted-foreground">{medications.length} active prescriptions</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Appointments Tab */}
      {activeTab === "appointments" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Appointment History
              <Dialog>
                <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-2" />Add Appointment</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Add New Appointment</DialogTitle></DialogHeader>
                  <AppointmentForm onSave={addAppointment} />
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments.map((apt) => (
                <div key={apt.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{apt.treatment}</h3>
                      <p className="text-sm text-muted-foreground">Dr. {apt.doctor}</p>
                      <div className="flex items-center mt-2 text-sm">
                        <Calendar className="h-4 w-4 mr-1" />{apt.date}
                        <Clock className="h-4 w-4 ml-4 mr-1" />{apt.time}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={apt.status === 'Completed' ? 'default' : 'secondary'}>{apt.status}</Badge>
                      <Dialog>
                        <DialogTrigger asChild><Button size="sm" variant="outline"><Edit className="h-4 w-4" /></Button></DialogTrigger>
                        <DialogContent>
                          <DialogHeader><DialogTitle>Edit Appointment</DialogTitle></DialogHeader>
                          <AppointmentForm appointment={apt} onSave={(updates) => updateAppointment(apt.id, updates)} />
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" variant="destructive" onClick={() => deleteAppointment(apt.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vitals Tab */}
      {activeTab === "vitals" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Vital Signs
              <Dialog>
                <DialogTrigger asChild><Button size="sm"><Edit className="h-4 w-4 mr-2" />Update Vitals</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Update Vital Signs</DialogTitle></DialogHeader>
                  <VitalsForm vitals={vitals} onSave={updateVitals} />
                </DialogContent>
              </Dialog>
            </CardTitle>
            <p className="text-sm text-muted-foreground">Last updated: {vitals.lastUpdated}</p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(vitals).filter(([key]) => key !== 'lastUpdated').map(([key, value]) => (
                <div key={key} className="border rounded-lg p-4">
                  <h3 className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</h3>
                  <p className="text-2xl font-bold mt-2">{value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Medications Tab */}
      {activeTab === "medications" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Current Medications
              <Dialog>
                <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-2" />Add Medication</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Add New Medication</DialogTitle></DialogHeader>
                  <MedicationForm onSave={addMedication} />
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {medications.map((med) => (
                <div key={med.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{med.name}</h3>
                      <p className="text-sm text-muted-foreground">Dosage: {med.dosage}</p>
                      <p className="text-sm text-muted-foreground">Duration: {med.duration}</p>
                      <p className="text-sm text-muted-foreground">Prescribed: {med.prescribed}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild><Button size="sm" variant="outline"><Edit className="h-4 w-4" /></Button></DialogTrigger>
                        <DialogContent>
                          <DialogHeader><DialogTitle>Edit Medication</DialogTitle></DialogHeader>
                          <MedicationForm medication={med} onSave={(updates) => updateMedication(med.id, updates)} />
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" variant="destructive" onClick={() => deleteMedication(med.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reports Tab */}
      {activeTab === "reports" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Lab Results & Reports
              <Dialog>
                <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-2" />Add Result</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Add Lab Result</DialogTitle></DialogHeader>
                  <LabResultForm onSave={addLabResult} />
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {labResults.map((lab) => (
                <div key={lab.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{lab.test}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{lab.result}</p>
                      <p className="text-sm text-muted-foreground">Date: {lab.date}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Badge variant="default">{lab.status}</Badge>
                      <Dialog>
                        <DialogTrigger asChild><Button size="sm" variant="outline"><Edit className="h-4 w-4" /></Button></DialogTrigger>
                        <DialogContent>
                          <DialogHeader><DialogTitle>Edit Lab Result</DialogTitle></DialogHeader>
                          <LabResultForm labResult={lab} onSave={(updates) => updateLabResult(lab.id, updates)} />
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" variant="destructive" onClick={() => deleteLabResult(lab.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Form Components
function PatientForm({ patient, onSave }: { patient?: any, onSave: (data: any) => void }) {
  const [formData, setFormData] = useState(patient || { name: '', phone: '', email: '', address: '', age: '', gender: '', bloodGroup: '', emergencyContact: '' });
  return (
    <div className="space-y-4">
      <Input placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
      <Input placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
      <Input placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
      <Input placeholder="Address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
      <div className="grid grid-cols-2 gap-2">
        <Input placeholder="Age" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} />
        <Input placeholder="Blood Group" value={formData.bloodGroup} onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})} />
      </div>
      <Button onClick={() => onSave(formData)}>Save</Button>
    </div>
  );
}

function AppointmentForm({ appointment, onSave }: { appointment?: any, onSave: (data: any) => void }) {
  const [formData, setFormData] = useState(appointment || { date: '', time: '', treatment: '', status: 'Scheduled', doctor: 'Dr. Rakesh Gupta' });
  return (
    <div className="space-y-4">
      <Input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
      <Input placeholder="Time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} />
      <Input placeholder="Treatment" value={formData.treatment} onChange={(e) => setFormData({...formData, treatment: e.target.value})} />
      <Input placeholder="Doctor" value={formData.doctor} onChange={(e) => setFormData({...formData, doctor: e.target.value})} />
      <Button onClick={() => onSave(formData)}>Save</Button>
    </div>
  );
}

function VitalsForm({ vitals, onSave }: { vitals: any, onSave: (data: any) => void }) {
  const [formData, setFormData] = useState(vitals);
  return (
    <div className="space-y-4">
      <Input placeholder="Blood Pressure" value={formData.bloodPressure} onChange={(e) => setFormData({...formData, bloodPressure: e.target.value})} />
      <Input placeholder="Heart Rate" value={formData.heartRate} onChange={(e) => setFormData({...formData, heartRate: e.target.value})} />
      <Input placeholder="Temperature" value={formData.temperature} onChange={(e) => setFormData({...formData, temperature: e.target.value})} />
      <Input placeholder="Weight" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} />
      <Button onClick={() => onSave(formData)}>Save</Button>
    </div>
  );
}

function MedicationForm({ medication, onSave }: { medication?: any, onSave: (data: any) => void }) {
  const [formData, setFormData] = useState(medication || { name: '', dosage: '', duration: '', prescribed: new Date().toISOString().split('T')[0] });
  return (
    <div className="space-y-4">
      <Input placeholder="Medication Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
      <Input placeholder="Dosage" value={formData.dosage} onChange={(e) => setFormData({...formData, dosage: e.target.value})} />
      <Input placeholder="Duration" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} />
      <Input type="date" value={formData.prescribed} onChange={(e) => setFormData({...formData, prescribed: e.target.value})} />
      <Button onClick={() => onSave(formData)}>Save</Button>
    </div>
  );
}

function LabResultForm({ labResult, onSave }: { labResult?: any, onSave: (data: any) => void }) {
  const [formData, setFormData] = useState(labResult || { test: '', result: '', date: new Date().toISOString().split('T')[0], status: 'Completed' });
  return (
    <div className="space-y-4">
      <Input placeholder="Test Name" value={formData.test} onChange={(e) => setFormData({...formData, test: e.target.value})} />
      <Textarea placeholder="Result" value={formData.result} onChange={(e) => setFormData({...formData, result: e.target.value})} />
      <Input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
      <Button onClick={() => onSave(formData)}>Save</Button>
    </div>
  );
}