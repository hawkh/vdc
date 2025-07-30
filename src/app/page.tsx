import { About } from "@/components/about";
import { Booking } from "@/components/booking";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Services } from "@/components/services";
import { Testimonials }from "@/components/testimonials";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <Services />
        <About />
         <Testimonials />
        <Booking />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
