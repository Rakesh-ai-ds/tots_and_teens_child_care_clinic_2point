import { useState, useEffect } from "react";
import { Phone, Menu, X } from "lucide-react";
import logoImage from "@assets/generated_images/Cute_animals_clinic_logo_0073faa9.png";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 bg-background ${
        isScrolled ? "shadow-md" : ""
      }`}
      data-testid="header-main"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 md:gap-4">
            <img
              src={logoImage}
              alt="Tots and Teens Child Care Clinic"
              className="h-12 w-12 rounded-full object-cover"
              data-testid="img-logo"
            />
            <div>
              <h1 className="font-heading font-semibold text-base text-foreground leading-tight">
                Tots and Teens
              </h1>
              <p className="text-xs text-muted-foreground">
                Child Care Clinic
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-base font-medium text-foreground hover:text-primary transition-colors">Home</a>
            <a href="#doctor-profile" className="text-base font-medium text-foreground hover:text-primary transition-colors">About</a>
            <a href="#services" className="text-base font-medium text-foreground hover:text-primary transition-colors">Our Services</a>
            <a href="#booking-form" className="text-base font-medium text-foreground hover:text-primary transition-colors">Book Appointment</a>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="tel:+916379238880"
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full font-medium text-sm hover-elevate active-elevate-2 transition-transform"
              data-testid="link-call-header"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Call Now</span>
              <span className="sm:hidden">Call</span>
            </a>
            <button
              className="md:hidden p-2 rounded-md text-foreground hover:bg-muted"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-background shadow-lg">
          <nav className="flex flex-col items-center gap-4 p-4">
            <a href="#" className="text-base font-medium text-foreground hover:text-primary transition-colors" onClick={toggleMobileMenu}>Home</a>
            <a href="#services" className="text-base font-medium text-foreground hover:text-primary transition-colors" onClick={toggleMobileMenu}>Our Services</a>
            <a href="#booking-form" className="text-base font-medium text-foreground hover:text-primary transition-colors" onClick={toggleMobileMenu}>Book Appointment</a>
            <a href="#doctor-profile" className="text-base font-medium text-foreground hover:text-primary transition-colors" onClick={toggleMobileMenu}>About</a>
          </nav>
        </div>
      )}
    </header>
  );
}