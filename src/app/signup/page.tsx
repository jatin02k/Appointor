"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Home } from "lucide-react";
import Image from "next/image";

export default function SignupPage() {

  const supabase = createClient();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    orgName: "",
    orgSlug: "",
    orgPhone: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate slug from organization name
  const handleOrgNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    // Slugify: lowercase, replace spaces with dashes, remove special chars
    // Append a random 4-char string to ensure uniqueness
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    
    // We update this in real-time. To avoid jitter, maybe we don't append random chars visibly?
    // User complaint: "cant keep the business name same coz it means slug becomes same".
    // Solution: We should append a unique ID internally or let them edit it.
    // For MVP, let's append a random number to the slug in the state.
    const uniqueSlug = baseSlug ? `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}` : "";

    setFormData((prev) => ({ ...prev, orgName: name, orgSlug: uniqueSlug }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let user = null;

      // 1. Sign Up User
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
          },
        },
      });

      if (authError) {
          if (authError.message.includes("already registered") || authError.message.includes("User already registered")) {
              console.log("User exists. Attempting recovery login...");
              const { data: signinData, error: signinError } = await supabase.auth.signInWithPassword({
                  email: formData.email,
                  password: formData.password
              });

              if (signinError) throw new Error("This email is already registered. Please Log In.");
              user = signinData.user;
          } else {
              throw authError;
          }
      } else {
         user = authData.user;
      }
      
      if (!user) throw new Error("Authentication failed");
      
      // Check for session to ensure RLS works
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
          setError("Please check your email to confirm your account before we can create your Dashboard.");
          return;
      }

      // 2. Check for Existing Organization (Handle Re-login/Re-signup)
      const { data: existingOrg } = await supabase
        .from("organizations")
        .select("slug")
        .eq("owner_id", user.id)
        .single();
      
      if (existingOrg) {
         console.log("User already has an organization. Redirecting...");
         const protocol = window.location.protocol;
         const host = window.location.host;
         window.location.href = `${protocol}//${host}/app/${existingOrg.slug}/admin/dashboard`;
         return;
      }

      // 3. Create Organization
      const orgName = formData.orgName || "Demo Consultancy";
      const orgSlug = formData.orgSlug || `demo-consult-${Math.floor(1000 + Math.random() * 9000)}`;

      console.log("Creating Organization:", orgName);

      const { data: newOrg, error: orgError } = await supabase.from("organizations").insert([
        {
          name: orgName,
          slug: orgSlug,
          owner_id: user.id,
          type: "clinic",
          email: formData.email,
          phone: formData.orgPhone, 
          subscription_status: "active",
        },
      ]).select().single();

      if (orgError) throw orgError;
      if (!newOrg) throw new Error("Failed to create organization");

      // 4. SEED DATA: Services
      console.log("Seeding Services...");
      const { data: services, error: servicesError } = await supabase.from("services").insert([
        { organization_id: newOrg.id, name: "Flash Tattoo Session", duration_minutes: 60, price: 150, description: "Pre-designed flash piece" },
        { organization_id: newOrg.id, name: "Custom Piece Consult", duration_minutes: 30, price: 50, description: "Discuss your custom design ideas" },
        { organization_id: newOrg.id, name: "Touch-up Session", duration_minutes: 45, price: 0, description: "Free touch-up for past work" },
      ]).select();

      if (servicesError) console.error("Error seeding services:", servicesError);

      // 5. SEED DATA: Appointments (if services created successfully)
      if (services && services.length > 0) {
          console.log("Seeding Appointments...");
          const today = new Date();
          // Helper to set time
          const setTime = (h: number, m: number) => {
              const d = new Date(today);
              d.setHours(h, m, 0, 0);
              return d.toISOString();
          };
          
          // Get IDs for specific services if possible, or just use indices
          const consultService = services.find(s => s.name === "Consultation Call") || services[0];
          const reviewService = services.find(s => s.name === "Code Review") || services[1];
          const scopeService = services.find(s => s.name === "Project Scope") || services[2];

          const { error: apptError } = await supabase.from("appointments").insert([
              { 
                  organization_id: newOrg.id, 
                  service_id: consultService.id, 
                  customer_name: "Alex Design", 
                  start_time: setTime(10, 0), 
                  end_time: setTime(10, 30), 
                  status: "confirmed",
                  notes: "Discussing new SaaS UI" 
              },
              { 
                  organization_id: newOrg.id, 
                  service_id: reviewService.id, 
                  customer_name: "Sarah Founder", 
                  start_time: setTime(14, 0), 
                  end_time: setTime(15, 0), 
                  status: "confirmed",
                  notes: "React performance audit" 
              },
               { 
                  organization_id: newOrg.id, 
                  service_id: scopeService.id, 
                  customer_name: "Mike Product", 
                  start_time: setTime(16, 0), 
                  end_time: setTime(16, 45), 
                  status: "confirmed",
                  notes: " MVP Feature list" 
              }
          ]);
           if (apptError) console.error("Error seeding appointments:", apptError);
      }

      // 6. Redirect
      const protocol = window.location.protocol;
      const host = window.location.host;
      const targetUrl = `${protocol}//${host}/app/${newOrg.slug}/admin/dashboard`;
      
      console.log("Signup Complete. Redirecting to:", targetUrl);
      window.location.href = targetUrl;

    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "object" && err !== null && "message" in err) {
        setError((err as any).message); // eslint-disable-line @typescript-eslint/no-explicit-any
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-zinc-950 relative">
      <Link href="/" className="absolute top-6 right-6 z-50 p-2.5 rounded-full shadow-lg hover:scale-110 transition-all duration-300 lg:bg-black/50 lg:text-white lg:border-zinc-800 lg:backdrop-blur-md border border-zinc-800 bg-zinc-900 text-slate-400 lg:border-transparent lg:hover:bg-zinc-800 group">
          <Home className="w-5 h-5 group-hover:text-rose-500 lg:group-hover:text-rose-400 transition-colors" />
      </Link>

      {/* BRAND PANEL (LEFT) */}
      <div className="hidden lg:flex lg:w-1/2 bg-zinc-900 relative overflow-hidden flex-col justify-between p-12 text-white border-r border-zinc-800">
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 mb-8">
             <Image src="/logo.png" alt="Appointor" width={24} height={24} className="object-contain" />
             <span className="text-2xl font-bold tracking-tight">Appointor</span>
          </Link>
          <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            The OS for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-500">
              Tattoo Artists & Creative Studios
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-md">
             Join thousands of artists who trust Appointor to automate strategy calls and payments.
          </p>
        </div>

        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-rose-900/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-amber-900/10 rounded-full blur-3xl"></div>

        {/* Testimonial / Footer */}
        <div className="relative z-10">
           <blockquote className="space-y-2">
              <p className="text-lg font-medium text-slate-200">
                &ldquo;Appointor transformed how I run my studio. The booking experience is seamless for my clients.&rdquo;
              </p>
              <footer className="text-sm text-slate-500">
                — Alex Rivera, Tattoo Artist
              </footer>
           </blockquote>
        </div>
      </div>

      {/* FORM SIDER (RIGHT) - COMPACT LAYOUT */}
      <div className="flex-1 flex flex-col justify-center py-6 px-3 sm:px-6 lg:px-20 xl:px-24 bg-black h-screen overflow-y-auto">
        <div className="mx-auto w-full max-w-lg lg:max-w-2xl">
          <div className="lg:hidden mb-4 text-center">
             <Link href="/" className="inline-flex items-center gap-2">
                 <span className="text-2xl font-bold tracking-tight text-gray-900">Appointor</span>
             </Link>
          </div>

          <div className="mb-6 text-center lg:text-left">
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-white/90">
              Create your account
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Start your 14-day free trial. {" "}
              <Link href="/login" className="font-medium text-rose-500 hover:text-rose-400">
                Already have an account?
              </Link>
            </p>
          </div>

          <form className="space-y-3 md:space-y-4" onSubmit={handleSignup}>
            {/* Personal Details */}
            <div className="bg-zinc-900 p-4 md:p-5 rounded-2xl shadow-sm border border-zinc-800 space-y-3 md:space-y-4">
                
                <div className="grid grid-cols-1 gap-3 md:gap-4">
                    <div>
                       <Label htmlFor="name" className="text-slate-400 text-xs uppercase font-semibold">Full Name</Label>
                       <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          className="mt-1 block w-full rounded-lg border-zinc-700 shadow-sm focus:border-rose-500 focus:ring-rose-500 bg-zinc-950/50 py-2 md:py-2 text-white placeholder-zinc-600"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                       />
                    </div>
                    <div>
                       <Label htmlFor="email" className="text-slate-400 text-xs uppercase font-semibold">Email</Label>
                       <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          className="mt-1 block w-full rounded-lg border-zinc-700 shadow-sm focus:border-rose-500 focus:ring-rose-500 bg-zinc-950/50 py-2 md:py-2 text-white placeholder-zinc-600"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                       />
                    </div>
                     <div>
                       <Label htmlFor="password" className="text-slate-400 text-xs uppercase font-semibold">Password</Label>
                       <Input
                          id="password"
                          name="password"
                          type="password"
                          required
                          className="mt-1 block w-full rounded-lg border-zinc-700 shadow-sm focus:border-rose-500 focus:ring-rose-500 bg-zinc-950/50 py-2 md:py-2 text-white placeholder-zinc-600"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                       />
                    </div>
                </div>
            </div>

            {/* Clinic Details */}
            <div className="bg-zinc-900 p-4 md:p-5 rounded-2xl shadow-sm border border-zinc-800 space-y-3 md:space-y-4">
                <div className="grid grid-cols-1 gap-3 md:gap-4">
                     <div>
                       <Label htmlFor="orgName" className="text-slate-400 text-xs uppercase font-semibold">Business / Brand Name</Label>
                       <Input
                          id="orgName"
                          name="orgName"
                          type="text"
                          required
                          className="mt-1 block w-full rounded-lg border-zinc-700 shadow-sm focus:border-rose-500 focus:ring-rose-500 bg-zinc-950/50 py-2 md:py-2 text-white placeholder-zinc-600"
                          placeholder="Acme Consulting"
                          value={formData.orgName}
                          onChange={handleOrgNameChange}
                       />
                    </div>
                     <div>
                       <Label htmlFor="orgPhone" className="text-slate-400 text-xs uppercase font-semibold">Phone (Optional)</Label>
                       <Input
                          id="orgPhone"
                          name="orgPhone"
                          type="tel"
                          required
                          className="mt-1 block w-full rounded-lg border-zinc-700 shadow-sm focus:border-rose-500 focus:ring-rose-500 bg-zinc-950/50 py-2 md:py-2 text-white placeholder-zinc-600"
                          placeholder="+1 555 000 0000"
                          value={formData.orgPhone}
                          onChange={(e) => setFormData({ ...formData, orgPhone: e.target.value })}
                       />
                    </div>
                     <div>
                       <Label htmlFor="orgSlug" className="text-slate-400 text-xs uppercase font-semibold">Booking URL</Label>
                       <div className="flex rounded-md shadow-sm mt-1">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-zinc-700 bg-zinc-800 text-slate-400 text-sm">
                            /app/
                          </span>
                          <Input
                            id="orgSlug"
                            name="orgSlug"
                            type="text"
                            required
                            className="block w-full rounded-none rounded-r-lg border-zinc-700 focus:border-rose-500 focus:ring-rose-500 bg-zinc-950/50 py-2 md:py-2 text-white placeholder-zinc-600"
                            placeholder="acme-consulting"
                            value={formData.orgSlug}
                            onChange={(e) => setFormData({ ...formData, orgSlug: e.target.value })}
                         />
                       </div>
                    </div>
                </div>
            </div>

            {error && (
               <div className="rounded-xl bg-red-50 p-3 border border-red-100">
                  <div className="flex items-center">
                     <AlertCircle className="h-4 w-4 text-red-500 mr-2" aria-hidden="true" />
                     <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
               </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-rose-900/20 text-sm font-bold tracking-wide text-white bg-white/10 hover:bg-white/20 border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all duration-200 transform hover:scale-[1.02]"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
                      <p className="mt-4 text-center text-xs text-zinc-500">
               By joining, you agree to our <a href="#" className="underline hover:text-zinc-300">Terms</a>.
            </p>
        </div>
      </div>
    </div>
  );
}
