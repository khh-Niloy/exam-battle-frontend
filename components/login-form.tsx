"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLoginMutation } from "@/redux/features/auth/auth.api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { demoUser } from "@/const/demoUser";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type LoginSchema = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loginUser, { isLoading }] = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const handleAutoLogin = async (email: string) => {
    await onSubmit({ email, password: "password123" });
  };

  const onSubmit = async (data: LoginSchema) => {
    try {
      const res = await loginUser(data).unwrap();
      if (res.success) {
        toast.success("Logged in successfully");
        router.push("/");
      }
    } catch (error: any) {
      toast.error(
        error.data?.message || "Login failed. Please check your credentials.",
      );
    }
  };

  return (
    <div className={cn("flex flex-col gap-8", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-5">
          <div className="space-y-2">
            <label
              className="text-sm font-black text-gray-900 uppercase tracking-widest pl-1"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-[#4088FD] outline-none transition-all px-6 text-base font-medium"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs font-bold pl-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label
                className="text-sm font-black text-gray-900 uppercase tracking-widest"
                htmlFor="password"
              >
                Password
              </label>
              <a
                href="#"
                className="text-xs font-bold text-[#4088FD] hover:underline"
              >
                Forgot?
              </a>
            </div>
            <div className="relative group">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-[#4088FD] outline-none transition-all px-6 text-base font-medium"
                {...register("password")}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-900 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs font-bold pl-1">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-6 pt-2">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 bg-[#4088FD] text-white rounded-2xl font-black text-base shadow-xl shadow-blue-500/25 hover:bg-blue-600 hover:translate-y-[-2px] transition-all active:scale-95 disabled:opacity-70"
          >
            {isLoading ? "Signing in..." : "Continue"}
          </Button>

          <p className="text-center text-sm font-bold text-gray-400">
            New to ExamBattle?{" "}
            <Link
              href="/register"
              className="text-[#4088FD] hover:underline decoration-2 underline-offset-4"
            >
              Create account
            </Link>
          </p>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase font-black text-gray-300">
              <span className="bg-white px-4 tracking-[0.3em]">
                Demo Access
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {demoUser.map((demo) => (
              <button
                key={demo.name}
                type="button"
                onClick={() => handleAutoLogin(demo.email)}
                className="py-3 px-2 border border-blue-50 bg-blue-50/30 text-[#4088FD] rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-[#4088FD] hover:text-white transition-all active:scale-95 shadow-sm"
              >
                {demo.name}
              </button>
            ))}
          </div>
        </div>
      </form>

      <p className="text-xs text-center text-gray-400 font-medium leading-relaxed max-w-[300px] mx-auto">
        By continuing, you agree to our{" "}
        <a href="#" className="underline">
          Terms
        </a>{" "}
        and{" "}
        <a href="#" className="underline">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
