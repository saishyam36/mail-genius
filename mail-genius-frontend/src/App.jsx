import React from 'react';
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { AppSidebar } from "./components/AppSidebar"
import { SiteHeader } from "./components/SiteHeader"
import EmailGenerator from "./pages/EmailGenerator"
import EmailInbox from './pages/EmailInbox.jsx';
import { Route, Routes } from 'react-router-dom'
import EmailInboxProvider from './contexts/EmailInboxContext';

export default function Page() {
  return (
    <div className="h-screen">
      <SidebarProvider className="flex flex-col h-full">
        <SiteHeader />
        <div className="flex flex-1 overflow-hidden">
          <AppSidebar />
          <EmailInboxProvider>
            <SidebarInset className="h-full">
              <Routes>
                <Route path="/" element={<EmailGenerator />} />
                <Route path="/email/inbox" element={<EmailInbox />} />
                {/* <Route path="/templates" element={<Templates />} /> */}
                {/* <Route path="/settings" element={<Settings />} /> */}
              </Routes>
            </SidebarInset>
          </EmailInboxProvider>
        </div>
      </SidebarProvider>
    </div>
  )
}
