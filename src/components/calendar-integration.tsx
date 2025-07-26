"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, CheckCircle, AlertCircle, Upload, Settings, RefreshCw } from "lucide-react";
import { useState } from "react";

export function CalendarIntegration() {
  const [isConnected, setIsConnected] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [credentials, setCredentials] = useState<any>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        setCredentials(json);
        setIsConnected(true);
        setIsUploading(false);
      } catch (error) {
        console.error('Invalid JSON file');
        setIsUploading(false);
      }
    };
    reader.readAsText(file);
  };

  const testConnection = () => {
    // Simulate connection test
    setTimeout(() => {
      setIsConnected(true);
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Google Calendar Integration
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-4">
                Upload Google Service Account credentials JSON file
              </p>
              <Input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </div>
            
            <div className="text-xs text-muted-foreground space-y-2">
              <p><strong>Setup Instructions:</strong></p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Go to Google Cloud Console</li>
                <li>Create a new service account</li>
                <li>Download the JSON credentials file</li>
                <li>Upload the file above</li>
              </ol>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Google Calendar Connected</span>
              <Badge variant="default">Active</Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Calendar ID</p>
                <p className="text-muted-foreground">primary</p>
              </div>
              <div>
                <p className="font-medium">Last Sync</p>
                <p className="text-muted-foreground">{new Date().toLocaleString()}</p>
              </div>
              <div>
                <p className="font-medium">Events Synced</p>
                <p className="text-muted-foreground">24 this month</p>
              </div>
              <div>
                <p className="font-medium">Status</p>
                <p className="text-green-600">Healthy</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={testConnection}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Test Connection
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Calendar Settings</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Default Calendar</label>
                      <Input value="primary" readOnly />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Sync Frequency</label>
                      <Input value="Real-time" readOnly />
                    </div>
                    <Button>Save Settings</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}