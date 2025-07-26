"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Phone, Mail, Calendar, Clock, Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export function EditableStaffManagement({ staff = [], onUpdate }: { staff?: any[], onUpdate?: (staff: any[]) => void }) {
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const toggleStatus = (id: number) => {
    onUpdate?.(staff.map(member => 
      member.id === id ? { ...member, status: member.status === 'Available' ? 'Busy' : 'Available' } : member
    ));
  };

  const handleSave = (staffData: any) => {
    if (isAddingNew) {
      const newStaff = { ...staffData, id: Math.max(...staff.map(s => s.id)) + 1 };
      onUpdate?.([...staff, newStaff]);
    } else {
      onUpdate?.(staff.map(s => s.id === staffData.id ? staffData : s));
    }
    setEditingStaff(null);
    setIsAddingNew(false);
  };

  const handleDelete = (id: number) => {
    onUpdate?.(staff.filter(s => s.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Staff Management
          <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4 mr-2" />Add Staff</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Staff Member</DialogTitle>
              </DialogHeader>
              <StaffForm onSave={handleSave} onCancel={() => setIsAddingNew(false)} />
            </DialogContent>
          </Dialog>
        </CardTitle>
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
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={member.status === 'Available' ? 'default' : 'secondary'}
                    className="cursor-pointer"
                    onClick={() => toggleStatus(member.id)}
                  >
                    {member.status}
                  </Badge>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" onClick={() => setEditingStaff(member)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Staff Member</DialogTitle>
                      </DialogHeader>
                      <StaffForm staff={editingStaff} onSave={handleSave} onCancel={() => setEditingStaff(null)} />
                    </DialogContent>
                  </Dialog>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(member.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {member.patients > 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  {member.patients} patients today
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function StaffForm({ staff, onSave, onCancel }: { staff?: any, onSave: (data: any) => void, onCancel: () => void }) {
  const [formData, setFormData] = useState(staff || {
    name: '', role: '', phone: '', email: '', schedule: 'Mon-Fri 09:00-18:00', status: 'Available', patients: 0
  });

  return (
    <div className="space-y-4">
      <Input placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
      <Input placeholder="Role" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} />
      <Input placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
      <Input placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
      <Input placeholder="Schedule" value={formData.schedule} onChange={(e) => setFormData({...formData, schedule: e.target.value})} />
      <div className="flex space-x-2">
        <Button onClick={() => onSave(formData)}>Save</Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}