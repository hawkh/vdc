"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Clock, User, FileText, Plus, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

export function EditableTreatmentPlanner({ treatments = [], onUpdate }: { treatments?: any[], onUpdate?: (treatments: any[]) => void }) {
  const [editingTreatment, setEditingTreatment] = useState<any>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const updateProgress = (id: string, completed: number) => {
    onUpdate?.(treatments.map(t => 
      t.id === id ? { ...t, completedSessions: Math.min(completed, t.totalSessions) } : t
    ));
  };

  const handleSave = (treatmentData: any) => {
    if (isAddingNew) {
      const newTreatment = { ...treatmentData, id: `TP${String(treatments.length + 1).padStart(3, '0')}` };
      onUpdate?.([...treatments, newTreatment]);
    } else {
      onUpdate?.(treatments.map(t => t.id === treatmentData.id ? treatmentData : t));
    }
    setEditingTreatment(null);
    setIsAddingNew(false);
  };

  const handleDelete = (id: string) => {
    onUpdate?.(treatments.filter(t => t.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Treatment Plans
          <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Treatment Plan</DialogTitle>
              </DialogHeader>
              <TreatmentForm onSave={handleSave} onCancel={() => setIsAddingNew(false)} />
            </DialogContent>
          </Dialog>
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
                <div className="flex items-center space-x-2">
                  <Badge variant={plan.status === 'In Progress' ? 'default' : 'secondary'}>
                    {plan.status}
                  </Badge>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" onClick={() => setEditingTreatment(plan)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Treatment Plan</DialogTitle>
                      </DialogHeader>
                      <TreatmentForm treatment={editingTreatment} onSave={handleSave} onCancel={() => setEditingTreatment(null)} />
                    </DialogContent>
                  </Dialog>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(plan.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{plan.completedSessions}/{plan.totalSessions} sessions</span>
                </div>
                <Progress value={(plan.completedSessions / plan.totalSessions) * 100} />
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => updateProgress(plan.id, plan.completedSessions + 1)}>
                    Mark Session Complete
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => updateProgress(plan.id, Math.max(0, plan.completedSessions - 1))}>
                    Undo Session
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2" />
                Next Session: {plan.nextSession}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function TreatmentForm({ treatment, onSave, onCancel }: { treatment?: any, onSave: (data: any) => void, onCancel: () => void }) {
  const [formData, setFormData] = useState(treatment || {
    patientName: '', diagnosis: '', totalSessions: 1, completedSessions: 0, 
    nextSession: new Date().toISOString().split('T')[0], status: 'Scheduled',
    treatments: [{ name: '', status: 'Scheduled', date: new Date().toISOString().split('T')[0] }]
  });

  return (
    <div className="space-y-4">
      <Input placeholder="Patient Name" value={formData.patientName} onChange={(e) => setFormData({...formData, patientName: e.target.value})} />
      <Textarea placeholder="Diagnosis" value={formData.diagnosis} onChange={(e) => setFormData({...formData, diagnosis: e.target.value})} />
      <Input type="number" placeholder="Total Sessions" value={formData.totalSessions} onChange={(e) => setFormData({...formData, totalSessions: parseInt(e.target.value)})} />
      <Input type="date" placeholder="Next Session" value={formData.nextSession} onChange={(e) => setFormData({...formData, nextSession: e.target.value})} />
      <div className="flex space-x-2">
        <Button onClick={() => onSave(formData)}>Save</Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}