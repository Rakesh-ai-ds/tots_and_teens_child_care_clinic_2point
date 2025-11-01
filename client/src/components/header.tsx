import { useState, useEffect, useRef } from "react";
import { Phone, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  const scrollToSection = (sectionId: string) => {
    if (sectionId === '#') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      const element = document.querySelector(sectionId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
    setIsMobileMenuOpen(false);
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
              src="/logo.png"
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

          <nav className="hidden md:flex items-center gap-8">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('#');
              }} 
              className="text-base font-semibold text-foreground hover:text-[#FF6B81] transition-colors duration-300"
            >
              Home
            </a>
            <a 
              href="#services" 
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('#services');
              }} 
              className="text-base font-semibold text-foreground hover:text-[#FF6B81] transition-colors duration-300"
            >
              Services
            </a>
            <a 
              href="#booking-form" 
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('#booking-form');
              }} 
              className="text-base font-semibold text-foreground hover:text-[#FF6B81] transition-colors duration-300"
            >
              Book Appointment
            </a>
            <a 
              href="#doctor-profile" 
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('#doctor-profile');
              }} 
              className="text-base font-semibold text-white bg-[#FF6B81] hover:bg-[#ff5a72] px-4 py-2 rounded-full transition-colors duration-300"
            >
              About
            </a>
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

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            ref={menuRef}
            className="md:hidden bg-background/95 backdrop-blur-sm shadow-lg overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: 1, 
              height: 'auto',
              transition: { 
                duration: 0.3,
                ease: 'easeInOut'
              }
            }}
            exit={{ 
              opacity: 0, 
              height: 0,
              transition: { 
                duration: 0.2,
                ease: 'easeInOut'
              }
            }}
          >
            <nav className="flex flex-col items-center gap-4 p-6">
              {[
                { label: 'Home', href: '#' },
                { label: 'Services', href: '#services' },
                { label: 'Book Appointment', href: '#booking-form' },
                { label: 'About', href: '#doctor-profile', isHighlighted: true }
              ].map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.href);
                  }}
                  className={`w-full text-center text-lg font-semibold py-3 px-6 rounded-full transition-colors duration-300 ${
                    item.isHighlighted 
                      ? 'bg-[#FF6B81] text-white hover:bg-[#ff5a72]' 
                      : 'text-foreground/90 hover:text-[#FF6B81] hover:bg-muted/50'
                  }`}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ 
                    x: 0, 
                    opacity: 1,
                    transition: { 
                      delay: index * 0.1,
                      duration: 0.3,
                      ease: 'easeOut'
                    }
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}