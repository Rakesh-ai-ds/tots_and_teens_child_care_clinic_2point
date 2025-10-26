import { Button } from "@/components/ui/button";
import { Phone, Instagram } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

export function SocialMediaBar() {
  return (
    <div 
      className="fixed md:static bottom-0 left-0 right-0 z-40 bg-background md:bg-transparent border-t md:border-t-0 border-border md:py-8"
      data-testid="section-social-media"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-center gap-3 md:gap-4 py-3 md:py-0">
          <a
            href="https://wa.me/916379238880?text=Hello,%20I%20would%20like%20to%20book%20an%20appointment"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="link-whatsapp"
          >
            <Button 
              className="bg-[#25D366] hover:bg-[#25D366] text-white px-4 md:px-6 py-3 rounded-full font-medium text-sm md:text-base flex items-center gap-2"
              style={{ backgroundColor: '#25D366' }}
            >
              <SiWhatsapp className="h-5 w-5" />
              <span className="hidden md:inline">WhatsApp</span>
            </Button>
          </a>

          <a
            href="https://www.instagram.com/amudha1429/"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="link-instagram"
          >
            <Button 
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white px-4 md:px-6 py-3 rounded-full font-medium text-sm md:text-base flex items-center gap-2"
            >
              <Instagram className="h-5 w-5" />
              <span className="hidden md:inline">@amudha1429</span>
            </Button>
          </a>

          <a
            href="tel:+916379238880"
            data-testid="link-call-now"
          >
            <Button 
              className="px-4 md:px-6 py-3 rounded-full font-medium text-sm md:text-base flex items-center gap-2"
            >
              <Phone className="h-5 w-5" />
              <span className="hidden md:inline">Call Now</span>
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
