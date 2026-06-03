"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft, AlertCircle, LogOut } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      // Check if user has ADMIN authority
      const hasAdminRole = user?.roles?.some(r => r === "ADMIN" || r === "ROLE_ADMIN");
      if (!hasAdminRole) {
        setAuthorized(false);
      } else {
        setAuthorized(true);
      }
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !authorized) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-zinc-950 text-zinc-100 p-6 text-center space-y-6">
        <div className="relative h-16 w-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center border border-rose-500/20 animate-pulse">
          <Shield size={32} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white">Security Access Denied</h2>
          <p className="text-sm text-zinc-500 max-w-sm leading-relaxed">
            This sector is restricted to platform administrators. Your credentials do not grant access to the Admin Panel.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button className="bg-zinc-900 hover:bg-zinc-800 hover:text-white text-zinc-300 font-bold flex items-center gap-1.5 cursor-pointer">
              <ArrowLeft size={16} />
              Return to Dashboard
            </Button>
          </Link>
          <Button variant="ghost" onClick={logout} className="text-zinc-500 hover:text-rose-400 font-bold cursor-pointer">
            <LogOut size={16} className="mr-2" />
            Switch Account
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-screen flex-col bg-zinc-950 text-zinc-100 antialiased">
      {/* Admin Navbar */}
      <header className="flex h-16 items-center justify-between border-b border-zinc-900 bg-zinc-950/40 backdrop-blur-md px-6 shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <span className="bg-gradient-to-r from-rose-500 to-indigo-500 bg-clip-text text-lg font-black tracking-wider text-transparent flex items-center gap-2">
            <Shield className="h-5 w-5 text-rose-500" />
            DSAverse ADMIN
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white font-bold cursor-pointer">
              <ArrowLeft size={14} className="mr-1.5" />
              Exit Admin Panel
            </Button>
          </Link>
        </div>
      </header>

      {/* Admin Main Body */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
