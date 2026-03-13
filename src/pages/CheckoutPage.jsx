import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { Check, CreditCard, ShoppingBag, Lock, AlertCircle, Smartphone, MapPin, Truck, ChevronDown, ChevronUp } from "lucide-react"
import { Link, useNavigate, Navigate } from "react-router-dom"

import { useCart } from "../contexts/CartContext"
import { useCurrency } from "../contexts/CurrencyContext"
import { useAuth } from "../contexts/AuthContext"
import { Button } from "../components/ui/button"
import { cn } from "../lib/utils"
import { openWhatsApp } from "../lib/whatsapp"
import { ordersAPI } from "../services/api"
import { validateCardNumber, validateCardExpiry, validateCVC, validateMaldivesPhone, validateName, formatCardNumber, formatExpiry } from "../lib/validation"

// --- Validation Schema ---
const checkoutSchema = z.object({
    // Customer Details
    email: z.string()
        .min(1, "Email is required")
        .email("Please enter a valid email address")
        .toLowerCase(),

    phone: z.string()
        .min(1, "Phone number is required")
        .refine(validateMaldivesPhone, {
            message: "Please enter a valid Maldives phone number (7 digits, e.g., 7771234 or +960 777-1234)"
        }),

    firstName: z.string()
        .min(1, "First name is required")
        .refine((val) => validateName(val, 2), {
            message: "First name must be at least 2 characters and contain only letters"
        }),

    lastName: z.string()
        .min(1, "Last name is required")
        .refine((val) => validateName(val, 2), {
            message: "Last name must be at least 2 characters and contain only letters"
        }),

    address: z.string()
        .min(5, "Address must be at least 5 characters")
        .max(200, "Address is too long"),

    city: z.string()
        .min(2, "City name must be at least 2 characters")
        .max(50, "City name is too long"),

    state: z.string()
        .min(1, "Please select a state/atoll"),

    zip: z.string().optional(),
    country: z.string().default("Maldives"),
    instructions: z.string().max(500, "Instructions are too long").optional(),
    saveInfo: z.boolean().default(false),

    // Payment Details
    paymentMethod: z.enum(["card", "bml", "transfer", "paypal", "cod"]),

    // Card details - conditionally required
    cardName: z.string().optional(),
    cardNumber: z.string().optional(),
    cardExpiry: z.string().optional(),
    cardCvc: z.string().optional(),

    terms: z.boolean().refine(val => val === true, {
        message: "You must agree to the Terms & Conditions",
    }),
}).superRefine((data, ctx) => {
    // If payment method is card, validate card details
    if (data.paymentMethod === "card") {
        // Validate card name
        if (!data.cardName || data.cardName.trim().length < 3) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Cardholder name is required (min 3 characters)",
                path: ["cardName"],
            });
        } else if (!validateName(data.cardName, 3)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Please enter a valid cardholder name",
                path: ["cardName"],
            });
        }

        // Validate card number
        if (!data.cardNumber || data.cardNumber.trim().length === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Card number is required",
                path: ["cardNumber"],
            });
        } else if (!validateCardNumber(data.cardNumber)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Please enter a valid card number",
                path: ["cardNumber"],
            });
        }

        // Validate expiry
        if (!data.cardExpiry || data.cardExpiry.trim().length === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Expiry date is required",
                path: ["cardExpiry"],
            });
        } else if (!validateCardExpiry(data.cardExpiry)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Please enter a valid expiry date (MM/YY) that hasn't expired",
                path: ["cardExpiry"],
            });
        }

        // Validate CVC
        if (!data.cardCvc || data.cardCvc.trim().length === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "CVC is required",
                path: ["cardCvc"],
            });
        } else if (!validateCVC(data.cardCvc, data.cardNumber || '')) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Please enter a valid CVC code (3-4 digits)",
                path: ["cardCvc"],
            });
        }
    }
});

export function CheckoutPage() {
    const navigate = useNavigate()
    const { currentUser, loading } = useAuth()
    const { cart, clearCart } = useCart()
    const { currency, formatPrice, convertPrice } = useCurrency()
    const [step, setStep] = useState(1)
    const [isProcessing, setIsProcessing] = useState(false)
    const [showOrderSummary, setShowOrderSummary] = useState(false)
    const [error, setError] = useState(''); // Added error state

    // Form Setup
    const form = useForm({
        resolver: zodResolver(checkoutSchema),
        defaultValues: async () => {
            const saved = localStorage.getItem("checkout_draft")
            if (saved) {
                try {
                    return JSON.parse(saved)
                } catch (e) { console.error(e) }
            }
            return {
                country: "Maldives",
                paymentMethod: "card",
                saveInfo: false,
            }
        },
        mode: "onChange"
    })

    // Auto-save draft
    const { register, handleSubmit, watch, trigger, formState: { errors } } = form
    // eslint-disable-next-line react-hooks/incompatible-library
    const formValues = watch()

    // Save to local storage on change
    // Using a simple effect without debounce for this demo, keeping it lightweight
    useEffect(() => {
        // Only save if the form is dirty (i.e., values have changed from initial load)
        // This prevents saving the default values immediately after loading from local storage
        if (form.formState.isDirty) {
            localStorage.setItem("checkout_draft", JSON.stringify(formValues))
        }
    }, [formValues, form.formState.isDirty])

    const paymentMethod = watch("paymentMethod")

    // Calculations (Base MVR)
    // Ensure item.price is treated as MVR
    const subtotalMVR = cart.reduce((acc, item) => acc + (item.price || item.priceMVR || 0) * item.quantity, 0)

    // Shipping Rules
    const isFreeShippingMVR = subtotalMVR > 2500

    const isCod = paymentMethod === "cod"
    const codFeeMVR = isCod ? 50 : 0

    const shippingBaseMVR = isFreeShippingMVR ? 0 : 35

    const finalShippingMVR = shippingBaseMVR + codFeeMVR

    const taxMVR = subtotalMVR * 0.06 // 6% GST

    const totalMVR = subtotalMVR + finalShippingMVR + taxMVR

    // Helper to format MVR value to current currency
    const formatMVR = (amount) => formatPrice(convertPrice(amount, 'MVR'));

    // Step Navigation
    const nextStep = async () => {
        let fieldsToValidate = []
        if (step === 1) {
            fieldsToValidate = ["email", "phone", "firstName", "lastName", "address", "city", "state"]
        } else if (step === 2) {
            // In a real app, validate payment fields here if payment method is 'card'
        }

        const isStepValid = await trigger(fieldsToValidate)
        if (isStepValid) {
            setStep(prev => prev + 1)
            window.scrollTo(0, 0)
        }
    }

    const prevStep = () => {
        setStep(prev => prev - 1)
        window.scrollTo(0, 0)
    }

    // Redirect if cart is empty - "The Smooth Flow"
    useEffect(() => {
        if (cart.length === 0 && !isProcessing && !location.search.includes('orderId')) {
            navigate('/');
        }
    }, [cart, navigate, isProcessing, location]);

    const onSubmit = async (data) => {
        setIsProcessing(true)
        setError('') // Clear any previous errors
        try {
            // "The Smooth Flow" - Payment Method Check
            // (Validated by Zod Schema already, but extra safety check)
            if (!data.paymentMethod) {
                setStep(2); // Go to payment step
                window.scrollTo(0, 0);
                throw new Error("Please select a payment method");
            }

            // Fix: Map cart items to match backend expectation (orderItems)
            const orderItems = cart.map(item => ({
                product: item.productId || item._id, // Use productId from CartContext
                name: item.name || item.title,
                qty: item.quantity, // User suggested qty, keeping compatibility if backend changes, but we know mappings
                quantity: item.quantity, // Send both to be safe or just quantity if backend updated
                image: item.image,
                price: item.price || item.priceMVR,
                size: item.size,
                color: item.color
            }))

            const orderData = {
                orderItems: orderItems, // Renamed from items to orderItems
                shippingAddress: {
                    address: data.address,
                    city: data.city,
                    postalCode: data.zip || "",
                    country: data.country,
                    state: data.state,
                },
                paymentMethod: data.paymentMethod,
                itemsPrice: subtotalMVR, // Renamed to match backend (itemsPrice)
                taxPrice: taxMVR,        // Renamed to match backend (taxPrice)
                shippingPrice: finalShippingMVR, // Renamed to match backend (shippingPrice)
                totalPrice: totalMVR,    // Renamed to match backend (totalPrice)
                currency: currency,
                notes: data.instructions || '',
            }

            const createdOrder = await ordersAPI.create(orderData);

            if (data.saveInfo) {
                // Future: Save profile info
            }

            localStorage.removeItem("checkout_draft")
            clearCart(); // Clear cart using CartContext


            navigate(`/order-success?orderId=${createdOrder._id}`)
        } catch (error) {
            console.error('Checkout error:', error);

            // Better error handling
            if (error.message === 'Network Error') {
                setError('Cannot connect to server. Please check your internet connection.');
            } else if (error.response?.status === 404) {
                setError('Order endpoint not found. Please contact support.');
            } else if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError('Failed to process order. Please try again.');
            }
        } finally {
            setIsProcessing(false)
        }
    }

    if (cart.length === 0) {
        return null; // Redirecting...
    }

    if (loading) {
        return null; // Wait for auth to resolve
    }

    if (!currentUser) {
        return <Navigate to="/login" state={{ from: '/checkout' }} replace />;
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20">
            {/* Mobile Order Summary Toggle (Shopify Style) */}
            <div className="lg:hidden bg-gray-50 border-y border-gray-200">
                <div className="container py-4">
                    <button
                        type="button"
                        onClick={() => setShowOrderSummary(!showOrderSummary)}
                        className="flex items-center justify-between w-full text-sm text-primary"
                    >
                        <div className="flex items-center gap-2 text-primary font-medium">
                            <span className="text-secondary">
                                {showOrderSummary ? "Hide" : "Show"} order summary
                            </span>
                            {showOrderSummary ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                        <span className="font-serif font-bold text-lg">
                            {formatMVR(totalMVR)}
                        </span>
                    </button>

                    <AnimatePresence>
                        {showOrderSummary && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="pt-6 pb-2 space-y-4 border-t border-gray-100 mt-4">
                                    {/* Items List */}
                                    <div className="space-y-3">
                                        {cart.map((item, idx) => (
                                            <div key={`${item.id}-${idx}`} className="flex gap-4 items-center">
                                                <div className="relative w-16 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0 border border-gray-200">
                                                    <div className="absolute -top-2 -right-2 bg-gray-500 text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center z-10 font-medium">
                                                        {item.quantity}
                                                    </div>
                                                    <img src={item.image} className="w-full h-full object-cover" alt={item.title} />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900">{item.title}</p>
                                                    <p className="text-xs text-gray-500">{item.size} / {item.color}</p>
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">{formatMVR((item.price || item.priceMVR || 0) * item.quantity)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Totals */}
                                    <div className="space-y-3 pt-4 border-t border-gray-100 text-sm">
                                        <div className="flex justify-between text-gray-600">
                                            <span>Subtotal</span>
                                            <span>{formatMVR(subtotalMVR)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span>Shipping</span>
                                            <span>{finalShippingMVR === 0 ? "Free" : formatMVR(finalShippingMVR)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span>GST (6%)</span>
                                            <span>{formatMVR(taxMVR)}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center font-serif font-bold text-xl pt-4 border-t border-gray-100">
                                        <span>Total</span>
                                        <span>{formatMVR(totalMVR)}</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="container mt-8 lg:mt-0">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* LEFT COLUMN - FORM STEPS */}
                    <div className="w-full lg:w-[60%] space-y-6">

                        {/* Progress Bar */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
                            <div className="flex justify-between relative">
                                {/* Gray line behind */}
                                <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-100 -z-10 -translate-y-1/2" />

                                {["Shipping", "Payment", "Review"].map((label, index) => {
                                    const stepNum = index + 1
                                    const isActive = step >= stepNum
                                    const isCurrent = step === stepNum

                                    return (
                                        <div key={label} className="flex flex-col items-center gap-2 bg-white px-2">
                                            <div className={cn(
                                                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300",
                                                isActive ? "bg-secondary text-white" : "bg-gray-100 text-gray-400",
                                                isCurrent && "ring-4 ring-secondary/20"
                                            )}>
                                                {isActive && step > stepNum ? <Check className="w-4 h-4" /> : stepNum}
                                            </div>
                                            <span className={cn(
                                                "text-xs font-medium uppercase tracking-wider",
                                                isActive ? "text-secondary" : "text-gray-400"
                                            )}>{label}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* STEP 1: SHIPPING */}
                        {step === 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-white p-6 lg:p-8 rounded-lg shadow-sm border border-gray-100 space-y-6 lg:space-y-8"
                            >
                                <div>
                                    <h2 className="text-xl lg:text-2xl font-serif font-bold mb-6 flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-secondary" /> Shipping Information
                                    </h2>

                                    <div className="space-y-6">
                                        {/* Contact */}
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Email Address *</label>
                                                <input
                                                    {...register("email")}
                                                    className={cn("w-full px-4 py-3 md:py-2 text-base md:text-sm border rounded-md focus:ring-secondary focus:border-secondary", errors.email && "border-red-500")}
                                                    placeholder="you@example.com"
                                                />
                                                {errors.email?.message && <p className="text-red-500 text-xs">{errors.email.message?.toString()}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Phone Number *</label>
                                                <input
                                                    {...register("phone")}
                                                    className={cn("w-full px-4 py-3 md:py-2 text-base md:text-sm border rounded-md focus:ring-secondary focus:border-secondary", errors.phone && "border-red-500")}
                                                    placeholder="+960 777-1234"
                                                />
                                                {errors.phone?.message && <p className="text-red-500 text-xs">{errors.phone.message?.toString()}</p>}
                                            </div>
                                        </div>

                                        {/* Name */}
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">First Name *</label>
                                                <input
                                                    {...register("firstName")}
                                                    className={cn("w-full px-4 py-3 md:py-2 text-base md:text-sm border rounded-md focus:ring-secondary focus:border-secondary", errors.firstName && "border-red-500")}
                                                />
                                                {errors.firstName?.message && <p className="text-red-500 text-xs">{errors.firstName.message?.toString()}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Last Name *</label>
                                                <input
                                                    {...register("lastName")}
                                                    className={cn("w-full px-4 py-3 md:py-2 text-base md:text-sm border rounded-md focus:ring-secondary focus:border-secondary", errors.lastName && "border-red-500")}
                                                />
                                                {errors.lastName?.message && <p className="text-red-500 text-xs">{errors.lastName.message?.toString()}</p>}
                                            </div>
                                        </div>

                                        {/* Address */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Address *</label>
                                            <input
                                                {...register("address")}
                                                className={cn("w-full px-4 py-3 md:py-2 text-base md:text-sm border rounded-md focus:ring-secondary focus:border-secondary", errors.address && "border-red-500")}
                                                placeholder="Street address, apartment, suite, etc."
                                            />
                                            {errors.address?.message && <p className="text-red-500 text-xs">{errors.address.message?.toString()}</p>}
                                        </div>

                                        <div className="grid md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">City *</label>
                                                <input
                                                    {...register("city")}
                                                    className={cn("w-full px-4 py-3 md:py-2 text-base md:text-sm border rounded-md focus:ring-secondary focus:border-secondary", errors.city && "border-red-500")}
                                                />
                                                {errors.city?.message && <p className="text-red-500 text-xs">{errors.city.message?.toString()}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">State / Atoll *</label>
                                                <select
                                                    {...register("state")}
                                                    className={cn("w-full px-4 py-3 md:py-2 text-base md:text-sm border rounded-md focus:ring-secondary focus:border-secondary bg-white", errors.state && "border-red-500")}
                                                >
                                                    <option value="">Select Atoll...</option>
                                                    <option value="male">Male&apos; City</option>
                                                    <option value="hulhumale">Hulhumale&apos;</option>
                                                    <option value="addu">Addu City</option>
                                                    <option value="fuvahmulah">Fuvahmulah City</option>
                                                    <option value="haa_alif">Haa Alif</option>
                                                    {/* Add more atolls */}
                                                </select>
                                                {errors.state?.message && <p className="text-red-500 text-xs">{errors.state.message?.toString()}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Postal Code</label>
                                                <input
                                                    {...register("zip")}
                                                    className="w-full px-4 py-3 md:py-2 text-base md:text-sm border rounded-md focus:ring-secondary focus:border-secondary"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Delivery Instructions (Optional)</label>
                                            <textarea
                                                {...register("instructions")}
                                                className="w-full px-4 py-3 md:py-2 text-base md:text-sm border rounded-md focus:ring-secondary focus:border-secondary h-24 resize-none"
                                                placeholder="Special instructions for delivery..."
                                            />
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <input type="checkbox" id="saveInfo" {...register("saveInfo")} className="rounded text-secondary focus:ring-secondary" />
                                            <label htmlFor="saveInfo" className="text-sm text-gray-600">Save this information for next time</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-6 border-t flex justify-end">
                                    <Button type="button" onClick={nextStep} className="w-full md:w-auto bg-secondary text-white px-8 py-3 rounded-md hover:bg-primary transition-colors">
                                        Continue to Payment
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 2: PAYMENT */}
                        {step === 2 && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white p-6 lg:p-8 rounded-lg shadow-sm border border-gray-100 space-y-6 lg:space-y-8"
                            >
                                <div>
                                    <h2 className="text-xl lg:text-2xl font-serif font-bold mb-6 flex items-center gap-2">
                                        <CreditCard className="w-5 h-5 text-secondary" /> Payment Method
                                    </h2>

                                    <div className="space-y-4">

                                        {/* Card Option */}
                                        <label className={cn(
                                            "flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-all",
                                            paymentMethod === "card" ? "border-secondary bg-secondary/5 ring-1 ring-secondary" : "hover:border-gray-300"
                                        )}>
                                            <input type="radio" value="card" {...register("paymentMethod")} className="mt-1 text-secondary focus:ring-secondary" />
                                            <div className="space-y-1 w-full">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-bold text-primary">Credit / Debit Card</span>
                                                    <div className="flex gap-2">
                                                        {/* Icons placeholder */}
                                                        <div className="w-8 h-5 bg-gray-200 rounded" />
                                                        <div className="w-8 h-5 bg-gray-200 rounded" />
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-500">Secure encrypted transaction</p>

                                                <AnimatePresence>
                                                    {paymentMethod === "card" && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="pt-4 space-y-4"
                                                        >
                                                            <div className="space-y-1">
                                                                <input
                                                                    {...register("cardNumber")}
                                                                    placeholder="1234 5678 9012 3456"
                                                                    className={cn("w-full px-4 py-3 md:py-2 text-base md:text-sm border rounded-md", errors.cardNumber && "border-red-500")}
                                                                    maxLength={19}
                                                                    onChange={(e) => {
                                                                        const formatted = formatCardNumber(e.target.value);
                                                                        e.target.value = formatted;
                                                                        register("cardNumber").onChange(e);
                                                                    }}
                                                                />
                                                                {errors.cardNumber?.message && <p className="text-red-500 text-xs">{errors.cardNumber.message?.toString()}</p>}
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div className="space-y-1">
                                                                    <input
                                                                        {...register("cardExpiry")}
                                                                        placeholder="MM / YY"
                                                                        className={cn("w-full px-4 py-3 md:py-2 text-base md:text-sm border rounded-md", errors.cardExpiry && "border-red-500")}
                                                                        maxLength={5}
                                                                        onChange={(e) => {
                                                                            const formatted = formatExpiry(e.target.value);
                                                                            e.target.value = formatted;
                                                                            register("cardExpiry").onChange(e);
                                                                        }}
                                                                    />
                                                                    {errors.cardExpiry?.message && <p className="text-red-500 text-xs">{errors.cardExpiry.message?.toString()}</p>}
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <input
                                                                        {...register("cardCvc")}
                                                                        placeholder="CVC"
                                                                        className={cn("w-full px-4 py-3 md:py-2 text-base md:text-sm border rounded-md", errors.cardCvc && "border-red-500")}
                                                                        maxLength={4}
                                                                        type="text"
                                                                        inputMode="numeric"
                                                                        pattern="[0-9]*"
                                                                    />
                                                                    {errors.cardCvc?.message && <p className="text-red-500 text-xs">{errors.cardCvc.message?.toString()}</p>}
                                                                </div>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <input
                                                                    {...register("cardName")}
                                                                    placeholder="Name on Card"
                                                                    className={cn("w-full px-4 py-3 md:py-2 text-base md:text-sm border rounded-md", errors.cardName && "border-red-500")}
                                                                />
                                                                {errors.cardName?.message && <p className="text-red-500 text-xs">{errors.cardName.message?.toString()}</p>}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </label>

                                        {/* BML Transfer */}
                                        <label className={cn(
                                            "flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-all",
                                            paymentMethod === "bml" ? "border-secondary bg-secondary/5 ring-1 ring-secondary" : "hover:border-gray-300"
                                        )}>
                                            <input type="radio" value="bml" {...register("paymentMethod")} className="mt-1 text-secondary focus:ring-secondary" />
                                            <div className="space-y-1">
                                                <span className="font-bold text-primary">Bank of Maldives (BML)</span>
                                                <p className="text-sm text-gray-500">Redirects to BML secure gateway</p>
                                            </div>
                                        </label>

                                        {/* COD */}
                                        <label className={cn(
                                            "flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-all",
                                            paymentMethod === "cod" ? "border-secondary bg-secondary/5 ring-1 ring-secondary" : "hover:border-gray-300"
                                        )}>
                                            <input type="radio" value="cod" {...register("paymentMethod")} className="mt-1 text-secondary focus:ring-secondary" />
                                            <div className="space-y-1">
                                                <span className="font-bold text-primary">Cash on Delivery</span>
                                                <p className="text-sm text-gray-500">Pay when you receive your order</p>
                                                {currency === 'MVR' && <p className="text-xs text-orange-600 font-medium">Note: MVR 50 handling fee applies</p>}
                                            </div>
                                        </label>

                                    </div>

                                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md flex items-start gap-3 mt-6">
                                        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-yellow-800">
                                            <strong>Demo Mode:</strong> No real money will be charged. This is a university project demonstration.
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-6 border-t flex flex-col-reverse md:flex-row justify-between gap-4">
                                    <Button type="button" variant="ghost" onClick={prevStep} className="w-full md:w-auto">Back</Button>
                                    <Button type="button" onClick={nextStep} className="w-full md:w-auto bg-secondary text-white px-8 py-3 rounded-md hover:bg-primary transition-colors">
                                        Continue to Review
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 3: REVIEW */}
                        {step === 3 && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white p-6 lg:p-8 rounded-lg shadow-sm border border-gray-100 space-y-6 lg:space-y-8"
                            >
                                <h2 className="text-xl lg:text-2xl font-serif font-bold mb-6">Review Order</h2>

                                {/* Info Recap */}
                                <div className="grid md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg">
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-2 flex justify-between">
                                            Shipping
                                            <button type="button" onClick={() => setStep(1)} className="text-xs text-secondary underline">Edit</button>
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            {watch("firstName")} {watch("lastName")}<br />
                                            {watch("address")}<br />
                                            {watch("city")}, {watch("state")}<br />
                                            {watch("phone")}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-2 flex justify-between">
                                            Payment
                                            <button type="button" onClick={() => setStep(2)} className="text-xs text-secondary underline">Edit</button>
                                        </h4>
                                        <p className="text-sm text-gray-600 capitalize">
                                            Method: {paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod}<br />
                                        </p>
                                    </div>
                                </div>

                                {/* Items Preview (Hidden on Mobile as it's repetitive with top summary, but can keep for context) */}
                                <div className="space-y-4">
                                    <h4 className="font-bold text-gray-900">Items ({cart.reduce((a, c) => a + c.quantity, 0)})</h4>
                                    <div className="max-h-60 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                                        {cart.map((item, idx) => (
                                            <div key={`${item.id}-${idx}`} className="flex gap-4 items-center border-b border-gray-100 pb-3">
                                                <div className="w-12 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                                    <img src={item.image} className="w-full h-full object-cover" alt={item.title} />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium line-clamp-1">{item.title}</p>
                                                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                </div>
                                                <span className="text-sm font-medium">{formatMVR((item.price || item.priceMVR || 0) * item.quantity)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* T&C */}
                                <div className="space-y-3 pt-4 border-t">
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input type="checkbox" {...register("terms")} className="mt-1 rounded text-secondary focus:ring-secondary" />
                                        <p className="text-gray-500">It&apos;s free and easy!</p>
                                        <Link to="/login" className="text-sm font-bold underline hover:text-secondary">Sign up for an account</Link> and <a href="#" className="underline text-secondary">Return Policy</a>. *
                                    </label>
                                    {errors.terms?.message && <p className="text-red-500 text-xs pl-7">{errors.terms.message?.toString()}</p>}
                                </div>

                                <div className="pt-6 border-t flex flex-col-reverse md:flex-row justify-between items-center gap-4">
                                    <Button type="button" variant="ghost" onClick={prevStep} className="w-full md:w-auto">Back</Button>
                                    <div className="flex flex-col items-center gap-2 w-full md:w-auto">
                                        {error && (
                                            <div className="text-red-500 text-sm mb-2 text-center bg-red-50 p-2 rounded border border-red-200 w-full">
                                                {error}
                                            </div>
                                        )}
                                        <Button
                                            type="submit"
                                            disabled={isProcessing}
                                            className="w-full bg-secondary text-white px-10 py-4 rounded-md hover:bg-primary transition-all text-lg shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {isProcessing ? "Processing..." : `Place Order - ${formatMVR(totalMVR)}`}
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* RIGHT COLUMN - ORDER SUMMARY (Desktop Specific) */}
                    <div className="hidden lg:block w-full lg:w-[40%]">
                        <div className="sticky top-24 space-y-6">
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                <h3 className="text-xl font-serif font-bold mb-6 border-b pb-4">Order Summary</h3>

                                <div className="space-y-4 text-sm mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>{formatMVR(subtotalMVR)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span className="flex items-center gap-1">Shipping <Truck className="w-3 h-3" /></span>
                                        <span>{finalShippingMVR === 0 ? <span className="text-green-600 font-medium">Free</span> : formatMVR(finalShippingMVR)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>GST (6%)</span>
                                        <span>{formatMVR(taxMVR)}</span>
                                    </div>

                                    <div className="border-t pt-4 flex justify-between items-center font-bold text-lg text-primary">
                                        <span>Total</span>
                                        <span>{formatMVR(totalMVR)}</span>
                                    </div>
                                </div>

                                {/* Promo Code */}
                                <div className="flex gap-2 mb-6">
                                    <input placeholder="Promo Code" className="flex-1 px-3 py-2 border rounded-md text-sm" />
                                    <Button variant="outline" size="sm">Apply</Button>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                        <Lock className="w-3 h-3" />
                                        Secure SSL Encryption
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                        <Smartphone className="w-3 h-3" />
                                        Need help? <button onClick={() => openWhatsApp("I need help with my checkout.")} className="text-secondary hover:underline">Chat on WhatsApp</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    )
}

