import { Clock, MapPin, Phone } from "lucide-react";

export function QuickInfo() {
  return (
    <section className="bg-secondary text-secondary-foreground py-6 md:py-8" data-testid="section-quick-info">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 text-center">
          <div className="flex flex-col items-center gap-2" data-testid="info-hours">
            <Clock className="h-6 w-6" />
            <div>
              <p className="font-heading font-semibold text-sm md:text-base">Clinic Hours</p>
              <p className="text-xs md:text-sm opacity-90">Mon - Sat: 6:00 PM – 8:00 PM</p>
              <p className="text-xs opacity-75">Sunday: Closed</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2 text-center" data-testid="info-location">
            <MapPin className="h-6 w-6" />
            <div>
              <p className="font-heading font-semibold text-sm md:text-base">Location</p>
              <p className="text-xs md:text-sm opacity-90">St. Mary's Higher Secondary School</p>
              <p className="text-xs md:text-sm opacity-90">Arisipalayam Main Rd,</p>
              <p className="text-xs md:text-sm opacity-90">Arisipalayam, Salem,</p>
              <p className="text-xs md:text-sm opacity-90">Tamil Nadu 636009</p>
              <p className="text-xs opacity-75"></p>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2" data-testid="info-contact">
            <Phone className="h-6 w-6" />
            <div>
              <p className="font-heading font-semibold text-sm md:text-base">Emergency Contact</p>
              <a 
                href="tel:+916379238880" 
                className="text-xs md:text-sm opacity-90 hover:opacity-100 transition-opacity"
                data-testid="link-emergency-phone"
              >
                63792 38880
              </a>
              <p className="text-xs opacity-75">Call for appointment</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
