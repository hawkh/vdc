interface CalendarError {
  appointmentId?: string;
  operation: 'create' | 'update' | 'delete';
  error: any;
  timestamp: Date;
  retryCount?: number;
}

interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  exponentialBase: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 30000, // 30 seconds
  exponentialBase: 2
};

class CalendarErrorHandler {
  private errorLog: CalendarError[] = [];
  private retryQueue: Map<string, CalendarError> = new Map();

  /**
   * Log calendar operation errors with detailed information
   */
  logError(error: CalendarError): void {
    const errorWithTimestamp = {
      ...error,
      timestamp: new Date(),
      retryCount: error.retryCount || 0
    };

    this.errorLog.push(errorWithTimestamp);
    
    // Log to console with detailed information
    console.error('Calendar Operation Error:', {
      operation: error.operation,
      appointmentId: error.appointmentId,
      timestamp: errorWithTimestamp.timestamp.toISOString(),
      retryCount: errorWithTimestamp.retryCount,
      error: this.extractErrorDetails(error.error)
    });

    // In production, you might want to send this to a monitoring service
    // this.sendToMonitoring(errorWithTimestamp);
  }

  /**
   * Extract meaningful error details from Google API errors
   */
  private extractErrorDetails(error: any): any {
    if (!error) return 'Unknown error';

    // Handle Google API errors
    if (error.response?.data?.error) {
      const apiError = error.response.data.error;
      return {
        code: apiError.code,
        message: apiError.message,
        status: apiError.status,
        details: apiError.errors?.map((e: any) => ({
          domain: e.domain,
          reason: e.reason,
          message: e.message
        }))
      };
    }

    // Handle standard errors
    if (error instanceof Error) {
      return {
        name: error.name,
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 5) // First 5 lines of stack
      };
    }

    return error;
  }

  /**
   * Determine if an error is retryable
   */
  isRetryableError(error: any): boolean {
    if (!error) return false;

    // Google API specific retryable errors
    if (error.response?.data?.error) {
      const apiError = error.response.data.error;
      const retryableStatuses = [
        'RATE_LIMIT_EXCEEDED',
        'QUOTA_EXCEEDED',
        'BACKEND_ERROR',
        'INTERNAL_ERROR'
      ];
      
      const retryableCodes = [429, 500, 502, 503, 504];
      
      return retryableStatuses.includes(apiError.status) || 
             retryableCodes.includes(apiError.code);
    }

    // Network errors are generally retryable
    if (error.code === 'ECONNRESET' || 
        error.code === 'ETIMEDOUT' || 
        error.code === 'ENOTFOUND') {
      return true;
    }

    return false;
  }

  /**
   * Calculate delay for retry with exponential backoff
   */
  private calculateRetryDelay(retryCount: number, config: RetryConfig = DEFAULT_RETRY_CONFIG): number {
    const delay = config.baseDelay * Math.pow(config.exponentialBase, retryCount);
    const jitter = Math.random() * 0.1 * delay; // Add 10% jitter
    return Math.min(delay + jitter, config.maxDelay);
  }

  /**
   * Add operation to retry queue
   */
  addToRetryQueue(key: string, error: CalendarError): void {
    this.retryQueue.set(key, error);
    console.log(`Added to retry queue: ${key}, retry count: ${error.retryCount || 0}`);
  }

  /**
   * Process retry queue
   */
  async processRetryQueue(
    retryFunction: (error: CalendarError) => Promise<boolean>,
    config: RetryConfig = DEFAULT_RETRY_CONFIG
  ): Promise<void> {
    const toRetry = Array.from(this.retryQueue.entries());
    
    for (const [key, error] of toRetry) {
      const retryCount = (error.retryCount || 0) + 1;
      
      if (retryCount > config.maxRetries) {
        console.error(`Max retries exceeded for ${key}, removing from queue`);
        this.retryQueue.delete(key);
        this.logError({
          ...error,
          retryCount,
          error: new Error(`Max retries (${config.maxRetries}) exceeded`)
        });
        continue;
      }

      const delay = this.calculateRetryDelay(retryCount - 1, config);
      
      setTimeout(async () => {
        try {
          const success = await retryFunction(error);
          if (success) {
            console.log(`Retry successful for ${key}`);
            this.retryQueue.delete(key);
          } else {
            // Update retry count and keep in queue
            this.retryQueue.set(key, { ...error, retryCount });
          }
        } catch (retryError) {
          console.error(`Retry failed for ${key}:`, retryError);
          this.retryQueue.set(key, { ...error, retryCount, error: retryError });
        }
      }, delay);
    }
  }

  /**
   * Get error statistics
   */
  getErrorStats(): {
    totalErrors: number;
    errorsByOperation: Record<string, number>;
    recentErrors: CalendarError[];
    queueSize: number;
  } {
    const errorsByOperation = this.errorLog.reduce((acc, error) => {
      acc[error.operation] = (acc[error.operation] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentErrors = this.errorLog
      .filter(error => Date.now() - error.timestamp.getTime() < 24 * 60 * 60 * 1000) // Last 24 hours
      .slice(-10); // Last 10 errors

    return {
      totalErrors: this.errorLog.length,
      errorsByOperation,
      recentErrors,
      queueSize: this.retryQueue.size
    };
  }

  /**
   * Clear old errors from log (keep last 1000)
   */
  cleanupErrorLog(): void {
    if (this.errorLog.length > 1000) {
      this.errorLog = this.errorLog.slice(-1000);
    }
  }

  /**
   * Get user-friendly error message
   */
  getUserFriendlyMessage(error: any): string {
    if (!error) return 'An unknown error occurred';

    if (error.response?.data?.error) {
      const apiError = error.response.data.error;
      
      switch (apiError.status) {
        case 'NOT_FOUND':
          return 'Calendar not found. Please check your calendar configuration.';
        case 'PERMISSION_DENIED':
          return 'Insufficient permissions. Please ensure the service account has calendar access.';
        case 'RATE_LIMIT_EXCEEDED':
          return 'Too many requests. Please try again in a few minutes.';
        case 'QUOTA_EXCEEDED':
          return 'Calendar API quota exceeded. Please try again later.';
        case 'INVALID_ARGUMENT':
          return 'Invalid calendar event data. Please check the appointment details.';
        default:
          return `Calendar service error: ${apiError.message}`;
      }
    }

    if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
      return 'Network connection error. Please check your internet connection.';
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'An unexpected error occurred with the calendar service.';
  }
}

// Export singleton instance
export const calendarErrorHandler = new CalendarErrorHandler();

// Export types for use in other modules
export type { CalendarError, RetryConfig };