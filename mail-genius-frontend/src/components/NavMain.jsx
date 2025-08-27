import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"

export function NavMain({
    items }) {
    return (
        <SidebarGroup>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <NavLink to={item.url}>
                            {({ isActive }) => (
                                <SidebarMenuButton
                                    tooltip={item.title}
                                    className={cn(
                                        "flex w-full items-center",
                                        isActive && "bg-slate-200 text-accent-foreground hover:bg-slate-300",
                                    )}
                                >
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </SidebarMenuButton>
                            )}
                        </NavLink>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
