import React, { useState } from 'react'
import {
    Mail,
    Search,
    Filter,
    MoreHorizontal,
    Eye,
    Trash2,
    Calendar,
    User,
    MailOpen,
    CheckCircle2,
    Clock,
    ChevronLeft,
    ChevronRight,
    MessageSquare,
    Reply,
    MoreVertical,
    Star,
    ShieldCheck
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

// Generate Dummy Contact Queries
const generateContacts = () => {
    const subjects = ['General Inquiry', 'Technical Support', 'Partnership', 'Billing Issue', 'Feature Request', 'Bug Report']
    const statuses = ['Unread', 'Read', 'Resolved']

    return Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        subject: subjects[Math.floor(Math.random() * subjects.length)],
        message: "Hello, I'm interested in learning more about your premium features and how they can help my team scale. I've been using the free version for a month now and I'm really impressed with the interface, but I have a few questions regarding data security and API access limits.",
        status: statuses[Math.floor(Math.random() * statuses.length)],
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString().split('T')[0],
        isStarred: Math.random() > 0.8,
        avatar: `https://i.pravatar.cc/150?u=${i + 100}`
    }))
}

const INITIAL_CONTACTS = generateContacts()

const ContactUs = () => {
    const [contacts, setContacts] = useState(INITIAL_CONTACTS)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')
    const [selectedContact, setSelectedContact] = useState(null)
    const [isSheetOpen, setIsSheetOpen] = useState(false)

    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)

    // Filter Logic
    const filteredContacts = contacts.filter(contact => {
        const matchesSearch =
            contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.subject.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === 'All' || contact.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const totalPages = Math.ceil(filteredContacts.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedContacts = filteredContacts.slice(startIndex, startIndex + itemsPerPage)

    const handleDelete = (id) => {
        if (window.confirm('Delete this message?')) {
            setContacts(contacts.filter(c => c.id !== id))
            setIsSheetOpen(false)
        }
    }

    const handleUpdateStatus = (id, newStatus) => {
        setContacts(contacts.map(c => c.id === id ? { ...c, status: newStatus } : c))
    }

    const toggleStar = (id) => {
        setContacts(contacts.map(c => c.id === id ? { ...c, isStarred: !c.isStarred } : c))
    }

    const openMessage = (contact) => {
        setSelectedContact(contact)
        setIsSheetOpen(true)
        if (contact.status === 'Unread') {
            handleUpdateStatus(contact.id, 'Read')
        }
    }

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
                    <Mail className="w-8 h-8 text-primary" />
                    Support Inbox
                </h1>
                <p className="text-muted-foreground mt-1 font-medium">Manage and respond to user inquiries from the landing page.</p>
            </header>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, email or subject..."
                        className="pl-9 bg-card border-border/60"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 bg-card p-1 rounded-lg border border-border">
                    {['All', 'Unread', 'Read', 'Resolved'].map(status => (
                        <Button
                            key={status}
                            variant={statusFilter === status ? 'default' : 'ghost'}
                            size="sm"
                            className="font-bold text-[11px] uppercase tracking-wider h-8"
                            onClick={() => setStatusFilter(status)}
                        >
                            {status}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Inbox List */}
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead className="bg-muted/30 border-b border-border text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                            <tr>
                                <th className="px-6 py-4 w-10"></th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Subject & Excerpt</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {paginatedContacts.length > 0 ? (
                                paginatedContacts.map((contact) => (
                                    <tr
                                        key={contact.id}
                                        className={`hover:bg-muted/40 transition-all cursor-pointer group ${contact.status === 'Unread' ? 'bg-primary/[0.02]' : ''}`}
                                        onClick={() => openMessage(contact)}
                                    >
                                        <td className="px-6 py-4" onClick={(e) => { e.stopPropagation(); toggleStar(contact.id); }}>
                                            <Star className={`w-4 h-4 transition-colors ${contact.isStarred ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30 hover:text-amber-400'}`} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img src={contact.avatar} className="w-8 h-8 rounded-full border border-border" alt="" />
                                                <div className="min-w-0">
                                                    <p className={`font-bold truncate max-w-[120px] ${contact.status === 'Unread' ? 'text-primary' : 'text-foreground'}`}>
                                                        {contact.name}
                                                    </p>
                                                    <p className="text-[10px] text-muted-foreground truncate max-w-[120px]">{contact.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col min-w-0">
                                                <span className={`text-sm tracking-tight ${contact.status === 'Unread' ? 'font-black text-foreground' : 'font-semibold text-foreground/70'}`}>
                                                    {contact.subject}
                                                </span>
                                                <span className="text-xs text-muted-foreground truncate max-w-[400px]">
                                                    {contact.message}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${contact.status === 'Unread' ? 'bg-amber-500/10 text-amber-600' :
                                                    contact.status === 'Read' ? 'bg-blue-500/10 text-blue-600' :
                                                        'bg-emerald-500/10 text-emerald-600'
                                                }`}>
                                                {contact.status === 'Unread' ? <Clock className="w-3 h-3" /> :
                                                    contact.status === 'Read' ? <MailOpen className="w-3 h-3" /> :
                                                        <CheckCircle2 className="w-3 h-3" />}
                                                {contact.status}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-[10px] font-bold text-muted-foreground whitespace-nowrap">
                                            {contact.createdAt}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openMessage(contact); }}>
                                                        <Eye className="w-4 h-4 mr-2" /> View
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleUpdateStatus(contact.id, 'Resolved'); }}>
                                                        <CheckCircle2 className="w-4 h-4 mr-2" /> Resolve
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive font-bold" onClick={(e) => { e.stopPropagation(); handleDelete(contact.id); }}>
                                                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center gap-2">
                                            <Mail className="w-10 h-10 opacity-20" />
                                            <p className="font-bold">No messages found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 flex items-center justify-between bg-muted/20 border-t border-border">
                        <p className="text-xs text-muted-foreground font-medium">
                            Showing <span className="text-foreground">{startIndex + 1}</span>-
                            <span className="text-foreground">{Math.min(startIndex + itemsPerPage, filteredContacts.length)}</span> of
                            <span className="text-foreground">{filteredContacts.length}</span>
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(p => p - 1)}
                                className="h-8 text-[10px] font-black uppercase tracking-wider"
                            >
                                Prev
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(p => p + 1)}
                                className="h-8 text-[10px] font-black uppercase tracking-wider"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Message Detail Sheet */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="sm:max-w-xl w-full flex flex-col p-8 border-l-border/50">
                    {selectedContact && (
                        <div className="flex flex-col h-full">
                            <SheetHeader className="space-y-6 text-left border-b border-border pb-8">
                                <div className="flex items-center justify-between">
                                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${selectedContact.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-primary/10 text-primary'
                                        }`}>
                                        {selectedContact.status}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" className="rounded-full" onClick={() => toggleStar(selectedContact.id)}>
                                            <Star className={`w-5 h-5 ${selectedContact.isStarred ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`} />
                                        </Button>
                                    </div>
                                </div>

                                <SheetTitle className="text-3xl font-black text-foreground leading-tight">
                                    {selectedContact.subject}
                                </SheetTitle>

                                <div className="flex items-center gap-4 bg-muted/40 p-4 rounded-2xl border border-border/50">
                                    <img src={selectedContact.avatar} className="w-14 h-14 rounded-full ring-4 ring-background shadow-lg" alt="" />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-lg font-black text-foreground truncate">{selectedContact.name}</h4>
                                        <p className="text-sm font-semibold text-primary truncate">{selectedContact.email}</p>
                                        <div className="flex items-center gap-2 mt-1 text-[10px] font-bold text-muted-foreground uppercase opacity-70">
                                            <Calendar className="w-3 h-3" />
                                            Received {selectedContact.createdAt}
                                        </div>
                                    </div>
                                </div>
                            </SheetHeader>

                            <div className="flex-1 overflow-y-auto py-10">
                                <section className="space-y-4">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <MessageSquare className="w-4 h-4" />
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Message Body</h4>
                                    </div>
                                    <div className="text-base leading-relaxed text-foreground font-medium bg-muted/20 p-6 rounded-2xl border border-border/40 italic">
                                        "{selectedContact.message}"
                                    </div>
                                </section>

                                <section className="mt-10 pt-10 border-t border-border/60">
                                    <div className="flex items-center gap-3 mb-4">
                                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                        <span className="text-[11px] font-black uppercase tracking-widest text-foreground">Verified Submission</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-loose">
                                        This inquiry was submitted through the landing page contact form. The user's email has been verified as active. You can respond directly via email or use the resolve action button below.
                                    </p>
                                </section>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-auto pt-8 border-t border-border">
                                <Button
                                    className="h-12 font-black text-[10px] uppercase tracking-widest gap-2 bg-foreground text-background hover:bg-foreground/90 shadow-xl"
                                    onClick={() => window.location.href = `mailto:${selectedContact.email}`}
                                >
                                    <Reply className="w-4 h-4" />
                                    Reply via Email
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-12 font-black text-[10px] uppercase tracking-widest gap-2 border-2 border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/5 hover:border-emerald-500/50 shadow-sm"
                                    onClick={() => handleUpdateStatus(selectedContact.id, 'Resolved')}
                                    disabled={selectedContact.status === 'Resolved'}
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    {selectedContact.status === 'Resolved' ? 'Resolved' : 'Mark Resolved'}
                                </Button>
                                <Button
                                    variant="destructive"
                                    className="col-span-2 h-12 font-black text-[10px] uppercase tracking-widest"
                                    onClick={() => handleDelete(selectedContact.id)}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Submission Permanently
                                </Button>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default ContactUs