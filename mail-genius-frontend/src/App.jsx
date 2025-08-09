import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { AppSidebar } from "./components/AppSidebar"
import { SiteHeader } from "./components/SiteHeader"
import EmailGenerator from "./pages/Email-Generator"

export default function Page() {
  return (
    <div className="">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <EmailGenerator />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}
