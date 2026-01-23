"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLoginMutation } from "@/redux/features/auth/auth.api";
import { useUserRegisterMutation } from "@/redux/features/user/user.api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.string(),
});

type RegisterSchema = z.infer<typeof registerSchema>;

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [registerUser, { isLoading }] = useUserRegisterMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "FREE",
    },
  });

  const onSubmit = async (data: RegisterSchema) => {
    try {
      const res = await registerUser(data).unwrap();
      if (res.success) {
        toast.success("Registration successful! Please login.");
        router.push("/login");
      }
    } catch (error: any) {
      toast.error(
        error.data?.message || "Registration failed. Please try again.",
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
              htmlFor="name"
            >
              Full Name
            </label>
            <div className="relative">
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                required
                className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-[#4088FD] outline-none transition-all px-6 text-base font-medium"
                {...register("name")}
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-xs font-bold pl-1">
                {errors.name.message}
              </p>
            )}
          </div>

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
            <label
              className="text-sm font-black text-gray-900 uppercase tracking-widest pl-1"
              htmlFor="password"
            >
              Password
            </label>
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
            {isLoading ? "Creating account..." : "Start your journey"}
          </Button>

          <p className="text-center text-sm font-bold text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#4088FD] hover:underline decoration-2 underline-offset-4"
            >
              Login here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
