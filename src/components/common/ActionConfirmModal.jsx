import React from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AlertTriangle, Trash2, XCircle, Info } from 'lucide-react'

const ActionConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Are you sure?",
    description = "This action cannot be undone. Please confirm to proceed.",
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "destructive" // destructive | warning | info
}) => {
    const getIcon = () => {
        switch (variant) {
            case 'destructive': return <Trash2 className="w-6 h-6 text-destructive" />;
            case 'warning': return <AlertTriangle className="w-6 h-6 text-amber-500" />;
            case 'info': return <Info className="w-6 h-6 text-blue-500" />;
            default: return <AlertTriangle className="w-6 h-6 text-primary" />;
        }
    }

    const getBg = () => {
        switch (variant) {
            case 'destructive': return 'bg-destructive/10';
            case 'warning': return 'bg-amber-500/10';
            case 'info': return 'bg-blue-500/10';
            default: return 'bg-primary/10';
        }
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="max-w-[400px] rounded-2xl border-border bg-card shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <AlertDialogHeader className="items-center text-center pt-4">
                    <div className={`w-14 h-14 rounded-2xl ${getBg()} flex items-center justify-center mb-4 animate-bounce-subtle`}>
                        {getIcon()}
                    </div>
                    <AlertDialogTitle className="text-xl font-black tracking-tight text-foreground uppercase">
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground font-medium pt-2 px-4 leading-relaxed">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex flex-col sm:flex-row gap-3 pt-6 pb-2">
                    <AlertDialogCancel
                        onClick={onClose}
                        className="flex-1 h-11 border-2 font-bold hover:bg-muted transition-all active:scale-95"
                    >
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            onConfirm();
                            onClose();
                        }}
                        className={`flex-1 h-11 font-black uppercase text-[11px] tracking-widest shadow-lg transition-all active:scale-95 ${variant === 'destructive'
                                ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-destructive/20'
                                : variant === 'warning'
                                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'
                                    : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20'
                            }`}
                    >
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ActionConfirmModal
