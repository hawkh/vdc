import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    id: 1,
    beforeImage: "/before1.jpg",
    afterImage: "/after1.jpg"
  },
  {
    id: 2,
    beforeImage: "/before2.jpg",
    afterImage: "/after2.jpg"
  },
  {
    id: 3,
    beforeImage: "/before3.jpg",
    afterImage: "/after3.jpg"
  }
];

export function Testimonials() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">
            Patient Success Stories
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            See the amazing transformations our patients have achieved with our expert dental care.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="shadow-lg">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-3">
                  <Image
                    src={testimonial.beforeImage}
                    alt="Before"
                    width={150}
                    height={150}
                    className="rounded-lg object-cover aspect-square w-full"
                  />
                  <Image
                    src={testimonial.afterImage}
                    alt="After"
                    width={150}
                    height={150}
                    className="rounded-lg object-cover aspect-square w-full"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
