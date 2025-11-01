'use client';

import { MapPin, Phone } from "lucide-react";
import { Button } from "./ui/button";
import { SiWhatsapp } from "react-icons/si";
import { Instagram } from "lucide-react";
import { motion } from "framer-motion";

export function LocationMap() {
  const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.246!2d78.1455386!3d11.6616727!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDM5JzQyLjAiTiA3OMKwMDgnNDMuOSJF!5e0!3m2!1sen!2sin!4v1637923888000!5m2!1sen!2sin&z=17`;
  const directionsUrl = "https://maps.app.goo.gl/VRcDfqYDeK7Xn7Ud6";

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-8 text-foreground">
          Our Location
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Map Section */}
          <div className="rounded-lg overflow-hidden shadow-lg h-96">
            <iframe
              src={mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Dr. Amudha's Clinic Location"
              className="w-full h-full"
            />
          </div>
          
          {/* Contact & Social Section */}
          <div className="flex flex-col justify-center">
            <div className="bg-white p-6 rounded-lg shadow-md h-full">
              <div className="flex items-center mb-6">
                <div className="bg-[#FF6B81]/10 p-2 rounded-full mr-4">
                  <MapPin className="h-6 w-6 text-[#FF6B81]" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Find Us</h3>
              </div>
              
              <p className="text-foreground/90 mb-6">
                St. Mary's Higher Secondary School,<br />
                Arisipalayam Main Rd,<br />
                Arisipalayam, Salem,<br />
                Tamil Nadu 636009
              </p>
              
              <div className="space-y-4">
                <motion.a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button className="w-full bg-[#FF6B81] hover:bg-[#FF6B81]/90 text-white py-6 text-base">
                    Get Directions
                  </Button>
                </motion.a>
                
                <div className="flex gap-3">
                  <motion.a
                    href="https://wa.me/916379238880?text=Hello,%20I%20would%20like%20to%20book%20an%20appointment"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button variant="outline" className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white border-0 py-6 text-base">
                      <SiWhatsapp className="h-5 w-5 mr-2" />
                      WhatsApp
                    </Button>
                  </motion.a>
                  
                  <motion.a
                    href="https://www.instagram.com/amudha1429/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button variant="outline" className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:opacity-90 text-white border-0 py-6 text-base">
                      <Instagram className="h-5 w-5 mr-2" />
                      @amudha1429
                    </Button>
                  </motion.a>
                </div>
                
                <motion.a
                  href="tel:+916379238880"
                  className="block"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button variant="outline" className="w-full bg-white hover:bg-gray-50 text-foreground border border-gray-200 py-6 text-base">
                    <Phone className="h-5 w-5 mr-2" />
                    Call Now: 63792 38880
                  </Button>
                </motion.a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
