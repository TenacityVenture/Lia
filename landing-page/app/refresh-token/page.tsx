import { useEffect } from 'react';

export default function RefreshTokenPage() {

  // sends request to the server to refresh the token
  // This is a placeholder function, you can implement your own logic here
  const refreshToken = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
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

    } catch (error) {
      console.error('Error refreshing token:', error);
    }
  };
  // Call the refresh token function when the component mounts
  useEffect(() => {
    refreshToken();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
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
    </div>
  )
}