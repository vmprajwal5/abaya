import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center text-xs uppercase tracking-[0.1em] transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-black text-white hover:bg-gray-800 border border-black",
                outline: "border border-black bg-transparent text-black hover:bg-black hover:text-white",
                secondary: "bg-gray-100 text-black hover:bg-gray-200 border border-transparent",
                ghost: "hover:bg-gray-50 text-black",
                link: "text-black underline-offset-4 hover:underline decoration-1",
                white: "bg-white text-black border border-gray-200 hover:border-black",
            },
            size: {
                default: "h-12 px-8 py-3",
                sm: "h-9 px-4 text-[10px]",
                lg: "h-14 px-10 text-sm",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

/**
 * @typedef {Object} ButtonProps
 * @property {string} [className]
 * @property {"default" | "outline" | "secondary" | "ghost" | "link" | "white"} [variant]
 * @property {"default" | "sm" | "lg" | "icon"} [size]
 * @property {boolean} [asChild]
 * @property {React.ReactNode} [children]
 */

/**
 * @type {React.ForwardRefExoticComponent<ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement> & React.RefAttributes<HTMLButtonElement>>}
 */
const Button = React.forwardRef(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
