import { MapPin, Phone, Clock, Mail, Instagram } from "lucide-react";
import logoImage from "@assets/generated_images/Cute_animals_clinic_logo_0073faa9.png";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-12 md:py-16 pb-24 md:pb-16" data-testid="section-footer">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={logoImage} 
                alt="Tots and Teens" 
                className="h-12 w-12 rounded-full"
              />
              <div>
                <h3 className="font-heading font-bold text-lg">Tots and Teens</h3>
                <p className="text-sm opacity-80">Child Care Clinic</p>
              </div>
            </div>
            <p className="text-sm opacity-90 leading-relaxed">
              Expert care for every stage of your child's growth, from infancy to adolescence.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Clinic Hours</h4>
            <div className="space-y-3 text-sm opacity-90">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Monday - Saturday</p>
                  <p className="opacity-80">6:00 PM – 8:00 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Sunday</p>
                  <p className="opacity-80">Closed</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm opacity-90">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 flex-shrink-0" />
                <div>
                  <p>Arisipalayam Main Rd,</p>
                  <p>Near St. Mary's School,</p>
                  <p>Salem, Tamil Nadu 636009</p>
                </div>
              </div>
              <a href="tel:+916379238880" className="flex items-center gap-3 hover:opacity-100 transition-opacity">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <span>63792 38880</span>
              </a>
              <a 
                href="https://www.instagram.com/amudha1429/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:opacity-100 transition-opacity"
              >
                <Instagram className="h-5 w-5 flex-shrink-0" />
                <span>@amudha1429</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 pt-6 text-center">
          <p className="text-sm opacity-80">
            © {new Date().getFullYear()} Tots and Teens Child Care Clinic. All rights reserved.
          </p>
          <p className="text-xs opacity-60 mt-2">
            Built with care for better child healthcare
          </p>
        </div>
      </div>
    </footer>
  );
}
