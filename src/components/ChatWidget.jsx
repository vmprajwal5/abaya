import { useState, useEffect, useRef } from "react"
import { MessageCircle, X, Send, Minus, ShoppingBag, Truck, Ruler, Phone } from "lucide-react"
import { cn } from "../lib/utils"
import { Button } from "./ui/button"
import { useLocation, useNavigate } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [isMinimized, setIsMinimized] = useState(false)
    const [inputValue, setInputValue] = useState("")
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem("chat_history")
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                return parsed.map((m) => ({ ...m, timestamp: new Date(m.timestamp) }))
            } catch (e) { console.error(e) }
        }
        return [{
            id: "welcome",
            text: "Hello! Welcome to Abaya Clothing.\nI'm here to assist you.",
            sender: "bot",
            timestamp: new Date()
        }]
    })
    const [isTyping, setIsTyping] = useState(false)
    const [hasUnread, setHasUnread] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const messagesEndRef = useRef(null)

    // Auto-scroll to bottom
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages, isOpen])

    // Save history
    useEffect(() => {
        if (messages.length > 0) {
            // Keep last 50 messages
            const history = messages.slice(-50)
            localStorage.setItem("chat_history", JSON.stringify(history))
        }
    }, [messages])

    // Context Awareness (Simple)
    const addBotMessage = (text) => {
        setMessages(prev => [...prev, {
            id: Math.random().toString(36).substr(2, 9),
            text,
            sender: "bot",
            timestamp: new Date()
        }])
    }

    const addUserMessage = (text) => {
        setMessages(prev => [...prev, {
            id: Math.random().toString(36).substr(2, 9),
            text,
            sender: "user",
            timestamp: new Date()
        }])
    }

    // Auto-trigger messages
    useEffect(() => {
        if (isOpen) return

        let timeout
        if (location.pathname.includes("/checkout")) {
            timeout = setTimeout(() => {
                addBotMessage("Do you need help with your order?")
                setHasUnread(true)
            }, 10000)
        }
        return () => clearTimeout(timeout)
    }, [location.pathname, isOpen])


    const handleSend = async () => {
        if (!inputValue.trim()) return

        const text = inputValue.trim()
        setInputValue("")
        addUserMessage(text)
        setIsTyping(true)

        // Simulate AI Delay
        setTimeout(() => {
            setIsTyping(false)
            const response = generateResponse(text)
            addBotMessage(response)
        }, 1500)
    }

    const generateResponse = (input) => {
        const lower = input.toLowerCase()

        if (lower.includes("price") || lower.includes("cost")) return "Standard Abayas start from MVR 1,200."
        if (lower.includes("shipping") || lower.includes("delivery")) return "We ship to all islands in the Maldives."
        if (lower.includes("return") || lower.includes("refund")) return "You can return unworn items within 30 days."
        if (lower.includes("size") || lower.includes("fit")) return "Our sizes range from XS to XXL. Please check the Size Guide."
        if (lower.includes("human") || lower.includes("agent")) return "Please click the WhatsApp button to chat with a human."

        return "Would you like to browse our latest collection?"
    }

    const quickAction = (action) => {
        if (action === "browse") {
            navigate("/shop")
            return
        }

        let text = ""
        if (action === "size") text = "Can you show me the size guide?"
        if (action === "track") text = "How do I track my order?"
        if (action === "human") text = "I want to speak to a human."

        addUserMessage(text)
        setIsTyping(true)
        setTimeout(() => {
            setIsTyping(false)
            addBotMessage(generateResponse(text))
        }, 1000)
    }

    const handleOpen = () => {
        setIsOpen(true)
        setHasUnread(false)
    }

    return (
        <>
            {/* Floating Button */}
            <AnimatePresence>
                {!isOpen && !isMinimized && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={handleOpen}
                        className="fixed bottom-5 right-5 z-40 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform group shadow-none"
                    >
                        <MessageCircle className="w-6 h-6 text-white" />
                        <span className="absolute -inset-1 rounded-full border border-black opacity-0 group-hover:opacity-100 animate-ping duration-1000" />

                        {hasUnread && (
                            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                        )}
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {(isOpen || isMinimized) && (
                    <motion.div
                        initial={{ y: 20, opacity: 0, scale: 0.95 }}
                        animate={{
                            y: isMinimized ? 0 : 0,
                            opacity: 1,
                            scale: 1,
                            height: isMinimized ? "60px" : "500px",
                            width: isMinimized ? "200px" : "320px"
                        }}
                        exit={{ y: 20, opacity: 0, scale: 0.95 }}
                        className={cn(
                            "fixed bottom-5 right-5 z-50 bg-white shadow-xl overflow-hidden flex flex-col border border-gray-100 transition-all duration-300",
                            isMinimized ? "cursor-pointer" : ""
                        )}
                        onClick={() => isMinimized && setIsMinimized(false)}
                    >
                        {/* Header */}
                        <div className="bg-black text-white p-4 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                {isMinimized ? (
                                    <span className="font-medium text-xs uppercase tracking-wider">Chat</span>
                                ) : (
                                    <>
                                        <div>
                                            <h3 className="font-medium text-xs uppercase tracking-wider">Abaya Support</h3>
                                            <div className="flex items-center gap-1.5 mt-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                <span className="text-[10px] opacity-80 uppercase tracking-wide">Online</span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {!isMinimized && (
                                <div className="flex items-center gap-2">
                                    <button onClick={(e) => { e.stopPropagation(); setIsMinimized(true) }} className="hover:opacity-50 transition-opacity">
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); setIsOpen(false) }} className="hover:opacity-50 transition-opacity">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Body (Hidden if minimized) */}
                        {!isMinimized && (
                            <>
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
                                    {messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={cn(
                                                "flex w-full",
                                                msg.sender === "user" ? "justify-end" : "justify-start"
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    "max-w-[85%] px-4 py-3 text-xs leading-relaxed whitespace-pre-line border",
                                                    msg.sender === "user"
                                                        ? "bg-black text-white border-black"
                                                        : "bg-white text-black border-gray-100"
                                                )}
                                            >
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}

                                    {isTyping && (
                                        <div className="flex justify-start">
                                            <div className="bg-white border border-gray-100 px-4 py-3">
                                                <div className="flex gap-1">
                                                    <span className="w-1 h-1 bg-black rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                    <span className="w-1 h-1 bg-black rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                    <span className="w-1 h-1 bg-black rounded-full animate-bounce" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Quick Replies */}
                                {messages.length > 0 && messages[messages.length - 1].sender === "bot" && (
                                    <div className="px-4 py-2 bg-white border-t border-gray-50 flex gap-2 overflow-x-auto no-scrollbar">
                                        {[
                                            { id: 'browse', icon: ShoppingBag, label: 'Browse' },
                                            { id: 'size', icon: Ruler, label: 'Size Guide' },
                                            { id: 'track', icon: Truck, label: 'Track' },
                                            { id: 'human', icon: Phone, label: 'Human' }
                                        ].map(action => (
                                            <button
                                                key={action.id}
                                                onClick={() => quickAction(action.id)}
                                                className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 text-[10px] uppercase tracking-wider hover:bg-black hover:text-white transition-colors shrink-0"
                                            >
                                                <action.icon className="w-3 h-3" />
                                                {action.label}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Input Area */}
                                <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
                                    <input
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                        placeholder="TYPE A MESSAGE..."
                                        className="flex-1 bg-transparent border-b border-gray-200 px-0 py-2 text-xs focus:outline-none focus:border-black transition-colors placeholder:text-gray-300"
                                    />
                                    <button
                                        onClick={handleSend}
                                        disabled={!inputValue.trim()}
                                        className="w-8 h-8 bg-black text-white flex items-center justify-center hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                                    >
                                        <Send className="w-3 h-3" />
                                    </button>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
