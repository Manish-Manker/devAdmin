import React, { useState } from 'react'
import {
    Settings,
    User,
    Lock,
    Bell,
    Palette,
    Shield,
    Globe,
    Mail,
    Save,
    CreditCard,
    Key,
    Database,
    Zap,
    Users,
    Trash2,
    CheckCircle2,
    Moon,
    Sun,
    Monitor,
    UserPlus,
    MoreHorizontal
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTheme } from '@/contexts/ThemeContext'

const SettingsPage = () => {
    const { theme, setTheme } = useTheme()
    const userEmail = localStorage.getItem('user') || 'admin@example.com'

    // Mock role detection - in a real app this would come from an auth context or JWT
    const [role, setRole] = useState(userEmail.includes('admin') ? 'ADMIN' : 'USER')
    const [activeTab, setActiveTab] = useState('profile')

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User, hidden: false },
        { id: 'security', label: 'Security', icon: Lock, hidden: false },
        { id: 'preferences', label: 'Preferences', icon: Palette, hidden: false },
        { id: 'system', label: 'System', icon: Settings, hidden: role !== 'ADMIN' },
        { id: 'team', label: 'Team', icon: Users, hidden: role !== 'ADMIN' },
        { id: 'billing', label: 'Billing', icon: CreditCard, hidden: role !== 'ADMIN' },
    ].filter(tab => !tab.hidden)

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
                        <Settings className="w-8 h-8 text-primary" />
                        Settings
                    </h1>
                    <p className="text-muted-foreground mt-1 font-medium italic">
                        Logged in as <span className="text-primary font-bold uppercase">{role}</span> ({userEmail})
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {/* Role Toggle for Demo Purposes */}
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-[10px] font-black uppercase tracking-widest h-8"
                        onClick={() => setRole(role === 'ADMIN' ? 'USER' : 'ADMIN')}
                    >
                        Switch Role (Demo)
                    </Button>
                    <Button className="font-black text-[11px] uppercase tracking-widest h-10 gap-2 shadow-lg shadow-primary/20">
                        <Save className="w-4 h-4" /> Save Changes
                    </Button>
                </div>
            </header>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <aside className="lg:w-64 space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === tab.id
                                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]'
                                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                                }`}
                        >
                            <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? '' : 'group-hover:scale-110 transition-transform'}`} />
                            <span className="font-bold text-sm">{tab.label}</span>
                        </button>
                    ))}
                </aside>

                {/* Content Area */}
                <main className="flex-1 space-y-6">
                    {activeTab === 'profile' && (
                        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden animate-in slide-in-from-right-4 duration-300">
                            <div className="p-6 border-b border-border bg-muted/20">
                                <h3 className="text-lg font-black text-foreground uppercase tracking-wider">Account Information</h3>
                            </div>
                            <div className="p-8 space-y-8">
                                <div className="flex flex-col md:flex-row gap-8 items-start">
                                    <div className="relative group">
                                        <div className="w-24 h-24 rounded-2xl bg-primary/10 border-2 border-dashed border-primary/30 flex items-center justify-center overflow-hidden">
                                            <User className="w-10 h-10 text-primary opacity-50" />
                                        </div>
                                        <button className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-1.5 rounded-lg shadow-lg">
                                            <Zap className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase text-muted-foreground tracking-widest">Full Name</label>
                                            <Input defaultValue="Admin User" className="h-11 bg-muted/20 font-bold" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase text-muted-foreground tracking-widest">Email Address</label>
                                            <Input defaultValue={userEmail} disabled className="h-11 bg-muted/40 font-bold opacity-60" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase text-muted-foreground tracking-widest">Personal Bio</label>
                                            <Input placeholder="Tell us about yourself..." className="h-11 bg-muted/20 font-bold" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase text-muted-foreground tracking-widest">Language</label>
                                            <select className="flex h-11 w-full rounded-md border border-border bg-muted/20 px-3 py-2 text-sm font-bold shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                                                <option>English (US)</option>
                                                <option>Spanish</option>
                                                <option>French</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="bg-card border border-border rounded-2xl shadow-sm">
                                <div className="p-6 border-b border-border bg-muted/20">
                                    <h3 className="text-lg font-black text-foreground uppercase tracking-wider">Password Management</h3>
                                </div>
                                <div className="p-8 space-y-6">
                                    <div className="grid gap-6 max-w-md">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase text-muted-foreground tracking-widest">Current Password</label>
                                            <Input type="password" placeholder="••••••••" className="h-11 bg-muted/20" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase text-muted-foreground tracking-widest">New Password</label>
                                            <Input type="password" placeholder="••••••••" className="h-11 bg-muted/20" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase text-muted-foreground tracking-widest">Confirm New Password</label>
                                            <Input type="password" placeholder="••••••••" className="h-11 bg-muted/20" />
                                        </div>
                                    </div>
                                    <Button className="bg-primary/10 text-primary hover:bg-primary/20 font-black text-[10px] uppercase tracking-widest h-10">
                                        Update Password
                                    </Button>
                                </div>
                            </div>

                            <div className="bg-card border border-border rounded-2xl shadow-sm p-8 flex items-center justify-between">
                                <div className="flex gap-4 items-center">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                        <Shield className="w-6 h-6 text-emerald-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-foreground uppercase tracking-wider">Two-Factor Authentication</h4>
                                        <p className="text-xs text-muted-foreground font-medium">Add an extra layer of security to your account.</p>
                                    </div>
                                </div>
                                <Button variant="outline" className="font-black text-[10px] uppercase tracking-widest border-2">
                                    Enable 2FA
                                </Button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'preferences' && (
                        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden animate-in slide-in-from-right-4 duration-300">
                            <div className="p-6 border-b border-border bg-muted/20">
                                <h3 className="text-lg font-black text-foreground uppercase tracking-wider">Appearance & Behavior</h3>
                            </div>
                            <div className="p-8 space-y-8">
                                <div className="space-y-6">
                                    <label className="text-xs font-black uppercase text-muted-foreground tracking-[0.2em]">Interface Theme</label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {[
                                            { id: 'light', label: 'Light Mode', icon: Sun },
                                            { id: 'dark', label: 'Dark Mode', icon: Moon },
                                            { id: 'system', label: 'System Default', icon: Monitor },
                                        ].map((mode) => (
                                            <button
                                                key={mode.id}
                                                onClick={() => mode.id !== 'system' && setTheme(mode.id)}
                                                className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 group ${theme === mode.id
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-border bg-muted/20 hover:border-muted-foreground/30'
                                                    }`}
                                            >
                                                <mode.icon className={`w-8 h-8 ${theme === mode.id ? 'text-primary' : 'text-muted-foreground'}`} />
                                                <span className={`text-[11px] font-black uppercase tracking-widest ${theme === mode.id ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                    {mode.label}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-border space-y-6">
                                    <label className="text-xs font-black uppercase text-muted-foreground tracking-[0.2em]">Email Notifications</label>
                                    <div className="space-y-4">
                                        {[
                                            'Notify me about new signups',
                                            'Receive weekly activity reports',
                                            'Alert me on critical system errors',
                                            'Maintenance notifications'
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 bg-muted/10 rounded-xl border border-border/50">
                                                <span className="text-sm font-bold text-foreground/80">{item}</span>
                                                <div className="w-10 h-5 bg-primary/20 rounded-full relative cursor-pointer">
                                                    <div className="absolute right-1 top-1 w-3 h-3 bg-primary rounded-full" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {role === 'ADMIN' && activeTab === 'system' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-border bg-muted/20 flex justify-between items-center">
                                    <h3 className="text-lg font-black text-foreground uppercase tracking-wider">Core Configuration</h3>
                                    <span className="text-[10px] font-black uppercase px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded">System Online</span>
                                </div>
                                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-muted-foreground tracking-widest">Platform Name</label>
                                        <Input defaultValue="DevAdmin Platform" className="h-11 bg-muted/20 font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-muted-foreground tracking-widest">Primary Domain</label>
                                        <Input defaultValue="admin.dev-reach.com" className="h-11 bg-muted/20 font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-muted-foreground tracking-widest">API Endpoint URL</label>
                                        <Input defaultValue="https://api.v2.dev-reach.com" className="h-11 bg-muted/20 font-bold" />
                                    </div>
                                    <div className="space-y-2 flex flex-col justify-end">
                                        <div className="flex items-center gap-3 p-3 bg-amber-500/5 rounded-xl border border-amber-500/20">
                                            <div className="flex-1">
                                                <h5 className="text-[10px] font-black uppercase text-amber-600 tracking-wider">Maintenance Mode</h5>
                                                <p className="text-[11px] font-bold text-amber-700/70">Disable public front-end access.</p>
                                            </div>
                                            <div className="w-10 h-5 bg-zinc-200 dark:bg-zinc-800 rounded-full relative cursor-pointer">
                                                <div className="absolute left-1 top-1 w-3 h-3 bg-zinc-400 dark:bg-zinc-600 rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-card border border-border rounded-2xl shadow-sm p-8 space-y-4">
                                <div className="flex items-center gap-3 text-destructive">
                                    <Database className="w-5 h-5" />
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em]">Data Management</h4>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    <Button variant="outline" className="font-black text-[10px] uppercase tracking-widest border-2">
                                        Purge Log Cache
                                    </Button>
                                    <Button variant="outline" className="font-black text-[10px] uppercase tracking-widest border-2">
                                        Reindex Database
                                    </Button>
                                    <Button variant="destructive" className="font-black text-[10px] uppercase tracking-widest gap-2">
                                        <Trash2 className="w-4 h-4" /> Reset System
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {role === 'ADMIN' && activeTab === 'team' && (
                        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden animate-in slide-in-from-right-4 duration-300">
                            <div className="p-6 border-b border-border bg-muted/20 flex justify-between items-center">
                                <h3 className="text-lg font-black text-foreground uppercase tracking-wider">Administrator Team</h3>
                                <Button size="sm" className="font-black text-[10px] uppercase tracking-widest h-8 gap-2">
                                    <UserPlus className="w-3 h-3" /> Invite
                                </Button>
                            </div>
                            <div className="p-0">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-muted/30 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                        <tr>
                                            <th className="px-6 py-3">Member</th>
                                            <th className="px-6 py-3">Role</th>
                                            <th className="px-6 py-3">Access Level</th>
                                            <th className="px-6 py-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {[
                                            { name: 'John Doe', email: 'john@admin.com', role: 'Super Admin', access: 'All Access' },
                                            { name: 'Sarah Smith', email: 'sarah@dev.com', role: 'Developer', access: 'Limited' },
                                            { name: 'Mike Johnson', email: 'mike@mgmt.com', role: 'Moderator', access: 'Moderation Only' },
                                        ].map((member, i) => (
                                            <tr key={i} className="hover:bg-muted/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center font-black text-primary text-xs">
                                                            {member.name[0]}
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-foreground">{member.name}</p>
                                                            <p className="text-[10px] text-muted-foreground">{member.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-bold text-xs">{member.role}</td>
                                                <td className="px-6 py-4 text-[10px] font-black uppercase text-emerald-500">{member.access}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

export default SettingsPage
