import { Clock, MapPin, Phone, Instagram } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { motion } from "framer-motion";

export function ClinicInfo() {
  return (
    <section className="bg-secondary/10 py-12 md:py-16" data-testid="section-clinic-info">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow" data-testid="info-hours">
            <div className="flex flex-col items-center text-center">
              <div className="bg-[#FF6B81]/10 p-3 rounded-full mb-4">
                <Clock className="h-8 w-8 text-[#FF6B81]" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">Clinic Hours</h3>
              <div className="space-y-1">
                <p className="text-foreground/90">Mon - Sat: 6:00 PM – 8:00 PM</p>
                <p className="text-foreground/70">Sunday: Closed</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow" data-testid="info-location">
            <div className="flex flex-col items-center text-center">
              <div className="bg-[#FF6B81]/10 p-3 rounded-full mb-4">
                <MapPin className="h-8 w-8 text-[#FF6B81]" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">Location</h3>
              <div className="space-y-1">
                <p className="text-foreground/90">NEW SRI VIJAYA MEDICAL</p>
                <p className="text-foreground/90">Arisipalayam Main Rd,</p>
                <p className="text-foreground/90">opposite to St. Mary's School,</p>
                <p className="text-foreground/90">Salem, Tamil Nadu 636009</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow" data-testid="info-contact">
            <div className="flex flex-col items-center text-center">
              <div className="bg-[#FF6B81]/10 p-3 rounded-full mb-4">
                <Phone className="h-8 w-8 text-[#FF6B81]" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">Emergency Contact</h3>
              <div className="space-y-3">
                <a 
                  href="tel:+916379238880" 
                  className="block text-foreground/90 hover:text-[#FF6B81] transition-colors text-lg font-medium"
                  data-testid="link-emergency-phone"
                >
                  63792 38880
                </a>
                <p className="text-foreground/70 mb-3">Call for appointment</p>
                
                <div className="flex justify-center gap-4 mt-4">
                  <motion.a 
                    href="https://wa.me/916379238880?text=Hello,%20I%20would%20like%20to%20book%20an%20appointment"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366] text-white p-2 rounded-full hover:opacity-90 transition-opacity"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="WhatsApp"
                  >
                    <SiWhatsapp className="h-5 w-5" />
                  </motion.a>
                  
                  <motion.a
                    href="https://www.instagram.com/amudha1429/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white p-2 rounded-full hover:opacity-90 transition-opacity"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </motion.a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
