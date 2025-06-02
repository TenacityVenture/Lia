export default function LogoutPage() {
  // Clear the access token cookie
  document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";    

    if (typeof window !== "undefined") {
        
        try {
            // Send a message to the extension to clear the tokens
            window.postMessage({ type: "CLEAR_TOKENS" }, "*"); // * means all domains (should be restricted to lia extension id)
        } catch (err) {
            console.warn("Error sending CLEAR_TOKENS message to extension:", err);
        }

        try {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("token");

        } catch (err) {
            console.warn("Error clearing localStorage:", err);
        }
    }

    return <div>You have been logged out.</div>;

}