import { createClient } from "@/lib/supabase/server";
import { Check, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "@/app/components/ui/imageWithFallback";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { notFound } from "next/navigation"; // 1. Add notFound

// 2. Define Props for Params
interface ServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ServiceSelectionPage({ params }: ServicePageProps) {
  const { slug } = await params; // 3. Await Params
  const supabase = await createClient();

  // 4. Find the Organization first
  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .select("id, name")
    .eq("slug", slug)
    .single();

  if (orgError || !org) {
    return notFound();
  }

  // 5. Fetch Services ONLY for this Organization
  const { data: services, error } = await supabase
    .from("services")
    .select("id, name, price, duration_minutes, description, features")
    .eq("organization_id", org.id) // <--- CRITICAL FILTER
    .order("duration_minutes", { ascending: true });

  if (error) {
    return (
      <div className="text-center text-red-500 mt-20">
        Error loading services. Please check the database connection.
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <div className="text-center mt-20 p-8">
        <h1 className="text-2xl font-semibold">
          No services available for {org.name}.
        </h1>
      </div>
    );
  }

  const gradientClasses = [
    { gradient: "from-orange-500 to-pink-500", shadow: "shadow-pink-500/20" },
    { gradient: "from-blue-500 to-cyan-500", shadow: "shadow-cyan-500/20" },
    { gradient: "from-green-500 to-lime-500", shadow: "shadow-lime-500/20" },
    { gradient: "from-purple-500 to-indigo-500", shadow: "shadow-indigo-500/20" }, // Added 4th color
  ];

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gradient-to-b from-bg-zinc-950 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-900/20 to-amber-900/20 rounded-full px-4 py-2 mb-4 border border-rose-500/10">
            <span className="text-sm bg-gradient-to-r from-rose-400 to-amber-400 bg-clip-text text-transparent font-medium">
              {org.name} Services {/* Personalized Header */}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl text-white mb-4 tracking-tight font-bold">
            Our{" "}
            <span className="bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">
              Services
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Choose from the range of programs at {org.name}.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={service.id}
              className={`overflow-hidden bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-all duration-300 hover:shadow-xl hover:shadow-rose-900/10 group`}
            >
              <CardHeader>
                <div className="mb-2 relative overflow-hidden">
                  <CardTitle className="text-xl text-white mb-1">
                    {service.name}
                  </CardTitle>
                  <div className="text-sm text-slate-400">
                    <b>{service.duration_minutes} mins</b>
                  </div>
                  <div
                  className={`absolute top-4 right-4 bg-gradient-to-r from-rose-600 to-amber-600 text-white px-3 py-1 rounded-full text-sm shadow-lg`}
                >
                  ₹{service.price}/session
                </div>
                </div>
                <CardDescription className="text-slate-400">
                  {service.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <ul className="space-y-2 mb-6">
                  {/* Features often stored as JSON array in Supabase */}
                  {(typeof service.features === 'string' ? JSON.parse(service.features) : service.features)?.map((feature: string, idx: number) => (
                    <li
                      key={idx}
                      className="flex items-center text-sm text-slate-300"
                    >
                      <div
                        className={`p-0.5 rounded-full bg-gradient-to-r from-rose-600 to-amber-600 mr-3 flex-shrink-0`}
                      >
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Important: Link is relative to the current subdomain! */}
                {/* Visiting /book/123 on gold.localhost stays on gold.localhost */}
                <Link
                  href={`/app/${slug}/book/${service.id}`}
                  className="w-full"
                  passHref
                >
                  <Button
                    className={`
                    w-full text-white bg-gradient-to-r from-rose-600 to-amber-600
                    hover:shadow-lg hover:shadow-rose-900/20 transition-all duration-300 group-hover:scale-105
                  `}
                  >
                    Select {service.name}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}