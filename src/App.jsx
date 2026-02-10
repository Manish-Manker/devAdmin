
import { RouterProvider } from "react-router-dom"
import { router } from "./routes"
// import Preloader from "@/components/common/Preloader"
import { ThemeProvider } from "@/contexts/ThemeContext"

import { Toaster } from 'sonner'

function App() {

  return (
    <ThemeProvider>
      <RouterProvider router={router} />
      <Toaster richColors position="top-center" />
    </ThemeProvider>
  )
}

export default App
