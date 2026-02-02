'use client';

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function LandingHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
      <header className="fixed top-0 w-full z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-rose-600 rounded-lg p-1.5">
               <span className="font-bold text-white text-lg tracking-tight">Ap</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Appointor</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex gap-6 text-sm font-medium text-slate-400">
              <a href="#features" className="hover:text-rose-500 transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-rose-500 transition-colors">How it Works</a>
              <a href="#pricing" className="hover:text-rose-500 transition-colors">Pricing</a>
              <a href="#faq" className="hover:text-rose-500 transition-colors">FAQ</a>
            </nav>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-semibold text-slate-400 hover:text-rose-500 transition-colors">
                Log in
              </Link>
              <Link href="/signup">
                <button className="bg-white hover:bg-zinc-200 text-zinc-950 px-5 py-2 rounded-full text-sm font-bold transition-all hover:shadow-lg hover:shadow-white/10 hover:translate-y-px">
                  Start Free Trial
                </button>
              </Link>
            </div>
          </div>

          <div className="md:hidden">
             {/* Mobile Menu Button */}
             <button 
               className="p-2 text-slate-400 hover:text-white transition-colors"
               onClick={toggleMobileMenu}
             >
               {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
             </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-white border-b border-slate-100 shadow-xl p-4 flex flex-col gap-4 md:hidden animate-in slide-in-from-top-2 z-40">
            <nav className="flex flex-col gap-4 text-sm font-medium text-slate-600">
              <a href="#features" className="hover:text-blue-600 transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
              <a href="#how-it-works" className="hover:text-blue-600 transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>How it Works</a>
              <a href="#pricing" className="hover:text-blue-600 transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>Pricing</a>
              <a href="#faq" className="hover:text-blue-600 transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>FAQ</a>
            </nav>
            <div className="flex flex-col gap-3 mt-2 border-t border-slate-50 pt-4">
              <Link href="/login" className="text-center font-semibold text-slate-700 hover:text-blue-600 transition-colors py-2">
                Log in
              </Link>
              <Link href="/signup">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-full text-sm font-semibold transition-all shadow-md">
                  Start Free Trial
                </button>
              </Link>
            </div>
          </div>
        )}
      </header>
  );
}
