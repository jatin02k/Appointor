import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import z from "zod";
import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import BookingForm from "@/app/components/bookingForm";


export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ serviceId?: string; date?: string; time?: string }>;
}) {
  const { slug } = await params;
  const paramsSchema = z.object({
    serviceId: z.uuid().optional(),
    date: z.string().optional(), // YYYY-MM-DD (we will pass-through to client validation)
    time: z.string().optional(), // HH:mm (24h)
  });
  const resolvedSearchParams = await searchParams; // Await params in Next 15promise

  const parsed = paramsSchema.safeParse(resolvedSearchParams);

  // Create a CLEAN object that only contains plain strings/values
  const serviceId = parsed.success ? parsed.data.serviceId ?? "" : "";
  const bookingDate = parsed.success ? parsed.data.date ?? "" : "";
  const bookingTime = parsed.success ? parsed.data.time ?? "" : "";

  const supabase = await createClient();
  const { data: serviceData, error: serviceError } = await supabase
    .from("services")
    .select(`
      name, 
      price, 
      duration_minutes,
      organizations (
        name,
        email
      )
    `)
    .eq("id", serviceId)
    .single();

  if (!serviceId || !serviceData || serviceError) {
    notFound();
  }

  // Extract QR Code URL safely


  return (
    <div className="min-h-screen pt-20 pb-16 bg-zinc-950">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href={`/app/${slug}/book/${serviceId}`}>
            <Button
              variant="outline"
              className="mb-4 border-zinc-700 bg-black text-slate-300 hover:bg-zinc-800 hover:text-white hover:border-zinc-500 transition-colors"
            >
              ← Back to Time Selection
            </Button>
          </Link>

          <h1 className="text-3xl md:text-4xl text-white mb-2 tracking-tight">
            Complete Your Booking
          </h1>
          <p className="text-xl text-slate-400">
            Just a few details and you are all set!
          </p>
        </div>

        <div className="space-y-8">
          {/* Booking Summary */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Service:</span>
                  <span className="text-white font-medium">{serviceData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date:</span>
                  <span className="text-white font-medium">
                    {(() => {
                      const dateObj = bookingDate
                        ? new Date(bookingDate)
                        : null;
                      return dateObj && !isNaN(dateObj.getTime())
                        ? dateObj.toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                        : bookingDate;
                    })()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Time:</span>
                  <span className="text-white font-medium">{bookingTime}</span>
                </div>
                <div className="flex justify-between border-t border-zinc-800 pt-3">
                  <span className="text-white font-bold">Total:</span>
                  <span className="text-xl text-rose-500 font-bold">
                    ₹{serviceData.price}
                  </span>
                </div>
              </div>
              {/* QR Code Display Section */}

            </CardContent>
          </Card>

          {/* Contact Information Form */}
          <BookingForm
            serviceId={String(serviceId)}
            serviceName={serviceData.name}
            time={String(bookingTime)}
            date={String(bookingDate)}
            slug={slug}
            price={serviceData.price}
          />
        </div>
      </div>
    </div>
  );
}
