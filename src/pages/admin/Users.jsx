import React, { useState, useEffect } from 'react'
import ActionConfirmModal from '@/components/common/ActionConfirmModal'
import { toast } from 'sonner'
import {
  Search,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  UserPlus,
  Mail,
  Shield,
  CheckCircle2,
  XCircle,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet"

// Generate Dummy Users Data (50 users)
import { userService } from '@/services/dataServices'
import Preloader from '@/components/common/Preloader'

const generateUsers = () => {
  const roles = ['Admin', 'Editor', 'User']
  const statuses = ['Active', 'Inactive']
  return Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: roles[Math.floor(Math.random() * roles.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    joined: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
    avatar: `https://i.pravatar.cc/150?u=${i + 1}`
  }))
}

const INITIAL_USERS = generateUsers()

const Users = () => {
  const [users, setUsers] = useState(INITIAL_USERS)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedUser, setSelectedUser] = useState(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  // Confirmation Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: null
  })

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalUsers, setTotalUsers] = useState(0)

  // Fetch Users
  const fetchUsers = async () => {
    setLoading(true)
    try {
      // Prepare params for API
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        status: statusFilter !== 'All' ? statusFilter : undefined
      }

      const response = await userService.getAllUsers(params)
      // Adjust based on your actual API response structure (e.g., data.users, data.total)
      // For now assuming response.data is the array or { data: [], total: 0 }
      // If the API returns just an array, we might need to handle pagination client-side or check API specs

      if (response.data) {
        // Check if response has pagination metadata
        if (Array.isArray(response.data)) {
          setUsers(response.data)
          // If total is not provided, we might default or check headers
          setTotalUsers(response.data.length)
        } else {
          setUsers(response.data.users || [])
          setTotalUsers(response.data.total || 0)
        }
      }
    } catch (error) {
      console.error("Failed to fetch users", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [currentPage, itemsPerPage, searchTerm, statusFilter])

  // Handlers
  const handleDelete = (id) => {
    setDeleteModal({ isOpen: true, id })
  }

  const handleConfirmDelete = async () => {
    if (deleteModal.id) {
      try {
        await userService.deleteUser(deleteModal.id)
        setUsers(users.filter(user => user.id !== deleteModal.id))
        setDeleteModal({ isOpen: false, id: null })
        toast.success('User deleted successfully', {
          description: 'User has been removed from the system.'
        })
        // Optionally re-fetch
        fetchUsers()
      } catch (error) {
        // Error handled by interceptor
        setDeleteModal({ isOpen: false, id: null })
      }
    }
  }

  const handleEdit = (user) => {
    setSelectedUser(user)
    setIsSheetOpen(true)
  }

  const handleAdd = () => {
    setSelectedUser(null)
    setIsSheetOpen(true)
  }

  const handleSaveUser = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const userData = {
      name: formData.get('name'),
      email: formData.get('email'),
      role: formData.get('role'),
      status: formData.get('status'),
    }

    try {
      if (selectedUser) {
        await userService.updateUser(selectedUser.id, userData)
        setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...userData } : u))
        toast.success('User updated successfully')
      } else {
        // New user
        const response = await userService.createUser(userData)
        // If API returns the new user, add it
        if (response.data) {
          setUsers([...users, response.data])
        }
        toast.success('User created successfully')
      }
      setIsSheetOpen(false)
      fetchUsers() // Refresh list
    } catch (error) {
      // Error handled by interceptor
      console.error("Failed to save user", error)
    }
  }

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter, itemsPerPage])

  if (loading) {
    return <div className="h-[80vh] flex items-center justify-center"><Preloader /></div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage your team members and their permissions.</p>
        </div>
        <Button onClick={handleAdd} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <UserPlus className="w-4 h-4" />
          Add New User
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-lg border border-border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            className="h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 overflow-hidden">
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${user.role === 'Admin'
                        ? 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800'
                        : user.role === 'Editor'
                          ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800'
                          : 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700'
                        }`}>
                        {user.role === 'Admin' && <Shield className="w-3 h-3" />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${user.status === 'Active'
                        ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'
                        : 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'
                        }`}>
                        {user.status === 'Active' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {user.joined}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                          onClick={() => handleEdit(user)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500/70 hover:text-red-600 hover:bg-red-100/20 dark:hover:bg-red-900/20"
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-8 h-8 opacity-20" />
                      <p>No users found matching your criteria</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-border bg-muted/20">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Show</span>
            <select
              className="h-8 px-2 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
            <span className="ml-2">
              Showing {users.length + 1} to {Math.min(users.length, itemsPerPage)} of {users.length} results
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="h-8 px-3"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="sr-only">Previous</span>
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(users.length, 5) }, (_, i) => {
                // Simple logic to show first 5 pages or relevant window
                // For complexity reduction, just showing page numbers for now
                let pageNum = i + 1
                if (users.length > 5 && currentPage > 3) {
                  pageNum = currentPage - 2 + i
                  if (pageNum > users.length) pageNum = users.length - (4 - i)
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="h-8 w-8 p-0"
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, users.length))}
              disabled={currentPage === users.length}
              className="h-8 px-3"
            >
              <ChevronRight className="w-4 h-4" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Edit/Add User Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{selectedUser ? 'Edit User' : 'Add New User'}</SheetTitle>
            <SheetDescription>
              {selectedUser ? 'Make changes to user profile here.' : 'Add a new member to your team.'}
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSaveUser} className="space-y-6 mt-8">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <div className="relative">
                <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input name="name" defaultValue={selectedUser?.name} placeholder="John Doe" className="pl-9" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input name="email" type="email" defaultValue={selectedUser?.email} placeholder="john@example.com" className="pl-9" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <select
                name="role"
                defaultValue={selectedUser?.role || 'User'}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="User">User</option>
                <option value="Editor">Editor</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select
                name="status"
                defaultValue={selectedUser?.status || 'Active'}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <SheetFooter className="pt-4">
              <SheetClose asChild>
                <Button variant="outline" type="button">Cancel</Button>
              </SheetClose>
              <Button type="submit">{selectedUser ? 'Save Changes' : 'Create User'}</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      <ActionConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={handleConfirmDelete}
        title="Delete User?"
        description="Are you sure you want to permanently delete this user account? This action will remove all their access and data immediately."
        confirmText="Yes, Delete User"
      />
    </div>
  )
}

export default Users