import { Button } from "@/components/ui/button";
import { Award, Users } from "lucide-react";
import animalsImage from "@assets/WhatsApp Image 2025-10-26 at 10.31.52_57e2e3e9_1761471001882.jpg";

export function Hero() {
  const scrollToBooking = () => {
    const bookingSection = document.getElementById("booking-form");
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section 
      className="relative pt-20 md:pt-24 pb-12 md:pb-20 overflow-hidden"
      data-testid="section-hero"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10"></div>
      
      <div 
        className="absolute inset-0 opacity-30 bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${animalsImage})` }}
      ></div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 md:mb-6 leading-tight">
            TOTS AND TEENS CHILD CARE CLINIC
          </h2>
          
          <p className="text-base md:text-lg lg:text-xl text-foreground/90 mb-8 md:mb-10 leading-relaxed max-w-2xl mx-auto">
            Expert care for every stage of your child's growth, from infancy to adolescence.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-8 md:mb-12">
            <div className="flex items-center gap-2 px-4 py-2 bg-background/90 backdrop-blur-sm rounded-full shadow-sm">
              <Award className="h-5 w-5 text-primary" />
              <span className="font-medium text-sm md:text-base text-foreground">13 Years of Clinical Experience</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-background/90 backdrop-blur-sm rounded-full shadow-sm">
              <Users className="h-5 w-5 text-secondary" />
              <span className="font-medium text-sm md:text-base text-foreground">Trusted by 3000+ Families</span>
            </div>
          </div>
          
          <Button 
            size="lg"
            onClick={scrollToBooking}
            className="px-8 md:px-12 py-4 md:py-6 text-base md:text-lg font-heading font-medium rounded-full shadow-lg"
            data-testid="button-book-appointment-hero"
          >
            Book Your Appointment Today
          </Button>
        </div>
      </div>
    </section>
  );
}
