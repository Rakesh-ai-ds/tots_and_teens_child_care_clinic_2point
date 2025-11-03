import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { bookingSchema as baseInsertAppointmentSchema } from "@shared/schema";
import toast from 'react-hot-toast';

// Extend the base schema to include childAge
const extendedInsertAppointmentSchema = baseInsertAppointmentSchema.extend({
  childAge: z.coerce
    .number()
    .int()
    .min(0, 'Age must be at least 0')
    .max(11, 'Maximum age is 11 years')
    .default(0),
});

type ExtendedInsertAppointment = z.infer<typeof extendedInsertAppointmentSchema>;

// Import UI components
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

export function BookingForm() {
  const [isSuccess, setIsSuccess] = useState(false);
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
      return await response.json();
    },
    onSuccess: () => {
      setIsSuccess(true);
      form.reset({
        parentName: '',
        phone: '',
        childName: '',
        email: '',
        childAge: 0,
        serviceType: 'General',
        preferredDate: '',
        preferredTime: '',
        additionalNotes: ''
      });
      toast.success('Appointment booked successfully!');
    },
    onError: (error: any) => {
      console.error('Booking error:', error);
      toast.error(error.message || 'Failed to book appointment');
    }
  });

  const onSubmit = (data: ExtendedInsertAppointment) => {
    bookingMutation.mutate(data);
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Appointment Booked Successfully!</h2>
          <p className="mb-6">Thank you for booking an appointment. We'll be in touch soon to confirm the details.</p>
          <Button onClick={() => setIsSuccess(false)}>Book Another Appointment</Button>
        </Card>
      </div>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <Card className="p-6 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Book an Appointment</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="parentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Parent's Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter parent's name"
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
                      <FormLabel className="font-medium">Email *</FormLabel>
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
                      <FormLabel className="font-medium">Phone Number *</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="Enter phone number"
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
                      <FormLabel className="font-medium">Child's Name *</FormLabel>
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
                      <FormLabel className="font-medium">Child's Age (0-11 years) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          max={11}
                          placeholder="Enter age"
                          {...field}
                          value={field.value === undefined ? '' : field.value}
                          onChange={(e) => {
                            const value = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                            field.onChange(isNaN(value) ? 0 : value);
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
                      <FormLabel className="font-medium">Service Type *</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full p-3 rounded-lg border-2"
                        >
                          <option value="">Select a service</option>
                          <option value="General Checkup">General Checkup</option>
                          <option value="Vaccination">Vaccination</option>
                          <option value="Dental Checkup">Dental Checkup</option>
                          <option value="Vision Test">Vision Test</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preferredDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Preferred Date *</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
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
                      <FormLabel className="font-medium">Preferred Time *</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          className="p-3 rounded-lg border-2"
                        />
                      </FormControl>
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
                    <FormLabel className="font-medium">Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any special requirements or notes..."
                        {...field}
                        className="min-h-[100px] p-3 rounded-lg border-2"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full py-6 text-lg"
                disabled={bookingMutation.isPending}
              >
                {bookingMutation.isPending ? 'Booking...' : 'Book Appointment'}
              </Button>
            </form>
          </Form>
        </Card>
      </div>
    </section>
  );
}
