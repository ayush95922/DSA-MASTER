"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { Menu, X, Sun, Moon, Laptop, ChevronRight } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const { isAuthenticated, user } = useAuthStore();
  const { setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll to add background styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-background/80 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-emerald-400 to-indigo-500 bg-clip-text text-2xl font-extrabold tracking-wider text-transparent">
                DSAverse
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </Link>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger className="h-9 w-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent border border-transparent transition-all outline-none cursor-pointer relative">
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover border-border text-popover-foreground">
                <DropdownMenuItem onClick={() => setTheme("light")} className="focus:bg-accent focus:text-accent-foreground">
                  <Sun className="mr-2 h-4 w-4" /> Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="focus:bg-accent focus:text-accent-foreground">
                  <Moon className="mr-2 h-4 w-4" /> Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")} className="focus:bg-accent focus:text-accent-foreground">
                  <Laptop className="mr-2 h-4 w-4" /> System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Auth CTAs */}
            {isAuthenticated ? (
              <Button
                asChild
                className="bg-emerald-500 hover:bg-emerald-600 text-primary-foreground font-semibold"
              >
                <Link href="/dashboard" className="flex items-center gap-1">
                  Dashboard
                  <ChevronRight size={16} />
                </Link>
              </Button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
                >
                  Log In
                </Link>
                <Button
                  asChild
                  className="bg-emerald-500 hover:bg-emerald-600 text-primary-foreground font-semibold"
                >
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger className="h-9 w-9 flex items-center justify-center rounded-lg text-muted-foreground border border-transparent transition-all outline-none cursor-pointer relative">
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover border-border text-popover-foreground">
                <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden border-b border-border bg-background px-4 pt-2 pb-6 space-y-4">
          <div className="flex flex-col space-y-3">
            <Link
              href="#features"
              onClick={() => setIsOpen(false)}
              className="text-base font-medium text-muted-foreground hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              onClick={() => setIsOpen(false)}
              className="text-base font-medium text-muted-foreground hover:text-foreground"
            >
              Pricing
            </Link>
            <Link
              href="#faq"
              onClick={() => setIsOpen(false)}
              className="text-base font-medium text-muted-foreground hover:text-foreground"
            >
              FAQ
            </Link>
          </div>

          <div className="border-t border-border pt-4 flex flex-col gap-3">
            {isAuthenticated ? (
              <Button asChild className="w-full bg-emerald-500 text-primary-foreground font-semibold">
                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                  Dashboard
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="outline" asChild className="w-full border-border text-foreground hover:bg-accent">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    Log In
                  </Link>
                </Button>
                <Button asChild className="w-full bg-emerald-500 text-primary-foreground font-semibold">
                  <Link href="/register" onClick={() => setIsOpen(false)}>
                    Sign Up
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
