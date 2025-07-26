import { useState, useEffect } from 'react';

export function usePatientData() {
  const [data, setData] = useState({
    patient: {
      name: "Priya K.",
      id: "P001",
      phone: "9876543210",
      email: "priya.k@email.com",
      address: "123 Main Street, Kamareddy, Telangana",
      bloodGroup: "O+",
      age: 28,
      gender: "Female",
      emergencyContact: "9876543211"
    },
    appointments: [],
    vitals: {
      bloodPressure: "120/80",
      heartRate: "72 bpm",
      temperature: "98.6°F",
      weight: "65 kg",
      height: "5'4\"",
      lastUpdated: new Date().toISOString().split('T')[0]
    },
    allergies: ["Penicillin", "Latex"],
    medications: [],
    labResults: [],
    treatmentPlan: null,
    diagnostics: null,
    loading: true
  });

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const currentDate = new Date();
        const appointments = [
          { 
            date: currentDate.toISOString().split('T')[0], 
            time: "10:30 AM", 
            treatment: "Root Canal Follow-up", 
            status: "Confirmed", 
            doctor: "Dr. Rakesh Gupta" 
          },
          { 
            date: new Date(currentDate.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
            time: "2:00 PM", 
            treatment: "Checkup", 
            status: "Completed", 
            doctor: "Dr. Rakesh Gupta" 
          }
        ];

        const medications = [
          { 
            name: "Amoxicillin 500mg", 
            dosage: "3 times daily", 
            duration: "5 days", 
            prescribed: new Date(currentDate.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          },
          { 
            name: "Ibuprofen 400mg", 
            dosage: "As needed for pain", 
            duration: "3 days", 
            prescribed: new Date(currentDate.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          }
        ];

        const labResults = [
          { 
            test: "Complete Blood Count", 
            result: "Normal", 
            date: new Date(currentDate.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
            status: "Completed" 
          },
          { 
            test: "X-Ray Dental", 
            result: "Root canal healing well", 
            date: new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
            status: "Completed" 
          }
        ];

        const treatmentPlan = {
          patientId: "P001",
          doctorName: "Dr. Bommakanti Rakesh Gupta",
          diagnosis: "Root canal therapy completed, crown placement scheduled",
          overallStatus: "In Progress",
          startDate: new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          estimatedCompletion: new Date(currentDate.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          totalCost: "₹15,000",
          paidAmount: "₹10,000",
          nextAppointment: {
            date: currentDate.toISOString().split('T')[0],
            time: "10:30 AM",
            treatment: "Crown Placement"
          },
          treatments: [
            {
              name: "Root Canal Therapy",
              status: "Completed",
              cost: "₹8,000",
              sittings: [
                { date: new Date(currentDate.getTime() - 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], notes: "Initial procedure completed", status: "Completed", cost: "₹8,000" }
              ]
            },
            {
              name: "Crown Placement",
              status: "Scheduled",
              cost: "₹7,000",
              sittings: [
                { date: currentDate.toISOString().split('T')[0], notes: "Crown placement scheduled", status: "Upcoming", cost: "₹7,000" }
              ]
            }
          ]
        };

        const diagnostics = {
          overallHealth: {
            score: Math.floor(Math.random() * 20) + 75,
            status: "Good",
            lastAssessment: new Date(currentDate.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            riskFactors: ["Dental Plaque", "Gum Sensitivity"],
            recommendations: [
              "Regular flossing twice daily",
              "Use fluoride mouthwash",
              "Schedule cleaning every 6 months"
            ]
          },
          treatmentProgress: {
            currentPlan: "Root Canal & Crown Restoration",
            completedSessions: 3,
            totalSessions: 4,
            nextAppointment: currentDate.toISOString().split('T')[0],
            expectedCompletion: new Date(currentDate.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          }
        };

        setData({
          patient: data.patient,
          appointments,
          vitals: {
            ...data.vitals,
            bloodPressure: `${Math.floor(Math.random() * 20) + 110}/${Math.floor(Math.random() * 10) + 75}`,
            heartRate: `${Math.floor(Math.random() * 20) + 65} bpm`,
            weight: `${Math.floor(Math.random() * 10) + 60} kg`
          },
          allergies: data.allergies,
          medications,
          labResults,
          treatmentPlan,
          diagnostics,
          loading: false
        });
      } catch (error) {
        console.error('Failed to fetch patient data:', error);
        setData(prev => ({ ...prev, loading: false }));
      }
    };

    fetchPatientData();
    const interval = setInterval(fetchPatientData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const updatePatientInfo = (updates: any) => {
    setData(prev => ({
      ...prev,
      patient: { ...prev.patient, ...updates }
    }));
  };

  const addAppointment = (appointment: any) => {
    setData(prev => ({
      ...prev,
      appointments: [...prev.appointments, appointment]
    }));
  };

  const updateVitals = (vitals: any) => {
    setData(prev => ({
      ...prev,
      vitals: { ...prev.vitals, ...vitals, lastUpdated: new Date().toISOString().split('T')[0] }
    }));
  };

  return { ...data, updatePatientInfo, addAppointment, updateVitals };
}