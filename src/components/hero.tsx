import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-card">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
           <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                Your Smile, Our Passion
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Welcome to Vasavi Dental Care. We provide top-quality dental services with a personal touch in Kamareddy.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <a href="#booking">
                <Button size="lg">Book an Appointment</Button>
              </a>
              <a href="#services">
                <Button size="lg" variant="outline">
                  Our Services
                </Button>
              </a>
            </div>
          </div>
          <Image
            alt="Hero"
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
            height="550"
            src="/vdc.jpg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            width="550"
          />
        </div>
      </div>
    </section>
  );
}
