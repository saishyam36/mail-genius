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

export default function Page() {
  return (
    <div className="">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <Routes>
              <Route path="/" element={<EmailGenerator />} />
              {/* The :id is now optional to allow showing the list and content together */}
              <Route path="/email/inbox/:id?" element={<EmailInbox />} />
              {/* <Route path="/templates" element={<Templates />} /> */}
              {/* <Route path="/settings" element={<Settings />} /> */}
            </Routes>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}
