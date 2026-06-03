"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useSidebarStore } from "@/stores/sidebar-store";
import {
  LayoutDashboard,
  Compass,
  BookOpen,
  HelpCircle,
  Building2,
  History,
  LineChart,
  Settings,
  Menu,
  Bell,
  LogOut,
  ChevronLeft,
  Sun,
  Moon,
  Laptop,
  Layers,
  Sparkles,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/roadmaps", label: "Roadmaps", icon: Compass },
  { href: "/topics", label: "Topics", icon: BookOpen },
  { href: "/sheets", label: "Curated Sheets", icon: Layers },
  { href: "/questions", label: "Questions", icon: HelpCircle },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/revision", label: "Spaced Revision", icon: History },
  { href: "/tutor", label: "AI Tutor", icon: Sparkles },
  { href: "/quiz", label: "AI Quiz", icon: Award },
  { href: "/analytics", label: "Analytics", icon: LineChart },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuthStore();
  const { isOpen, toggle, setOpen } = useSidebarStore();
  const { setTheme } = useTheme();
  const pathname = usePathname();

  // Close sidebar on mobile devices on route change
  useEffect(() => {
    if (window.innerWidth < 768) {
      setOpen(false);
    }
  }, [pathname, setOpen]);

  // Handle resizing to auto-close sidebar on smaller views
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // trigger initial check
    return () => window.removeEventListener("resize", handleResize);
  }, [setOpen]);

  const userInitials = user?.profile?.fullName
    ? user.profile.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.username?.slice(0, 2).toUpperCase() || "US";

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-100 antialiased">
      {/* 1. Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-20 flex flex-col border-r border-zinc-900 bg-zinc-950 transition-all duration-300 md:static ${
          isOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full md:w-20 md:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-zinc-900 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2">
            {isOpen ? (
              <span className="bg-gradient-to-r from-emerald-400 to-indigo-500 bg-clip-text text-xl font-extrabold tracking-wider text-transparent">
                DSAverse
              </span>
            ) : (
              <span className="bg-gradient-to-r from-emerald-400 to-indigo-500 bg-clip-text text-xl font-black text-transparent">
                D
              </span>
            )}
          </Link>
          {isOpen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-900 md:flex hidden"
            >
              <ChevronLeft size={16} />
            </Button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                }`}
              >
                <Icon size={18} className={isActive ? "text-emerald-400" : "text-zinc-400"} />
                {(isOpen || window.innerWidth < 768) && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Footer Profile */}
        <div className="border-t border-zinc-900 p-4 shrink-0 space-y-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-zinc-800">
              <AvatarImage src={user?.profile?.avatar || ""} />
              <AvatarFallback className="bg-zinc-900 text-emerald-400 font-bold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            {isOpen && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-white truncate">
                  {user?.profile?.fullName || user?.username}
                </p>
                <span className="text-xs text-zinc-500 truncate block">
                  {user?.email}
                </span>
              </div>
            )}
          </div>
          {isOpen && (
            <Button
              variant="ghost"
              onClick={logout}
              className="w-full justify-start text-zinc-400 hover:text-rose-400 hover:bg-rose-950/20 font-bold mt-2"
            >
              <LogOut size={16} className="mr-2" />
              Log Out
            </Button>
          )}
        </div>
      </aside>

      {/* Backdrop overlay on mobile */}
      {isOpen && (
        <div
          onClick={toggle}
          className="fixed inset-0 z-10 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      {/* 2. Main Content Container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header bar */}
        <header className="flex h-16 items-center justify-between border-b border-zinc-900 bg-zinc-950/40 backdrop-blur-md px-6 shrink-0">
          {/* Header left */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              className="h-9 w-9 text-zinc-400 hover:text-white"
            >
              <Menu size={20} />
            </Button>
            <h2 className="text-lg font-bold tracking-tight text-white capitalize hidden sm:block">
              {pathname.split("/")[1] || "dashboard"}
            </h2>
          </div>

          {/* Header right */}
          <div className="flex items-center gap-4">
            {/* Quick stats banner */}
            {user?.profile?.dsaLevel && (
              <span className="text-xs font-bold bg-emerald-950/50 text-emerald-400 px-3 py-1 rounded-full border border-emerald-900/30 hidden sm:inline-block">
                Level: {user.profile.dsaLevel}
              </span>
            )}

            {/* Notification bell */}
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 text-zinc-400 hover:text-white hover:bg-zinc-900"
            >
              <Bell size={18} />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </Button>

            {/* Theme trigger */}
            <DropdownMenu>
              <DropdownMenuTrigger className="h-9 w-9 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent transition-all outline-none cursor-pointer relative">
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-zinc-300">
                <DropdownMenuItem onClick={() => setTheme("light")} className="focus:bg-zinc-800">
                  <Sun className="mr-2 h-4 w-4" /> Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="focus:bg-zinc-800">
                  <Moon className="mr-2 h-4 w-4" /> Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")} className="focus:bg-zinc-800">
                  <Laptop className="mr-2 h-4 w-4" /> System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content Panel */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-zinc-950 text-zinc-100">
          {children}
        </main>
      </div>
    </div>
  );
}
