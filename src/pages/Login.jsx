import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { loginSchema } from "../utils/validation";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    // Default redirect to home or the page they tried to access

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const email = watch("email");
    const password = watch("password");

    // Clear error when user types
    if (error && (email || password)) {
        // We use an effect or just simple logic. 
        // Since this is a render-time check, better to use an effect or clear on input change.
        // But to keep it simple with 'watch', we can use useEffect (see below).
        // OR better: use onChange in inputs? 
        // The requirement: "If the user starts typing again, clear the error message."
        // We will do it via useEffect on watching 'email' and 'password'.
    }

    // Using useEffect to clear error when inputs change
    useEffect(() => {
        if (error) setError(null);
    }, [email, password, error]);

    const isSubmitDisabled = !email || !password || isLoading;

    const onSubmit = async (data) => {
        setIsLoading(true);
        setError(null);
        try {
            const user = await login(data.email, data.password);
            if (user && user.isAdmin) {
                navigate('/admin/dashboard', { replace: true });
            } else {
                navigate('/', { replace: true });
            }
        } catch (err) {
            if (err.response?.status === 423) {
                const lockTime = new Date(err.response.data.lockUntil).toLocaleTimeString();
                setError(`${err.response.data.message} Try again after: ${lockTime}`);
            } else {
                let errorMessage = err.response?.data?.message || err.message || "Invalid Email or Password";
                if (err.response?.data?.remainingAttempts) {
                    errorMessage += ` ${err.response.data.remainingAttempts} attempts remaining.`;
                }
                setError(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 bg-gray-50 flex items-center justify-center">
            <div className="bg-white p-8 md:p-12 rounded-none shadow-sm max-w-md w-full border border-gray-100 animate-fade-in-up">
                <div className="text-center mb-8">
                    <h1 className="font-serif text-3xl text-primary mb-2">Welcome Back</h1>
                    <p className="text-gray-500 font-light">Please enter your details to sign in</p>
                </div>

                {/* Red Alert Box */}
                {error && (
                    <div className={cn("p-4 mb-6 text-sm text-center border rounded-md shadow-sm font-medium animate-pulse", error.includes('locked') ? "bg-red-50 text-red-600 border-red-200" : "bg-orange-50 text-orange-600 border-orange-200")}>
                        ⚠️ {error}
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
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-0 top-2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                {...register("rememberMe")}
                                className="rounded border-gray-300 text-black focus:ring-black"
                            />
                            <span className="text-gray-600">Remember me</span>
                        </label>
                        <Link to="/forgot-password" className="text-secondary hover:text-black transition-colors underline">
                            Forgot password?
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitDisabled || error?.includes('locked')}
                        className="w-full h-12 bg-secondary text-white hover:bg-primary uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
                    </Button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                </div>

                <div className="space-y-4">
                    <p className="text-center text-sm text-gray-500">
                        Don&apos;t have an account?{" "}
                        <Link to="/signup" className="text-black font-semibold hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
