"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText, Download, Eye, Calendar, Activity, AlertCircle } from "lucide-react";
import { jsPDF } from 'jspdf';

const diagnosticData = {
  overallHealth: {
    score: 78,
    status: "Good",
    lastAssessment: "2024-01-20",
    riskFactors: ["Dental Plaque", "Gum Sensitivity"],
    recommendations: [
      "Regular flossing twice daily",
      "Use fluoride mouthwash",
      "Schedule cleaning every 6 months"
    ]
  },
  dentalExam: {
    date: "2024-01-20",
    findings: [
      { tooth: "#14", condition: "Root Canal Required", severity: "High", status: "In Treatment" },
      { tooth: "#12", condition: "Small Cavity", severity: "Medium", status: "Scheduled" },
      { tooth: "#28", condition: "Plaque Buildup", severity: "Low", status: "Monitoring" }
    ],
    oralHygiene: "Fair",
    gumHealth: "Mild Inflammation",
    biteAlignment: "Normal"
  },
  xrayResults: {
    date: "2024-01-15",
    images: [
      { type: "Panoramic X-Ray", findings: "Cavity in tooth #14, wisdom teeth impacted", status: "Reviewed" },
      { type: "Bitewing X-Ray", findings: "Bone loss minimal, no hidden cavities", status: "Normal" }
    ]
  },
  treatmentProgress: {
    currentPlan: "Root Canal & Restoration",
    completedSessions: 3,
    totalSessions: 5,
    nextAppointment: "2024-01-25",
    expectedCompletion: "2024-02-15"
  },
  preventiveCare: {
    lastCleaning: "2023-12-15",
    nextCleaning: "2024-06-15",
    fluorideTreatment: "Due",
    sealants: "Not Required"
  }
};

export function DiagnosticReports({ diagnostics }: { diagnostics?: any }) {
  const localDiagnosticData = diagnostics || {
    overallHealth: {
      score: 78,
      status: "Good",
      lastAssessment: "2024-01-20",
      riskFactors: ["Dental Plaque", "Gum Sensitivity"],
      recommendations: ["Regular flossing twice daily", "Use fluoride mouthwash", "Schedule cleaning every 6 months"]
    },
    dentalExam: {
      date: "2024-01-20",
      findings: [
        { tooth: "#14", condition: "Root Canal Required", severity: "High", status: "In Treatment" },
        { tooth: "#12", condition: "Small Cavity", severity: "Medium", status: "Scheduled" }
      ],
      oralHygiene: "Fair",
      gumHealth: "Mild Inflammation",
      biteAlignment: "Normal"
    },
    xrayResults: {
      date: "2024-01-15",
      images: [
        { type: "Panoramic X-Ray", findings: "Cavity in tooth #14", status: "Reviewed" },
        { type: "Bitewing X-Ray", findings: "Bone loss minimal", status: "Normal" }
      ]
    },
    treatmentProgress: {
      currentPlan: "Root Canal & Restoration",
      completedSessions: 3,
      totalSessions: 5,
      nextAppointment: "2024-01-25",
      expectedCompletion: "2024-02-15"
    },
    preventiveCare: {
      lastCleaning: "2023-12-15",
      nextCleaning: "2024-06-15",
      fluorideTreatment: "Due",
      sealants: "Not Required"
    }
  };
  const generateDetailedReport = () => {
    const reportContent = `
COMPREHENSIVE DENTAL DIAGNOSTIC REPORT
=====================================

Patient: Priya K. (P001)
Report Date: ${new Date().toLocaleDateString()}
Doctor: Dr. Bommakanti Rakesh Gupta
Clinic: Vasavi Dental Care, Kamareddy

OVERALL HEALTH ASSESSMENT
=========================
Health Score: ${localDiagnosticData.overallHealth.score}/100 (${localDiagnosticData.overallHealth.status})
Last Assessment: ${localDiagnosticData.overallHealth.lastAssessment}

Risk Factors Identified:
${localDiagnosticData.overallHealth.riskFactors.map(factor => `• ${factor}`).join('\n')}

DENTAL EXAMINATION FINDINGS
===========================
Examination Date: ${localDiagnosticData.dentalExam?.date || 'N/A'}
Oral Hygiene Status: ${localDiagnosticData.dentalExam?.oralHygiene || 'N/A'}
Gum Health: ${localDiagnosticData.dentalExam?.gumHealth || 'N/A'}
Bite Alignment: ${localDiagnosticData.dentalExam?.biteAlignment || 'N/A'}

Specific Findings:
${(localDiagnosticData.dentalExam?.findings || []).map(finding => 
  `• Tooth ${finding.tooth}: ${finding.condition} (${finding.severity} severity) - ${finding.status}`
).join('\n')}

X-RAY ANALYSIS
==============
X-Ray Date: ${localDiagnosticData.xrayResults?.date || 'N/A'}

${(localDiagnosticData.xrayResults?.images || []).map(xray => 
  `${xray.type}:\n  Findings: ${xray.findings}\n  Status: ${xray.status}`
).join('\n\n')}

TREATMENT PROGRESS
==================
Current Treatment Plan: ${localDiagnosticData.treatmentProgress?.currentPlan || 'N/A'}
Progress: ${localDiagnosticData.treatmentProgress?.completedSessions || 0}/${localDiagnosticData.treatmentProgress?.totalSessions || 0} sessions completed
Next Appointment: ${localDiagnosticData.treatmentProgress?.nextAppointment || 'N/A'}
Expected Completion: ${localDiagnosticData.treatmentProgress?.expectedCompletion || 'N/A'}

RECOMMENDATIONS
===============
${localDiagnosticData.overallHealth.recommendations.map(rec => `• ${rec}`).join('\n')}

DOCTOR'S NOTES
==============
Patient shows good compliance with treatment plan. Root canal therapy progressing well.
Recommend improved oral hygiene routine to prevent future complications.
Continue current medication regimen as prescribed.

This report is confidential and intended for medical use only.
For questions, contact Vasavi Dental Care at 9676118880.

Report Generated: ${new Date().toLocaleString()}
    `;

    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(16);
      doc.text('COMPREHENSIVE DENTAL DIAGNOSTIC REPORT', 20, 20);
      
      // Add content with proper formatting
      doc.setFontSize(10);
      const lines = doc.splitTextToSize(reportContent, 170);
      doc.text(lines, 20, 40);
      
      doc.save(`Diagnostic_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('PDF generation failed:', error);
      // Fallback to text download
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Diagnostic_Report_${new Date().toISOString().split('T')[0]}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      {/* Health Score Overview */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Overall Health Assessment
            </CardTitle>
            <Button onClick={generateDetailedReport}>
              <Download className="h-4 w-4 mr-2" />
              Full Diagnostic Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Health Score</span>
                <span className="text-2xl font-bold">{localDiagnosticData.overallHealth.score}/100</span>
              </div>
              <Progress value={localDiagnosticData.overallHealth.score} className="mb-4" />
              <Badge variant={localDiagnosticData.overallHealth.score >= 80 ? 'default' : localDiagnosticData.overallHealth.score >= 60 ? 'secondary' : 'destructive'}>
                {localDiagnosticData.overallHealth.status}
              </Badge>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Risk Factors</h3>
              <div className="space-y-1">
                {localDiagnosticData.overallHealth.riskFactors.map((factor, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <AlertCircle className="h-3 w-3 mr-2 text-orange-500" />
                    {factor}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dental Examination */}
      <Card>
        <CardHeader>
          <CardTitle>Dental Examination Results</CardTitle>
          <p className="text-sm text-muted-foreground">Last exam: {localDiagnosticData.dentalExam?.date || 'N/A'}</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-semibold">Oral Hygiene</h3>
              <p className="text-2xl font-bold mt-2">{localDiagnosticData.dentalExam?.oralHygiene || 'N/A'}</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-semibold">Gum Health</h3>
              <p className="text-2xl font-bold mt-2">{localDiagnosticData.dentalExam?.gumHealth || 'N/A'}</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-semibold">Bite Alignment</h3>
              <p className="text-2xl font-bold mt-2">{localDiagnosticData.dentalExam?.biteAlignment || 'N/A'}</p>
            </div>
          </div>
          
          <h3 className="font-semibold mb-4">Specific Findings</h3>
          <div className="space-y-3">
            {(localDiagnosticData.dentalExam?.findings || []).map((finding, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">Tooth {finding.tooth}</h4>
                    <p className="text-sm text-muted-foreground">{finding.condition}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant={finding.severity === 'High' ? 'destructive' : finding.severity === 'Medium' ? 'secondary' : 'outline'}>
                      {finding.severity}
                    </Badge>
                    <Badge variant="outline">{finding.status}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* X-Ray Results */}
      <Card>
        <CardHeader>
          <CardTitle>X-Ray Analysis</CardTitle>
          <p className="text-sm text-muted-foreground">Imaging date: {localDiagnosticData.xrayResults?.date || 'N/A'}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(localDiagnosticData.xrayResults?.images || []).map((xray, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{xray.type}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{xray.findings}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant="default">{xray.status}</Badge>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View Image
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Treatment Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Treatment Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">{localDiagnosticData.treatmentProgress.currentPlan}</h3>
              <div className="flex items-center justify-between mt-2 mb-2">
                <span className="text-sm">Progress</span>
                <span className="text-sm">{localDiagnosticData.treatmentProgress.completedSessions}/{localDiagnosticData.treatmentProgress.totalSessions} sessions</span>
              </div>
              <Progress value={(localDiagnosticData.treatmentProgress.completedSessions / localDiagnosticData.treatmentProgress.totalSessions) * 100} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="text-sm">Next Appointment: {localDiagnosticData.treatmentProgress.nextAppointment}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="text-sm">Expected Completion: {localDiagnosticData.treatmentProgress.expectedCompletion}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Doctor's Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {localDiagnosticData.overallHealth.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                <span className="text-sm">{rec}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}