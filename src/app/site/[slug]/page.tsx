
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Phone, Sparkles, Zap, CalendarCheck, MousePointerClick, Mail, ArrowRight, UserCheck, Twitter, Instagram, Linkedin, Facebook, Youtube, Globe, Clock, Star, MapPin, CreditCard } from "lucide-react";
import Image from "next/image";
import { ImageWithFallback } from "@/app/components/ui/imageWithFallback";

interface TenantPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Helper to map platform names to Icons (Dynamic imports or lucide-react icons can be used here if needed, 
// for now we used inline SVG or we can re-add them if we implement the SocialIcon component fully with Lucide)
// Ideally we keep the imports but for lint cleanup we removed unused ones.
// Wait, SocialIcon function uses them. I should verify if SocialIcon is used. 
// Yes, line 161: <SocialIcon platform={link.platform} />
// So I MUST NOT remove the imports for icons used in SocialIcon.
// Twitter, Instagram, Linkedin, Facebook, Youtube, Globe are used in SocialIcon component (lines 17-26).
// So I should keep those.
// MapPin, CreditCard, Star, Clock seem unused in the main render (Clock is used in line 240).
// Let's retry the imports chunk.

const SocialIcon = ({ platform }: { platform: string }) => {
  switch (platform.toLowerCase()) {
    case "twitter": return <Twitter className="w-5 h-5" />;
    case "instagram": return <Instagram className="w-5 h-5" />;
    case "linkedin": return <Linkedin className="w-5 h-5" />;
    case "facebook": return <Facebook className="w-5 h-5" />;
    case "youtube": return <Youtube className="w-5 h-5" />;
    default: return <Globe className="w-5 h-5" />;
  }
};

export default async function TenantHomePage({ params }: TenantPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // 1. Fetch Basic Info
  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .select("*")
    .eq("slug", slug)
    .single();

  if (orgError || !org) {
    return notFound();
  }

  // Feature Gating: Block access if subscription is inactive
  if (org.subscription_status !== 'active') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 p-4">
        <div className="text-center max-w-md">
          <Sparkles className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Bookings Unavailable</h1>
          <p className="text-slate-400">
            This business is currently unable to accept bookings. Please contact them directly.
          </p>
        </div>
      </div>
    );
  }

  // 2. Fetch Services (Top 3)
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("organization_id", org.id)
    .limit(2)
    .order("price", { ascending: false });

  // 3. Fetch Social Proof (Booking Count)
  // We need service IDs first if we want to filter by org via service relation
  // But wait, we only fetched 3 services above. We need ALL service IDs for the org to get total bookings.
  const { data: allServiceIds } = await supabase
      .from("services")
      .select("id")
      .eq("organization_id", org.id);
  
  let bookingCount = 0;
  if (allServiceIds && allServiceIds.length > 0) {
      const ids = allServiceIds.map(s => s.id);
      const { count } = await supabase
          .from("appointments")
          .select("id", { count: 'exact', head: true })
          .in("service_id", ids)
          .in("status", ["confirmed", "completed", "upcoming"]); // Count valid bookings
      
      bookingCount = count || 0;
  }
  
  // Format for display (e.g. "43+" if 43, "100+" if 100+)
  const displayBookingCount = bookingCount > 0 ? `${bookingCount}+` : "";

  const socialLinks = (Array.isArray(org.social_links) ? org.social_links : []) as { platform: string; url: string }[];


  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-slate-50">
      
      {/* --------------------- HERO SECTION --------------------- */}
      {/* --------------------- HERO SECTION --------------------- */}
      <section className="relative overflow-hidden bg-zinc-900 text-white py-12 md:py-20">
        {/* Abstract Background */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
           <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-600 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
           <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-600 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4"></div>
        </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex flex-col-reverse md:flex-row items-center gap-12 md:gap-20">
                
                {/* Hero Text */}
                <div className="flex-1 text-center md:text-left z-10">
                    <div className="inline-flex items-center gap-2 mb-6">
                        <div className="h-1 w-12 bg-rose-500 rounded-full"></div>
                        <span className="text-rose-400 font-bold tracking-wider uppercase text-sm">
                            {org.name}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1]">
                        {org.headline || `Book a Session with ${org.name}`}
                    </h1>
                    
                    <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-2xl mx-auto md:mx-0">
                        {org.bio ? org.bio.split('.')[0] + '.' : "Schedule your appointment online. Simple, secure, and instant confirmation."}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                        <Link href={`/app/${slug}/services`}>
                            <Button size="lg" className="w-full sm:w-auto bg-white text-zinc-950 hover:bg-rose-50 hover:text-rose-600 px-6 md:px-8 py-6 rounded-full text-base md:text-lg font-bold shadow-xl shadow-rose-500/10 transition-all hover:scale-105">
                                Book Your Session <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>

                    {/* Contact & Socials */}
                    <div className="mt-8 pt-6 border-t border-white/10 flex flex-col items-center md:items-start gap-6">
                         {(org.email || org.phone) && (
                            <div className="flex flex-col gap-2 text-sm text-slate-400">
                               {org.email && (
                                 <div className="flex items-center gap-2">
                                   <Mail className="w-4 h-4 text-rose-400" />
                                   <a href={`mailto:${org.email}`} className="hover:text-white transition-colors">{org.email}</a>
                                 </div>
                               )}
                               {org.phone && (
                                 <div className="flex items-center gap-2">
                                   <Phone className="w-4 h-4 text-green-400" />
                                   <a href={`tel:${org.phone}`} className="hover:text-white transition-colors">{org.phone}</a>
                                 </div>
                               )}
                            </div>
                         )}
                        
                        {socialLinks.length > 0 && (
                            <div className="flex items-center gap-3">
                                {socialLinks.map((link, i) => (
                                    <a 
                                      key={i} 
                                      href={link.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="p-2.5 bg-white/5 hover:bg-white/20 rounded-xl transition-all hover:-translate-y-1 text-white/70 hover:text-white border border-white/5 hover:border-white/20"
                                    >
                                        <SocialIcon platform={link.platform} />
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Hero Image / Profile */}
                <div className="relative flex-shrink-0 w-64 h-64 md:w-96 md:h-96">
                    {/* Circle Background & Glow */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-rose-500 to-amber-500 rounded-full blur-2xl opacity-40 animate-pulse"></div>
                    <div className="relative w-full h-full rounded-full border-4 border-white/10 shadow-2xl overflow-hidden bg-zinc-800">
                         {org.profile_image_url ? (
                             <ImageWithFallback
                                src={org.profile_image_url}
                                alt={org.name}
                                className="w-full h-full object-cover"
                             />
                         ) : (
                             <div className="w-full h-full flex items-center justify-center bg-slate-700 text-slate-500">
                                 <UserCheck className="w-32 h-32 opacity-50" />
                             </div>
                         )}
                    </div>
                    {/* Float Badge */}
                    {displayBookingCount && (
                        <div className="absolute bottom-4 right-0 md:-right-6 bg-zinc-900/80 backdrop-blur-md border border-zinc-700 px-4 py-3 rounded-xl flex items-center gap-3 animate-fade-in-up">
                            <div className="bg-rose-500/20 p-2 rounded-lg">
                                <Zap className="w-5 h-5 text-rose-400" />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">Trusted By</p>
                                <p className="text-sm font-bold text-white leading-none">{displayBookingCount} Clients</p>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
      </section>

      {/* --------------------- ABOUT SECTION --------------------- */}
      {/* --------------------- ABOUT SECTION --------------------- */}
      {org.bio && (
        <section className="py-20 bg-black">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <span className="text-rose-500 font-bold tracking-widest text-sm uppercase mb-3 block">About Me</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">What I Do</h2>
                <div className="text-xl text-slate-400 leading-relaxed space-y-6">
                    {org.bio.split('\n').map((line: string, i: number) => (
                        <p key={i}>{line}</p>
                    ))}
                </div>
            </div>
        </section>
      )}

      {/* --------------------- SERVICES PREVIEW --------------------- */}
      {services && services.length > 0 && (
         <section className="py-20 md:py-32">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Popular Sessions</h2>
                    <p className="text-xl text-slate-400">Choose a package that suits your needs</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {services.map((service: { id: string; name: string; price: number; duration_minutes: number; description?: string | null }) => (
                        <div key={service.id} className="group relative bg-zinc-900 rounded-3xl p-8 border border-zinc-800 shadow-lg shadow-black/50 hover:shadow-2xl hover:border-rose-500/30 hover:-translate-y-1 transition-all duration-300 flex flex-col">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-rose-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
                            <h3 className="text-2xl font-bold text-white mb-2 line-clamp-1">{service.name}</h3>
                            <div className="text-4xl font-extrabold text-rose-500 mb-4">
                                ₹{service.price}
                                <span className="text-base font-medium text-zinc-500 ml-1">/ session</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-zinc-400 mb-6 text-sm font-medium bg-black w-fit px-3 py-1 rounded-full border border-zinc-800">
                                <Clock className="w-4 h-4" />
                                {service.duration_minutes} Minutes
                            </div>

                            <p className="text-zinc-400 mb-8 line-clamp-3 min-h-[4.5rem] flex-grow">
                                {service.description || "Book this session to get started on your goals."}
                            </p>
                            
                            <Link href={`/app/${slug}/services`} className="mt-auto">
                                <Button className="w-full bg-white hover:bg-rose-50 text-zinc-950 rounded-xl py-6 font-semibold transition-colors">
                                    Book Now
                                </Button>
                            </Link>
                        </div>
                    ))}

                    {/* View All Card */}
                    <div className="group relative bg-zinc-900 rounded-3xl p-8 border border-zinc-800 shadow-xl flex flex-col items-center justify-center text-center overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-rose-600/20 to-amber-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <Sparkles className="w-12 h-12 text-rose-400 mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2">More Options?</h3>
                        <p className="text-slate-400 mb-8">View all available services and packages.</p>
                        
                        <Link href={`/app/${slug}/services`}>
                             <Button size="lg" className="bg-rose-600 hover:bg-rose-500 text-white rounded-xl px-10 py-6 font-bold shadow-lg shadow-rose-500/25 transition-all hover:scale-105">
                                View All <ArrowRight className="ml-2 w-5 h-5" />
                             </Button>
                        </Link>
                    </div>
                </div>
            </div>
         </section>
      )}


      {/* --------------------- HOW IT WORKS --------------------- */}
      <section className="py-20 md:py-24 bg-slate-900 text-white relative overflow-hidden">
         {/* Decoration */}
         <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">How It Works</h2>
              <p className="text-lg text-slate-400">Simple steps to get started</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12 text-center relative">
               {/* Connector Line (Desktop) */}
               <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-pink-500/50 border-t border-dashed border-white/20 z-0"></div>

               {/* Step 1 */}
               <div className="relative z-10">
                  <div className="w-24 h-24 mx-auto bg-zinc-800 rounded-3xl flex items-center justify-center mb-8 border border-white/10 shadow-2xl shadow-rose-500/10">
                      <MousePointerClick className="w-10 h-10 text-rose-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">1. Browse & Select</h3>
                  <p className="text-slate-400 px-6">Explore the services and choose the one that fits your goals.</p>
               </div>

               {/* Step 2 */}
               <div className="relative z-10">
                  <div className="w-24 h-24 mx-auto bg-slate-800 rounded-3xl flex items-center justify-center mb-8 border border-white/10 shadow-2xl shadow-purple-500/10">
                      <CalendarCheck className="w-10 h-10 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">2. Book Your Slot</h3>
                  <p className="text-slate-400 px-6">Pick a date and time that works for you from the live calendar.</p>
               </div>

               {/* Step 3 */}
               <div className="relative z-10">
                  <div className="w-24 h-24 mx-auto bg-zinc-800 rounded-3xl flex items-center justify-center mb-8 border border-white/10 shadow-2xl shadow-amber-500/10">
                      <Zap className="w-10 h-10 text-amber-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">3. Meet & Grow</h3>
                  <p className="text-slate-400 px-6">Join the session and start making progress towards your success.</p>
               </div>
            </div>
         </div>
      </section>
      
      {/* --------------------- FOOTER / CTA --------------------- */}
       <section className="py-20 bg-zinc-950 border-t border-zinc-900">
          <div className="max-w-5xl mx-auto px-6">
             <div className="bg-zinc-900 rounded-[2.5rem] p-8 md:p-16 text-center shadow-2xl overflow-hidden relative">
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none"></div>
                
                <h2 className="relative z-10 text-3xl md:text-5xl font-bold text-white mb-6">Ready to transform your life?</h2>
                <p className="relative z-10 text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
                    Don&apos;t wait for the perfect moment. Take the first step today and book your session with {org.name}.
                </p>
                
                <Link href={`/app/${slug}/services`} className="relative z-10 inline-block w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto bg-white hover:bg-rose-50 text-zinc-950 px-8 sm:px-12 py-6 sm:py-8 text-lg sm:text-xl rounded-full shadow-xl shadow-white/10 transition-all hover:scale-105 font-bold whitespace-normal h-auto">
                        Book Your First Session
                    </Button>
                </Link>
             </div>
          </div>
       </section>

    </div>
  );
}