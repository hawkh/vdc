"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Package, Plus, Minus, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

export function EditableInventory({ inventory = [], onUpdate }: { inventory?: any[], onUpdate?: (inventory: any[]) => void }) {
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const updateQuantity = (id: number, change: number) => {
    onUpdate?.(inventory.map(item => 
      item.id === id ? { ...item, quantity: Math.max(0, item.quantity + change) } : item
    ));
  };

  const handleSave = (itemData: any) => {
    if (isAddingNew) {
      const newItem = { ...itemData, id: Math.max(...inventory.map(i => i.id)) + 1 };
      onUpdate?.([...inventory, newItem]);
    } else {
      onUpdate?.(inventory.map(i => i.id === itemData.id ? itemData : i));
    }
    setEditingItem(null);
    setIsAddingNew(false);
  };

  const handleDelete = (id: number) => {
    onUpdate?.(inventory.filter(i => i.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Inventory Management
          <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4 mr-2" />Add Item</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Item</DialogTitle>
              </DialogHeader>
              <InventoryForm onSave={handleSave} onCancel={() => setIsAddingNew(false)} />
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Cost/Unit</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center">
                    <Package className="h-4 w-4 mr-2" />
                    {item.item}
                  </div>
                </TableCell>
                <TableCell>{item.quantity} {item.unit}</TableCell>
                <TableCell>
                  <Badge variant={
                    item.quantity <= item.minStock * 0.5 ? 'destructive' : 
                    item.quantity <= item.minStock ? 'secondary' : 'default'
                  }>
                    {item.quantity <= item.minStock * 0.5 && <AlertTriangle className="h-3 w-3 mr-1" />}
                    {item.quantity <= item.minStock * 0.5 ? 'Critical' : item.quantity <= item.minStock ? 'Low' : 'Good'}
                  </Badge>
                </TableCell>
                <TableCell>{item.cost}</TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, -1)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, 1)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" onClick={() => setEditingItem(item)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Item</DialogTitle>
                        </DialogHeader>
                        <InventoryForm item={editingItem} onSave={handleSave} onCancel={() => setEditingItem(null)} />
                      </DialogContent>
                    </Dialog>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-3 w-3" />
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

function InventoryForm({ item, onSave, onCancel }: { item?: any, onSave: (data: any) => void, onCancel: () => void }) {
  const [formData, setFormData] = useState(item || {
    item: '', quantity: 0, minStock: 10, unit: 'pieces', cost: '₹0'
  });

  return (
    <div className="space-y-4">
      <Input placeholder="Item Name" value={formData.item} onChange={(e) => setFormData({...formData, item: e.target.value})} />
      <Input type="number" placeholder="Quantity" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})} />
      <Input type="number" placeholder="Min Stock" value={formData.minStock} onChange={(e) => setFormData({...formData, minStock: parseInt(e.target.value)})} />
      <Input placeholder="Unit" value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} />
      <Input placeholder="Cost" value={formData.cost} onChange={(e) => setFormData({...formData, cost: e.target.value})} />
      <div className="flex space-x-2">
        <Button onClick={() => onSave(formData)}>Save</Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}