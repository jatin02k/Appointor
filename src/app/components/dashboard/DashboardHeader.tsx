"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Copy, Share2, ExternalLink, Check, CalendarCheck } from "lucide-react";
import Link from "next/link";

interface DashboardHeaderProps {
  org: {
    name: string;
    slug: string;
    id: string;
  };
  timeSavedMinutes: number;
  timeSavedHours: string;
  revenueCollected: number;
  hasRealBookings: boolean;
  isServicesEdited: boolean;
}

export function DashboardHeader({
  org,
  timeSavedMinutes,
  timeSavedHours,
  revenueCollected,
  hasRealBookings,
  isServicesEdited,
}: DashboardHeaderProps) {
  const [hasShared, setHasShared] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Check local storage for shared state
    const storedShare = localStorage.getItem(`appointor_share_clicked_${org.id}`);
    if (storedShare === "true") {
      setHasShared(true);
    }
  }, [org.id]);

  const [bookingUrl, setBookingUrl] = useState("");

  const [prettyUrl, setPrettyUrl] = useState("");

  useEffect(() => {
    setBookingUrl(`${window.location.origin}/app/${org.slug}`);
    setPrettyUrl(`${window.location.host}/app/${org.slug}`);
  }, [org.slug]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(bookingUrl);
      setCopied(true);
      markAsShared();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const handleShare = async () => {
    markAsShared();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${org.name} Booking`,
          text: `Book your appointment at ${org.name}`,
          url: bookingUrl,
        });
      } catch (err) {
        console.log("Error sharing", err);
        // Fallback to copy if share fails/cancelled (optional, but handleCopy does the UI feedback)
         handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const markAsShared = () => {
    setHasShared(true);
    localStorage.setItem(`appointor_share_clicked_${org.id}`, "true");
  };

  // Combine server logic (bookings) with client logic (clicks)
  const isLinkShared = hasRealBookings || hasShared;
  const allComplete = isServicesEdited && isLinkShared;
  
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <header className="mb-8 w-full">
      <div className="w-full">
        {/* 1. Header with CTA */}
        <div className="bg-zinc-900 rounded-2xl p-3 md:p-6 shadow-sm border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 overflow-hidden">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white">
              Welcome to {org.name}
            </h1>
            <p className="text-slate-400 mt-1">
              Your booking page is live! Share your link to get real bookings.
            </p>
          </div>

            <div className="flex flex-col gap-3 w-full sm:w-auto sm:flex-row sm:items-center">
              <Link
                href={`/app/${org.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center gap-2 whitespace-nowrap"
              >
                <ExternalLink className="w-4 h-4" />
                Open Public Page
              </Link>
            <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg p-1 pr-2 sm:pr-4 w-full sm:w-auto overflow-hidden">
              <div className="bg-zinc-900 px-3 py-1.5 text-xs text-slate-400 font-mono rounded border border-zinc-800 select-all truncate flex-1 sm:flex-none">
                {prettyUrl}
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs text-blue-600 hover:bg-blue-50 gap-1.5 sm:gap-2 shrink-0"
                onClick={handleCopy}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span className={copied ? "" : "hidden sm:inline"}>{copied ? "Copied" : "Copy Link"}</span>
              </Button>
            </div>
              <Button
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 gap-2 whitespace-nowrap"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4" />
                Share Page
              </Button>
            </div>
          </div>

        {/* 2. Value-Driven Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-l-4 border-green-500 shadow-sm bg-zinc-900 border-t-0 border-r-0 border-b-0">
            <CardContent className="p-3 md:p-6">
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wide">
                Time Saved
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-white mt-2">
                {timeSavedMinutes === 0
                  ? "0 Minutes"
                  : timeSavedMinutes >= 60
                  ? `${timeSavedHours} Hours`
                  : `${timeSavedMinutes} Minutes`}
              </h3>
              <p className="text-xs text-green-600 mt-1 font-medium">
                {hasRealBookings
                  ? "All by automating bookings"
                  : "Starts updating after your first booking"}
              </p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-blue-500 shadow-sm bg-zinc-900 border-t-0 border-r-0 border-b-0">
            <CardContent className="p-3 md:p-6">
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wide">
                Revenue Collected
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-white mt-2">
                ₹{revenueCollected.toLocaleString()}
              </h3>
              <p className="text-xs text-blue-600 mt-1 font-medium">
                {revenueCollected > 0
                  ? "Without a single phone call"
                  : "Starts updating after your first booking"}
              </p>
            </CardContent>
          </Card>
          
          {/* Onboarding Checklist - Minimizes when complete */}
          {allComplete && !isExpanded ? (
             <Card className="border-l-4 border-emerald-500 shadow-sm bg-emerald-950/20 border-t-0 border-r-0 border-b-0">
                <CardContent className="p-3 md:p-6 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-900/50 rounded-full flex items-center justify-center text-emerald-500">
                      <Check className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-emerald-400">You&apos;re all set!</p>
                      <p className="text-xs text-emerald-600">Onboarding complete.</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-emerald-500 hover:text-emerald-400 hover:bg-emerald-900/30"
                    onClick={() => setIsExpanded(true)}
                  >
                    View Checklist
                  </Button>
                </CardContent>
             </Card>
          ) : (
            <Card className={`border-l-4 shadow-sm border-t-0 border-r-0 border-b-0 ${allComplete ? "border-emerald-500 bg-emerald-950/20" : "border-purple-500 bg-purple-950/20"}`}>
                <CardContent className="p-3 md:p-6">
                <div className="flex justify-between items-start mb-3">
                  <p className="text-sm font-medium text-white font-bold">
                      Onboarding Checklist
                  </p>
                  {allComplete && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 text-xs text-slate-500 hover:text-slate-700 -mt-1"
                      onClick={() => setIsExpanded(false)}
                    >
                      Minimize
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                    <ChecklistItem label="Booking page created" checked={true} />
                    <ChecklistItem label="Edit your sessions" checked={isServicesEdited} />
                    <ChecklistItem label="Share link with clients" checked={isLinkShared} />
                </div>
                </CardContent>
            </Card>
          )}

        </div>
      </div>
    </header>
  );
}

function ChecklistItem({ label, checked }: { label: string; checked: boolean }) {
  if (checked) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-700">
        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
          <Check className="w-3 h-3" />
        </div>
        <span className="line-through text-slate-400">{label}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 text-sm text-slate-700">
      <div className="w-5 h-5 border-2 border-slate-300 rounded-full"></div>
      <span>{label}</span>
    </div>
  );
}
