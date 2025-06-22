'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const accessToken = searchParams.get('access_token');

    if (accessToken) {
      localStorage.setItem('zoho_access_token', accessToken);
      console.log('Access token saved to localStorage');

      // Optionally navigate to dashboard or home
      router.push('/dashboard');
    }
  }, [searchParams, router]);

  return <p>Logging you in...</p>;
}
