"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, User, FileText, Plus } from "lucide-react";

const treatmentPlans = [
  {
    id: "TP001",
    patientName: "Priya Sharma",
    diagnosis: "Multiple cavities, root canal needed",
    totalSessions: 6,
    completedSessions: 4,
    nextSession: "2024-01-25",
    status: "In Progress",
    treatments: [
      { name: "Root Canal Therapy", status: "Completed", date: "2024-01-10" },
      { name: "Crown Placement", status: "In Progress", date: "2024-01-25" },
      { name: "Follow-up Check", status: "Scheduled", date: "2024-02-15" }
    ]
  },
  {
    id: "TP002", 
    patientName: "Rajesh Kumar",
    diagnosis: "Orthodontic alignment required",
    totalSessions: 12,
    completedSessions: 8,
    nextSession: "2024-01-30",
    status: "In Progress",
    treatments: [
      { name: "Initial Assessment", status: "Completed", date: "2023-10-15" },
      { name: "Braces Installation", status: "Completed", date: "2023-11-01" },
      { name: "Monthly Adjustment", status: "In Progress", date: "2024-01-30" }
    ]
  }
];

export function TreatmentPlanner({ treatments = [] }: { treatments?: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Treatment Plans
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Plan
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {treatments.map((plan) => (
            <div key={plan.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    {plan.patientName}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{plan.diagnosis}</p>
                </div>
                <Badge variant={plan.status === 'In Progress' ? 'default' : 'secondary'}>
                  {plan.status}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{plan.completedSessions}/{plan.totalSessions} sessions</span>
                </div>
                <Progress value={(plan.completedSessions / plan.totalSessions) * 100} />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Treatment Steps</h4>
                  {plan.treatments.map((treatment, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span>{treatment.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {treatment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Next Session: {plan.nextSession}
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <Clock className="h-4 w-4 mr-1" />
                      Schedule
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}