"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, CheckCircle, AlertCircle, Clock, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { calendarSync } from "@/services/calendar-sync";

export function CalendarSyncStatus() {
  const [syncStatus, setSyncStatus] = useState<any>(null);
  const [isProcessingRetries, setIsProcessingRetries] = useState(false);

  useEffect(() => {
    const updateStatus = () => {
      const status = calendarSync.getSyncStatus();
      setSyncStatus(status);
    };

    updateStatus();
    const interval = setInterval(updateStatus, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleProcessRetries = async () => {
    setIsProcessingRetries(true);
    await calendarSync.processRetries();
    setIsProcessingRetries(false);
    
    // Update status after processing
    const status = calendarSync.getSyncStatus();
    setSyncStatus(status);
  };

  if (!syncStatus) {
    return <div>Loading sync status...</div>;
  }

  const successRate = syncStatus.totalErrors > 0 
    ? ((syncStatus.totalErrors - syncStatus.queueSize) / syncStatus.totalErrors) * 100 
    : 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Calendar Sync Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {syncStatus.isConnected ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
              <span className="font-medium">
                {syncStatus.isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <Badge variant={syncStatus.isConnected ? 'default' : 'destructive'}>
              {syncStatus.isConnected ? 'Active' : 'Inactive'}
            </Badge>
          </div>

          {/* Sync Statistics */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Last Sync</p>
              <p className="text-muted-foreground">
                {new Date(syncStatus.lastSync).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="font-medium">Calendar ID</p>
              <p className="text-muted-foreground">{syncStatus.calendarId}</p>
            </div>
            <div>
              <p className="font-medium">Total Operations</p>
              <p className="text-muted-foreground">{syncStatus.totalErrors}</p>
            </div>
            <div>
              <p className="font-medium">Pending Retries</p>
              <p className="text-muted-foreground">{syncStatus.queueSize}</p>
            </div>
          </div>

          {/* Success Rate */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Success Rate</span>
              <span>{successRate.toFixed(1)}%</span>
            </div>
            <Progress value={successRate} />
          </div>

          {/* Operations Breakdown */}
          {Object.keys(syncStatus.errorsByOperation).length > 0 && (
            <div>
              <p className="font-medium text-sm mb-2">Operations</p>
              <div className="space-y-2">
                {Object.entries(syncStatus.errorsByOperation).map(([operation, count]) => (
                  <div key={operation} className="flex justify-between text-sm">
                    <span className="capitalize">{operation}</span>
                    <Badge variant="outline">{count as number}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Errors */}
          {syncStatus.recentErrors.length > 0 && (
            <div>
              <p className="font-medium text-sm mb-2">Recent Issues</p>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {syncStatus.recentErrors.slice(0, 3).map((error: any, index: number) => (
                  <div key={index} className="text-xs p-2 bg-muted rounded">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-3 w-3 text-orange-500" />
                      <span className="capitalize">{error.operation}</span>
                      <span className="text-muted-foreground">
                        {new Date(error.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            
            {syncStatus.queueSize > 0 && (
              <Button
                size="sm"
                onClick={handleProcessRetries}
                disabled={isProcessingRetries}
              >
                <Clock className="h-4 w-4 mr-2" />
                {isProcessingRetries ? 'Processing...' : `Retry ${syncStatus.queueSize} Failed`}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}