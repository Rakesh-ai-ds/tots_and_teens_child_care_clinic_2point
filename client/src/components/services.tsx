import { Card } from "@/components/ui/card";
import { Stethoscope, Brain, Users2, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useRef } from "react";

const services = [
  {
    icon: Stethoscope,
    title: "General Pediatrics",
    items: [
      "Regular Health Check-up",
      "Growth Monitoring",
      "Routine illness.",
      "Nutritional Guidance."
    ],
    image: null
  },
  {
    icon: Shield,
    title: "Vaccination Services",
    description: "Complete vaccination schedule administered safely and responsibly. Protecting your child's health with immunizations at every stage.",
    image: null
  },
  {
    icon: Users2,
    title: "Adolescent Health",
    prefix: "Confidential Consultation for",
    items: [
      "Physical health",
      "Behavioral issues",
      "Academic performance",
      "Digital deaddiction",
      "Obesity management."
    ],
    image: null
  },
  {
    icon: Brain,
    title: "Developmental Intervention",
    description: "Early identification & intervention for developmental delay. Specialized care for speech delay, autism, ADHD, and learning disabilities.",
    image: null
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
      className="py-16 md:py-24 bg-gradient-to-b from-background to-gray-50/50 scroll-mt-20"
      data-testid="section-services"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div 
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="inline-block text-sm font-semibold text-[#FF6B81] mb-3 tracking-wider">OUR SERVICES</span>
          <h2 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            Expert Care for Your Child
          </h2>
          <div className="w-24 h-1.5 bg-[#FF6B81] mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Comprehensive pediatric care designed to support your child's health and development at every stage
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
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
                  className="p-0 overflow-hidden transition-all duration-300 cursor-default h-full hover:shadow-xl border border-gray-100 hover:border-[#FF6B81]/30 flex flex-col group bg-white"
                  data-testid={`card-service-${index}`}
                >
                  
                  <div className="p-6 md:p-8 flex-1 flex flex-col">
                    <div className="flex items-start mb-3">
                      <div className="h-12 w-12 rounded-full bg-[#FF6B81]/10 flex items-center justify-center flex-shrink-0 mr-4 mt-1">
                        <Icon className="h-6 w-6 text-[#FF6B81]" />
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-xl md:text-2xl text-foreground">
                          {service.title}
                        </h3>
                        {service.items ? (
                          <div className="text-gray-600 leading-relaxed mt-2">
                            {service.prefix && (
                              <p className="mb-2">{service.prefix}</p>
                            )}
                            <ul className="space-y-1.5 list-none">
                              {service.items.map((item, idx) => (
                                <li key={idx} className="flex items-center">
                                  <span className="text-[#FF6B81] mr-2 flex-shrink-0">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <p className="text-gray-600 leading-relaxed mt-2">
                            {service.description}
                          </p>
                        )}
                      </div>
                    </div>
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
