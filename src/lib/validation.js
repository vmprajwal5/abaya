/**
 * Validation utilities for forms
 */

/**
 * Luhn algorithm for credit card validation
 * @param {string} cardNumber - Card number to validate
 * @returns {boolean} - True if valid
 */
export function validateCardNumber(cardNumber) {
    // Remove spaces and dashes
    const cleaned = cardNumber.replace(/[\s-]/g, '');

    // Must be digits only
    if (!/^\d+$/.test(cleaned)) return false;

    // Must be 13-19 digits (standard card length)
    if (cleaned.length < 13 || cleaned.length > 19) return false;

    // Luhn algorithm
    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
        let digit = parseInt(cleaned[i], 10);

        if (isEven) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }

        sum += digit;
        isEven = !isEven;
    }

    return sum % 10 === 0;
}

/**
 * Validate card expiry date
 * @param {string} expiry - Expiry date in MM/YY format
 * @returns {boolean} - True if valid and not expired
 */
export function validateCardExpiry(expiry) {
    // Check format MM/YY or MM/YYYY
    const match = expiry.match(/^(\d{2})\/(\d{2}|\d{4})$/);
    if (!match) return false;

    const month = parseInt(match[1], 10);
    let year = parseInt(match[2], 10);

    // Validate month
    if (month < 1 || month > 12) return false;

    // Convert 2-digit year to 4-digit
    if (year < 100) {
        year += 2000;
    }

    // Check if expired
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 0-indexed

    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;

    return true;
}

/**
 * Validate CVC code
 * @param {string} cvc - CVC code
 * @param {string} cardNumber - Card number (optional, for Amex detection)
 * @returns {boolean} - True if valid
 */
export function validateCVC(cvc, cardNumber = '') {
    // Remove spaces
    const cleaned = cvc.replace(/\s/g, '');

    // Must be digits only
    if (!/^\d+$/.test(cleaned)) return false;

    // Amex cards have 4-digit CVC, others have 3
    const isAmex = cardNumber.replace(/\s/g, '').startsWith('34') ||
        cardNumber.replace(/\s/g, '').startsWith('37');

    const expectedLength = isAmex ? 4 : 3;
    return cleaned.length === expectedLength;
}

/**
 * Validate Maldives phone number
 * @param {string} phone - Phone number
 * @returns {boolean} - True if valid
 */
export function validateMaldivesPhone(phone) {
    // Remove spaces, dashes, and parentheses
    const cleaned = phone.replace(/[\s\-()]/g, '');

    // Remove country code if present
    const withoutCountryCode = cleaned.replace(/^\+?960/, '');

    // Maldives mobile numbers are 7 digits
    // Landline can be 6-7 digits
    return /^\d{6,7}$/.test(withoutCountryCode);
}

/**
 * Validate name (allows letters, spaces, hyphens, apostrophes)
 * @param {string} name - Name to validate
 * @param {number} minLength - Minimum length
 * @returns {boolean} - True if valid
 */
export function validateName(name, minLength = 2) {
    if (!name || name.length < minLength) return false;

    // Allow letters (including unicode), spaces, hyphens, apostrophes
    return /^[a-zA-Z\u00C0-\u017F\s'-]+$/.test(name);
}

/**
 * Format card number with spaces
 * @param {string} value - Card number
 * @returns {string} - Formatted card number
 */
export function formatCardNumber(value) {
    const cleaned = value.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
}

/**
 * Format expiry date
 * @param {string} value - Expiry value
 * @returns {string} - Formatted expiry (MM/YY)
 */
export function formatExpiry(value) {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
        return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
}

/**
 * Get card type from number
 * @param {string} cardNumber - Card number
 * @returns {string} - Card type (visa, mastercard, amex, discover, etc.)
 */
export function getCardType(cardNumber) {
    const cleaned = cardNumber.replace(/\s/g, '');

    if (/^4/.test(cleaned)) return 'visa';
    if (/^5[1-5]/.test(cleaned)) return 'mastercard';
    if (/^3[47]/.test(cleaned)) return 'amex';
    if (/^6(?:011|5)/.test(cleaned)) return 'discover';
    if (/^(?:2131|1800|35)/.test(cleaned)) return 'jcb';

    return 'unknown';
}
