import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { bookingSchema as baseInsertAppointmentSchema } from "@shared/schema";
import toast from 'react-hot-toast';
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
import { Loader2, CheckCircle2 } from "lucide-react";

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

export function BookingFormFixed() {
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
                  <Input 
                    placeholder="Enter your name" 
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
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-heading font-medium text-sm">
                  Child's Age (0-11 years)
                </FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    min={0}
                    max={11}
                    placeholder="Enter child's age"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === '' ? '' : Number(value));
                    }}
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
                  Service Type
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
                  Preferred Date
                </FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    min={new Date().toISOString().split('T')[0]}
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
            name="preferredTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-heading font-medium text-sm">
                  Preferred Time
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
        </div>

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

        <Button 
          type="submit" 
          className="w-full py-6 text-lg font-medium"
          disabled={bookingMutation.isPending}
        >
          {bookingMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Book Appointment'
          )}
        </Button>
      </form>
    </Form>
  );
}
