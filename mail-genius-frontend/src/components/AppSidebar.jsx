import React from 'react';
import { NavMain } from "@/components/NavMain.jsx"
import { NavUser } from "@/components/NavUser.jsx"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { CustomSidebarTrigger } from "./CustomSidebarTrigger"
import { SIDEBAR } from '@/utils/constants';

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props} className="h-[calc(100vh-3rem)] border-r-0 relative">
      <CustomSidebarTrigger />
      <SidebarHeader>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={SIDEBAR.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={SIDEBAR.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
