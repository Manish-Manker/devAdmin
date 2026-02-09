import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft, Search } from 'lucide-react'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-zinc-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative inline-block">
            {/* Large 404 Text */}
            <h1 className="text-9xl md:text-[12rem] font-bold text-zinc-500/20 select-none">
              404
            </h1>
            {/* Floating Icon */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-zinc-800 rounded-full shadow-2xl flex items-center justify-center animate-bounce border border-zinc-700">
                <Search className="w-12 h-12 md:w-16 md:h-16 text-zinc-100" />
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4 mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Page Not Found
          </h2>
          <p className="text-lg md:text-xl text-zinc-400 max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={() => navigate('/')}
            className="bg-zinc-100 hover:bg-zinc-200 text-black px-8 py-6 text-lg w-full sm:w-auto"
          >
            <Home className="w-5 h-5 mr-2" />
            Go to Home
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate(-1)}
            className="px-8 py-6 text-lg w-full sm:w-auto border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Additional Help */}
        <div className="mt-12 p-6 bg-zinc-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-zinc-800">
          <h3 className="text-lg font-semibold text-white mb-3">
            Looking for something?
          </h3>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <button
              onClick={() => navigate('/login')}
              className="text-zinc-300 hover:text-zinc-100 hover:underline"
            >
              Login
            </button>
            <span className="text-zinc-600">•</span>
            <button
              onClick={() => navigate('/admin')}
              className="text-zinc-300 hover:text-zinc-100 hover:underline"
            >
              Dashboard
            </button>
            <span className="text-zinc-600">•</span>
            <button
              onClick={() => navigate('/')}
              className="text-zinc-300 hover:text-zinc-100 hover:underline"
            >
              Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound