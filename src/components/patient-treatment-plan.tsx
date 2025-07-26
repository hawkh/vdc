
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Clock } from "lucide-react";

const treatmentPlan = {
  patientId: "P001",
  doctorName: "Dr. Bommakanti Rakesh Gupta",
  diagnosis: "Multiple cavities with pulp involvement, orthodontic malocclusion",
  overallStatus: "In Progress",
  startDate: "2024-08-01",
  estimatedCompletion: "2024-12-15",
  totalCost: "₹45,000",
  paidAmount: "₹28,000",
  treatments: [
    {
      name: "Root Canal Therapy (Tooth #14)",
      status: "Completed",
      cost: "₹8,000",
      sittings: [
        { date: "2024-08-06", notes: "Access cavity preparation, pulp extirpation", status: "Completed", cost: "₹3,000" },
        { date: "2024-08-13", notes: "Biomechanical preparation, medication", status: "Completed", cost: "₹2,500" },
        { date: "2024-08-20", notes: "Obturation and temporary restoration", status: "Completed", cost: "₹2,500" }
      ]
    },
    {
      name: "Cavity Fillings (Multiple teeth)",
      status: "Completed", 
      cost: "₹12,000",
      sittings: [
        { date: "2024-08-27", notes: "Composite fillings on teeth #12, #13, #28", status: "Completed", cost: "₹12,000" }
      ]
    },
    {
      name: "Crown Placement (Tooth #14)",
      status: "In Progress",
      cost: "₹15,000",
      sittings: [
        { date: "2024-09-03", notes: "Tooth preparation and impression", status: "Completed", cost: "₹5,000" },
        { date: "2024-09-17", notes: "Crown cementation", status: "Upcoming", cost: "₹10,000" }
      ]
    },
    {
      name: "Orthodontic Treatment",
      status: "Scheduled",
      cost: "₹25,000",
      sittings: [
        { date: "2024-10-01", notes: "Orthodontic consultation and records", status: "Upcoming", cost: "₹3,000" },
        { date: "2024-10-15", notes: "Braces placement", status: "Upcoming", cost: "₹15,000" },
        { date: "2024-11-15", notes: "First adjustment", status: "Upcoming", cost: "₹2,000" }
      ]
    }
  ],
  nextAppointment: {
    date: "2024-09-17",
    time: "10:30 AM",
    treatment: "Crown Cementation"
  },
  prescriptions: [
    { medication: "Amoxicillin 500mg", dosage: "3 times daily", duration: "5 days" },
    { medication: "Ibuprofen 400mg", dosage: "As needed for pain", duration: "3 days" }
  ]
};


export function PatientTreatmentPlan() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "In Progress":
        return <Clock className="h-5 w-5 text-yellow-500 animate-pulse" />;
      case "Upcoming":
        return <Circle className="h-5 w-5 text-muted-foreground" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
              <div>
                  <CardTitle>Treatment Plan Overview</CardTitle>
                  <CardDescription>Comprehensive treatment plan by {treatmentPlan.doctorName}</CardDescription>
              </div>
              <Badge variant={treatmentPlan.overallStatus === "Completed" ? "default" : "secondary"}>
                  {treatmentPlan.overallStatus}
              </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Diagnosis</h3>
                <p className="text-muted-foreground text-sm">{treatmentPlan.diagnosis}</p>
              </div>
              <div>
                <h3 className="font-semibold">Treatment Duration</h3>
                <p className="text-sm">{treatmentPlan.startDate} - {treatmentPlan.estimatedCompletion}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Financial Summary</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Total Cost:</span>
                    <span className="font-medium">{treatmentPlan.totalCost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Paid Amount:</span>
                    <span className="text-green-600 font-medium">{treatmentPlan.paidAmount}</span>
                  </div>
                  <div className="flex justify-between border-t pt-1">
                    <span>Balance:</span>
                    <span className="font-medium text-orange-600">₹{(45000 - 28000).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {treatmentPlan.nextAppointment && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900">Next Appointment</h3>
              <p className="text-blue-800 text-sm">
                {treatmentPlan.nextAppointment.date} at {treatmentPlan.nextAppointment.time} - {treatmentPlan.nextAppointment.treatment}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Treatment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">

          <div className="space-y-2">
            <h3 className="font-semibold">Treatment Details</h3>
             <Accordion type="single" collapsible className="w-full">
                {treatmentPlan.treatments.map((treatment, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger>
                            <div className="flex items-center gap-4">
                                {getStatusIcon(treatment.status)}
                                <span className="font-medium">{treatment.name}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                           <ul className="space-y-4 pl-6">
                                {treatment.sittings.map((sitting, sIndex) => (
                                    <li key={sIndex} className="relative pl-6">
                                        <div className="absolute left-[-4px] top-[5px] h-3 w-3 rounded-full bg-primary" />
                                        <div className="absolute left-[-1px] top-[5px] h-full w-px bg-border" />
                                        <div className="flex justify-between items-start">
                                          <div>
                                            <p className="font-semibold">{sitting.date}</p>
                                            <p className="text-sm text-muted-foreground">{sitting.notes}</p>
                                          </div>
                                          <div className="text-right">
                                            <Badge variant={sitting.status === "Completed" ? "outline" : "secondary"} className="mb-1">
                                                {sitting.status}
                                            </Badge>
                                            <p className="text-sm font-medium">{sitting.cost}</p>
                                          </div>
                                        </div>
                                    </li>
                                ))}
                           </ul>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
          </div>
        </CardContent>
      </Card>
      
      {treatmentPlan.prescriptions && treatmentPlan.prescriptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Current Prescriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {treatmentPlan.prescriptions.map((prescription, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <h4 className="font-medium">{prescription.medication}</h4>
                  <p className="text-sm text-muted-foreground">
                    {prescription.dosage} for {prescription.duration}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
