import React from "react";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AvailabilitySelector } from "@/app/components/AvailabilitySelector";
import { Button } from "@/app/components/ui/button";

interface BookingPageProps {
  params: Promise<{
    slug: string; // We get slug from the folder
    id: string;   // We get id from the folder
  }>;
}

export default async function SlotSelectionPage({ params }: BookingPageProps) {
  const { id, slug } = await params; // Await params in Next 15
  
  const supabase = await createClient();
  const { data: service, error } = await supabase
    .from("services")
    .select("id, name, duration_minutes, price")
    .eq("id", id)
    .single();

  if (error || !service) notFound();

  return (
    <div className="min-h-screen bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-6xl w-full">
        {/* Navigation */}
        <div className="mb-8">
          <Link href={`/app/${slug}/services`} className="inline-flex items-center text-slate-400 hover:text-white transition-colors">
            <span className="mr-2">←</span> Back to Sessions
          </Link>
        </div>

        <div className="bg-zinc-900 rounded-[2rem] shadow-2xl border border-zinc-800 overflow-hidden grid lg:grid-cols-3 min-h-[600px]">
           {/* Left Panel: Service Details */}
           <div className="bg-black text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-20 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-600 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 opacity-20 pointer-events-none"></div>
              
              <div className="relative z-10">
                  <h2 className="text-slate-400 font-medium tracking-wide uppercase text-sm mb-4">Service Details</h2>
                  <h1 className="text-4xl font-extrabold mb-6 leading-tight">{service.name}</h1>
                  
                  <div className="space-y-6">
                      <div className="flex items-start gap-4">
                          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                             <div className="w-6 h-6 flex items-center justify-center font-bold">₹</div>
                          </div>
                          <div>
                              <p className="text-slate-400 text-sm">Price</p>
                              <p className="text-2xl font-bold">₹{service.price}</p>
                          </div>
                      </div>

                      <div className="flex items-start gap-4">
                          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                             <div className="w-6 h-6 flex items-center justify-center font-bold">🕒</div>
                          </div>
                          <div>
                              <p className="text-slate-400 text-sm">Chair Time</p>
                              <p className="text-xl font-bold">{service.duration_minutes} Minutes</p>
                          </div>
                      </div>
                  </div>
              </div>

              <div className="relative z-10 mt-12 pt-8 border-t border-white/10">
                  <p className="text-slate-400 text-sm italic">
                    &quot;Select a time that works best for you. We look forward to meeting you.&quot;
                  </p>
              </div>
           </div>

           {/* Right Panel: Calendar & Slots */}
           <div className="lg:col-span-2 p-6 md:p-12 bg-zinc-900">
               <h2 className="text-2xl font-bold text-white mb-6">Select a Date & Time</h2>
               <AvailabilitySelector
                  serviceId={service.id}
                  serviceName={service.name}
                  durationMinutes={service.duration_minutes}
                  price={service.price}
                  slug={slug}
                />
           </div>
        </div>
      </div>
    </div>
  );
}