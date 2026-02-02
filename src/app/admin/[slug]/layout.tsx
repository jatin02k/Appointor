import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { StaffSidebar } from "@/app/components/StaffSidebar";
import Link from "next/link";
import { Clock } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function AdminLayout({ children, params }: AdminLayoutProps) {
  const supabase = await createClient();
  const { slug } = await params;
  
  // 1. Get User
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/admin/login");

  // 2. Get User's Organization
  const { data: org } = await supabase
    .from("organizations")
    .select("slug, created_at, subscription_status, subscription_id")
    .eq("owner_id", user.id)
    .single();

  if (!org) {
     return <div>Error: No Organization found for this user.</div>;
  }

  // 3. Strict Check: Does URL Slug match User's Org Slug?
  if (slug !== org.slug) {
      const correctUrl = `/app/${org.slug}/admin/dashboard`;
      console.log(`Mismatch! URL: ${slug}, Org: ${org.slug}. Redirecting to ${correctUrl}`);
      redirect(correctUrl);
  }

  // Trial Logic
  // Trial = Status Active AND No Subscription ID (Razorpay sub ID)
  // Assuming new signups get 'active' status but no sub ID.
  const isTrial = org.subscription_status === "active" && !org.subscription_id;
  
  let daysLeft = 0;
  if (isTrial && org.created_at) {
      const trialEndsAt = new Date(new Date(org.created_at).getTime() + 14 * 24 * 60 * 60 * 1000);
      daysLeft = Math.ceil((trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {isTrial && (
        <div className="bg-rose-600 text-white px-4 py-2 text-center text-sm font-medium flex items-center justify-center gap-2">
            <Clock className="w-4 h-4" />
            <span>You are on the 14-day free trial. {Math.max(0, daysLeft)} days remaining.</span>
            <Link href={`/app/${org.slug}/admin/dashboard/subscription`} className="underline hover:text-rose-100">
                Upgrade now
            </Link>
        </div>
      )}
      
      <div className="flex flex-1">
        <StaffSidebar slug={org.slug} /> 
        
        <main className="flex-1 p-0">
          {children}
        </main>
      </div>
    </div>
  );
}