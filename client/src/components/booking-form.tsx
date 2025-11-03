import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { insertAppointmentSchema as baseInsertAppointmentSchema, type InsertAppointment } from "@shared/schema";
// Using react-hot-toast for notifications
import toast from 'react-hot-toast';

// Simple toast wrapper to match the expected interface
const useToast = () => ({
  toast: (data: { 
    title: string; 
    description?: string; 
    variant?: 'default' | 'destructive' 
  }) => {
    const message = data.description ? `${data.title}: ${data.description}` : data.title;
    if (data.variant === 'destructive') {
      toast.error(message, { duration: 5000 });
    } else {
      toast.success(message, { duration: 5000 });
    }
  }
});

// Extend the base schema to include childMonths
const extendedInsertAppointmentSchema = baseInsertAppointmentSchema.extend({
  childMonths: z.coerce.number().min(0).max(11).default(0),
});

type ExtendedInsertAppointment = InsertAppointment & {
  childMonths: number;
};
import { apiRequest } from "@/lib/queryClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, CheckCircle2, Calendar } from "lucide-react";

const serviceTypes = [
  "General Pediatrics",
  "Developmental Intervention",
  "Adolescent Health",
  "Vaccination Services",
];

const timeSlots = [
  "6:00 PM - 6:30 PM",
  "6:30 PM - 7:00 PM",
  "7:00 PM - 7:30 PM",
  "7:30 PM - 8:00 PM",
];

export function BookingForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<ExtendedInsertAppointment>({
    resolver: zodResolver(extendedInsertAppointmentSchema) as any,
    defaultValues: {
      parentName: "",
      childName: "",
      childAge: 0,
      childMonths: 0,
      phoneNumber: "",
      email: "",
      serviceType: "General Pediatrics",
      preferredDate: "",
      preferredTime: "",
      additionalNotes: "",
    },
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: ExtendedInsertAppointment) => {
      // Prepare the data for the API
      const bookingData = {
        parentName: data.parentName,
        email: data.email,
        phoneNumber: data.phoneNumber || '',
        childName: data.childName || '',
        childAge: data.childMonths ? `${data.childMonths} months` : '',
        serviceType: data.serviceType || 'General',
        preferredDate: data.preferredDate || 'Not specified',
        preferredTime: data.preferredTime || 'Not specified',
        additionalNotes: data.additionalNotes || ''
      };
      
      console.log('Sending booking request:', bookingData);
      
      // Use the apiRequest function which handles errors and headers
      const response = await apiRequest('POST', '/api/appointments', bookingData);
      return await response.json();
    },
    onSuccess: (data) => {
      console.log('Booking successful:', data);
      setIsSuccess(true);
      
      // Reset form on success
      form.reset({
        parentName: '',
        childName: '',
        childMonths: 0,
        phoneNumber: '',
        email: '',
        serviceType: 'General Pediatrics',
        preferredDate: '',
        preferredTime: '',
        additionalNotes: '',
      });
      
      // Show success message
      toast({
        title: 'Success!',
        description: 'Your appointment has been booked successfully.',
      });
      
      // Scroll to the booking form section
      const bookingSection = document.getElementById("booking-form");
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      
      // Reset success state after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    },
    onError: (error: Error) => {
      console.error('Booking error:', error);
      
      let errorMessage = error.message || 'Failed to book appointment. Please try again.';
      
      // Handle specific error cases
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Failed to connect to the server. Please check your internet connection.';
      } else if (error.message.includes('400')) {
        errorMessage = 'Invalid request. Please check your input and try again.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      toast({
        title: 'Booking Failed',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  });

  const onSubmit: SubmitHandler<ExtendedInsertAppointment> = (data) => {
    // Convert to the format expected by the API
    const { childMonths, ...apiData } = data;
    // Include childMonths in the API data
    bookingMutation.mutate({
      ...apiData,
      childMonths: childMonths || 0 // Ensure we always send a number
    } as ExtendedInsertAppointment);
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const handleDateChange = (date: string, onChange: (value: string) => void) => {
    if (!date) {
      onChange(date);
      return;
    }
    
    const selectedDate = new Date(date + 'T00:00:00');
    const dayOfWeek = selectedDate.getDay();
    
    if (dayOfWeek === 0) {
      toast({
        title: "Clinic Closed on Sunday",
        description: "Please select a date between Monday and Saturday.",
        variant: "destructive",
      });
      onChange("");
      return;
    }
    
    onChange(date);
  };

  return (
    <section id="booking-form" className="py-12 md:py-20 bg-muted/30 scroll-mt-20" data-testid="section-booking-form">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Book Your Appointment
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Fill out the form below and we'll get back to you with a confirmation
          </p>
        </div>

        <Card className="max-w-2xl mx-auto p-6 md:p-10 shadow-lg">
          {isSuccess ? (
            <div className="text-center py-12" data-testid="success-message">
              <CheckCircle2 className="h-16 w-16 text-[hsl(var(--success))] mx-auto mb-4" />
              <h3 className="font-heading font-semibold text-2xl text-foreground mb-2">
                Appointment Booked!
              </h3>
              <p className="text-muted-foreground mb-6">
                Check your email for confirmation details.
              </p>
              <Button onClick={() => setIsSuccess(false)} data-testid="button-book-another">
                Book Another Appointment
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="parentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-heading font-medium text-sm">
                        Parent/Guardian Name <span className="text-primary">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your full name" 
                          {...field} 
                          className="p-3 rounded-lg border-2" data-testid="input-parent-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="childName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-heading font-medium text-sm">
                        Child's Name <span className="text-primary">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter child's full name" 
                          {...field}
                          className="p-3 rounded-lg border-2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="childAge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-heading font-medium text-sm">
                          Child's Age <span className="text-primary">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              placeholder="0" 
                              type="number"
                              min="0"
                              step="1"
                              onKeyDown={(e) => {
                                if (['-', '+', 'e', 'E', '.'].includes(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                              {...field}
                              onChange={(e) => {
                                const value = parseInt(e.target.value);
                                if (!isNaN(value) && value >= 0) {
                                  field.onChange(value);
                                } else if (e.target.value === '') {
                                  field.onChange('');
                                }
                              }}
                              className="p-3 rounded-lg border-2 pr-10"
                              data-testid="input-child-years"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                              {field.value === 1 ? 'year' : 'years'}
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="childMonths"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-heading font-medium text-sm">
                          &nbsp;
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              placeholder="0" 
                              type="number"
                              min="0"
                              max="11"
                              step="1"
                              onKeyDown={(e) => {
                                if (['-', '+', 'e', 'E', '.'].includes(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                              {...field}
                              value={field.value || ''}
                              onChange={(e) => {
                                let value = parseInt(e.target.value);
                                if (isNaN(value)) {
                                  field.onChange(0);
                                  return;
                                }
                                // Ensure months are between 0 and 11
                                value = Math.min(11, Math.max(0, value));
                                field.onChange(value);
                              }}
                              className="p-3 rounded-lg border-2 pr-10"
                              data-testid="input-child-months"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                              {(!field.value || field.value === 1) ? 'month' : 'months'}
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-heading font-medium text-sm">
                        Phone Number <span className="text-primary">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="tel" 
                          placeholder="10 digit mobile number" 
                          {...field}
                          className="p-3 rounded-lg border-2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-heading font-medium text-sm">
                        Email Address <span className="text-primary">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="your.email@example.com" 
                          {...field}
                          className="p-3 rounded-lg border-2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="serviceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-heading font-medium text-sm">
                        Service Type <span className="text-primary">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="p-3 rounded-lg border-2" data-testid="select-service">
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {serviceTypes.map((service) => (
                            <SelectItem key={service} value={service}>
                              {service}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preferredDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-heading font-medium text-sm">
                        Preferred Date <span className="text-primary">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type="date" 
                            value={field.value}
                            onChange={(e) => handleDateChange(e.target.value, field.onChange)}
                            min={getMinDate()}
                            className="p-3 rounded-lg border-2"
                          />
                          <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                        </div>
                      </FormControl>
                      <p className="text-xs text-muted-foreground mt-1">Clinic closed on Sundays</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preferredTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-heading font-medium text-sm">
                        Preferred Time Slot <span className="text-primary">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="p-3 rounded-lg border-2" data-testid="select-time">
                            <SelectValue placeholder="Select a time slot" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="additionalNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-heading font-medium text-sm">
                        Additional Notes (Optional)
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any specific concerns or questions?" 
                          {...field}
                          className="rounded-lg border-2 min-h-24"
                          data-testid="textarea-notes"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full px-12 py-6 text-lg font-heading font-medium rounded-full shadow-lg"
                  disabled={bookingMutation.isPending}
                  data-testid="button-submit-booking"
                >
                  {bookingMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Booking...
                    </>
                  ) : (
                    "Book Appointment Now"
                  )}
                </Button>
              </form>
            </Form>
          )}
        </Card>
      </div>
    </section>
  );
}
