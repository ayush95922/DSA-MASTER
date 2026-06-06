"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, ArrowRight } from "lucide-react";

// Form validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { forgotPassword, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    forgotPassword(data.email);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-white">Reset Password</h2>
        <p className="text-sm text-zinc-400">
          Enter your email and we&apos;ll send you instructions to reset your password.
        </p>
      </div>

      {isSubmitSuccessful ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4 text-center">
          <p className="text-sm text-zinc-300">
            If an account exists with that email, you will receive a reset link shortly.
          </p>
          <Link
            href="/login"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Back to login
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                type="email"
                placeholder="name@college.edu"
                {...register("email")}
                disabled={isLoading}
                className="pl-10 bg-zinc-950 border-zinc-800 focus-visible:ring-emerald-500 text-zinc-100 placeholder:text-zinc-600"
              />
            </div>
            {errors.email && (
              <p className="text-xs font-medium text-rose-500">{errors.email.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold transition-all mt-2 py-6 text-base"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending instructions...
              </>
            ) : (
              "Send Instructions"
            )}
          </Button>
        </form>
      )}

      {/* Footer Link */}
      {!isSubmitSuccessful && (
        <p className="mt-6 text-center text-sm text-zinc-400">
          Remembered your password?{" "}
          <Link
            href="/login"
            className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Log in
          </Link>
        </p>
      )}
    </div>
  );
}
