import { AnimatedSection } from "@/components/animated-section";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { QuickInfo } from "@/components/quick-info";
import { Services } from "@/components/services";
import { BookingForm } from "@/components/booking-form";
import { DoctorProfile } from "@/components/doctor-profile";

import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <AnimatedSection><Hero /></AnimatedSection>
        <AnimatedSection><QuickInfo /></AnimatedSection>
        <AnimatedSection><Services /></AnimatedSection>
        <AnimatedSection><BookingForm /></AnimatedSection>
        <AnimatedSection><DoctorProfile /></AnimatedSection>
      </main>
      
      <WhatsAppButton />
      <Footer />
    </div>
  );
}
