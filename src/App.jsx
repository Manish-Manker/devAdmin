
import { RouterProvider } from "react-router-dom"
import { router } from "./routes"
import Preloader from "@/components/common/Preloader"
import { ThemeProvider } from "@/contexts/ThemeContext"

function App() {

  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
