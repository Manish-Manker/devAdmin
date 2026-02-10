import React from 'react'
import { Button } from "@/components/ui/button"
import { LoaderIcon } from "lucide-react"
import { cn } from "@/lib/utils"

function Spinner({ className, ...props }) {
    return (
        <LoaderIcon
            role="status"
            aria-label="Loading"
            className={cn("size-6 animate-spin", className)}
            {...props}
        />
    )
}

const Preloader = () => {
    return (
        <div className="flex items-center gap-4">
            <Spinner />
            <span>Loading...</span>
        </div>
    )
}

export default Preloader