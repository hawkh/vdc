"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const appointmentId = searchParams.get("appointmentId");
    const paymentIntentId = searchParams.get("payment_intent");

    if (!appointmentId || !paymentIntentId) {
      toast({
        title: "Error",
        description: "Missing appointment information",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Update appointment payment status in the database
    const updatePaymentStatus = async () => {
      try {
        const response = await fetch("/api/update-payment-status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            appointmentId,
            paymentIntentId,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update payment status");
        }

        toast({
          title: "Payment Successful",
          description: "Your appointment has been confirmed.",
        });
      } catch (error) {
        console.error("Error updating payment status:", error);
        toast({
          title: "Warning",
          description:
            "Payment received but we couldn't update your appointment status. Our team will contact you.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    updatePaymentStatus();
  }, [searchParams, toast]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {loading ? (
              <Loader2 className="h-16 w-16 text-primary animate-spin" />
            ) : (
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {loading ? "Processing Payment..." : "Payment Successful!"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          {loading ? (
            <p>Please wait while we confirm your payment...</p>
          ) : (
            <>
              <p>
                Thank you for your payment. Your appointment has been confirmed.
              </p>
              <p className="text-sm text-muted-foreground">
                A confirmation has been sent to your email address.
              </p>
              <div className="pt-4">
                <Button
                  onClick={() => router.push("/")}
                  className="w-full"
                >
                  Return to Home
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Loader2 className="h-16 w-16 text-primary animate-spin" />
            </div>
            <CardTitle className="text-2xl">Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}