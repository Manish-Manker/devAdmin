import React, { useState, useEffect } from 'react'
import {
    Search,
    Filter,
    MoreHorizontal,
    Eye,
    Trash2,
    AlertCircle,
    CheckCircle2,
    XCircle,
    User,
    Flag,
    Calendar,
    ChevronLeft,
    ChevronRight,
    ShieldAlert,
    MessageSquare,
    MoreVertical
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Generate Dummy Reported Posts Data
const generateReports = () => {
    const reasons = ['Inappropriate Content', 'Spam', 'Hate Speech', 'Harassment', 'False Information', 'Copyright Violation']
    const reportStatuses = ['Pending', 'Reviewed', 'Resolved', 'Dismissed']
    const postStatuses = ['Active', 'Hidden', 'Banned']

    return Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        reportId: `REP-${1000 + i}`,
        post: {
            id: 200 + i,
            title: `User conversation about ${['AI', 'Crypto', 'Politics', 'Gaming', 'Health'][i % 5]} goes wrong`,
            content: "This is a detailed preview of the reported content. The user might have used offensive language or violated community guidelines in this specific post instance. Administrators need to review the context thoroughly.",
            status: postStatuses[Math.floor(Math.random() * postStatuses.length)],
            image: `https://picsum.photos/seed/${i + 1}/400/200`
        },
        owner: {
            name: `User ${i + 5}`,
            email: `user${i + 5}@example.com`,
            avatar: `https://i.pravatar.cc/150?u=${i + 5}`
        },
        reporter: {
            name: `Reporter ${i + 10}`,
            email: `reporter${i + 10}@example.com`,
            avatar: `https://i.pravatar.cc/150?u=${i + 50}`
        },
        reason: reasons[Math.floor(Math.random() * reasons.length)],
        status: reportStatuses[Math.floor(Math.random() * reportStatuses.length)],
        reportedAt: new Date(Date.now() - Math.floor(Math.random() * 500000000)).toISOString().split('T')[0],
        description: "The user is repeatedly posting irrelevant links and using caps lock in every sentence which is disturbing the community flow."
    }))
}

const INITIAL_REPORTS = generateReports()

const ReportPost = () => {
    const [reports, setReports] = useState(INITIAL_REPORTS)
    const [searchTerm, setSearchTerm] = useState('')
    const [reasonFilter, setReasonFilter] = useState('All')
    const [statusFilter, setStatusFilter] = useState('All')
    const [selectedReport, setSelectedReport] = useState(null)
    const [isSheetOpen, setIsSheetOpen] = useState(false)

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(8)

    // Filter Logic
    const filteredReports = reports.filter(report => {
        const matchesSearch =
            report.post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.reporter.name.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesReason = reasonFilter === 'All' || report.reason === reasonFilter
        const matchesStatus = statusFilter === 'All' || report.status === statusFilter

        return matchesSearch && matchesReason && matchesStatus
    })

    // Pagination Logic
    const totalPages = Math.ceil(filteredReports.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedReports = filteredReports.slice(startIndex, startIndex + itemsPerPage)

    const handleDeletePost = (id) => {
        if (window.confirm('Are you sure you want to PERMANENTLY DELETE this post? This action will also resolve all associated reports.')) {
            setReports(reports.filter(r => r.post.id !== id))
            setIsSheetOpen(false)
        }
    }

    const handleUpdatePostStatus = (postId, newStatus) => {
        setReports(reports.map(r =>
            r.post.id === postId ? { ...r, post: { ...r.post, status: newStatus }, status: 'Resolved' } : r
        ))
    }

    const handleUpdateReportStatus = (reportId, newStatus) => {
        setReports(reports.map(r =>
            r.id === reportId ? { ...r, status: newStatus } : r
        ))
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
                        <ShieldAlert className="w-8 h-8 text-primary" />
                        Report Moderation
                    </h1>
                    <p className="text-muted-foreground mt-1 font-medium">Review and take actions on reported content to keep the community safe.</p>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
                <div className="relative lg:col-span-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by post title, owner or reporter..."
                        className="pl-9 h-11 bg-background border-border/60"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
                    <select
                        className="w-full h-11 px-3 rounded-md border border-border bg-background text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        value={reasonFilter}
                        onChange={(e) => setReasonFilter(e.target.value)}
                    >
                        <option value="All">All Reasons</option>
                        {['Inappropriate Content', 'Spam', 'Hate Speech', 'Harassment', 'False Information', 'Copyright Violation'].map(r => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-muted-foreground shrink-0" />
                    <select
                        className="w-full h-11 px-3 rounded-md border border-border bg-background text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All Report Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Dismissed">Dismissed</option>
                    </select>
                </div>
            </div>

            {/* Reports List */}
            <div className="grid grid-cols-1 gap-4">
                {paginatedReports.length > 0 ? (
                    paginatedReports.map((report) => (
                        <div
                            key={report.id}
                            className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-all group relative overflow-hidden"
                        >
                            {/* Status Ribbon */}
                            <div className={`absolute top-0 right-0 h-1 w-24 ${report.status === 'Pending' ? 'bg-amber-500' :
                                    report.status === 'Resolved' ? 'bg-emerald-500' : 'bg-blue-500'
                                }`} />

                            <div className="flex flex-col lg:flex-row gap-6">
                                {/* Post Info */}
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-muted text-muted-foreground">
                                                    {report.reportId}
                                                </span>
                                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${report.status === 'Pending' ? 'bg-amber-500/10 text-amber-600' :
                                                        report.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-blue-500/10 text-blue-600'
                                                    }`}>
                                                    {report.status}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                                {report.post.title}
                                            </h3>
                                        </div>
                                    </div>

                                    <p className="text-muted-foreground text-sm line-clamp-2 italic border-l-2 border-border pl-3 py-1">
                                        "{report.post.content}"
                                    </p>

                                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
                                        <div className="flex items-center gap-1.5 text-destructive underline decoration-2 underline-offset-4">
                                            <Flag className="w-3.5 h-3.5" />
                                            Reason: {report.reason}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {report.reportedAt}
                                        </div>
                                    </div>
                                </div>

                                {/* Participants */}
                                <div className="flex items-center gap-8 lg:border-l border-border lg:pl-8">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="h-10 w-10 h-10 w-10 rounded-full border-2 border-primary/20 p-0.5">
                                            <img src={report.owner.avatar} alt="" className="rounded-full w-full h-full object-cover" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] uppercase font-black text-muted-foreground tracking-tighter">Owner</p>
                                            <p className="text-xs font-bold truncate max-w-[80px]">{report.owner.name.split(' ')[0]}</p>
                                        </div>
                                    </div>

                                    <div className="h-8 w-px bg-border hidden sm:block" />

                                    <div className="flex flex-col items-center gap-2">
                                        <div className="h-10 w-10 rounded-full border-2 border-amber-500/20 p-0.5">
                                            <img src={report.reporter.avatar} alt="" className="rounded-full w-full h-full object-cover" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] uppercase font-black text-muted-foreground tracking-tighter">Reporter</p>
                                            <p className="text-xs font-bold truncate max-w-[80px]">{report.reporter.name.split(' ')[0]}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-row lg:flex-col justify-end gap-2 shrink-0">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="font-bold gap-2 hover:bg-primary hover:text-white transition-all"
                                        onClick={() => {
                                            setSelectedReport(report)
                                            setIsSheetOpen(true)
                                        }}
                                    >
                                        <Eye className="w-4 h-4" />
                                        Details
                                    </Button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => handleUpdateReportStatus(report.id, 'Reviewed')}>
                                                Mark as Reviewed
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleUpdatePostStatus(report.post.id, 'Hidden')}>
                                                Hide Post
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="text-destructive font-bold"
                                                onClick={() => handleDeletePost(report.post.id)}
                                            >
                                                Delete Post
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-card border border-border border-dashed rounded-xl p-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                            <ShieldAlert className="w-12 h-12 text-muted-foreground opacity-20" />
                            <p className="text-xl font-black text-muted-foreground">No reports found matching your filters</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between py-4 border-t border-border">
                    <p className="text-sm font-medium text-muted-foreground">
                        Showing <span className="text-foreground">{startIndex + 1}</span> to <span className="text-foreground">{Math.min(startIndex + itemsPerPage, filteredReports.length)}</span> of <span className="text-foreground">{filteredReports.length}</span> reports
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                            className="font-bold"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="font-bold"
                        >
                            Next <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Detailed View Sheet */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="sm:max-w-2xl w-full flex flex-col p-0 overflow-hidden border-l-border/40 shadow-2xl">
                    {selectedReport && (
                        <>
                            {/* Sheet Header with Post Image */}
                            <div className="h-56 relative bg-muted group overflow-hidden">
                                <img
                                    src={selectedReport.post.image}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    alt=""
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                                <div className="absolute bottom-6 left-6 right-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="px-2 py-1 rounded bg-destructive text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                                            {selectedReport.reason}
                                        </span>
                                        <span className="px-2 py-1 rounded bg-background/80 backdrop-blur-md text-foreground text-[10px] font-black uppercase tracking-widest border border-border shadow-lg">
                                            Post ID: {selectedReport.post.id}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-black text-foreground leading-tight drop-shadow-sm">
                                        {selectedReport.post.title}
                                    </h2>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto px-8 py-10 space-y-10 scrollbar-hide">
                                {/* Post Content Section */}
                                <section className="space-y-4">
                                    <div className="flex items-center gap-2 text-primary">
                                        <MessageSquare className="w-5 h-5" />
                                        <h4 className="text-xs font-black uppercase tracking-[0.2em]">Reported Content</h4>
                                    </div>
                                    <div className="bg-muted/30 rounded-2xl p-6 border border-border/50 relative">
                                        <div className="absolute -top-3 left-6 px-2 bg-background">
                                            <AlertCircle className="w-6 h-6 text-primary/40" />
                                        </div>
                                        <p className="text-lg leading-relaxed font-semibold italic text-foreground/80">
                                            "{selectedReport.post.content}"
                                        </p>
                                    </div>
                                </section>

                                {/* Participant Details Grid */}
                                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-6 rounded-2xl bg-card border border-border shadow-sm group">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Original Author</h4>
                                            <div className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 text-[10px] font-black">ACTIVE</div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <img src={selectedReport.owner.avatar} className="w-12 h-12 rounded-full ring-4 ring-primary/5 shadow-inner" alt="" />
                                            <div className="min-w-0">
                                                <p className="font-black text-foreground truncate">{selectedReport.owner.name}</p>
                                                <p className="text-xs text-muted-foreground truncate font-medium">{selectedReport.owner.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 rounded-2xl bg-card border border-border shadow-sm group">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Reporter Info</h4>
                                            <div className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 text-[10px] font-black underline">TRUSTED</div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <img src={selectedReport.reporter.avatar} className="w-12 h-12 rounded-full ring-4 ring-amber-500/5 shadow-inner" alt="" />
                                            <div className="min-w-0">
                                                <p className="font-black text-foreground truncate">{selectedReport.reporter.name}</p>
                                                <p className="text-xs text-muted-foreground truncate font-medium">{selectedReport.reporter.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Report Details */}
                                <section className="space-y-4">
                                    <div className="flex items-center gap-2 text-amber-500">
                                        <Flag className="w-5 h-5" />
                                        <h4 className="text-xs font-black uppercase tracking-[0.2em]">Reporter's Complaint</h4>
                                    </div>
                                    <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6">
                                        <p className="text-sm font-semibold leading-loose text-amber-700 dark:text-amber-500">
                                            {selectedReport.description}
                                        </p>
                                        <div className="mt-4 pt-4 border-t border-amber-500/10 flex items-center gap-4 text-[10px] font-black uppercase text-amber-600/60">
                                            <span>IP: 192.168.1.45</span>
                                            <span>•</span>
                                            <span>DEVICE: Mobile (iOS)</span>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* Action Footer */}
                            <div className="p-8 bg-card border-t border-border flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <Button
                                        className="flex-1 font-black text-[10px] uppercase tracking-widest h-12 shadow-lg shadow-emerald-500/10"
                                        variant="outline"
                                        onClick={() => handleUpdateReportStatus(selectedReport.id, 'Dismissed')}
                                    >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Dismiss Report
                                    </Button>
                                    <Button
                                        className="flex-1 font-black text-[10px] uppercase tracking-widest h-12 shadow-lg shadow-primary/20"
                                        onClick={() => handleUpdatePostStatus(selectedReport.post.id, 'Hidden')}
                                    >
                                        <ShieldAlert className="w-4 h-4 mr-2" />
                                        Hide & Resolve
                                    </Button>
                                </div>
                                <Button
                                    variant="destructive"
                                    className="w-full font-black text-[10px] uppercase tracking-widest h-12 group"
                                    onClick={() => handleDeletePost(selectedReport.post.id)}
                                >
                                    <Trash2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                                    Delete Post Permanently
                                </Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default ReportPost