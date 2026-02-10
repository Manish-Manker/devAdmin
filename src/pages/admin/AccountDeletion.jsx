import React, { useState } from 'react'
import {
  UserX,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Trash2,
  Calendar,
  Database,
  UserCog,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  XCircle,
  HardDrive,
  UserCircle
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

// Generate Dummy Deletion Requests
const generateDeletionRequests = () => {
  const reasons = [
    'No longer using the platform',
    'Privacy concerns',
    'Receiving too many emails',
    'Found a better alternative',
    'Technical issues',
    'Account security compromised'
  ]
  const types = ['FULL_DELETION', 'DATA_ONLY'] // FULL_DELETION: Delete all data + account, DATA_ONLY: Delete data only
  const statuses = ['Pending', 'Processing', 'Completed', 'Cancelled']

  return Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    requestId: `DEL-${2000 + i}`,
    name: `User ${i + 20}`,
    email: `user${i + 20}@example.com`,
    reason: reasons[Math.floor(Math.random() * reasons.length)],
    type: types[Math.floor(Math.random() * types.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 800000000)).toISOString().split('T')[0],
    avatar: `https://i.pravatar.cc/150?u=${i + 200}`,
    description: "I've decided to move my workflow to a different tool and I want to ensure all my personal data and interaction history is completely removed from your servers as per GDPR requirements."
  }))
}

const INITIAL_REQUESTS = generateDeletionRequests()

const AccountDeletion = () => {
  const [requests, setRequests] = useState(INITIAL_REQUESTS)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('Pending')
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(8)

  // Filter Logic
  const filteredRequests = requests.filter(request => {
    const matchesSearch =
      request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requestId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === 'All' || request.type === typeFilter
    const matchesStatus = statusFilter === 'All' || request.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage)

  const handleAction = (id, newStatus) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: newStatus } : r))
    if (newStatus === 'Completed') {
      setIsSheetOpen(false)
    }
  }

  const handleDeleteUser = (id) => {
    if (window.confirm('CRITICAL ACTION: This will permanently delete the user account and all associated data. This cannot be undone. Proceed?')) {
      setRequests(requests.filter(r => r.id !== id))
      setIsSheetOpen(false)
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
          <UserX className="w-8 h-8 text-destructive" />
          Deletion Requests
        </h1>
        <p className="text-muted-foreground mt-1 font-medium">Manage user account and data deletion requests in compliance with privacy regulations.</p>
      </header>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email or ID..."
            className="pl-9 h-11 bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="h-11 px-3 rounded-md border border-border bg-background text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="All">All Request Types</option>
          <option value="FULL_DELETION">Full Account Deletion</option>
          <option value="DATA_ONLY">Data Deletion Only</option>
        </select>
        <select
          className="h-11 px-3 rounded-md border border-border bg-background text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Content List */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-muted/30 border-b border-border text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Request ID</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Deletion Type</th>
                <th className="px-6 py-4">Reason</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedRequests.length > 0 ? (
                paginatedRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="hover:bg-muted/40 transition-all cursor-pointer group"
                    onClick={() => {
                      setSelectedRequest(request)
                      setIsSheetOpen(true)
                    }}
                  >
                    <td className="px-6 py-4">
                      <span className="text-[11px] font-black font-mono text-muted-foreground px-2 py-1 bg-muted rounded">
                        {request.requestId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={request.avatar} className="w-8 h-8 rounded-full border border-border" alt="" />
                        <div className="min-w-0">
                          <p className="font-bold truncate text-foreground">{request.name}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{request.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${request.type === 'FULL_DELETION' ? 'bg-destructive/10 text-destructive' : 'bg-amber-500/10 text-amber-600'
                        }`}>
                        {request.type === 'FULL_DELETION' ? <UserX className="w-3 h-3" /> : <HardDrive className="w-3 h-3" />}
                        {request.type === 'FULL_DELETION' ? 'Account + Data' : 'Data Only'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-muted-foreground italic">
                      "{request.reason}"
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${request.status === 'Pending' ? 'bg-amber-500/10 text-amber-600' :
                          request.status === 'Processing' ? 'bg-blue-500/10 text-blue-600' :
                            request.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-600' :
                              'bg-zinc-500/10 text-zinc-600'
                        }`}>
                        {request.status === 'Pending' ? <Clock className="w-3 h-3" /> :
                          request.status === 'Processing' ? <Database className="w-3 h-3 animate-pulse" /> :
                            request.status === 'Completed' ? <CheckCircle2 className="w-3 h-3" /> :
                              <XCircle className="w-3 h-3" />}
                        {request.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedRequest(request); setIsSheetOpen(true); }}>
                            <Eye className="w-4 h-4 mr-2" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleAction(request.id, 'Processing'); }}>
                            <Database className="w-4 h-4 mr-2 text-blue-500" /> Start Processing
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleAction(request.id, 'Cancelled'); }}>
                            <XCircle className="w-4 h-4 mr-2 text-amber-500" /> Cancel Request
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive font-black"
                            onClick={(e) => { e.stopPropagation(); handleDeleteUser(request.id); }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> PERMANENT DELETE
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-muted-foreground font-black uppercase tracking-widest opacity-30">
                    No pending requests
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-border bg-muted/10">
            <span className="text-xs font-bold text-muted-foreground uppercase opacity-70">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Details Side Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-2xl w-full flex flex-col p-0 border-l-destructive/20 shadow-2xl overflow-hidden">
          {selectedRequest && (
            <>
              {/* Danger Header */}
              <div className={`h-40 relative flex items-center justify-center overflow-hidden ${selectedRequest.type === 'FULL_DELETION' ? 'bg-destructive/10' : 'bg-amber-500/10'
                }`}>
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                  <AlertTriangle className="w-full h-full scale-110 rotate-12" />
                </div>
                <div className="z-10 text-center p-6 mt-4">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 border-2 shadow-sm ${selectedRequest.type === 'FULL_DELETION' ? 'bg-background border-destructive text-destructive' : 'bg-background border-amber-500 text-amber-500'
                    }`}>
                    {selectedRequest.type === 'FULL_DELETION' ? <UserX className="w-7 h-7" /> : <HardDrive className="w-7 h-7" />}
                  </div>
                  <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">
                    {selectedRequest.type === 'FULL_DELETION' ? 'Confirm Full Deletion' : 'Confirm Data Deletion'}
                  </h2>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-8 py-10 space-y-10 scrollbar-hide">
                {/* Profile Info */}
                <section className="flex items-center gap-6 p-6 bg-card border border-border rounded-2xl shadow-sm">
                  <img src={selectedRequest.avatar} className="w-20 h-20 rounded-full border-4 border-background ring-4 ring-muted/50" alt="" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-black text-foreground truncate">{selectedRequest.name}</h3>
                    <p className="text-primary font-bold text-sm mb-2">{selectedRequest.email}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-muted rounded">ID: {selectedRequest.requestId}</span>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-muted rounded">REQUESTED: {selectedRequest.createdAt}</span>
                    </div>
                  </div>
                </section>

                {/* Reason & Description */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="w-5 h-5" />
                    <h4 className="text-xs font-black uppercase tracking-[0.2em]">User Justification</h4>
                  </div>
                  <div className="bg-muted/30 p-6 rounded-2xl border border-border border-l-4 border-l-destructive">
                    <p className="font-black text-foreground mb-4 uppercase text-xs tracking-wider">Reason: {selectedRequest.reason}</p>
                    <p className="text-base text-foreground/80 font-medium leading-relaxed italic">
                      "{selectedRequest.description}"
                    </p>
                  </div>
                </section>

                {/* Legal Warning */}
                <section className="p-6 rounded-2xl bg-destructive/5 border border-destructive/20">
                  <div className="flex items-center gap-3 mb-4">
                    <ShieldAlert className="w-6 h-6 text-destructive" />
                    <span className="text-sm font-black uppercase tracking-widest text-destructive">Compliance Notice</span>
                  </div>
                  <p className="text-xs text-destructive/80 font-bold leading-relaxed">
                    This request falls under {selectedRequest.type === 'FULL_DELETION' ? 'Total Account Erasure' : 'Personal Data Removal'} regulations.
                    Execution will purge all linked assets including posts, comments, media, and metadata from active databases and primary backups.
                    THIS ACTION IS IRREVERSIBLE.
                  </p>
                </section>
              </div>

              {/* Sticky Footer Actions */}
              <div className="p-8 bg-card border-t border-border space-y-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    className="flex-1 h-14 font-black uppercase text-[11px] tracking-widest"
                    onClick={() => handleAction(selectedRequest.id, 'Cancelled')}
                  >
                    <XCircle className="w-4 h-4 mr-2" /> Reject Request
                  </Button>
                  <Button
                    className="flex-1 h-14 font-black uppercase text-[11px] tracking-widest shadow-xl shadow-primary/10"
                    onClick={() => handleAction(selectedRequest.id, 'Processing')}
                  >
                    <Database className="w-4 h-4 mr-2" /> Mark Processing
                  </Button>
                </div>
                <Button
                  variant="destructive"
                  className="w-full h-14 font-black uppercase text-[12px] tracking-[0.1em] group"
                  onClick={() => handleDeleteUser(selectedRequest.id)}
                >
                  <Trash2 className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                  {selectedRequest.type === 'FULL_DELETION' ? 'EXECUTE FULL DELETION' : 'EXECUTE DATA PURGE'}
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default AccountDeletion