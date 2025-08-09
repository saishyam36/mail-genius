import React from "react"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"


export function CustomSidebarTrigger({...props }) {
  const { toggleSidebar, state } = useSidebar()

  return (
    <Button
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className="absolute -right-3 top-1 z-20 h-6 w-6 rounded-full border bg-background shadow-md hover:bg-accent"
      onClick={(event) => {
        props.onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <ChevronLeft
        className={cn("h-3 w-3 transition-transform duration-300 ease-in-out", state === "collapsed" && "rotate-180")}
      />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}
