"use client";
import Link from "next/link";
import { Sparkles, Mail, Phone, Clock } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-slate-950 text-white pt-16 pb-8 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
                <Link href="/" className="cursor-pointer">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-rose-400 to-amber-400 bg-clip-text text-transparent inline-flex items-center gap-2">
                    Appointor
                    <Sparkles className="h-4 w-4 text-rose-400" />
                  </h2>
                </Link>
            </div>
            <p className="text-gray-400 max-w-sm leading-relaxed text-sm">
              The comprehensive operating system designed for modern service-based businesses. Simplify management, automate workflows, and scale your operations.
            </p>
          </div>

          <div className="flex flex-col gap-4 text-sm text-zinc-400">
            <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-rose-400" />
                <span>jatin02kr@gmail.com</span>
            </div>
            <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-amber-400" />
                <span>+91 9650584722</span>
            </div>
            <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-orange-400" />
                <span>Mon-Fri, 9am - 6pm IST</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Appointor Inc. All rights reserved.</p>
            <div className="flex gap-6 flex-wrap justify-center">
              <Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/legal/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/legal/refund" className="hover:text-white transition-colors">Refund Policy</Link>
            </div>
        </div>
      </div>
    </footer>
  );
}
