"use client";
import Link from "next/link";

// 1. Updated Imports for Supabase
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

import { Loader2, LogIn, Home } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. Initialize Supabase Client (Shared Config)
  const supabase = createClient();

  // Create useCallback for handleRedirect to be stable for useEffect
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleRedirect = async (user: User) => {
      try {
          // 4. Success! Fetch Slug + Redirect
          if (user) {
              const { data: org, error } = await supabase
                  .from("organizations")
                  .select("slug")
                  .eq("owner_id", user.id)
                  .single();
              
              if (error || !org) {
                  console.error("No Organization found for user:", user.id);
                  // Sign out so that on next refresh, we don't hit this error lookup again
                  await supabase.auth.signOut();
                  setError("No Business account found for this user. Please contact support.");
                  setIsCheckingSession(false);
                  setIsLoading(false); 
                  return;
              }

              if (org) {
                  const protocol = window.location.protocol;
                  const host = window.location.host;

                  // Path-Based Redirection
                  const targetPath = `/app/${org.slug}/admin/dashboard`;
                  const targetUrl = `${protocol}//${host}${targetPath}`;

                  console.log("Redirecting to Tenant Dashboard:", targetUrl);
                  // Use window.location.replace to avoid back-button loops
                  window.location.replace(targetUrl); 
                  return;
              }
          }
      } catch (err) {
          console.error("Redirect Error:", err);
          setError("Failed to redirect to dashboard.");
          setIsCheckingSession(false);
      }
  };

  useEffect(() => {
    let mounted = true;
    const checkSession = async () => {
      // Failsafe: If check takes too long (e.g. slow network or weird loop), show login form
      const timer = setTimeout(() => {
          if (mounted) setIsCheckingSession(false);
      }, 4000);

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && mounted) {
          console.log("User already logged in, redirecting...");
          // We don't await here to allow the timeout/cleanup to work if needed? 
          // Actually, we want to try redirecting.
          await handleRedirect(user);
        } else if (mounted) {
          setIsCheckingSession(false);
        }
      } catch (err) {
        console.error("Session check error:", err);
        if (mounted) setIsCheckingSession(false);
      } finally {
        clearTimeout(timer);
      }
    };
    checkSession();
    
    return () => { mounted = false; };
  }, [supabase, router, handleRedirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // 3. The Magic: Supabase handles the password check securely
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      console.error("Login failed:", signInError);
      setError(signInError.message); 
      setIsLoading(false);
    } else {
      console.log("Login successful, checking session...");
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
         console.error("Login succeeded but no user session found (Cookie issue?).");
         setError("Login succeeded but session failed. Please try again.");
         setIsLoading(false);
         return;
      }

      // Small delay to ensure cookie propagation
      setTimeout(async () => {
         await handleRedirect(user);
      }, 500);
    }
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
        <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black p-4">
      <div className="absolute top-0 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-rose-500/20 rounded-full blur-3xl opacity-60 animate-pulse"></div>
      <div className="absolute top-0 right-1/4 translate-y-1/2 w-[500px] h-[500px] bg-amber-500/20 rounded-full blur-3xl opacity-60 animate-pulse" style={{ animationDelay: "2s" }}></div>

      <Card className="w-full max-w-md shadow-2xl border-zinc-800 bg-zinc-900/95 backdrop-blur-sm relative z-10 border">
        <CardHeader className="text-center pb-2 pt-8">
          <Link href="/" className="absolute top-6 right-6 z-50 p-3 rounded-full bg-black/50 backdrop-blur-md border border-zinc-800 text-slate-400 shadow-xl hover:bg-zinc-800 hover:text-white hover:scale-110 transition-all duration-300 group">
         <Home className="w-5 h-5" />
      </Link>
           <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-500/30">
              <LogIn className="w-6 h-6 text-white" />
           </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-white">
            Welcome back
          </CardTitle>
          <CardDescription className="text-base text-slate-400 mt-2">
            Sign in to manage your business
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-950/20 border border-red-900/50 text-red-400 rounded-xl text-sm flex items-center gap-2">
                 <div className="h-2 w-2 rounded-full bg-red-500"></div>
                 {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-400 font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="py-6 rounded-xl border-zinc-800 bg-zinc-950/50 text-white placeholder-zinc-600 focus:border-rose-500 focus:ring-rose-500"
              />
            </div>

            <div className="space-y-2">
             <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-400 font-medium">Password</Label>
                <a href="#" className="text-sm font-medium text-rose-500 hover:text-rose-400">Forgot password?</a>
             </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="py-6 rounded-xl border-zinc-800 bg-zinc-950/50 text-white placeholder-zinc-600 focus:border-rose-500 focus:ring-rose-500"
              />
            </div>

            <Button
              type="submit"
              className="w-full py-6 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white shadow-lg shadow-rose-900/20 transition-all duration-200 font-semibold text-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
          <div className="mt-8 text-center text-sm">
            <span className="text-slate-500">Don&apos;t have an account? </span>
            <Link href="/signup" className="font-semibold text-rose-500 hover:text-rose-400">
              Start your 14-day free trial
            </Link>
          </div>
        </CardContent>
      </Card>
      
      <div className="absolute bottom-6 text-center text-white/20 text-xs z-10 p-2">
         &copy; {new Date().getFullYear()} Appointor. All rights reserved.
      </div>
    </div>
  );
}