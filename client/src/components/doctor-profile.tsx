import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, GraduationCap, Award } from "lucide-react";

const credentials = [
  "MBBS (Stanley Medical College)",
  "M.D. Paediatrics (GMKMCH, Salem)",
  "PGDDN (Developmental Neurology)",
  "PGDAP (Adolescent Paediatrics)",
];

const expertise = [
  "Child Specialist",
  "Child Developmental Neurologist",
  "Adolescent Pediatrician",
];

export function DoctorProfile() {
  return (
    <section className="py-12 md:py-20 bg-background" data-testid="section-doctor-profile">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
              Meet Dr. Amudhadevi S.
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Senior Assistant Professor of Paediatrics at Govt. Mohan Kumaramangalam Medical College
            </p>
          </div>

          <Card className="p-6 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1 flex flex-col items-center">
                <div className="h-40 w-40 md:h-48 md:w-48 rounded-full bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center mb-4">
                  <GraduationCap className="h-20 w-20 md:h-24 md:w-24 text-primary" />
                </div>
                <div className="text-center">
                  <h3 className="font-heading font-bold text-xl md:text-2xl text-foreground mb-2">
                    Dr. Amudhadevi S.
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">Paediatrician</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {expertise.map((exp, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {exp}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="mb-6">
                  <p className="text-base leading-relaxed text-foreground/90 mb-4">
                    Dr. Amudhadevi S. is a highly qualified Pediatrician and Child Specialist with{" "}
                    <span className="font-semibold text-primary">13 years of dedicated experience</span> in 
                    general and specialized child health. She is committed to ensuring the comprehensive 
                    well-being and developmental success of every child.
                  </p>
                  <p className="text-base leading-relaxed text-foreground/90">
                    Her dual role as Senior Assistant Professor ensures the clinic provides care based on 
                    the latest medical research and highest ethical standards.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="h-5 w-5 text-secondary" />
                    <h4 className="font-heading font-semibold text-lg text-foreground">
                      Education & Qualifications
                    </h4>
                  </div>
                  <ul className="space-y-3">
                    {credentials.map((credential, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-[hsl(var(--success))] flex-shrink-0 mt-0.5" />
                        <span className="text-sm md:text-base text-foreground/90">{credential}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
