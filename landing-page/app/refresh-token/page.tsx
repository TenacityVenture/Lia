'use client';
import { useEffect, useState } from 'react';

export default function RefreshTokenPage() {
  const [loading, setLoading] = useState(true);

  // sends request to the server to refresh the token
  // This is a placeholder function, you can implement your own logic here
  const refreshToken = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        setLoading(false);
        console.error('Failed to refresh token:', response.statusText);
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
        localStorage.setItem('lia_access_token', data.access_token);
        // for security reasons i will not store the refresh token in local storage
        //localStorage.setItem('lia_refresh_token', data.refresh_token);

        // send jwts to chrome extension
        window.postMessage({ type: "SEND_JWTs", 
          access_token: data.access_token, 
          refresh_token: data.refresh_token}, "*") // * means all domains (shoule be restricted to lia extension id)
        
        // Redirect to the previous page or default to dashboard
        const previousPage = document.referrer && new URL(document.referrer).origin === window.location.origin
          ? new URL(document.referrer).pathname
          : '/dashboard';
        window.location.href = previousPage;
    } catch (error) {
      setLoading(false);
      console.error('Error refreshing token:', error);
    }
  };
  // Call the refresh token function when the component mounts
  useEffect(() => {
    refreshToken();
  }, []);

  return (
    !loading ? (<div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Refresh Token</h1>
      <p className="text-gray-600 mb-6">
        This page is used to refresh your authentication token.
      </p>
      <p className="text-gray-600 mb-6">
        If you are seeing this page, it means your session has expired. Please log in again.
      </p>
      <a
        href="/login"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Go to Login
      </a>
    </div>) : (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
        <h1 className="text-2xl font-bold mb-4">Refreshing Token...</h1>
        <p className="text-gray-600 mb-6">
        Please wait while we refresh your authentication token.
        </p>
      </div>
    )
  )
}