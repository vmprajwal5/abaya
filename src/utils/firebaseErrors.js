export const getFirebaseErrorMessage = (error) => {
    if (!error || typeof error !== 'object' || !('code' in error)) {
        return "An unexpected error occurred. Please try again.";
    }

    const code = error.code;

    switch (code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
            return "Invalid email or password.";
        case 'auth/email-already-in-use':
        case 'auth/account-exists-with-different-credential':
            return "An account with this email already exists.";
        case 'auth/weak-password':
            return "Password should be at least 6 characters.";
        case 'auth/invalid-email':
            return "Please enter a valid email address.";
        case 'auth/too-many-requests':
            return "Too many failed login attempts. Please try again later.";
        case 'auth/network-request-failed':
            return "Network error. Please check your internet connection.";
        case 'auth/requires-recent-login':
            return "Please log in again to update your security settings.";
        case 'auth/popup-closed-by-user':
            return "Sign in cancelled.";
        default:
            return "Something went wrong. Please try again.";
    }
};
