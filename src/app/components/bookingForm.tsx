"use client";

import { bookingSchema } from "@/lib/validation/bookingSchema";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { toast, ToastContainer } from "react-toastify";
import z from "zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
// Minimal Type Definitions for Razorpay
interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayErrorResponse {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: unknown;
  };
}

// Renamed to avoid global conflict if any
interface AppointorRazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact?: string;
  };
  theme: {
    color: string;
  };
}

// Remove global declaration to avoid merge conflicts
// declare global { ... }

type BookingFormProps = {
  serviceId: string;
  serviceName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  slug: string;
  price: number;
};

// This was the original export, we wrap it to include the script
export default function BookingForm(props: BookingFormProps) {
  return (
    <>
      <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      <BookingFormContent {...props} />
    </>
  );
}

function BookingFormContent({
  serviceId,
  serviceName,
  date,
  time,
  slug,
  price,
}: BookingFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNo: "",
  });


  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Client-only schema (NO file here)
  const clientSchema = useMemo(
    () =>
      z.object({
        name: bookingSchema.shape.name,
        email: bookingSchema.shape.email,
        phoneNo: bookingSchema.shape.phoneNo.optional(),
      }),
    []
  );

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 2️⃣ Validate form fields
    const parsed = clientSchema.safeParse(formData);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        fieldErrors[String(i.path[0])] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    
    try {
        // 1. Create Razorpay Order
        const orderRes = await fetch("/api/payment/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ serviceId }),
        });
        
        const orderData = await orderRes.json();
        
        if (!orderRes.ok) {
            throw new Error(orderData.error || "Failed to initiate payment");
        }

        // 2. Open Razorpay Checkout
        const options: AppointorRazorpayOptions = {
            key: orderData.keyId,
            amount: orderData.amount,
            currency: orderData.currency,
            name: "Appointor Booking", 
            description: `Booking for ${serviceName}`,
            order_id: orderData.orderId,
            handler: async function (response: RazorpayResponse) {
                // Payment Success! Now confirm booking
                await confirmBooking(response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature);
            },
            prefill: {
                name: formData.name,
                email: formData.email,
                contact: formData.phoneNo,
            },
            theme: {
                color: "#000000",
            },
        };

        // Use 'any' cast for window to access Razorpay constructor without conflict
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rzp1 = new (window as any).Razorpay(options);
        
        rzp1.on('payment.failed', function (response: RazorpayErrorResponse){
             toast.error(response.error.description || "Payment Failed");
             setIsSubmitting(false);
        });
        rzp1.open();

    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      toast.error(errorMessage);
      setIsSubmitting(false);
    } 
  };
  
  const confirmBooking = async (paymentId: string, orderId: string, signature: string) => {
      try {
        const startTime = new Date(`${date}T${time}`).toISOString();

        const payload = {
            ...formData,
            serviceId,
            startTime,
            paymentId,
            orderId,
            signature // Send signature for server verification
        };
  
        // 8️⃣ Send to API
        const res = await fetch("/api/public/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
  
        const data = await res.json();
  
        if (!res.ok) {
            throw new Error(data?.error || "Booking confirmation failed");
        }
  
        toast.success("Booking submitted!");
        router.push(
            `/app/${slug}/checkout/booking-summary/${data.cancellationLinkUuid}`
        );
      } catch(err: unknown) {
          console.error(err);
          const errorMessage = err instanceof Error ? err.message : "Booking failed after payment";
          toast.error(errorMessage);
      } finally {
          setIsSubmitting(false);
      }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Contact Information</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label className="text-slate-400">Full Name</Label>
            <Input
              className="bg-zinc-950 border-zinc-800 text-white focus:border-rose-500"
              value={formData.name}
              onChange={(e) =>
                handleInputChange("name", e.target.value)
              }
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <Label className="text-slate-400">Email</Label>
            <Input
              className="bg-zinc-950 border-zinc-800 text-white focus:border-rose-500"
              type="email"
              value={formData.email}
              onChange={(e) =>
                handleInputChange("email", e.target.value)
              }
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <Label className="text-slate-400">Phone Number</Label>
            <Input
              className="bg-zinc-950 border-zinc-800 text-white focus:border-rose-500"
              type="tel"
              value={formData.phoneNo}
              onChange={(e) =>
                handleInputChange("phoneNo", e.target.value)
              }
            />
          </div>


        </CardContent>
      </Card>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-rose-600 text-white py-6 text-lg hover:bg-rose-700 shadow-lg shadow-rose-900/20"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting…
          </>
        ) : (
          price > 0 ? `Pay ₹${price} & Book` : "Confirm Booking"
        )}
      </Button>

      <ToastContainer />
    </form>
  );
}
