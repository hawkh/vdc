import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { treatments } from "@/lib/data";

export function Services() {
  return (
    <section id="services" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Our Treatments</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              We offer a wide range of dental services to meet your needs.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-4">
          {treatments.map((treatment) => (
            <Card key={treatment.id} className="text-center transition-transform transform hover:-translate-y-2 hover:shadow-xl">
              <CardHeader className="items-center gap-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <treatment.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>{treatment.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{treatment.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
