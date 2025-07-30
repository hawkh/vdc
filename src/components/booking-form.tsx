
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2, QrCode, MessageCircle, Upload, X, CreditCard } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { treatments, generateTimeSlots } from "@/lib/data";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { StripePaymentWrapper } from "./stripe-payment-wrapper";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];


const bookingFormSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit phone number." }),
  email: z.string().email({ message: "Please enter a valid email." }).optional().or(z.literal("")),
  treatment: z.string({ required_error: "Please select a treatment." }),
  date: z.date({ required_error: "A date is required." }),
  time: z.string({ required_error: "Please select a time." }),
  notes: z.string().max(500).optional(),
  teethPictures: z
    .custom<FileList>()
    .refine((files) => Array.from(files ?? []).length <= 5, "You can upload a maximum of 5 images.")
    .refine(
      (files) => Array.from(files ?? []).every((file) => file.size <= MAX_FILE_SIZE),
      `Max file size is 5MB.`
    )
    .refine(
      (files) => Array.from(files ?? []).every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
      ".jpg, .jpeg, .png and .webp files are accepted."
    )
    .optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

export function BookingForm() {
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showStripePayment, setShowStripePayment] = useState(false);
  const [bookedDetails, setBookedDetails] = useState<BookingFormValues | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [appointmentId, setAppointmentId] = useState<string | null>(null);
  const { toast } = useToast();

  const timeSlots = generateTimeSlots(selectedDate);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      notes: "",
    },
  });

  const onSubmit = async (data: BookingFormValues) => {
    setLoading(true);

    // Convert 12-hour time to 24-hour format for the backend
    const timeParts = data.time.match(/(\d+):(\d+) (AM|PM)/);
    let hour = timeParts ? parseInt(timeParts[1], 10) : 0;
    const minute = timeParts ? parseInt(timeParts[2], 10) : 0;
    const period = timeParts ? timeParts[3] : 'AM';

    if (period === 'PM' && hour !== 12) {
      hour += 12;
    } else if (period === 'AM' && hour === 12) {
      hour = 0;
    }

    const formData = new FormData();
    formData.append('fullName', data.fullName);
    formData.append('phone', data.phone);
    formData.append('email', data.email || '');
    formData.append('treatment', data.treatment);
    formData.append('date', format(data.date, "yyyy-MM-dd"));
    formData.append('time', `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`);
    formData.append('notes', data.notes || '');

    if (data.teethPictures) {
      Array.from(data.teethPictures).forEach(file => {
        formData.append('teethPictures', file);
      });
    }

    try {
      const response = await fetch('/api/book-appointment', {
        method: 'POST',
        body: formData, // Send FormData instead of JSON
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }

      const result = await response.json();
      setBookedDetails(data);
      setAppointmentId(result.appointmentId);
      setShowConfirmation(true);
    } catch (error) {
      console.error("Booking submission error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        title: "Booking Failed",
        description: `Could not save your appointment. ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    form.setValue("date", date as Date, { shouldValidate: true });
    form.setValue("time", ""); // Reset time when date changes
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPreviews = Array.from(files).map(file => URL.createObjectURL(file));
      setImagePreviews(newPreviews);
      form.setValue("teethPictures", files, { shouldValidate: true });
    }
  };

  const removeImage = (indexToRemove: number) => {
    const currentFiles = form.getValues("teethPictures");
    if (currentFiles) {
      const newFiles = new DataTransfer();
      Array.from(currentFiles)
        .filter((_, index) => index !== indexToRemove)
        .forEach(file => newFiles.items.add(file));

      form.setValue("teethPictures", newFiles.files, { shouldValidate: true });
      setImagePreviews(previews => previews.filter((_, index) => index !== indexToRemove));
    }
  };


  const handleProceedToPayment = () => {
    setShowConfirmation(false);
    // If we have an appointmentId from MongoDB, use Stripe payment
    if (appointmentId) {
      setShowStripePayment(true);
    } else {
      // Fallback to the old UPI QR code payment method
      setShowPaymentModal(true);
    }
  }

  const handleSendOnWhatsApp = () => {
    if (!bookedDetails) return;

    const message = `
Hi ${bookedDetails.fullName},

✅ Your appointment at Vasavi Dental Care is confirmed.

📅 Date: ${format(bookedDetails.date, 'PPP')}
🕑 Time: ${bookedDetails.time}
📌 Reason: ${bookedDetails.treatment}

Please complete payment using UPI and share the screenshot here.

Thank you!
    `.trim();

    const whatsappUrl = `https://wa.me/9381091722?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');

    setShowPaymentModal(false);
    toast({
      title: "Redirecting to WhatsApp",
      description: "Please send the payment screenshot to confirm your appointment.",
    });
    form.reset();
    setSelectedDate(undefined);
    setBookedDetails(null);
    setImagePreviews([]);
  }

  return (
    <>
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="9876543210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="treatment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Treatment</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a treatment type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {treatments.map((t) => (
                          <SelectItem key={t.id} value={t.name}>
                            {t.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Appointment Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={handleDateSelect}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0)) || date.getDay() === 0
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {selectedDate && (
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Available Time Slots</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-2">
                          {timeSlots.length > 0 ? timeSlots.map((slot) => (
                            <Button
                              key={slot}
                              variant={field.value === slot ? "default" : "outline"}
                              type="button"
                              onClick={() => form.setValue("time", slot, { shouldValidate: true })}
                              className="transition-all"
                            >
                              {slot}
                            </Button>
                          )) : <p className="text-muted-foreground col-span-full text-sm">No slots available. Please select another date.</p>}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="teethPictures"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Teeth Pictures (Optional)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="file"
                          multiple
                          accept="image/png, image/jpeg, image/webp"
                          className="w-full h-auto p-2 border rounded-md cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                          onChange={handleImageChange}
                        />
                        <div className="absolute top-1/2 right-4 -translate-y-1/2">
                          <Upload className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {imagePreviews.map((src, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={src}
                        alt={`Preview ${index + 1}`}
                        width={100}
                        height={100}
                        className="rounded-md object-cover aspect-square w-full"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any specific concerns or requests?"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Book Now
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Appointment Booked Successfully!</AlertDialogTitle>
            <AlertDialogDescription>
              Your appointment for {bookedDetails?.treatment} on {bookedDetails?.date ? format(bookedDetails.date, 'PPP') : ''} at {bookedDetails?.time} has been reserved. A confirmation has been added to the doctor's calendar. Please proceed with payment to fully confirm.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => {
              setShowConfirmation(false);
              form.reset();
              setSelectedDate(undefined);
              setImagePreviews([]);
            }}>Cancel</Button>
            <Button onClick={handleProceedToPayment}>
              <CreditCard className="mr-2 h-4 w-4" />
              Proceed to Payment
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Legacy UPI Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-center">Complete Your Payment</DialogTitle>
            <DialogDescription className="text-center">
              Scan the QR code below with any UPI app to pay the consultation fee. Then, send us the screenshot on WhatsApp.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center p-4">
            <Image
              src="https://images.unsplash.com/photo-1606166187734-a4cb74079037?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=250&q=80"
              alt="UPI QR Code"
              width={250}
              height={250}
              className="rounded-lg border"
            />
          </div>
          <p className="text-sm text-muted-foreground">After payment, click the button below to send the screenshot.</p>
          <DialogFooter className="sm:justify-center">
            <Button onClick={handleSendOnWhatsApp}>
              <MessageCircle className="mr-2 h-4 w-4" />
              Send Screenshot on WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Stripe Payment Modal */}
      <Dialog open={showStripePayment} onOpenChange={setShowStripePayment}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Secure Payment</DialogTitle>
            <DialogDescription className="text-center">
              Complete your payment to confirm your appointment.
            </DialogDescription>
          </DialogHeader>
          {appointmentId && (
            <StripePaymentWrapper
              appointmentId={appointmentId}
              amount={500} // Consultation fee in INR
              onSuccess={() => {
                setShowStripePayment(false);
                toast({
                  title: "Payment Successful",
                  description: "Your appointment has been confirmed.",
                });
                form.reset();
                setSelectedDate(undefined);
                setImagePreviews([]);
              }}
              onCancel={() => {
                setShowStripePayment(false);
                // Fallback to WhatsApp payment option
                setShowPaymentModal(true);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
