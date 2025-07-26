"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Package, Plus, Minus } from "lucide-react";

const inventory = [
  { id: 1, item: "Dental Composite", quantity: 15, minStock: 10, unit: "tubes", cost: "₹450", status: "Good" },
  { id: 2, item: "Anesthetic Cartridges", quantity: 8, minStock: 20, unit: "boxes", cost: "₹280", status: "Low" },
  { id: 3, item: "Surgical Gloves", quantity: 45, minStock: 30, unit: "boxes", cost: "₹120", status: "Good" },
  { id: 4, item: "Dental Burs", quantity: 5, minStock: 15, unit: "sets", cost: "₹850", status: "Critical" },
  { id: 5, item: "Impression Material", quantity: 12, minStock: 8, unit: "packs", cost: "₹320", status: "Good" }
];

export function InventoryManagement({ inventory = [] }: { inventory?: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Inventory Management
          <Button size="sm"><Plus className="h-4 w-4 mr-2" />Add Item</Button>
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
                    item.status === 'Critical' ? 'destructive' : 
                    item.status === 'Low' ? 'secondary' : 'default'
                  }>
                    {item.status === 'Critical' && <AlertTriangle className="h-3 w-3 mr-1" />}
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>{item.cost}</TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="outline"><Minus className="h-3 w-3" /></Button>
                    <Button size="sm" variant="outline"><Plus className="h-3 w-3" /></Button>
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