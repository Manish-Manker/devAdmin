import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowRight, Shield, Zap, Users, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

const Home = () => {
    const { theme, toggleTheme } = useTheme()

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-zinc-900 dark:from-black dark:via-zinc-950 dark:to-zinc-900 bg-gradient-to-br light:from-slate-50 light:via-blue-50 light:to-indigo-100">
            {/* Navigation */}
            <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <Shield className="w-8 h-8 text-zinc-100 dark:text-zinc-100 light:text-indigo-600" />
                    <h1 className="text-2xl font-bold text-white dark:text-white light:text-slate-900">DevAdmin</h1>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={toggleTheme}
                        className="border-zinc-700 dark:border-zinc-700 light:border-slate-300"
                    >
                        {theme === 'dark' ? (
                            <Sun className="w-5 h-5 text-zinc-100" />
                        ) : (
                            <Moon className="w-5 h-5 text-slate-700" />
                        )}
                    </Button>
                    <Link to="/login">
                        <Button className="bg-zinc-100 hover:bg-zinc-200 text-black dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-black light:bg-indigo-600 light:hover:bg-indigo-700 light:text-white">
                            Login
                        </Button>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-8 py-20">
                <div className="text-center space-y-8">
                    <div className="inline-block">
                        <span className="px-4 py-2 bg-zinc-800 text-zinc-100 rounded-full text-sm font-semibold">
                            Welcome to DevAdmin
                        </span>
                    </div>

                    <h2 className="text-6xl font-bold text-white leading-tight">
                        Manage Your Platform
                        <br />
                        <span className="text-zinc-300">With Confidence</span>
                    </h2>

                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                        A powerful admin panel to manage users, monitor activity, and control your application with ease.
                    </p>

                    <div className="flex items-center justify-center gap-4 pt-4">
                        <Link to="/login">
                            <Button size="lg" className="bg-zinc-100 hover:bg-zinc-200 text-black text-lg px-8 py-6">
                                Get Started
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-8 mt-24">
                    <div className="bg-zinc-900/80 backdrop-blur-sm p-8 rounded-2xl border border-zinc-800 shadow-lg hover:shadow-xl hover:border-zinc-700 transition-all">
                        <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center mb-4">
                            <Shield className="w-6 h-6 text-zinc-100" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Secure</h3>
                        <p className="text-zinc-400">
                            Enterprise-grade security to protect your data and users.
                        </p>
                    </div>

                    <div className="bg-zinc-900/80 backdrop-blur-sm p-8 rounded-2xl border border-zinc-800 shadow-lg hover:shadow-xl hover:border-zinc-700 transition-all">
                        <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center mb-4">
                            <Zap className="w-6 h-6 text-zinc-100" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Fast</h3>
                        <p className="text-zinc-400">
                            Lightning-fast performance for seamless management.
                        </p>
                    </div>

                    <div className="bg-zinc-900/80 backdrop-blur-sm p-8 rounded-2xl border border-zinc-800 shadow-lg hover:shadow-xl hover:border-zinc-700 transition-all">
                        <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center mb-4">
                            <Users className="w-6 h-6 text-zinc-100" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">User-Friendly</h3>
                        <p className="text-zinc-400">
                            Intuitive interface designed for efficiency and ease.
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="text-center py-8 text-zinc-500">
                <p>© 2026 DevAdmin. All rights reserved.</p>
            </footer>
        </div>
    )
}

export default Home