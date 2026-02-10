import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowRight, Shield, Zap, Users, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

const Home = () => {
    const { theme, toggleTheme } = useTheme()

    return (
        <div className="min-h-screen transition-colors duration-500 bg-slate-50 dark:bg-black text-slate-900 dark:text-zinc-100">
            {/* Navigation */}
            <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <Shield className="w-8 h-8 text-primary dark:text-primary" />
                    <h1 className="text-2xl font-black tracking-tighter text-slate-950 dark:text-white">DevAdmin</h1>
                </div>
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="rounded-full w-10 h-10 hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors"
                    >
                        {theme === 'dark' ? (
                            <Sun className="w-5 h-5 text-amber-400" />
                        ) : (
                            <Moon className="w-5 h-5 text-slate-700" />
                        )}
                    </Button>
                    <Link to="/login">
                        <Button className="font-bold px-6 bg-slate-900 dark:bg-zinc-100 hover:bg-slate-800 dark:hover:bg-zinc-200 text-white dark:text-black transition-all">
                            Login
                        </Button>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-8 py-24">
                <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-block">
                        <span className="px-4 py-1.5 bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground rounded-full text-xs font-black uppercase tracking-widest border border-primary/20">
                            Version 2.0 is Live
                        </span>
                    </div>

                    <h2 className="text-5xl md:text-7xl font-black text-slate-950 dark:text-white leading-[1.1] tracking-tight">
                        Platform Management
                        <br />
                        <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Reinvented</span>
                    </h2>

                    <p className="text-lg md:text-xl text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto font-medium leading-relaxed">
                        A high-fidelity, premium administrative cockpit designed for speed, security, and absolute control over your digital ecosystem.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                        <Link to="/login">
                            <Button size="lg" className="h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase text-[11px] tracking-[0.2em] px-10 shadow-xl shadow-primary/25 transition-all hover:scale-[1.03]">
                                Launch Dashboard
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                        <Button variant="outline" size="lg" className="h-14 border-2 font-black uppercase text-[11px] tracking-[0.2em] px-10 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-all">
                            View Documentation
                        </Button>
                    </div>
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-8 mt-32">
                    {[
                        {
                            title: 'Elite Security',
                            desc: 'End-to-end encryption and multi-factor authentication for total peace of mind.',
                            icon: Shield,
                            color: 'text-emerald-500'
                        },
                        {
                            title: 'Hyper Speed',
                            desc: 'Real-time synchronization and ultra-low latency response cycles across all modules.',
                            icon: Zap,
                            color: 'text-amber-500'
                        },
                        {
                            title: 'Collaborative',
                            desc: 'Granular access controls and team workspaces tailored for modern organizations.',
                            icon: Users,
                            color: 'text-blue-500'
                        }
                    ].map((feature, i) => (
                        <div key={i} className="group bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl p-10 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm hover:shadow-2xl hover:border-primary/30 transition-all duration-500">
                            <div className={`w-14 h-14 bg-slate-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500`}>
                                <feature.icon className={`w-6 h-6 ${feature.color}`} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 uppercase tracking-tight">{feature.title}</h3>
                            <p className="text-slate-600 dark:text-zinc-400 font-medium leading-relaxed">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </main>

            {/* Footer */}
            <footer className="max-w-7xl mx-auto px-8 pt-20 pb-12 border-t border-slate-200 dark:border-zinc-900 mt-20">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 grayscale brightness-50 contrast-125 dark:brightness-100 dark:grayscale-0 opacity-50">
                        <Shield className="w-5 h-5" />
                        <span className="font-bold text-sm tracking-tighter uppercase">DevAdmin Terminal</span>
                    </div>
                    <p className="text-sm font-bold text-slate-500 dark:text-zinc-600 uppercase tracking-widest">
                        © 2026 Architectural Excellence. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default Home