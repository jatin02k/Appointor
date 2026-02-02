
import Link from "next/link";
import { Button } from "@/app/components/ui/button"; 
// Using standard HTML buttons for landing page as per design choice, but keeping import if needed for future or removing if strictly unused.
// Linter says unused.
import { 
  CheckCircle2, 
  MessageCircle, 
  CreditCard, 
  Clock, 
  ChevronRight, 
  Menu, 
  Users,
  Brain,
  Briefcase,
  GraduationCap,
  Sparkles,
  Zap,
  ShieldCheck,
  Smartphone,
  Code
} from "lucide-react";
import Image from "next/image";
import { LandingFooter } from "@/app/components/LandingFooter";
import { LandingHeader } from "@/app/components/LandingHeader";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-slate-50 selection:bg-rose-500/30 selection:text-rose-200">
      
      {/* HEADER */}
      <LandingHeader />

      {/* HERO SECTION - Tighter & "Artistic" */}
      <section className="pt-24 pb-12 lg:pt-32 lg:pb-16 relative overflow-hidden flex items-center min-h-[60vh]">
        {/* Background Elements - Subtle Dark Grid */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-900/20 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-900/10 rounded-full blur-3xl opacity-50 -translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Text Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-rose-400 text-xs font-semibold uppercase tracking-wide mb-6 animate-fade-in-up">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
                New: Payments Integration
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight lg:leading-[1.1]">
                Focus On The Art. <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-fuchsia-400 to-amber-300">Not The Schedule.</span>
              </h1>
              
              <p className="mt-4 text-lg text-slate-400 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                The dedicated booking OS for Tattoo Artists & Luxury Studios. Eliminate no-shows with automated deposits and manage multi-hour sessions without the DM chaos.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link href="/signup" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-8 py-3.5 bg-white text-zinc-950 rounded-full font-bold text-lg hover:bg-zinc-200 transition-all hover:scale-105 shadow-xl hover:shadow-white/10">
                    Claim Your Studio Link
                  </button>
                </Link>
                <Link href="#demo" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-8 py-3.5 bg-zinc-900/50 text-white border border-zinc-800 rounded-full font-bold text-lg hover:bg-zinc-800 transition-all hover:border-zinc-700 flex items-center justify-center gap-2 backdrop-blur-sm">
                    <span className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-rose-400">
                       <ChevronRight className="w-4 h-4" />
                    </span>
                    See Artist Demo
                  </button>
                </Link>
              </div>
              <p className="mt-4 text-xs text-zinc-500 uppercase tracking-wider font-medium">14-day free trial • No credit card required</p>
            </div>

            {/* Right Column: Hero Image - Dark Mode Style */}
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/50 p-2 shadow-2xl transform lg:rotate-1 hover:rotate-0 transition-transform duration-500">
                 <div className="rounded-xl overflow-hidden bg-zinc-950 relative aspect-[4/3] lg:aspect-auto">
                    <Image 
                      src="/dashboard-mockup.png" 
                      alt="Appointor Dashboard" 
                      width={800} 
                      height={600} 
                      className="object-cover w-full h-full opacity-90 hover:opacity-100 transition-opacity"
                    />
                    {/* Dark Overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 to-transparent pointer-events-none"></div>
                 </div>
              </div>
              
              {/* Floating Elements - Dark Theme */}
              <div className="absolute -right-4 top-12 bg-zinc-900 p-4 rounded-xl shadow-xl shadow-black/20 border border-zinc-800 hidden lg:block animate-bounce-slow z-20">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-900/30 flex items-center justify-center text-emerald-400">
                       <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="text-xs text-zinc-500 font-medium">New Booking</p>
                       <p className="text-sm font-bold text-white">₹999.00 Received</p>
                    </div>
                 </div>
              </div>
              <div className="absolute -left-8 bottom-12 bg-zinc-900 p-4 rounded-xl shadow-xl shadow-black/20 border border-zinc-800 hidden lg:block animate-bounce-slow z-20" style={{ animationDelay: '1s' }}>
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-rose-900/30 flex items-center justify-center text-rose-400">
                       <Clock className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="text-xs text-zinc-500 font-medium">Next Session</p>
                       <p className="text-sm font-bold text-white">In 15 mins</p>
                    </div>
                 </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* VIDEO WALKTHROUGH SECTION */}
      <section id="demo" className="py-20 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold uppercase tracking-wide mb-6">
              <Zap className="w-4 h-4" />
              See it in action
           </div>
           <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
             Watch how easy it is to <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400">fill your chair</span>
           </h2>
           
           <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-rose-900/10 border border-zinc-800 bg-zinc-900 aspect-video">
              <iframe 
                className="absolute inset-0 w-full h-full" 
                src="https://www.youtube.com/embed/ru9JoVg3A5o?si=1acHFz1ftCTVdPrH&amp;start=41" 
                title="Appointor Walkthrough" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              ></iframe>
           </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="py-24 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Does this sound familiar?
              </h2>
              <p className="text-lg text-slate-400">
                 You started your business to create art, not to become a full-time scheduler.
              </p>
           </div>

           <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-sm hover:border-zinc-700 transition-colors">
                 <div className="w-12 h-12 bg-red-900/20 rounded-xl flex items-center justify-center text-red-500 mb-6">
                    <MessageCircle className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-3">Manual Booking Chaos</h3>
                 <p className="text-slate-400 leading-relaxed">
                   &quot;Are you free Tuesday?&quot; &quot;No, how about Wed?&quot;... <br/>
                   Endless back-and-forth messages on WhatsApp, DM, or Email just to book one session.
                 </p>
              </div>

              <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-sm hover:border-zinc-700 transition-colors">
                 <div className="w-12 h-12 bg-orange-900/20 rounded-xl flex items-center justify-center text-orange-500 mb-6">
                    <Clock className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-3">No-Shows & Late</h3>
                 <p className="text-slate-400 leading-relaxed">
                   Without automated reminders and deposits, clients flake. You waste ink, time, and money waiting for people who never show up.
                 </p>
              </div>

              <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-sm hover:border-zinc-700 transition-colors">
                 <div className="w-12 h-12 bg-amber-900/20 rounded-xl flex items-center justify-center text-amber-500 mb-6">
                    <CreditCard className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-3">Chasing Payments</h3>
                 <p className="text-slate-400 leading-relaxed">
                   Awkwardly asking for screenshots of payments or waiting for transfers before confirming slots.
                 </p>
              </div>
           </div>
        </div>
      </section>

      {/* SOLUTION / HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-20">
             <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
               The New Way to Book
             </h2>
             <p className="text-lg text-slate-400 max-w-2xl mx-auto">
               Automate your entire booking flow in 3 simple steps.
             </p>
           </div>

           <div className="relative">
              {/* Connector Line (Desktop) */}
              <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-zinc-800 via-rose-900 to-zinc-800 -z-10"></div>
              
              <div className="grid md:grid-cols-3 gap-12 text-center">
                 {/* Step 1 */}
                 <div className="relative bg-zinc-950 pt-4">
                    <div className="w-16 h-16 mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-rose-500 text-2xl font-bold shadow-lg shadow-black mb-6 rotate-3 hover:rotate-6 transition-transform">
                      1
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Share Your Link</h3>
                    <p className="text-slate-400 leading-relaxed">
                      Send your custom link (e.g., appointor.com/you) to clients or put it in your bio.
                    </p>
                 </div>

                 {/* Step 2 */}
                 <div className="relative bg-zinc-950 pt-4">
                    <div className="w-16 h-16 mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-amber-500 text-2xl font-bold shadow-lg shadow-black mb-6 -rotate-3 hover:-rotate-6 transition-transform">
                      2
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Clients Book 24/7</h3>
                    <p className="text-slate-400 leading-relaxed">
                      Clients see your available slots, pick a time that works for them, and pay upfront.
                    </p>
                 </div>

                 {/* Step 3 */}
                 <div className="relative bg-zinc-950 pt-4">
                    <div className="w-16 h-16 mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-emerald-500 text-2xl font-bold shadow-lg shadow-black mb-6 rotate-3 hover:rotate-6 transition-transform">
                      3
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">You Just Show Up</h3>
                    <p className="text-slate-400 leading-relaxed">
                      Both of you get calendar invites and reminders. You start the session on time.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
             <h2 className="text-3xl md:text-5xl font-bold mb-6">
               Built for Solo Professionals
             </h2>
             <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                If you sell your time and talent, Appointor helps you sell more of it with less effort.
              </p>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[
                { icon: Brain, label: "Tattoo Artists", color: "text-blue-400" },
                { icon: Briefcase, label: "Piercers", color: "text-purple-400" },
                { icon: Sparkles, label: "Nail Techs", color: "text-emerald-400" },
                { icon: Code, label: "Hair Stylists", color: "text-cyan-400" },
                { icon: Users, label: "PMU Artists", color: "text-indigo-400" },
                { icon: GraduationCap, label: "Studios", color: "text-pink-400" }
              ].map((item, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors text-center group cursor-default">
                  <div className={`mx-auto w-12 h-12 mb-4 rounded-full bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform ${item.color}`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-white">{item.label}</h3>
                </div>
              ))}
           </div>
           
           <div className="mt-12 text-center">
             <div className="inline-flex items-center gap-2 text-slate-400 bg-white/5 rounded-full px-4 py-2 text-sm">
               <Users className="w-4 h-4" />
               <span>Join 50+ artists automating their workflow</span>
             </div>
           </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section id="features" className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
             <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Everything you need to run your booking</h2>
           </div>

           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-rose-500/30 transition-colors group">
                 <div className="w-12 h-12 bg-rose-900/20 rounded-xl flex items-center justify-center text-rose-500 mb-6 group-hover:scale-110 transition-transform">
                    <Smartphone className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-3">Custom Booking Page</h3>
                 <p className="text-slate-400">Your own branded booking page (e.g., appointor.com/ink-studio) that works professionally on mobile and desktop.</p>
              </div>

              {/* Feature 2 */}
              <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-amber-500/30 transition-colors group">
                 <div className="w-12 h-12 bg-amber-900/20 rounded-xl flex items-center justify-center text-amber-500 mb-6 group-hover:scale-110 transition-transform">
                    <Clock className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-3">24/7 Availability</h3>
                 <p className="text-slate-400">Wake up to new bookings. Your calendar is open for business 24/7, even while you sleep.</p>
              </div>

              {/* Feature 3 */}
              <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/30 transition-colors group">
                 <div className="w-12 h-12 bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-3">Reduce No-Shows</h3>
                  <p className="text-slate-400">Secure your income before you even pick up the machine. Automated reminders and deposit collection cut no-shows by up to 50%.</p>
              </div>

              {/* Feature 4 */}
              <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/30 transition-colors group">
                 <div className="w-12 h-12 bg-orange-900/20 rounded-xl flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform">
                    <Zap className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-3">Instant Payments</h3>
                  <p className="text-slate-400">Integrate payment links. Collect deposits upfront when clients book. No more chasing transfers.</p>
              </div>

              {/* Feature 5 */}
              <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-pink-500/30 transition-colors group">
                 <div className="w-12 h-12 bg-pink-900/20 rounded-xl flex items-center justify-center text-pink-500 mb-6 group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-3">Calendar Sync</h3>
                 <p className="text-slate-400">Connects with your Google Calendar so you&apos;re never double-booked. (Coming Soon)</p>
              </div>

              {/* Feature 6 */}
              <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-cyan-500/30 transition-colors group">
                 <div className="w-12 h-12 bg-cyan-900/20 rounded-xl flex items-center justify-center text-cyan-500 mb-6 group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-3">Client Database</h3>
                  <p className="text-slate-400">Keep track of your client history, past pieces, and preferences in one secure place.</p>
              </div>
           </div>
        </div>
      </section>
      
      {/* VIDEO WALKTHROUGH SECTION */}
      <section id="demo" className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 border border-purple-100 rounded-full text-purple-700 text-xs font-semibold uppercase tracking-wide mb-6">
              <Zap className="w-4 h-4" />
              See it in action
           </div>
           <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8">
             Watch how easy it is to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">fill your chair</span>
           </h2>
           
           <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-900 aspect-video">
              <iframe 
                className="absolute inset-0 w-full h-full" 
                src="https://www.youtube.com/embed/ru9JoVg3A5o?si=1acHFz1ftCTVdPrH&amp;start=41" 
                title="Appointor Walkthrough" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              ></iframe>
           </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <div className="mb-16">
             <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Simple Pricing</h2>
             <p className="text-lg text-slate-400">Everything you need. No hidden fees.</p>
           </div>
           
           <div className="max-w-lg mx-auto bg-zinc-900 p-10 rounded-3xl shadow-xl shadow-black/20 border border-zinc-800 relative">
              <div className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 rotate-12 bg-amber-400 text-amber-950 font-bold px-4 py-1 rounded-full text-sm shadow-md">
                 Most Popular
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">Pro Plan</h3>
              <div className="flex items-baseline justify-center gap-1 mb-8">
                <span className="text-5xl font-extrabold text-white">₹999</span>
                <span className="text-slate-500">/month</span>
              </div>
              <p className="text-sm text-slate-500 mb-8 border-b border-zinc-800 pb-8">
                 (or $12/month for international users)
              </p>

              <ul className="space-y-4 mb-10 text-left">
                 {[
                   "Unlimited Bookings",
                   "Custom Booking Page",
                   "Email Reminders",
                   "Accept Payments",
                   "Client History",
                   "Admin Dashboard"
                 ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-300">
                       <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                       <span>{feature}</span>
                    </li>
                 ))}
              </ul>

              <Link href="/signup">
                <button className="w-full py-4 bg-white text-zinc-950 rounded-xl font-bold text-lg hover:bg-zinc-200 transition-colors shadow-lg hover:shadow-white/10">
                   Start 14-Day Free Trial
                </button>
              </Link>
              <p className="mt-4 text-xs text-zinc-500">No credit card required to start.</p>
           </div>
        </div>
      </section>

      {/* FROM THE FOUNDER */}
      <section className="py-24 bg-zinc-900/50 border-t border-zinc-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-24 h-24 mx-auto bg-zinc-800 rounded-full mb-6 overflow-hidden relative">
               {/* Placeholder for founder image, or use a generic avatar icon */}
               <div className="absolute inset-0 flex items-center justify-center bg-zinc-950 text-white font-bold text-2xl">
                  JD
               </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-6">Built for precision. Made for artists.</h2>
            <p className="text-lg text-slate-400 leading-relaxed italic">
              &quot;As a B.Tech ECE student, I learned that precision is everything—whether in circuits or in ink. I built Appointor to give local creators the professional, high-performance infrastructure their talent deserves.&quot;
            </p>
            <p className="mt-4 font-bold text-white">— Jatin, Founder</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-zinc-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
           <h2 className="text-3xl font-bold text-white mb-12 text-center">Frequently Asked Questions</h2>
           
           <div className="space-y-8">
              <div>
                 <h3 className="text-lg font-bold text-white mb-2">What is Appointor?</h3>
                 <p className="text-slate-400">Appointor is a simple scheduling tool for professionals. It replaces the back-and-forth of DMs with a professional booking link where clients can book you instantly.</p>
              </div>
              <div>
                 <h3 className="text-lg font-bold text-white mb-2">How is this different from Calendly?</h3>
                 <p className="text-slate-400">We are designed specifically for paid 1-on-1 sessions for freelancers and solo-preneurs. We are more affordable (₹999 vs expensive enterprise tiers) and clearer to set up.</p>
              </div>
              <div>
                 <h3 className="text-lg font-bold text-white mb-2">Do I need technical skills?</h3>
                 <p className="text-slate-400">Not at all. If you can set up an Instagram profile, you can set up Appointor. It takes about 5 minutes.</p>
              </div>
              <div>
                 <h3 className="text-lg font-bold text-white mb-2">Can I cancel anytime?</h3>
                 <p className="text-slate-400">Yes, absolutely. There are no contracts. You can cancel your subscription with one click from your dashboard.</p>
              </div>
           </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 bg-black text-center relative overflow-hidden">
         <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f43f5e_1px,transparent_1px)] [background-size:16px_16px]"></div>
         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to stop juggling manual bookings?
            </h2>
            <p className="text-xl text-slate-400 mb-10">
              Join the professionals who save 10+ hours a week with Appointor.
            </p>
            <Link href="/signup">
               <button className="px-10 py-5 bg-white text-zinc-950 rounded-full font-bold text-xl hover:bg-zinc-200 transition-all hover:scale-105 shadow-2xl">
                  Start Your Free Trial
               </button>
            </Link>
         </div>
      </section>

      {/* FOOTER */}
      <LandingFooter />

    </div>
  );
}
