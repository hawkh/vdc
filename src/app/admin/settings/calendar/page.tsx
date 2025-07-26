'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Settings,
  Trash2,
  TestTube
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CalendarConfig {
  isConnected: boolean;
  calendarId: string;
  calendarName: string;
  lastSync: string;
  status: 'connected' | 'error' | 'disconnected';
}

export default function CalendarSettingsPage() {
  const [config, setConfig] = useState<CalendarConfig>({
    isConnected: false,
    calendarId: '',
    calendarName: '',
    lastSync: '',
    status: 'disconnected'
  });
  const [credentials, setCredentials] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [availableCalendars, setAvailableCalendars] = useState<any[]>([]);
  const [selectedCalendar, setSelectedCalendar] = useState('');
  const { toast } = useToast();

  const handleCredentialUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/json') {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a JSON file containing your service account credentials.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    try {
      const text = await file.text();
      const credentialsData = JSON.parse(text);
      
      // Basic validation
      if (!credentialsData.client_email || !credentialsData.private_key) {
        throw new Error('Invalid service account credentials');
      }

      setCredentials(text);
      toast({
        title: 'Credentials uploaded',
        description: 'Service account credentials have been uploaded successfully.',
      });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Invalid JSON file or missing required fields.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const validateCredentials = async () => {
    if (!credentials) {
      toast({
        title: 'No credentials',
        description: 'Please upload service account credentials first.',
        variant: 'destructive',
      });
      return;
    }

    setIsTesting(true);
    try {
      const response = await fetch('/api/admin/calendar/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credentials }),
      });

      const result = await response.json();
      
      if (result.success) {
        setAvailableCalendars(result.calendars);
        toast({
          title: 'Credentials validated',
          description: `Found ${result.calendars.length} accessible calendars.`,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: 'Validation failed',
        description: error instanceof Error ? error.message : 'Failed to validate credentials.',
        variant: 'destructive',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const testConnection = async () => {
    if (!selectedCalendar) {
      toast({
        title: 'No calendar selected',
        description: 'Please select a calendar to test.',
        variant: 'destructive',
      });
      return;
    }

    setIsTesting(true);
    try {
      const response = await fetch('/api/admin/calendar/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          credentials,
          calendarId: selectedCalendar 
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        toast({
          title: 'Connection successful',
          description: 'Test event created and deleted successfully.',
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: 'Connection test failed',
        description: error instanceof Error ? error.message : 'Failed to test connection.',
        variant: 'destructive',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const saveConfiguration = async () => {
    if (!credentials || !selectedCalendar) {
      toast({
        title: 'Incomplete setup',
        description: 'Please upload credentials and select a calendar.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch('/api/admin/calendar/configure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credentials,
          calendarId: selectedCalendar,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setConfig({
          isConnected: true,
          calendarId: selectedCalendar,
          calendarName: availableCalendars.find(cal => cal.id === selectedCalendar)?.summary || 'Unknown',
          lastSync: new Date().toISOString(),
          status: 'connected'
        });
        
        toast({
          title: 'Configuration saved',
          description: 'Google Calendar integration is now active.',
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: 'Save failed',
        description: error instanceof Error ? error.message : 'Failed to save configuration.',
        variant: 'destructive',
      });
    }
  };

  const disconnectCalendar = async () => {
    try {
      const response = await fetch('/api/admin/calendar/disconnect', {
        method: 'POST',
      });

      if (response.ok) {
        setConfig({
          isConnected: false,
          calendarId: '',
          calendarName: '',
          lastSync: '',
          status: 'disconnected'
        });
        setCredentials('');
        setAvailableCalendars([]);
        setSelectedCalendar('');
        
        toast({
          title: 'Calendar disconnected',
          description: 'Google Calendar integration has been disabled.',
        });
      }
    } catch (error) {
      toast({
        title: 'Disconnect failed',
        description: 'Failed to disconnect calendar.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Google Calendar Integration</h1>
      </div>

      {/* Current Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {config.status === 'connected' ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-gray-400" />
              )}
              <div>
                <p className="font-medium">
                  {config.isConnected ? 'Connected' : 'Not Connected'}
                </p>
                {config.isConnected && (
                  <p className="text-sm text-muted-foreground">
                    Calendar: {config.calendarName}
                  </p>
                )}
              </div>
            </div>
            {config.isConnected && (
              <Button variant="destructive" onClick={disconnectCalendar}>
                <Trash2 className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {!config.isConnected && (
        <>
          {/* Setup Instructions */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Setup Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">1. Create a Google Service Account</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Go to the Google Cloud Console</li>
                  <li>• Create a new project or select an existing one</li>
                  <li>• Enable the Google Calendar API</li>
                  <li>• Create a service account with Calendar access</li>
                  <li>• Download the JSON credentials file</li>
                </ul>
              </div>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-medium">2. Share Your Calendar</h4>
                <p className="text-sm text-muted-foreground">
                  Share your Google Calendar with the service account email address (found in the credentials file) 
                  and give it "Make changes to events" permission.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Credential Upload */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Upload Service Account Credentials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="credentials">Service Account JSON File</Label>
                <Input
                  id="credentials"
                  type="file"
                  accept=".json"
                  onChange={handleCredentialUpload}
                  disabled={isUploading}
                  className="mt-1"
                />
              </div>
              
              {credentials && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Credentials uploaded successfully. Click "Validate & Get Calendars" to continue.
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={validateCredentials} 
                disabled={!credentials || isTesting}
                className="w-full"
              >
                {isTesting ? 'Validating...' : 'Validate & Get Calendars'}
              </Button>
            </CardContent>
          </Card>

          {/* Calendar Selection */}
          {availableCalendars.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Select Calendar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {availableCalendars.map((calendar) => (
                    <div
                      key={calendar.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedCalendar === calendar.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedCalendar(calendar.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{calendar.summary}</p>
                          <p className="text-sm text-muted-foreground">{calendar.id}</p>
                        </div>
                        {selectedCalendar === calendar.id && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={testConnection} 
                    disabled={!selectedCalendar || isTesting}
                    variant="outline"
                    className="flex-1"
                  >
                    <TestTube className="h-4 w-4 mr-2" />
                    {isTesting ? 'Testing...' : 'Test Connection'}
                  </Button>
                  
                  <Button 
                    onClick={saveConfiguration} 
                    disabled={!selectedCalendar}
                    className="flex-1"
                  >
                    Save Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}