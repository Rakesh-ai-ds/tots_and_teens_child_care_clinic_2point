import { AnimatedSection } from "@/components/animated-section";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Services } from "@/components/services";
import { BookingForm } from "@/components/booking-form";
import { DoctorProfile } from "@/components/doctor-profile";
import { ClinicInfo } from "@/components/clinic-info";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { MapPin } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <AnimatedSection><Hero /></AnimatedSection>
        <AnimatedSection><ClinicInfo /></AnimatedSection>
        <AnimatedSection><Services /></AnimatedSection>
        <AnimatedSection><DoctorProfile /></AnimatedSection>
        <AnimatedSection><BookingForm /></AnimatedSection>
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-8 text-foreground">
              Find Us on Map
            </h2>
            <div className="max-w-5xl mx-auto rounded-lg overflow-hidden shadow-lg">
              <iframe
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.246!2d78.14553863466013!3d11.661672684748126!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDM5JzQyLjAiTiA3OMKwMDgnNDMuOSJF!5e0!3m2!1sen!2sin!4v1637923888000!5m2!1sen!2sin&z=17`}
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Tots & Teens Child Care Clinic Location"
                className="w-full"
                aria-label="Map showing the exact location of Tots and Teens Child Care Clinic"
              />
            </div>
            <div className="text-center mt-6">
              <a
                href="https://maps.app.goo.gl/VRcDfqYDeK7Xn7Ud6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-[#FF3366] hover:bg-[#FF1A4D] shadow-md hover:shadow-lg transition-all duration-300"
              >
                <MapPin className="h-5 w-5 mr-2" />
                View larger map
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <WhatsAppButton />
      <Footer />
    </div>
  );
}
