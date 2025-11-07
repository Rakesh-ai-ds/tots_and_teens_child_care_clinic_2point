import { motion } from "framer-motion";
import { SocialMediaBar } from "@/components/social-media-bar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, GraduationCap, Award, BookOpen, HeartPulse } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from 'react';

const credentials = [
  "MBBS (Stanley Medical College)",
  "M.D. Paediatrics (GMKMCH, Salem)",
  "Post Graduate Diploma in Developmental Neurology (Kerala University, Thiruvananthapuram)",
  "Post Graduate Diploma in Adolescent Paediatrics (Kerala University, Thiruvananthapuram)",
];

const expertise = [
  "Child Specialist",
  "Child Developmental Neurologist",
  "Adolescent Pediatrician",
];

const achievements = [
  "13+ years of clinical experience in pediatric care",
  "Published research in national pediatric journals",
  "Regular speaker at pediatric conferences",
  "Mentored 50+ medical students and residents"
];

export function DoctorProfile() {
  const [isMapActive, setMapActive] = useState(false);

  return (
    <section id="doctor-profile" className="py-12 md:py-20 bg-background scroll-mt-20" data-testid="section-doctor-profile">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
              <span className="md:inline">Meet</span> <span className="block md:inline">Dr. Amudhadevi S</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Senior Assistant Professor of Paediatrics at Govt. Mohan Kumaramangalam Medical College
            </p>
          </div>

          <Card className="p-6 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1 flex flex-col items-center">
                <img src="/WhatsApp Image 2025-10-26 at 20.24.23_823e7c40.jpg" alt="Dr. Amudhadevi S." className="h-40 w-40 md:h-48 md:w-48 rounded-full object-cover mb-4" />
                <div className="text-center">
                  <h3 className="font-heading font-bold text-xl md:text-2xl text-foreground mb-2">
                    Dr. Amudhadevi S
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">Paediatrician</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {expertise.map((exp, index) => (
                      <Badge key={index} variant="accent" className="text-xs">
                        {exp}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="mb-6">
                  <p className="text-base leading-relaxed text-foreground/90 mb-4">
                    Dr. Amudhadevi S is a highly qualified Pediatrician and Child Specialist with{" "}
                    <span className="font-semibold text-primary">13 years of dedicated experience</span> in 
                    general and specialized child health. She is committed to ensuring the comprehensive 
                    well-being and developmental success of every child.
                  </p>
                  <p className="text-base leading-relaxed text-foreground/90">
                    Her dual role as Senior Assistant Professor ensures the clinic provides care based on 
                    the latest medical research and highest ethical standards.
                  </p>
                </div>

                <div className="space-y-8">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Award className="h-5 w-5 text-secondary" />
                      <h4 className="font-heading font-semibold text-lg text-foreground">
                        Education & Qualifications
                      </h4>
                    </div>
                    <ul className="space-y-3 mb-6">
                      {credentials.map((credential, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-[hsl(var(--success))] flex-shrink-0 mt-0.5" />
                          <span className="text-sm md:text-base text-foreground/90">{credential}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <HeartPulse className="h-5 w-5 text-secondary" />
                      <h4 className="font-heading font-semibold text-lg text-foreground">
                        Professional Achievements
                      </h4>
                    </div>
                    <ul className="space-y-3 mb-6">
                      {achievements.map((achievement, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <BookOpen className="h-5 w-5 text-[hsl(var(--success))] flex-shrink-0 mt-0.5" />
                          <span className="text-sm md:text-base text-foreground/90">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
