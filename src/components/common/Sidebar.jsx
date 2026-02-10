import React, { useState } from 'react'
import { Home, Users, Settings, LogOut, User, FileText, ShieldAlert, Mail, UserX, UserPlus, Sparkles } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '@/contexts/ThemeContext'
import { Button } from '@/components/ui/button'
import LogoutConfirmModal from './LogoutConfirmModal'

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
    const navigate = useNavigate()
    const location = useLocation()
    const { theme } = useTheme()
    const userEmail = localStorage.getItem('user')
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

    const menuItems = [
        { title: "Dashboard", icon: Home, url: "/admin" },
        { title: "Users", icon: Users, url: "/admin/users" },
        { title: "Posts", icon: FileText, url: "/admin/posts" },
        { title: "Report Post", icon: ShieldAlert, url: "/admin/reportpost" },
        { title: "Contact Us", icon: Mail, url: "/admin/contactus" },
        { title: "Account Deletion", icon: UserX, url: "/admin/accountdeletion" },
        { title: "Waiting List", icon: Sparkles, url: "/admin/waitinglist" },
        { title: "Settings", icon: Settings, url: "/admin/settings" },
    ]

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
    }

    return (
        <>
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
                                {menuItems.map((item) => {
                                    const isActive = location.pathname === item.url
                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={isActive}
                                                className={`transition-all duration-200 ${isActive
                                                        ? "bg-primary text-primary-foreground font-bold shadow-sm"
                                                        : "hover:bg-muted"
                                                    }`}
                                            >
                                                <Link to={item.url}>
                                                    <item.icon className={isActive ? "scale-110" : ""} />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    )
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <div className="px-3 py-4 border-t border-border mt-auto">
                        <div className="flex items-center gap-3 mb-4 px-1">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <User className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-medium truncate">{userEmail}</span>
                                <span className="text-[10px] text-muted-foreground">Administrator</span>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsLogoutModalOpen(true)}
                            className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Log out</span>
                        </Button>
                    </div>
                </SidebarFooter>
            </Sidebar>

            <LogoutConfirmModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleLogout}
            />
        </>
    )
}

export default AppSidebar
