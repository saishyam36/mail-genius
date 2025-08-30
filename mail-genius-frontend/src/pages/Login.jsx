import React,{ useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login, accessToken, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && accessToken) {
      // If already logged in, redirect to inbox
      navigate('/email/inbox');
    }
  }, [accessToken, loading, navigate]);

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
