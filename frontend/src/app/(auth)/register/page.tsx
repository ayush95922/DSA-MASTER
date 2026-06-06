"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, Lock, User, SquareUser } from "lucide-react";

// Form validation schema
const registerSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters long"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters long")
      .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain alphanumeric characters and underscores"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: signUp, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    // Exclude confirmPassword from the actual payload sent to server
    const { confirmPassword, ...payload } = data;
    signUp(payload);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-white">Create an Account</h2>
        <p className="text-sm text-zinc-400">Join DSAverse to jumpstart your practice.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              type="text"
              placeholder="Alex Johnson"
              {...register("fullName")}
              disabled={isLoading}
              className="pl-10 bg-zinc-950 border-zinc-800 focus-visible:ring-emerald-500 text-zinc-100 placeholder:text-zinc-600"
            />
          </div>
          {errors.fullName && (
            <p className="text-xs font-medium text-rose-500">{errors.fullName.message}</p>
          )}
        </div>

        {/* Username */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
            Username
          </label>
          <div className="relative">
            <SquareUser className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              type="text"
              placeholder="alex_codes"
              {...register("username")}
              disabled={isLoading}
              className="pl-10 bg-zinc-950 border-zinc-800 focus-visible:ring-emerald-500 text-zinc-100 placeholder:text-zinc-600"
            />
          </div>
          {errors.username && (
            <p className="text-xs font-medium text-rose-500">{errors.username.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              type="email"
              placeholder="alex@college.edu"
              {...register("email")}
              disabled={isLoading}
              className="pl-10 bg-zinc-950 border-zinc-800 focus-visible:ring-emerald-500 text-zinc-100 placeholder:text-zinc-600"
            />
          </div>
          {errors.email && (
            <p className="text-xs font-medium text-rose-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              type="password"
              placeholder="••••••••"
              {...register("password")}
              disabled={isLoading}
              className="pl-10 bg-zinc-950 border-zinc-800 focus-visible:ring-emerald-500 text-zinc-100 placeholder:text-zinc-600"
            />
          </div>
          {errors.password && (
            <p className="text-xs font-medium text-rose-500">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword")}
              disabled={isLoading}
              className="pl-10 bg-zinc-950 border-zinc-800 focus-visible:ring-emerald-500 text-zinc-100 placeholder:text-zinc-600"
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs font-medium text-rose-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold transition-all mt-4 py-6 text-base"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      {/* Footer Link */}
      <p className="mt-6 text-center text-sm text-zinc-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          Log in instead
        </Link>
      </p>
    </div>
  );
}
