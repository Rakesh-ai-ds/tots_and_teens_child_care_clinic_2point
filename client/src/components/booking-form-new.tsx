import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { bookingSchema as baseInsertAppointmentSchema } from "@shared/schema";
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

// Extend the base schema to include childAge
const extendedInsertAppointmentSchema = baseInsertAppointmentSchema.extend({
  childAge: z.coerce
    .number({
      required_error: "Child's age is required",
      invalid_type_error: "Age must be a number"
    })
    .int("Age must be a whole number")
    .min(0, 'Age must be at least 0')
    .max(11, 'Maximum age is 11 years')
    .default(0),
});

type ExtendedInsertAppointment = z.infer<typeof extendedInsertAppointmentSchema>;

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
    resolver: zodResolver(extendedInsertAppointmentSchema),
    defaultValues: {
      parentName: "",
      email: "",
      phone: "",
      childName: "",
      childAge: 0,
      serviceType: "",
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
        phone: data.phone || '',  
        childName: data.childName || '',
        childAge: data.childAge !== undefined ? `${data.childAge} years` : 'Not specified',
        serviceType: data.serviceType || 'General',
        preferredDate: data.preferredDate || 'Not specified',
        preferredTime: data.preferredTime || 'Not specified',
        additionalNotes: data.additionalNotes || ''
      };
      
      console.log('Sending booking request:', bookingData);
      
      // Use the apiRequest function which handles errors and headers
      const response = await apiRequest('POST', '/api', bookingData);
      return response;
    },
    onSuccess: () => {
      setIsSuccess(true);
      form.reset();
      toast({
        title: "Appointment booked!",
        description: "We've received your booking request. We'll get back to you soon.",
        variant: 'default',
      });
    },
    onError: (error: any) => {
      console.error('Booking error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to book appointment. Please try again.",
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: ExtendedInsertAppointment) => {
    console.log('Form submitted:', data);
    bookingMutation.mutate(data);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Appointment Requested!</h2>
        <p className="text-muted-foreground mb-6">
          We've received your booking request. Our team will contact you shortly to confirm your appointment.
        </p>
        <Button onClick={() => setIsSuccess(false)}>
          Book Another Appointment
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="parentName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-heading font-medium text-sm">
                  Parent/Guardian Name <span className="text-primary">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} className="p-3 rounded-lg border-2" />
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
                  Email <span className="text-primary">*</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="Enter your email" 
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
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-heading font-medium text-sm">
                  Phone Number
                </FormLabel>
                <FormControl>
                  <Input 
                    type="tel" 
                    placeholder="Enter your phone number" 
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
            name="childName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-heading font-medium text-sm">
                  Child's Name
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter child's name" 
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
            name="childAge"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel className="font-heading font-medium text-sm">
                  Child's Age (0-11 years) <span className="text-primary">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="Enter age"
                      min={0}
                      max={11}
                      step={1}
                      value={value === undefined ? '' : value}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        if (inputValue === '') {
                          onChange(undefined);
                          return;
                        }
                        const numValue = parseInt(inputValue, 10);
                        if (!isNaN(numValue)) {
                          onChange(Math.max(0, Math.min(11, numValue)));
                        }
                      }}
                      onKeyDown={(e) => {
                        if (['-', '+', 'e', 'E', '.'].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      className="p-3 rounded-lg border-2"
                      {...field}
                    />
                  </div>
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
                    <SelectTrigger className="p-3 rounded-lg border-2">
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
                      min={new Date().toISOString().split('T')[0]}
                      className="p-3 rounded-lg border-2 pr-10"
                      {...field}
                    />
                    <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </FormControl>
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
                  Preferred Time <span className="text-primary">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="p-3 rounded-lg border-2">
                      <SelectValue placeholder="Select a time slot" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="additionalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-heading font-medium text-sm">
                    Additional Notes
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any special requirements or notes..."
                      className="min-h-[100px] p-3 rounded-lg border-2"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="px-8 py-6 text-base font-medium rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={bookingMutation.isPending}
          >
            {bookingMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Booking...
              </>
            ) : (
              'Book Appointment'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
