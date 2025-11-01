import { Button } from "@/components/ui/button";
import { Award, Users } from "lucide-react";

export function Hero() {
  const scrollToBooking = () => {
    const bookingSection = document.getElementById("booking-form");
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section 
      className="relative pt-16 pb-8 md:pt-24 md:pb-20 overflow-hidden"
      data-testid="section-hero"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20"></div>
      
      <div 
        className="absolute inset-0 opacity-30 bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url('/logo.png')` }}
      ></div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-foreground mb-4 md:mb-6 leading-tight">
            TOTS AND TEENS CHILD CARE CLINIC
          </h2>
          
          <p className="text-base md:text-lg text-foreground/90 mb-8 md:mb-10 leading-relaxed max-w-2xl mx-auto">
            Expert care for every stage of your child's growth, from infancy to adolescence.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-8 md:mb-12">
            <div className="flex items-center gap-2 px-4 py-2 bg-card backdrop-blur-sm rounded-full shadow-sm">
              <Award className="h-5 w-5 text-primary" />
              <span className="font-medium text-sm md:text-base text-foreground">13 Years of Clinical Experience</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card backdrop-blur-sm rounded-full shadow-sm">
              <Users className="h-5 w-5 text-secondary" />
              <span className="font-medium text-sm md:text-base text-foreground">Trusted by 3000+ Families</span>
            </div>
          </div>
          
          <Button 
            size="lg"
            onClick={scrollToBooking}
            className="px-8 py-4 text-base font-heading font-medium rounded-full shadow-lg"
            data-testid="button-book-appointment-hero"
          >
            Book Your Appointment Today
          </Button>
        </div>
      </div>
    </section>
  );
}
