import React from 'react';
import {
  GalleryVerticalEnd,
  Settings2,
  MailIcon,
  WandSparklesIcon,
} from "lucide-react"

import { NavMain } from "@/components/NavMain.jsx"
import { NavUser } from "@/components/NavUser.jsx"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { CustomSidebarTrigger } from "./CustomSidebarTrigger"

const data = {
  user: {
    name: "Shyam",
    email: "shyam@gmail.com",
    avatar: "https://ui.shadcn.com/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Email Generator",
      url: "#",
      icon: WandSparklesIcon,
      isActive: true,
    },
    {
      title: "Mailbox",
      url: "#",
      icon: MailIcon,
    },
    {
      title: "Templates",
      url: "#",
      icon: GalleryVerticalEnd,
    },
    {
      title: "Configuration",
      url: "#",
      icon: Settings2,
    },
  ],
}

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props} className="h-[calc(100vh-3rem)] border-r-0 relative">
      <CustomSidebarTrigger />
      <SidebarHeader>
        {/* <TeamSwitcher teams={data.teams} /> */}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
