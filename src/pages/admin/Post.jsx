import React, { useState, useEffect } from 'react'
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Trash2,
  FileText,
  ThumbsUp,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  AlertCircle
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
  SheetClose
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Generate Dummy Posts Data (50 posts)
const generatePosts = () => {
  const statuses = ['Published', 'Draft', 'Archived']
  const categories = ['Technology', 'Lifestyle', 'Travel', 'Health', 'Business']

  return Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    title: `Comprehensive Guide to React Dashboard Design - Part ${i + 1}`,
    author: {
      name: `Author ${i + 1}`,
      avatar: `https://i.pravatar.cc/150?u=${i + 10}`
    },
    category: categories[Math.floor(Math.random() * categories.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    publishedAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
    likes: Math.floor(Math.random() * 500),
    comments: Math.floor(Math.random() * 100),
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
  }))
}

const INITIAL_POSTS = generatePosts()

import ActionConfirmModal from '@/components/common/ActionConfirmModal'
import { toast } from 'sonner'

const Post = () => {
  const [posts, setPosts] = useState(INITIAL_POSTS)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedPost, setSelectedPost] = useState(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    id: null
  })

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Filtered Posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'All' || post.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Pagination Logic
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + itemsPerPage)

  // Handlers
  const handleDeleteClick = (id) => {
    setConfirmModal({ isOpen: true, id })
  }

  const handleConfirmDelete = () => {
    if (confirmModal.id) {
      setPosts(posts.filter(post => post.id !== confirmModal.id))
      setConfirmModal({ isOpen: false, id: null })
      setIsSheetOpen(false)
      toast.success('Post deleted permanently', {
        description: 'The post and all its data have been removed.'
      })
    }
  }

  const handleView = (post) => {
    setSelectedPost(post)
    setIsSheetOpen(true)
  }

  const handleToggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'Published' ? 'Draft' : 'Published'
    setPosts(posts.map(post => post.id === id ? { ...post, status: newStatus } : post))
    toast.success(`Post ${newStatus === 'Published' ? 'Published' : 'Moved to Draft'}`, {
      description: `Post status has been updated to ${newStatus}.`
    })
  }

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter, itemsPerPage])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Post Management</h1>
        <p className="text-muted-foreground mt-1">Monitor, moderate, and analyze all user posts.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-lg border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search posts by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-background focus-visible:ring-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            className="h-10 px-3 rounded-md border border-input bg-background text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all cursor-pointer hover:border-primary/50"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Posts Table */}
      <div className="rounded-xl border border-border bg-card shadow-md overflow-hidden animate-in fade-in duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/30 text-muted-foreground uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Content</th>
                <th className="px-6 py-4 font-semibold">Author</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Engagement</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedPosts.length > 0 ? (
                paginatedPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-muted/40 transition-all group">
                    <td className="px-6 py-4 max-w-[280px]">
                      <div className="flex flex-col gap-1.5">
                        <span className="font-bold text-foreground truncate block text-sm" title={post.title}>{post.title}</span>
                        <span className={`text-[10px] uppercase font-bold tracking-tighter px-2 py-0.5 rounded-md w-fit ${post.category === 'Technology' ? 'bg-blue-500/10 text-blue-500' :
                          post.category === 'Lifestyle' ? 'bg-pink-500/10 text-pink-500' :
                            post.category === 'Travel' ? 'bg-orange-500/10 text-orange-500' :
                              post.category === 'Health' ? 'bg-green-500/10 text-green-500' :
                                'bg-purple-500/10 text-purple-500'
                          }`}>
                          {post.category}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full border border-border/50 p-0.5">
                          <img src={post.author.avatar} alt={post.author.name} className="h-full w-full rounded-full object-cover shadow-inner" />
                        </div>
                        <span className="font-medium text-foreground/80">{post.author.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${post.status === 'Published'
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        : post.status === 'Draft'
                          ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                          : 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
                        }`}>
                        {post.status === 'Published' ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                          post.status === 'Draft' ? <Clock className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {post.status}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4 text-muted-foreground/70">
                        <div className="flex items-center gap-1.5">
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span className="text-xs font-semibold">{post.likes}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span className="text-xs font-semibold">{post.comments}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-mono text-[11px]">
                      {post.publishedAt}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted ring-offset-background">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 p-1">
                          <DropdownMenuLabel className="text-xs text-muted-foreground px-2 py-1.5">Action Menu</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleView(post)} className="cursor-pointer">
                            <Eye className="w-4 h-4 mr-2" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(post.id, post.status)} className="cursor-pointer">
                            {post.status === 'Published' ? (
                              <div className="flex items-center w-full">
                                <XCircle className="w-4 h-4 mr-2 text-amber-500" /> Set as Draft
                              </div>
                            ) : (
                              <div className="flex items-center w-full">
                                <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" /> Publish Post
                              </div>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                            onClick={() => handleDeleteClick(post.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete Permanently
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-12 w-12 bg-muted/30 rounded-full flex items-center justify-center">
                        <FileText className="w-6 h-6 text-muted-foreground/30" />
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-lg text-foreground/80">No results found</p>
                        <p className="text-sm text-muted-foreground mt-1 text-balance">Try adjusting your filters or search keywords to find what you're looking for.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-5 border-t border-border bg-muted/10">
          <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground">
            <div className="flex items-center gap-2.5">
              <span className="opacity-70">Rows per page:</span>
              <select
                className="h-8 px-2.5 rounded-lg border border-border bg-background ring-offset-background outline-none focus:ring-1 focus:ring-primary transition-all cursor-pointer"
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
              </select>
            </div>
            <span className="opacity-70 border-l border-border pl-4">
              Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredPosts.length)} of {filteredPosts.length} posts
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="h-9 px-3 border-border hover:bg-muted"
            >
              <ChevronLeft className="w-4 h-4 mr-1.5" />
              Previous
            </Button>
            <div className="hidden md:flex items-center gap-1.5">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum = i + 1
                if (totalPages > 5 && currentPage > 3) {
                  pageNum = currentPage - 2 + i
                  if (pageNum > totalPages) pageNum = totalPages - (4 - i)
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`h-9 w-9 p-0 font-bold border-border ${currentPage === pageNum ? 'shadow-lg shadow-primary/20' : ''}`}
                  >
                    {pageNum}
                  </Button>
                )
              })}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <span className="px-2 text-muted-foreground opacity-50 font-bold">...</span>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="h-9 px-3 border-border hover:bg-muted"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* View Post Detail Drawer / Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-xl w-full flex flex-col p-0 border-l-border/50 shadow-2xl overflow-hidden">
          {selectedPost && (
            <>
              <div className="relative h-48 bg-muted animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest w-fit shadow-lg mb-3 ${selectedPost.category === 'Technology' ? 'bg-blue-600 text-white' :
                    selectedPost.category === 'Lifestyle' ? 'bg-pink-600 text-white' :
                      selectedPost.category === 'Travel' ? 'bg-orange-600 text-white' :
                        selectedPost.category === 'Health' ? 'bg-green-600 text-white' :
                          'bg-purple-600 text-white'
                    }`}>
                    {selectedPost.category}
                  </div>
                  <SheetTitle className="text-2xl font-black text-foreground drop-shadow-sm leading-tight">
                    {selectedPost.title}
                  </SheetTitle>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 scrollbar-hide">
                {/* Author & Meta Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full ring-2 ring-primary/20 p-1">
                      <img src={selectedPost.author.avatar} alt={selectedPost.author.name} className="h-full w-full rounded-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">{selectedPost.author.name}</h4>
                      <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Published on {selectedPost.publishedAt}
                      </p>
                    </div>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${selectedPost.status === 'Published' ? 'border-emerald-500/50 text-emerald-500 bg-emerald-500/5' :
                    selectedPost.status === 'Draft' ? 'border-amber-500/50 text-amber-500 bg-amber-500/5' :
                      'border-zinc-500/50 text-zinc-500 bg-zinc-500/5'
                    }`}>
                    {selectedPost.status}
                  </div>
                </div>

                {/* Main Content Body */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 bg-muted/30 px-3 py-2 rounded-lg border border-border/50">
                    <AlertCircle className="w-4 h-4 text-primary opacity-70" />
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Content Preview</span>
                  </div>
                  <p className="text-foreground/80 leading-relaxed font-medium text-lg italic border-l-4 border-primary/20 pl-6 py-2">
                    "{selectedPost.content}"
                  </p>
                  <p className="text-muted-foreground text-sm leading-loose">
                    {Array(5).fill(selectedPost.content).join(" ")}
                  </p>
                </div>

                {/* Engagement Matrix */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/40 backdrop-blur-sm p-5 rounded-2xl border border-border/50 flex flex-col items-center gap-2 group hover:bg-muted/60 transition-all">
                    <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center mb-1 group-hover:scale-110 transition-transform duration-300">
                      <ThumbsUp className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-3xl font-black text-foreground">{selectedPost.likes}</span>
                    <span className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Total Likes</span>
                  </div>
                  <div className="bg-muted/40 backdrop-blur-sm p-5 rounded-2xl border border-border/50 flex flex-col items-center gap-2 group hover:bg-muted/60 transition-all">
                    <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center mb-1 group-hover:scale-110 transition-transform duration-300">
                      <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-3xl font-black text-foreground">{selectedPost.comments}</span>
                    <span className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Comments</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-card border-t border-border flex items-center gap-4">
                <Button
                  size="lg"
                  className="flex-1 font-black text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20"
                  variant={selectedPost.status === 'Published' ? "outline" : "default"}
                  onClick={() => {
                    handleToggleStatus(selectedPost.id, selectedPost.status)
                    setIsSheetOpen(false)
                  }}
                >
                  {selectedPost.status === 'Published' ? 'Move to Draft' : 'Approve & Publish'}
                </Button>
                <Button
                  size="lg"
                  variant="destructive"
                  className="font-black text-[11px] uppercase tracking-widest px-6"
                  onClick={() => handleDeleteClick(selectedPost.id)}
                >
                  Delete
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
      <ActionConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={handleConfirmDelete}
        title="Delete Post?"
        description="Are you sure you want to permanently delete this post? This action cannot be reversed and all associated data will be lost."
        confirmText="Yes, Delete Post"
      />
    </div>
  )
}

export default Post