import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";
import { authAPI } from "../services/api";
import { forgotPasswordSchema } from "../utils/validation";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";

export default function ForgotPassword() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await authAPI.forgotPassword({ email: data.email });
            const responseData = /** @type {any} */ (response);
            const resetToken = responseData?.resetToken || responseData?.data?.resetToken;
            setIsSubmitted(true);
            
            // For Demo: redirect to reset password page automatically
            setTimeout(() => {
                window.location.href = `/reset-password?token=${resetToken}`;
            }, 3000);
            
        } catch (err) {
            setError(err.message || "Failed to reset password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 bg-gray-50 flex items-center justify-center">
            <div className="bg-white p-8 md:p-12 rounded-none shadow-sm max-w-md w-full border border-gray-100 animate-fade-in-up">

                {isSubmitted ? (
                    <div className="text-center space-y-6">
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-600">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="font-serif text-2xl text-primary mb-2">Check your email</h1>
                            <p className="text-gray-500 font-light text-sm">
                                We&apos;ve sent password reset instructions to your email address.
                            </p>
                            <p className="text-secondary font-medium text-xs mt-4">
                                (Demo Mode: Redirecting to reset page in 3 seconds...)
                            </p>
                        </div>
                        <Button
                            asChild
                            className="w-full h-12 bg-secondary text-white hover:bg-primary uppercase tracking-widest text-sm"
                        >
                            <Link to="/login">Back to Login</Link>
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-8">
                            <h1 className="font-serif text-2xl text-primary mb-2">Reset Password</h1>
                            <p className="text-gray-500 font-light text-sm">
                                Enter your email address and we&apos;ll send you a link to reset your password.
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 mb-6 text-sm text-center border border-red-100">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 bg-secondary text-white hover:bg-primary uppercase tracking-widest text-sm"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Reset Link"}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <Link to="/login" className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-black transition-colors">
                                <ArrowLeft size={12} /> Back to Login
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div >
    );
}
