"use client";

import { ArrowLeft } from "lucide-react";
import { LoginForm } from "@/components/login-form";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full pb-24 text-neutral-950">
      {/* Shared light orange mesh background (matches guest landing) */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[var(--bg-auth-mesh)]" />

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 pt-10 md:flex-row md:items-start md:justify-between md:px-6 md:pt-12">
        {/* Left: copy */}
        <section className="max-w-md space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-neutral-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <div className="space-y-3 pt-3">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-neutral-600">
              Login to Exam Battle
            </p>
            <h1 className="font-heading text-3xl font-black tracking-tight md:text-4xl">
              Pick up from{" "}
              <span className="text-orange-600">your last battle.</span>
            </h1>
            <p className="text-sm leading-relaxed text-neutral-700 md:text-base">
              Sign in to join live battles, scheduled exam wars, and track how
              you are improving over time.
            </p>
          </div>

          <ul className="mt-2 space-y-1.5 text-sm text-neutral-700">
            <li>- Use the same account on phone and desktop.</li>
            <li>- Your history, accuracy, and ranks are always saved.</li>
          </ul>
        </section>

        {/* Right: form */}
        <section className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <LoginForm />
          </motion.div>
        </section>
      </main>
    </div>
  );
}
