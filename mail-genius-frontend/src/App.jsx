import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './auth/AuthProvider'; // Import useAuth
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { AppSidebar } from "./components/AppSidebar"
import { SiteHeader } from "./components/SiteHeader"
import EmailGenerator from "./pages/EmailGenerator"
import EmailInbox from './pages/EmailInbox.jsx';
import Login from './pages/Login.jsx';
import { Route, Routes, Navigate } from 'react-router-dom'
import EmailInboxProvider from './contexts/EmailInboxContext';
import { EmailAiProvider } from './contexts/EmailAiContext';

// New component to encapsulate authenticated content
function AuthAppContent() {
  const { accessToken, loading } = useAuth();

  if (loading) {
    return <div>Loading application...</div>; // Or a more sophisticated loading spinner
  }

  return (
    <SidebarProvider className="flex flex-col h-full">
      <SiteHeader />
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar />
        <EmailInboxProvider>
          <EmailAiProvider>
            <SidebarInset className="h-full">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/"
                  element= <EmailGenerator />
                />
                <Route
                  path="/email/inbox"
                  element={accessToken ? <EmailInbox /> : <Navigate to="/login" />}
                />
                {/* <Route path="/templates" element={<Templates />} /> */}
                {/* <Route path="/settings" element={<Settings />} /> */}
              </Routes>
            </SidebarInset>
          </EmailAiProvider>
        </EmailInboxProvider>
      </div>
    </SidebarProvider>
  );
}

export default function Page() {
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <div className="h-screen">
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <AuthAppContent />
        </AuthProvider>
      </GoogleOAuthProvider>
    </div>
  )
}
