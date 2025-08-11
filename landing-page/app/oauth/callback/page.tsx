'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash.substring(1); // remove the #
    const params = new URLSearchParams(hash);

    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');

    if (!access_token || !refresh_token) {
      console.error('Missing tokens');
      router.push('/login?error=oauth_failed');
      return;
    }

    const provider = new URLSearchParams(window.location.search).get('provider');
    const syncEndpoint = provider === 'google' ? '/api/auth/oauth/google-sync' : '/api/auth/oauth/linkedIn-sync';

    // 1. Save to localStorage
    localStorage.setItem('lia_access_token', access_token);

    // 2. Sync user to DB (optional if you're using SQL trigger)
    fetch(`${process.env.NEXT_PUBLIC_API_HOST}${syncEndpoint}?refresh_token=${refresh_token}`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${access_token}`
      },
      credentials: 'include'
    }).finally(() => {
        // 3. Send JWT to the website
      try {

        if (access_token && refresh_token) {
          // Send tokens to the extension
          window.postMessage({
              type: 'SEND_JWTs',
              access_token,
              refresh_token
          }, 'https://www.getlia.live');
        }
      } catch (err) {
        console.warn('Error sending JWT to Website:', err);
      }

      // 4. Redirect to dashboard
      router.push('/onboarding?success=oauth_complete');
    });

    // send jwts to website (since contentscript will be listening there to then send to extension)
    if (access_token && refresh_token) {
      // Send tokens to the extension
      window.postMessage({
          type: 'SEND_JWTs',
          access_token,
          refresh_token
      }, 'https://www.getlia.live');
    }

    router.push('/dashboard');
  }, [router]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>🔄 Finishing sign-in…</h2>
      <p>Just a moment, redirecting...</p>
    </div>
  );
}
