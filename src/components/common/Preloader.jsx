import React from 'react'
import { Button } from "@/components/ui/button"
const Preloader = () => {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center d-none">
            <Button>Click me</Button>
        </div>
    )
}   

export default Preloader