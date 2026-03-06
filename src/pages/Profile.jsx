import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Package, MapPin, Edit2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { authAPI } from "../services/api";
import { profileSchema } from "../utils/validation";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";

export default function Profile() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            displayName: currentUser?.displayName || currentUser?.name || "",
            email: currentUser?.email || "",
            phoneNumber: currentUser?.phoneNumber || "",
        }
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            await authAPI.updateProfile({
                name: data.displayName, // Mapping displayName to name as per typical backend
                displayName: data.displayName
            });
            setIsEditing(false);
            // Ideally reload user or update context, but a page refresh or context re-fetch would be needed.
            // basic implementation for now.
            window.location.reload();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        logout(); // Use context logout
        navigate("/");
    };

    if (!currentUser) return null;

    return (
        <div className="container min-h-screen pt-32 pb-20">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row gap-8 md:gap-16">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 space-y-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center text-secondary text-2xl font-serif">
                                {currentUser.displayName?.charAt(0) || "U"}
                            </div>
                            <div>
                                <h2 className="font-serif text-xl">{currentUser.displayName}</h2>
                                <p className="text-xs text-gray-500">Member since {new Date(currentUser.createdAt || Date.now()).getFullYear()}</p>
                            </div>
                        </div>

                        <nav className="space-y-1">
                            <Button variant="ghost" className="w-full justify-start gap-3 text-black font-medium bg-gray-50">
                                <User size={18} /> My Profile
                            </Button>
                            <Button variant="ghost" className="w-full justify-start gap-3 text-gray-500 hover:text-black">
                                <Package size={18} /> Orders
                            </Button>
                            <Button variant="ghost" className="w-full justify-start gap-3 text-gray-500 hover:text-black">
                                <MapPin size={18} /> Addresses
                            </Button>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors mt-8"
                            >
                                <LogOut size={18} /> Logout
                            </button>
                        </nav>
                    </aside>

                    {/* Content */}
                    <main className="flex-1">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                            <h1 className="font-serif text-3xl text-primary">My Profile</h1>
                            {!isEditing && (
                                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
                                    <Edit2 size={14} /> Edit Profile
                                </Button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-6">
                            {/* Name */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Full Name</label>
                                <input
                                    {...register("displayName")}
                                    disabled={!isEditing}
                                    type="text"
                                    className={cn(
                                        "w-full border-b border-gray-200 py-2 focus:border-black focus:outline-none transition-colors bg-white disabled:bg-transparent disabled:border-transparent disabled:pl-0",
                                        errors.displayName && "border-red-500"
                                    )}
                                />
                                {errors.displayName && <p className="text-red-500 text-xs mt-1">{errors.displayName.message}</p>}
                            </div>

                            {/* Email */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Email</label>
                                <input
                                    {...register("email")}
                                    disabled
                                    type="email"
                                    className="w-full border-b border-transparent py-2 bg-transparent pl-0 text-gray-600 cursor-not-allowed"
                                />
                                <p className="text-[10px] text-gray-400">Email cannot be changed directly.</p>
                            </div>

                            {isEditing && (
                                <div className="pt-4 flex gap-4">
                                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isLoading} className="bg-secondary text-white hover:bg-primary">
                                        {isLoading ? "Saving..." : "Save Changes"}
                                    </Button>
                                </div>
                            )}
                        </form>
                    </main>
                </div>
            </div>
        </div>
    );
}
