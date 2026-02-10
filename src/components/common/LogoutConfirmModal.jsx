import React from 'react'
import { LogOut, AlertTriangle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const LogoutConfirmModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 translate-z-0 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-card border border-border w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="relative p-6 pb-0">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 p-1 rounded-full hover:bg-muted transition-colors"
                    >
                        <X className="w-4 h-4 text-muted-foreground" />
                    </button>

                    <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                            <AlertTriangle className="w-6 h-6 text-destructive" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">Sign Out</h3>
                        <p className="text-muted-foreground mt-2">
                            Are you sure you want to log out? You will need to sign in again to access the admin panel.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row gap-3 p-6 mt-4 bg-muted/30">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1 order-2 sm:order-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        className="flex-1 order-1 sm:order-2 gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </Button>
                </div>
            </div>

            {/* Backdrop click to close */}
            <div className="absolute inset-0 -z-10" onClick={onClose} />
        </div>
    )
}

export default LogoutConfirmModal
