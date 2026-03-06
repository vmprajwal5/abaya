// Utility to clear corrupted cart data from localStorage
// Run this in the browser console if you still see errors

console.log('Clearing corrupted cart data...');
localStorage.removeItem('cart');
console.log('Cart cleared! Please refresh the page.');
