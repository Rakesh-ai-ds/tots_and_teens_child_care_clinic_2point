import { useState, useEffect } from "react";
import { Phone } from "lucide-react";
import logoImage from "@assets/generated_images/Cute_animals_clinic_logo_0073faa9.png";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 bg-background ${
        isScrolled ? "shadow-md" : ""
      }`}
      data-testid="header-main"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-3 md:gap-4">
            <img 
              src={logoImage} 
              alt="Tots and Teens Child Care Clinic" 
              className="h-12 w-12 md:h-16 md:w-16 rounded-full object-cover"
              data-testid="img-logo"
            />
            <div>
              <h1 className="font-heading font-semibold text-base md:text-lg text-foreground leading-tight">
                Tots and Teens
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">Child Care Clinic</p>
            </div>
          </div>
          
          <a 
            href="tel:+916379238880" 
            className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-2.5 bg-primary text-primary-foreground rounded-full font-medium text-sm md:text-base hover-elevate active-elevate-2 transition-transform"
            data-testid="link-call-header"
          >
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">Call Now</span>
            <span className="sm:hidden">Call</span>
          </a>
        </div>
      </div>
    </header>
  );
}
