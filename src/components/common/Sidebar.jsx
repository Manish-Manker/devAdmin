import React from 'react'
import { Home, Users, Settings, Sun, Moon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTheme } from '@/contexts/ThemeContext'
import { Button } from '@/components/ui/button'

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar"

const AppSidebar = () => {
    const { theme, toggleTheme } = useTheme()

    const menuItems = [
        { title: "Dashboard", icon: Home, url: "/admin" },
        { title: "Users", icon: Users, url: "/admin/users" },
        { title: "Posts", icon: Users, url: "/admin/posts" },
        { title: "Settings", icon: Settings, url: "/admin/settings" },
    ]

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="px-2 py-4">
                    <h2 className="text-lg font-bold">DevAdmin</h2>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link to={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <div className="px-2 py-2 space-y-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleTheme}
                        className="w-full justify-start gap-2"
                    >
                        {theme === 'dark' ? (
                            <>
                                <Sun className="w-4 h-4" />
                                <span>Light Mode</span>
                            </>
                        ) : (
                            <>
                                <Moon className="w-4 h-4" />
                                <span>Dark Mode</span>
                            </>
                        )}
                    </Button>
                    <div className="text-xs text-muted-foreground text-center">
                        © 2026 DevAdmin
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}

export default AppSidebar  