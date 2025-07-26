

import { BookingForm } from "./booking-form";

export function Booking() {
  return (
    <section id="booking" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
              Book Your Appointment
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Choose your preferred treatment, date, and time. We look forward to seeing you.
            </p>
          </div>
        </div>
        <div className="mx-auto w-full max-w-2xl py-12">
          <BookingForm />
        </div>
      </div>
    </section>
  );
}
