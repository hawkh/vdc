import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export function About() {
  return (
    <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-card">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">
            Meet Our Doctors
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Our experienced dental professionals are committed to providing exceptional care with a gentle approach.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col items-center space-y-4">
            <Card className="w-full max-w-sm shadow-lg">
              <CardContent className="p-0">
                <Image
                  alt="Dr. Bommakanti Rakesh Gupta"
                  className="aspect-square overflow-hidden rounded-lg object-cover"
                  height="400"
                  src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  width="400"
                />
              </CardContent>
            </Card>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Dr. Bommakanti Rakesh Gupta</h3>
              <p className="text-muted-foreground">
                Experienced dentist dedicated to providing the highest standard of dental care with a gentle approach and focus on patient comfort.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-4">
            <Card className="w-full max-w-sm shadow-lg">
              <CardContent className="p-0">
                <Image
                  alt="Dr. Navya"
                  className="aspect-square overflow-hidden rounded-lg object-cover"
                  height="400"
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  width="400"
                />
              </CardContent>
            </Card>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Dr. Navya</h3>
              <p className="text-muted-foreground">
                Skilled dental professional committed to delivering comprehensive oral healthcare with compassionate patient care and modern treatment approaches.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
