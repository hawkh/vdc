
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut, User } from "lucide-react";
import { PatientDashboard } from "@/components/patient-dashboard";
import Logo from "@/components/logo";

export default function PatientPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [patientName, setPatientName] = useState("Priya K.");

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("isPatientAuthenticated");
    if (!isAuthenticated) {
      router.push("/patient/login");
    } else {
      // In a real app, you would fetch patient data here
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem("isPatientAuthenticated");
    router.push("/");
  };

  if (loading) {
    return (
       <div className="flex min-h-screen w-full items-center justify-center bg-muted/40">
        <div className="flex flex-col gap-4 w-full max-w-5xl p-4">
            <Skeleton className="h-10 w-1/2" />
            <div className="grid gap-4 md:grid-cols-2">
                <Skeleton className="h-64" />
                <Skeleton className="h-64" />
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
            <div className="flex items-center gap-2">
                <Logo className="h-8 w-auto text-primary" />
                <h1 className="text-xl font-bold">Patient Dashboard</h1>
            </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium">
                <User className="h-4 w-4" />
                <span>Welcome, {patientName}</span>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">
           <PatientDashboard />
        </main>
    </div>
  );
}
