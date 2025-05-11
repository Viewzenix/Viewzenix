'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      router.push('/auth/login');
    } else {
      // Redirect to dashboard if authenticated
      router.push('/dashboard');
    }
  }, [router]);

  return null; // No UI needed for this redirector page
}