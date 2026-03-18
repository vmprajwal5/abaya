import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Check } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { signupSchema } from "../utils/validation";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
import PasswordStrength from "../components/PasswordStrength";

export default function Signup() {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { signup } = useAuth();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(signupSchema),
    });

    const password = watch("password", "");

    const onSubmit = async (data) => {
        // Client-side Password Match Validation
        if (data.password !== data.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            await signup(data.fullName, data.email, data.password);
            toast.success("Registration Successful!");
            navigate("/"); // Redirect to home after signup
        } catch (err) {
            if (err.response?.data?.errors) {
                const msgs = err.response.data.errors.join(". ");
                setError(msgs);
                toast.error(msgs);
            } else {
                const errorMessage = err.response?.data?.message || err.message || "Failed to create account";
                setError(errorMessage);
                toast.error(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Password strength helpers are handled in PasswordStrength component

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 bg-gray-50 flex items-center justify-center">
            <div className="bg-white p-8 md:p-12 rounded-none shadow-sm max-w-md w-full border border-gray-100 animate-fade-in-up">
                <div className="text-center mb-8">
                    <h1 className="font-serif text-3xl text-primary mb-2">Create Account</h1>
                    <p className="text-gray-500 font-light">Join us for exclusive access and rewards</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 mb-6 text-sm text-center border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Full Name */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Full Name</label>
                        <input
                            {...register("fullName")}
                            type="text"
                            className={cn(
                                "w-full border-b border-gray-200 py-2 focus:border-black focus:outline-none transition-colors bg-white",
                                errors.fullName && "border-red-500"
                            )}
                            placeholder="John Doe"
                        />
                        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Email</label>
                        <input
                            {...register("email")}
                            type="email"
                            className={cn(
                                "w-full border-b border-gray-200 py-2 focus:border-black focus:outline-none transition-colors bg-white",
                                errors.email && "border-red-500"
                            )}
                            placeholder="name@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Password</label>
                        <div className="relative">
                            <input
                                {...register("password")}
                                type={showPassword ? "text" : "password"}
                                className={cn(
                                    "w-full border-b border-gray-200 py-2 focus:border-black focus:outline-none transition-colors bg-white pr-10",
                                    errors.password && "border-red-500"
                                )}
                                placeholder="Create a password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-0 top-2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* Password Strength Indicator */}
                        <PasswordStrength password={password} />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Confirm Password</label>
                        <input
                            {...register("confirmPassword")}
                            type="password"
                            className={cn(
                                "w-full border-b border-gray-200 py-2 focus:border-black focus:outline-none transition-colors bg-white",
                                errors.confirmPassword && "border-red-500"
                            )}
                            placeholder="Confirm your password"
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                    </div>

                    <div className="flex items-start gap-2">
                        <input
                            type="checkbox"
                            {...register("terms")}
                            className="mt-1 rounded border-gray-300 text-black focus:ring-black"
                        />
                        <span className="text-xs text-gray-500">
                            I agree to the <Link to="/terms" className="underline hover:text-black">Terms & Conditions</Link> and <Link to="/privacy" className="underline hover:text-black">Privacy Policy</Link>.
                        </span>
                    </div>
                    {errors.terms && <p className="text-red-500 text-xs">{errors.terms.message}</p>}

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 bg-secondary text-white hover:bg-primary uppercase tracking-widest text-sm"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
                    </Button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                </div>

                <div className="space-y-4">
                    <p className="text-center text-sm text-gray-500">
                        Already have an account?{" "}
                        <Link to="/login" className="text-black font-semibold hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
