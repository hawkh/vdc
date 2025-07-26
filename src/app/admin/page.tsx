
"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, LogOut, Check, XIcon, Loader2, MessageSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO, isToday, isFuture } from "date-fns";
import type { AppointmentFromSheet } from "@/services/google-sheets";
import { getAppointments } from "../actions/get-appointments";
import { useToast } from "@/hooks/use-toast";
import { updateAppointmentStatus } from "../actions/update-appointment-status";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { AnalyticsChart } from "@/components/analytics-chart";
import { EditablePatientRecords } from "@/components/editable-patient-records";
import { EditableTreatmentPlanner } from "@/components/editable-treatment-planner";
import { EditableInventory } from "@/components/editable-inventory";
import { EditableStaffManagement } from "@/components/editable-staff-management";
import { FinancialDashboard } from "@/components/financial-dashboard";
import { AppointmentCalendar } from "@/components/appointment-calendar";
import { LiveAnalyticsSummary } from "@/components/live-analytics-summary";
import { CalendarIntegration } from "@/components/calendar-integration";
import { CalendarSyncStatus } from "@/components/calendar-sync-status";
import { AIAssistant } from "@/components/ai-assistant";


export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<AppointmentFromSheet[]>([]);
  const dashboardData = useDashboardData(appointments);
  const [patients, setPatients] = useState(dashboardData.patients);
  const [inventory, setInventory] = useState(dashboardData.inventory);
  const [treatments, setTreatments] = useState(dashboardData.treatments);
  const [staff, setStaff] = useState(dashboardData.staff);
  
  useEffect(() => {
    setPatients(dashboardData.patients);
    setInventory(dashboardData.inventory);
    setTreatments(dashboardData.treatments);
    setStaff(dashboardData.staff);
  }, [dashboardData]);
  
  // Dynamic analytics based on editable data
  const analytics = {
    totalPatients: patients.length,
    activePatients: patients.filter(p => p.status === 'Active').length,
    totalTreatments: treatments.length,
    inProgressTreatments: treatments.filter(t => t.status === 'In Progress').length,
    completedTreatments: treatments.filter(t => t.completedSessions === t.totalSessions).length,
    totalRevenue: treatments.reduce((sum, t) => sum + (t.completedSessions * 850), 0),
    pendingRevenue: treatments.reduce((sum, t) => sum + ((t.totalSessions - t.completedSessions) * 850), 0),
    lowStockItems: inventory.filter(i => i.quantity <= i.minStock).length,
    criticalStockItems: inventory.filter(i => i.quantity <= i.minStock * 0.5).length,
    availableStaff: staff.filter(s => s.status === 'Available').length,
    treatmentTypes: treatments.reduce((acc, t) => {
      const type = t.treatments?.[0]?.name || 'General';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {})
  };
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    // Using NextAuth.js for authentication
    if (status === "loading") return;
    
    if (status === "unauthenticated") {
      router.push("/admin/login");
      return;
    }
    
    fetchAppointments();
  }, [router, status]);

  const fetchAppointments = async () => {
    try {
        setLoading(true);
        const data = await getAppointments();
        setAppointments(data);
    } catch (error) {
        console.error("Failed to fetch appointments:", error);
        toast({
          title: "Error",
          description: "Failed to fetch appointments.",
          variant: "destructive"
        });
    } finally {
        setLoading(false);
    }
  };


  const handleLogout = () => {
    signOut({ callbackUrl: "/admin/login" });
  };

  const handleUpdateStatus = (rowIndex: number, newStatus: 'Confirmed' | 'Cancelled') => {
    setUpdatingId(rowIndex);
    startTransition(async () => {
        const result = await updateAppointmentStatus(rowIndex, newStatus);
        if (result.success) {
            toast({
                title: "Status Updated",
                description: `Appointment marked as ${newStatus}.`
            });
            // Re-fetch appointments to show the latest status
            await fetchAppointments();
        } else {
            toast({
                title: "Update Failed",
                description: result.error,
                variant: "destructive"
            });
        }
        setUpdatingId(null);
    });
  };

  const handleSendReminder = (apt: AppointmentFromSheet) => {
    const message = `Hi ${apt.name}, this is a reminder for your dental appointment at Vasavi Dental Care on ${format(parseISO(apt.date), 'PPP')} at ${apt.time}. See you soon!`;
    const whatsappUrl = `https://web.whatsapp.com/send?phone=91${apt.phone}&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast({
      title: "WhatsApp Ready",
      description: "Reminder message copied to WhatsApp tab."
    });
  };

  const getTodayAppointments = () => {
    return appointments
      .filter(a => a.date && isToday(parseISO(a.date)))
      .sort((a, b) => (a.time || "").localeCompare(b.time || ""));
  };

  const getUpcomingAppointments = () => {
    return appointments
      .filter(a => a.date && isFuture(parseISO(a.date)) && !isToday(parseISO(a.date)))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  if (loading && appointments.length === 0) {
    return (
       <div className="flex min-h-screen w-full flex-col bg-muted/40 p-4">
         <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="outline" size="sm" className="ml-auto">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
          </Button>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
             </div>
            <div className="grid gap-6 md:grid-cols-2">
                <Skeleton className="h-96" />
                <Skeleton className="h-96" />
            </div>
        </main>
      </div>
    )
  }
  
  const todayAppointments = getTodayAppointments();
  const upcomingAppointments = getUpcomingAppointments();
  
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button onClick={handleLogout} variant="outline" size="sm" className="ml-auto">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
        </Button>
      </header>
      <main className="flex-1 p-4 sm:px-6 sm:py-4 md:gap-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
           <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalPatients}</div>
                <p className="text-xs text-muted-foreground">{analytics.activePatients} active patients</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Treatment Plans</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalTreatments}</div>
                <p className="text-xs text-muted-foreground">{analytics.inProgressTreatments} in progress, {analytics.completedTreatments} completed</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue Earned</CardTitle>
                <div className="h-4 w-4 text-green-600">₹</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{analytics.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">₹{analytics.pendingRevenue.toLocaleString()} pending</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inventory Status</CardTitle>
                <div className="h-4 w-4 text-orange-600">!</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inventory.length}</div>
                <p className="text-xs text-muted-foreground">{analytics.criticalStockItems} critical, {analytics.lowStockItems} low stock</p>
              </CardContent>
            </Card>
        </div>

        <AnalyticsChart data={{
          monthlyData: dashboardData.analytics.monthlyData,
          treatmentData: Object.entries(analytics.treatmentTypes).map(([name, value], i) => ({
            name, value: value as number, color: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'][i % 5]
          }))
        }} />
        
        <div className="mt-8">
          <AppointmentCalendar appointments={dashboardData.calendar} />
        </div>
        
        <div className="mt-8">
          <EditableTreatmentPlanner treatments={treatments} onUpdate={setTreatments} />
        </div>
        
        <div className="mt-8">
          <FinancialDashboard financial={{
            ...dashboardData.financial,
            monthlyRevenue: analytics.totalRevenue,
            pendingPayments: analytics.pendingRevenue,
            profit: analytics.totalRevenue - (analytics.totalRevenue * 0.4),
            paymentMethods: [
              { method: 'Cash', amount: Math.floor(analytics.totalRevenue * 0.44), percentage: 44 },
              { method: 'UPI', amount: Math.floor(analytics.totalRevenue * 0.33), percentage: 33 },
              { method: 'Card', amount: Math.floor(analytics.totalRevenue * 0.23), percentage: 23 }
            ]
          }} />
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <EditableStaffManagement staff={staff} onUpdate={setStaff} />
          <EditableInventory inventory={inventory} onUpdate={setInventory} />
        </div>
        
        <LiveAnalyticsSummary analytics={analytics} />
        
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <CalendarIntegration />
          <CalendarSyncStatus />
        </div>
        
        <div className="mt-8">
          <AIAssistant />
        </div>
        
        <div className="mt-8">
          <EditablePatientRecords patients={patients} onUpdate={setPatients} />
        </div>
      </main>
    </div>
  );
}

    