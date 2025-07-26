import { useState, useEffect } from 'react';

export function useDashboardData(appointments: any[] = []) {
  const [data, setData] = useState({
    metrics: { totalPatients: 0, todayAppointments: 0, monthlyRevenue: 0, successRate: 94.2 },
    financial: { dailyRevenue: 0, monthlyRevenue: 0, pendingPayments: 0, expenses: 0, profit: 0, paymentMethods: [] },
    analytics: { monthlyData: [], treatmentData: [] },
    patients: [],
    treatments: [],
    staff: [],
    inventory: [],
    calendar: [],
    loading: false
  });

  useEffect(() => {
    const today = new Date().toDateString();
    const todayAppointments = appointments.filter(a => a.date && new Date(a.date).toDateString() === today);
    const baseRevenue = appointments.length * 850;
    const dailyRevenue = Math.floor(Math.random() * 20000) + 8000;
    const expenses = Math.floor(baseRevenue * 0.4);
    const profit = baseRevenue - expenses;
    
    const treatmentCounts = appointments.reduce((acc, apt) => {
      acc[apt.treatment] = (acc[apt.treatment] || 0) + 1;
      return acc;
    }, {});
    
    const treatmentData = Object.entries(treatmentCounts).map(([name, value], i) => ({
      name, value: value as number, color: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'][i % 5]
    }));
    
    const uniquePatients = [...new Set(appointments.map(a => a.name))].map((name, i) => ({
      id: `P${String(i + 1).padStart(3, '0')}`,
      name,
      phone: appointments.find(a => a.name === name)?.phone || '',
      email: `${name.toLowerCase().replace(' ', '.')}@email.com`,
      lastVisit: appointments.filter(a => a.name === name).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.date || '',
      treatment: appointments.find(a => a.name === name)?.treatment || '',
      status: Math.random() > 0.3 ? 'Active' : 'Completed',
      totalVisits: appointments.filter(a => a.name === name).length
    }));
    
    setData({
      metrics: {
        totalPatients: uniquePatients.length,
        todayAppointments: todayAppointments.length,
        monthlyRevenue: baseRevenue,
        successRate: Math.floor(Math.random() * 5) + 92
      },
      financial: {
        dailyRevenue,
        monthlyRevenue: baseRevenue,
        pendingPayments: Math.floor(Math.random() * 50000) + 15000,
        expenses,
        profit,
        paymentMethods: [
          { method: 'Cash', amount: Math.floor(baseRevenue * 0.44), percentage: 44 },
          { method: 'UPI', amount: Math.floor(baseRevenue * 0.33), percentage: 33 },
          { method: 'Card', amount: Math.floor(baseRevenue * 0.23), percentage: 23 }
        ]
      },
      analytics: {
        monthlyData: Array.from({length: 6}, (_, i) => ({
          month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
          appointments: Math.floor(Math.random() * 30) + 40,
          revenue: Math.floor(Math.random() * 20000) + 35000
        })),
        treatmentData
      },
      patients: uniquePatients,
      treatments: appointments.map((apt, i) => ({
        id: `TP${String(i + 1).padStart(3, '0')}`,
        patientName: apt.name,
        diagnosis: `Treatment for ${apt.treatment}`,
        totalSessions: Math.floor(Math.random() * 8) + 3,
        completedSessions: Math.floor(Math.random() * 5) + 1,
        nextSession: apt.date,
        status: apt.status === 'Confirmed' ? 'In Progress' : 'Scheduled',
        treatments: [{ name: apt.treatment, status: apt.status === 'Confirmed' ? 'In Progress' : 'Scheduled', date: apt.date }]
      })),
      staff: [
        { id: 1, name: 'Dr. Rakesh Gupta', role: 'Chief Dentist', phone: '9676118880', email: 'dr.rakesh@vasavi.com', schedule: 'Mon-Sat 10:00-19:00', status: 'Available', patients: todayAppointments.length },
        { id: 2, name: 'Nurse Priya', role: 'Dental Assistant', phone: '9876543210', email: 'priya@vasavi.com', schedule: 'Mon-Fri 09:00-18:00', status: Math.random() > 0.5 ? 'Available' : 'Busy', patients: Math.floor(todayAppointments.length * 0.6) },
        { id: 3, name: 'Receptionist Raj', role: 'Front Desk', phone: '9876543211', email: 'raj@vasavi.com', schedule: 'Mon-Sat 09:00-20:00', status: 'Available', patients: 0 }
      ],
      inventory: [
        { id: 1, item: 'Dental Composite', quantity: Math.floor(Math.random() * 30) + 10, minStock: 10, unit: 'tubes', cost: '₹450', status: 'Good' },
        { id: 2, item: 'Anesthetic Cartridges', quantity: Math.floor(Math.random() * 15) + 5, minStock: 20, unit: 'boxes', cost: '₹280', status: 'Low' },
        { id: 3, item: 'Surgical Gloves', quantity: Math.floor(Math.random() * 40) + 30, minStock: 30, unit: 'boxes', cost: '₹120', status: 'Good' },
        { id: 4, item: 'Dental Burs', quantity: Math.floor(Math.random() * 10) + 3, minStock: 15, unit: 'sets', cost: '₹850', status: Math.random() > 0.7 ? 'Critical' : 'Low' },
        { id: 5, item: 'Impression Material', quantity: Math.floor(Math.random() * 20) + 8, minStock: 8, unit: 'packs', cost: '₹320', status: 'Good' }
      ],
      calendar: todayAppointments.map(apt => ({
        time: apt.time,
        patient: apt.name,
        treatment: apt.treatment,
        phone: apt.phone,
        status: apt.status === 'Confirmed' ? 'Confirmed' : 'Pending'
      })),
      loading: false
    });
  }, [appointments]);

  return data;
}