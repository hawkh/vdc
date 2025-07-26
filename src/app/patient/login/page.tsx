
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/logo";

export default function PatientLoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo login credentials for patient portal
    if (phone === "9876543210" && password === "password123") {
      sessionStorage.setItem("isPatientAuthenticated", "true");
      router.push("/patient");
    } else {
      toast({
        title: "Invalid Credentials",
        description: "Please check your phone number and password.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
                <Logo className="h-12 w-auto text-primary" />
            </div>
          <CardTitle className="text-2xl">Patient Portal</CardTitle>
          <CardDescription>
            Access your treatment plans and appointment history.
          </CardDescription>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-900 mb-2">Demo Credentials:</p>
            <p className="text-sm text-blue-800">Phone: <span className="font-mono bg-blue-100 px-1 rounded">9876543210</span></p>
            <p className="text-sm text-blue-800">Password: <span className="font-mono bg-blue-100 px-1 rounded">password123</span></p>
          </div>
        </CardHeader>
        <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                id="phone"
                type="tel"
                placeholder="9876543210"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                />
            </div>
            </CardContent>
            <CardFooter>
            <Button className="w-full" type="submit">Sign In</Button>
            </CardFooter>
        </form>
      </Card>
    </div>
  );
}
