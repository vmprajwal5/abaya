export const DEFAULT_PHONE = "9607771234"; // Placeholder Maldives number

export function generateWhatsAppLink(
    phone = DEFAULT_PHONE,
    message = ""
) {
    // Remove non-numeric characters from phone
    const cleanPhone = phone.replace(/[^\d]/g, "");

    // Encode message
    const encodedMessage = encodeURIComponent(message);

    // Check if mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const baseUrl = isMobile
        ? "https://api.whatsapp.com/send"
        : "https://web.whatsapp.com/send";

    return `${baseUrl}?phone=${cleanPhone}&text=${encodedMessage}`;
}

export function openWhatsApp(message = "") {
    const link = generateWhatsAppLink(DEFAULT_PHONE, message);
    window.open(link, "_blank");
}
