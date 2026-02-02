'use client'
import { useState } from "react"; // Add useState
import { createClient } from "@/lib/supabase/client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Calendar, UserPlus, List, Users, Sparkles, LogOut, Menu, X } from "lucide-react"; // Add Menu, X
import { Button } from "./ui/button";

interface StaffSidebarProps {
  slug: string;
}

export function StaffSidebar({ slug }: StaffSidebarProps) {
  const pathname = usePathname();
  const supabase = createClient();
  const [isOpen, setIsOpen] = useState(false); // Mobile state

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const staffNavItems = [
    {
      href: `/app/${slug}/admin/dashboard`,
      label: "Appointments Calendar",
      icon: Calendar,
      gradient: "from-orange-500 to-pink-500",
    },
    {
      href: `/app/${slug}/admin/dashboard/services`,
      label: "Sessions & Hours",
      icon: Users,
      gradient: "from-purple-500 to-blue-500",
    },
    {
      href: `/app/${slug}/admin/dashboard/appointments`,
      label: "Upcoming Appointments",
      icon: List,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      href: `/app/${slug}/admin/dashboard/bookings`,
      label: "Manual Booking",
      icon: UserPlus,
      gradient: "from-cyan-500 to-blue-500",
    },
    {
      href: `/app/${slug}/admin/dashboard/subscription`,
      label: "Subscription",
      icon: Sparkles,
      gradient: "from-yellow-400 to-orange-500",
    },
    {
       href: `/app/${slug}/admin/dashboard/profile`,
       label: "Profile",
       icon: UserPlus, // Or User if imported
       gradient: "from-indigo-500 to-purple-500",
    },
    // {
    //   href: `/app/${slug}`,
    //   label: "Back to Customer Site",
    //   icon: Home,
    //   gradient: "from-gray-600 to-gray-800",
    // },
  ];

  // Helper Content Component
  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-800 text-white">
      <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
        <div>
           <div className="flex items-center gap-2 mb-1">
             <h2 className="text-lg bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
               Admin Dashboard
             </h2>
             <Sparkles className="h-4 w-4 text-orange-400" />
           </div>
           <p className="text-sm text-gray-400">Appointor Management</p>
        </div>
        {/* Close Button for Mobile */}
        <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-400 hover:text-white">
          <X className="h-6 w-6" />
        </button>
      </div>

      <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
        {staffNavItems.map((item) => {
          const Icon = item.icon; 
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              passHref
              onClick={() => setIsOpen(false)} // Close on click (mobile)
            >
              <Button 
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start transition-all duration-300 group mb-1 ${
                  isActive
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg hover:shadow-xl hover:scale-105`
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                <Icon
                  className={`mr-3 h-4 w-4 ${
                    isActive ? "" : "group-hover:scale-110 transition-transform"
                  }`}
                />
                <span className="text-sm">{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
         <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="w-full justify-start text-red-400 hover:bg-red-950/30 hover:text-red-300 transition-colors"
         >
            <LogOut className="mr-3 h-4 w-4" />
            <span className="text-sm">Log Out</span>
         </Button>
      </div>

      <div className="p-4 bg-gradient-to-r from-orange-500/10 to-pink-500/10 border-t border-orange-500/20">
        <p className="text-xs text-gray-400 text-center">
          Manage your business with ease ✨
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Trigger Button (Visible only on mobile) */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-zinc-950 border-b border-zinc-800 p-4 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-orange-400" />
            <span className="text-white font-bold">Appointor Admin</span>
         </div>
         <button onClick={() => setIsOpen(true)} className="text-white p-2">
            <Menu className="h-6 w-6" />
         </button>
      </div>

      {/* Desktop Sidebar (Fixed, always visible on MD+) */}
      <div className="hidden md:block w-64 fixed left-0 top-0 h-screen shadow-xl z-40">
        <SidebarContent />
      </div>

      {/* Mobile Drawer (Overlay, visible when Open) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
           {/* Backdrop */}
           <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
           
           {/* SidebarContent Drawer */}
           <div className="relative w-4/5 max-w-xs h-full shadow-2xl animate-in slide-in-from-left duration-200">
              <SidebarContent />
           </div>
        </div>
      )}
    </>
  );
}
