import { Card } from "@/components/ui/card";
import { Stethoscope, Brain, Users2, Shield } from "lucide-react";

const services = [
  {
    icon: Stethoscope,
    title: "General Pediatrics",
    description: "Comprehensive infant & child health checkups for routine illness, preventative health, and nutritional guidance. Full range of vaccination services.",
  },
  {
    icon: Brain,
    title: "Developmental Intervention",
    description: "Early identification & intervention for developmental delay. Specialized care for speech delay, autism, ADHD, and learning disabilities.",
  },
  {
    icon: Users2,
    title: "Adolescent Health",
    description: "Confidential consultation covering physical health, behavioral issues, academic performance improvement, digital deaddiction, and weight management.",
  },
  {
    icon: Shield,
    title: "Vaccination Services",
    description: "Complete vaccination schedule administered safely and responsibly. Protecting your child's health with immunizations at every stage.",
  },
];

export function Services() {
  return (
    <section className="py-12 md:py-20 bg-background" data-testid="section-services">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Our Services
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive pediatric care tailored to every stage of your child's development
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card 
                key={index} 
                className="p-6 md:p-8 hover-elevate transition-all duration-150 cursor-default"
                data-testid={`card-service-${index}`}
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Icon className="h-8 w-8 md:h-10 md:w-10 text-secondary" />
                  </div>
                  <h3 className="font-heading font-semibold text-xl md:text-2xl text-foreground">
                    {service.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
