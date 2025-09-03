import React, { useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Login() {
  const { login, accessToken, loading, isTokenExpired, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && accessToken) {
      const isExpired = isTokenExpired(accessToken);
      if (isExpired) {
        toast.error('Token expired. Redirecting to login.');
        logout();
        navigate('/login');
      } else {
        navigate('/email/inbox');
        toast.success('Logged in successfully!');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, loading]);

  if (loading) {
    return <div>Loading authentication status...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-[350px]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Login to Mail Genius</CardTitle>
          <CardDescription>
            Sign in with your Google account to access your emails.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button onClick={() => login()} className="w-full">
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
