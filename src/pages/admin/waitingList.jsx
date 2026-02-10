import React, { useState, useEffect } from 'react'
import {
    Users,
    Search,
    Filter,
    MoreHorizontal,
    Mail,
    Trash2,
    Calendar,
    Send,
    CheckCircle2,
    Clock,
    ChevronLeft,
    ChevronRight,
    UserPlus,
    XCircle,
    Copy,
    ExternalLink,
    Sparkles,
    Eye
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Generate Dummy Waiting List Data
const generateWaitingList = () => {
    const sources = ['Twitter', 'LinkedIn', 'Direct', 'Referral', 'Product Hunt', 'Newsletter']
    const statuses = ['Pending', 'Invited', 'Joined', 'Rejected']

    return Array.from({ length: 40 }, (_, i) => ({
        id: i + 1,
        name: `Early Adopter ${i + 1}`,
        email: `early${i + 1}@example.com`,
        source: sources[Math.floor(Math.random() * sources.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        rank: i + 1,
        referrals: Math.floor(Math.random() * 15),
        joinedAt: new Date(Date.now() - Math.floor(Math.random() * 2000000000)).toISOString().split('T')[0],
        avatar: `https://i.pravatar.cc/150?u=${i + 300}`,
        notes: "Interested in the enterprise collaboration features and early API access."
    }))
}

const INITIAL_LIST = generateWaitingList()

const WaitingList = () => {
    const [list, setList] = useState(INITIAL_LIST)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')
    const [selectedUser, setSelectedUser] = useState(null)
    const [isSheetOpen, setIsSheetOpen] = useState(false)

    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)

    // Filter Logic
    const filteredList = list.filter(item => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.email.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === 'All' || item.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const totalPages = Math.ceil(filteredList.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedList = filteredList.slice(startIndex, startIndex + itemsPerPage)

    const handleInvite = (id) => {
        setList(list.map(item => item.id === id ? { ...item, status: 'Invited' } : item))
        // In a real app, you'd trigger an email here
    }

    const handleDelete = (id) => {
        if (window.confirm('Remove this person from the waiting list?')) {
            setList(list.filter(item => item.id !== id))
            setIsSheetOpen(false)
        }
    }

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
                        <Sparkles className="w-8 h-8 text-amber-500" />
                        Waiting List
                    </h1>
                    <p className="text-muted-foreground mt-1 font-medium">Manage early access requests and user invitations.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-card border border-border px-4 py-2 rounded-xl shadow-sm">
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Total Queue</p>
                        <p className="text-xl font-black text-foreground">{list.length}</p>
                    </div>
                    <Button className="font-black text-[11px] uppercase tracking-widest h-12 gap-2 shadow-xl shadow-primary/20">
                        <UserPlus className="w-4 h-4" /> Export List
                    </Button>
                </div>
            </header>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name or email..."
                        className="pl-9 h-11 bg-card border-border/60"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex bg-card p-1 rounded-xl border border-border overflow-x-auto">
                    {['All', 'Pending', 'Invited', 'Joined'].map(status => (
                        <Button
                            key={status}
                            variant={statusFilter === status ? 'default' : 'ghost'}
                            size="sm"
                            className="font-bold text-[10px] uppercase tracking-wider h-9 px-4 rounded-lg"
                            onClick={() => setStatusFilter(status)}
                        >
                            {status}
                        </Button>
                    ))}
                </div>
            </div>

            {/* List Table */}
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/30 border-b border-border text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                            <tr>
                                <th className="px-6 py-4">Rank</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Source</th>
                                <th className="px-6 py-4 text-center">Referrals</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Joined At</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {paginatedList.length > 0 ? (
                                paginatedList.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-muted/40 transition-all cursor-pointer group"
                                        onClick={() => {
                                            setSelectedUser(item)
                                            setIsSheetOpen(true)
                                        }}
                                    >
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-black text-muted-foreground">#{item.rank}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img src={item.avatar} className="w-9 h-9 rounded-full border border-border shadow-sm" alt="" />
                                                <div className="min-w-0">
                                                    <p className="font-bold text-foreground truncate">{item.name}</p>
                                                    <p className="text-[10px] text-muted-foreground truncate">{item.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[11px] font-bold text-foreground/70 bg-muted px-2 py-0.5 rounded">
                                                {item.source}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/5 border border-primary/10">
                                                <span className="text-xs font-black text-primary">{item.referrals}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${item.status === 'Pending' ? 'bg-amber-500/10 text-amber-600' :
                                                item.status === 'Invited' ? 'bg-blue-500/10 text-blue-600' :
                                                    item.status === 'Joined' ? 'bg-emerald-500/10 text-emerald-600' :
                                                        'bg-zinc-500/10 text-zinc-600'
                                                }`}>
                                                {item.status === 'Pending' ? <Clock className="w-3 h-3" /> :
                                                    item.status === 'Invited' ? <Send className="w-3 h-3" /> :
                                                        item.status === 'Joined' ? <CheckCircle2 className="w-3 h-3" /> :
                                                            <XCircle className="w-3 h-3" />}
                                                {item.status}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-[10px] font-bold text-muted-foreground">
                                            {item.joinedAt}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    <DropdownMenuLabel>Moderation</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedUser(item); setIsSheetOpen(true); }}>
                                                        <Eye className="w-4 h-4 mr-2" /> View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={(e) => { e.stopPropagation(); handleInvite(item.id); }}
                                                        disabled={item.status === 'Invited' || item.status === 'Joined'}
                                                    >
                                                        <Send className="w-4 h-4 mr-2 text-primary" /> Send Invitation
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setList(list.map(u => u.id === item.id ? { ...u, status: 'Joined' } : u)) }}>
                                                        <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" /> Mark as Joined
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive font-bold" onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}>
                                                        <Trash2 className="w-4 h-4 mr-2" /> Remove User
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-20 text-center text-muted-foreground font-black uppercase tracking-[0.2em] opacity-30">
                                        No users in waiting list
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 flex items-center justify-between border-t border-border bg-muted/5">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                            Page {currentPage} of {totalPages}
                        </p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="h-9 w-9 p-0">
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} className="h-9 w-9 p-0">
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* User Details Sheet */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="sm:max-w-xl w-full flex flex-col p-0 border-l-border/40 shadow-2xl overflow-hidden">
                    {selectedUser && (
                        <>
                            <div className="h-40 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent relative p-10 flex items-end">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Sparkles className="w-24 h-24" />
                                </div>
                                <div className="flex items-center gap-6 z-10">
                                    <img src={selectedUser.avatar} className="w-24 h-24 rounded-full border-4 border-background shadow-2xl" alt="" />
                                    <div>
                                        <h2 className="text-3xl font-black text-foreground tracking-tight">{selectedUser.name}</h2>
                                        <p className="text-primary font-bold">{selectedUser.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-10 space-y-10 scrollbar-hide">
                                {/* Stats Cards */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-card border border-border p-5 rounded-2xl shadow-sm group hover:scale-[1.02] transition-transform">
                                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">Queue Rank</p>
                                        <p className="text-2xl font-black text-foreground">#{selectedUser.rank}</p>
                                        <div className="w-full h-1 bg-muted mt-3 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary" style={{ width: `${(1 - selectedUser.rank / INITIAL_LIST.length) * 100}%` }} />
                                        </div>
                                    </div>
                                    <div className="bg-card border border-border p-5 rounded-2xl shadow-sm group hover:scale-[1.02] transition-transform">
                                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">Referrals</p>
                                        <p className="text-2xl font-black text-foreground">{selectedUser.referrals}</p>
                                        <p className="text-[10px] font-bold text-emerald-500 mt-2 flex items-center gap-1">
                                            <Sparkles className="w-3 h-3" /> Top 5% contributor
                                        </p>
                                    </div>
                                </div>

                                {/* Information */}
                                <section className="space-y-4">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Calendar className="w-4 h-4" />
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Acquisition Details</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 bg-muted/30 rounded-xl border border-border/50">
                                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Sign Up Source</p>
                                            <p className="text-sm font-bold mt-1 flex items-center gap-2">
                                                <ExternalLink className="w-3 h-3" /> {selectedUser.source}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-muted/30 rounded-xl border border-border/50">
                                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Wait Time</p>
                                            <p className="text-sm font-bold mt-1 flex items-center gap-2">
                                                <Clock className="w-3 h-3" /> 14 Days
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* Notes */}
                                <section className="space-y-4">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Mail className="w-4 h-4" />
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Application Notes</h4>
                                    </div>
                                    <div className="bg-card border border-border p-6 rounded-2xl italic font-medium text-foreground/80 leading-relaxed">
                                        "{selectedUser.notes}"
                                    </div>
                                </section>
                            </div>

                            {/* Actions */}
                            <div className="p-10 border-t border-border bg-card space-y-4 mt-auto">
                                <Button
                                    className="w-full h-14 font-black uppercase text-[11px] tracking-widest gap-2 shadow-xl shadow-primary/20"
                                    onClick={() => handleInvite(selectedUser.id)}
                                    disabled={selectedUser.status === 'Invited' || selectedUser.status === 'Joined'}
                                >
                                    <Send className="w-4 h-4" />
                                    {selectedUser.status === 'Invited' ? 'Invite Sent' :
                                        selectedUser.status === 'Joined' ? 'Already Joined' : 'Send Invitation Email'}
                                </Button>
                                <div className="flex gap-4">
                                    <Button variant="outline" className="flex-1 h-12 font-black uppercase text-[10px] tracking-widest gap-2">
                                        <Copy className="w-3 h-3" /> Copy Link
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="h-12 px-6 font-black uppercase text-[10px] tracking-widest"
                                        onClick={() => handleDelete(selectedUser.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default WaitingList