"use client";

import { ArrowLeft } from "lucide-react";
import { RegisterForm } from "@/components/register-form";
import { motion } from "framer-motion";
import Link from "next/link";

export default function RegisterPage() {
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
              Create your Exam Battle account
            </p>
            <h1 className="font-heading text-3xl font-black tracking-tight md:text-4xl">
              Get ready for{" "}
              <span className="text-orange-600">competitive practice.</span>
            </h1>
            <p className="text-sm leading-relaxed text-neutral-700 md:text-base">
              Register once to save your battles, exam wars, and progress across
              all your devices.
            </p>
          </div>

          <ul className="mt-2 space-y-1.5 text-sm text-neutral-700">
            <li>- Free student account with battle and war history.</li>
            <li>- Join exams from your coaching or school in one place.</li>
          </ul>
        </section>

        {/* Right: form */}
        <section className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <RegisterForm />
          </motion.div>
        </section>
      </main>
    </div>
  );
}
