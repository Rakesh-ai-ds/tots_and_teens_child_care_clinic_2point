import { Card } from "@/components/ui/card";
import { Stethoscope, Brain, Users2, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useRef } from "react";

const services = [
  {
    icon: Stethoscope,
    title: "General Pediatrics",
    description: "Comprehensive infant & child health checkups for routine illness, preventative health, and nutritional guidance. Full range of vaccination services.",
  },
  {
    icon: Brain,
    title: "Developmental Intervention",
    description: "Early identification & intervention for developmental delay. Specialized care for speech delay, autism, ADHD, and learning disabilities.",
  },
  {
    icon: Users2,
    title: "Adolescent Health",
    description: "Confidential consultation covering physical health, behavioral issues, academic performance improvement, digital deaddiction, and weight management.",
  },
  {
    icon: Shield,
    title: "Vaccination Services",
    description: "Complete vaccination schedule administered safely and responsibly. Protecting your child's health with immunizations at every stage.",
  },
];

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  }),
  hover: {
    y: -5,
    transition: { duration: 0.2 }
  }
};

export function Services() {
  const [sectionRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Fix for heading being hidden under header
  useEffect(() => {
    const handleHashNavigation = () => {
      if (typeof window === 'undefined') return;
      
      const section = document.getElementById('services');
      if (section && window.location.hash === '#services') {
        const headerHeight = 80; // Adjust this value based on your header height
        const scrollPosition = section.offsetTop - headerHeight;
        
        window.scrollTo({
          top: scrollPosition,
          behavior: 'smooth'
        });
      }
    };

    // Run once on mount
    handleHashNavigation();
    
    // Also handle hash changes
    window.addEventListener('hashchange', handleHashNavigation);
    return () => window.removeEventListener('hashchange', handleHashNavigation);
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="services" 
      className="py-16 md:py-24 bg-background scroll-mt-20"
      data-testid="section-services"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div 
          className="text-center mb-12 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Our Services
          </h2>
          <div className="w-20 h-1 bg-[#FF6B81] mx-auto mb-6 rounded-full"></div>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive pediatric care tailored to every stage of your child's development
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                custom={index}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                variants={itemVariants}
                whileHover="hover"
              >
                <Card 
                  className="p-6 md:p-8 transition-all duration-300 cursor-default h-full hover:shadow-lg border-2 border-transparent hover:border-[#FF6B81]/20"
                  data-testid={`card-service-${index}`}
                >
                  <div className="flex flex-col items-center text-center gap-4">
                    <motion.div 
                      className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-[#FF6B81]/10 flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Icon className="h-8 w-8 md:h-10 md:w-10 text-[#FF6B81]" />
                    </motion.div>
                    <h3 className="font-heading font-semibold text-xl md:text-2xl text-foreground">
                      {service.title}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
