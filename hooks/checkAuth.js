import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const checkAuth = (setPageLoading) => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
    } else {  
        setPageLoading(false);
      }
  }, []);
};