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
import {
  GalleryVerticalEnd,
  Settings2,
  MailIcon,
  WandSparklesIcon,
} from "lucide-react"

const SIDEBAR = {
    user: {
        name: "Shyam",
        email: "shyam@gmail.com",
        avatar: "https://ui.shadcn.com/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Email Generator",
            url: "/",
            icon: WandSparklesIcon,
            isActive: true,
        },
        {
            title: "Mailbox",
            url: "/email/inbox",
            icon: MailIcon,
        },
        // {
        //     title: "Templates",
        //     url: "/templates",
        //     icon: GalleryVerticalEnd,
        // },
        {
            title: "Configuration",
            url: "/configuration",
            icon: Settings2,
        },
    ],
}

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props} className="h-[calc(100vh-3rem)] border-r-0 relative">
      <CustomSidebarTrigger />
      <SidebarHeader>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={SIDEBAR.navMain} />
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={SIDEBAR.user} />
      </SidebarFooter> */}
    </Sidebar>
  )
}
