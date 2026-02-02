import { createClient } from "@/lib/supabase/server";
import ServiceOverview from "@/app/components/ServiceOverview";
import BusinessHoursForm from "@/app/components/BusinessHoursForm";
import { redirect } from "next/navigation";

export default async function ServicesPage() {
  const supabase = await createClient();

  // 1. Check Auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/admin/login");
  }

  // 2. Get User's Organization
  const { data: org } = await supabase
    .from("organizations")
    .select("id, subscription_status, slug") // Fetch ID, Status, & Slug
    .eq("owner_id", user.id)
    .single();

  if (!org) {
     return <div>Error: No Organization found for this user.</div>;
  }

  const isSubscribed = org.subscription_status === 'active';

  // 3. Fetch Services & Business Hours (Parallel)
  console.log("Fetching services and hours for Org ID:", org.id);

  const [servicesResult, hoursResult] = await Promise.all([
    supabase
      .from("services")
      .select("*")
      .eq("organization_id", org.id)
      .order("id", { ascending: false }),
    supabase
      .from("business_hours")
      .select("*")
      .eq("organization_id", org.id) // Assuming column exists
      .order("day_of_week", { ascending: true })
  ]);

  const { data: services, error: servicesError } = servicesResult;
  const { data: hours, error: hoursError } = hoursResult;

  if (servicesError || hoursError) {
    // ... (keep existing error handling)
    console.error("Failed to fetch data. Org ID:", org.id);
    // ...
    return (
        <div className="p-4 text-red-500">
            Error loading data...
        </div>
    )
  }

  return (
    <div className="p-4 md:p-8 md:ml-64 mt-16 md:mt-0 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Session Management</h1>
        
        {!isSubscribed && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
            <div className="flex items-center">
                <span className="font-medium mr-2">Subscription Inactive:</span>
                You cannot create services or update hours until you subscribe.
            </div>
            <a href={`/app/${org.slug}/admin/dashboard/subscription`} className="text-sm bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md transition-colors">
                Subscribe Now
            </a>
          </div>
        )}

        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 ${!isSubscribed ? 'opacity-70 pointer-events-none grayscale-[0.5]' : ''}`}>
            <ServiceOverview initialServices={services || []} />
            <BusinessHoursForm initialHours={hours || []} />
        </div>
      </div>
    </div>
  );
}
