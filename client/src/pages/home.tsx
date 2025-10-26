import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { QuickInfo } from "@/components/quick-info";
import { Services } from "@/components/services";
import { BookingForm } from "@/components/booking-form";
import { DoctorProfile } from "@/components/doctor-profile";
import { SocialMediaBar } from "@/components/social-media-bar";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <QuickInfo />
        <Services />
        <BookingForm />
        <DoctorProfile />
      </main>
      <SocialMediaBar />
      <Footer />
    </div>
  );
}
