"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, FileText, Download, Phone, Mail, MapPin, Clock, User, Heart, Edit, Plus } from "lucide-react";
import { useState } from "react";
import { DiagnosticReports } from "@/components/diagnostic-reports";
import { usePatientData } from "@/hooks/use-patient-data";
import { jsPDF } from 'jspdf';

export function PatientDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { patient, appointments, vitals, allergies, medications, labResults, treatmentPlan, diagnostics, loading, updatePatientInfo, addAppointment, updateVitals } = usePatientData();
  const [editingVitals, setEditingVitals] = useState(false);
  
  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading patient data...</div>;
  }

  const generatePDFReport = () => {
    const reportContent = `
PATIENT MEDICAL REPORT
======================

Patient Information:
Name: ${patient.name}
ID: ${patient.id}
Age: ${patient.age} | Gender: ${patient.gender}
Blood Group: ${patient.bloodGroup}
Phone: ${patient.phone}
Email: ${patient.email}
Address: ${patient.address}
Emergency Contact: ${patient.emergencyContact}

Current Vitals (${vitals.lastUpdated}):
Blood Pressure: ${vitals.bloodPressure}
Heart Rate: ${vitals.heartRate}
Temperature: ${vitals.temperature}
Weight: ${vitals.weight}
Height: ${vitals.height}

Allergies: ${allergies.join(", ")}

Current Medications:
${medications.map(med => `- ${med.name}: ${med.dosage} for ${med.duration}`).join("\n")}

Recent Lab Results:
${labResults.map(lab => `- ${lab.test}: ${lab.result} (${lab.date})`).join("\n")}

Recent Appointments:
${appointments.map(apt => `- ${apt.date} ${apt.time}: ${apt.treatment} - ${apt.status}`).join("\n")}

${treatmentPlan ? `Treatment Plan:\nDiagnosis: ${treatmentPlan.diagnosis}\nStatus: ${treatmentPlan.overallStatus}\nTotal Cost: ${treatmentPlan.totalCost}\nPaid: ${treatmentPlan.paidAmount}\n` : ''}

Report Generated: ${new Date().toLocaleString()}
Doctor: Dr. Bommakanti Rakesh Gupta
Vasavi Dental Care, Kamareddy
    `;

    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(16);
      doc.text('PATIENT MEDICAL REPORT', 20, 20);
      
      // Add content with proper formatting
      doc.setFontSize(10);
      const lines = doc.splitTextToSize(reportContent, 170);
      doc.text(lines, 20, 40);
      
      doc.save(`${patient.name}_Medical_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('PDF generation failed:', error);
      // Fallback to text download
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${patient.name}_Medical_Report_${new Date().toISOString().split('T')[0]}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };
  
  const handleVitalsUpdate = (newVitals: any) => {
    updateVitals(newVitals);
    setEditingVitals(false);
  };

  return (
    <div className="space-y-6">
      {/* Patient Header */}
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
            <Button onClick={generatePDFReport}>
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 border-b">
        {["overview", "appointments", "vitals", "medications", "reports", "diagnostics"].map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "ghost"}
            onClick={() => setActiveTab(tab)}
            className="capitalize"
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>{patient.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>{patient.email}</span>
              </div>
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-1" />
                <span>{patient.address}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>Emergency: {patient.emergencyContact}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="h-5 w-5 mr-2" />
                Health Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium">Allergies:</p>
                <div className="flex space-x-2 mt-1">
                  {allergies.map((allergy) => (
                    <Badge key={allergy} variant="destructive">{allergy}</Badge>
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

      {activeTab === "appointments" && (
        <Card>
          <CardHeader>
            <CardTitle>Appointment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments.map((apt, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{apt.treatment}</h3>
                      <p className="text-sm text-muted-foreground">Dr. {apt.doctor}</p>
                      <div className="flex items-center mt-2 text-sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        {apt.date}
                        <Clock className="h-4 w-4 ml-4 mr-1" />
                        {apt.time}
                      </div>
                    </div>
                    <Badge variant={apt.status === 'Completed' ? 'default' : apt.status === 'Confirmed' ? 'secondary' : 'outline'}>
                      {apt.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "vitals" && (
        <Card>
          <CardHeader>
            <CardTitle>Vital Signs</CardTitle>
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

      {activeTab === "medications" && (
        <Card>
          <CardHeader>
            <CardTitle>Current Medications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {medications.map((med, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-semibold">{med.name}</h3>
                  <p className="text-sm text-muted-foreground">Dosage: {med.dosage}</p>
                  <p className="text-sm text-muted-foreground">Duration: {med.duration}</p>
                  <p className="text-sm text-muted-foreground">Prescribed: {med.prescribed}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "reports" && (
        <Card>
          <CardHeader>
            <CardTitle>Lab Results & Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {labResults.map((lab, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{lab.test}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{lab.result}</p>
                      <p className="text-sm text-muted-foreground">Date: {lab.date}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Badge variant="default">{lab.status}</Badge>
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "diagnostics" && <DiagnosticReports diagnostics={diagnostics} />}
    </div>
  );
}