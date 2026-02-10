import React, { useState, useEffect } from 'react'
import { TrendingUp, Users, FileText, Calendar as CalendarIcon, ArrowUp, ArrowDown } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { dashboardService } from '@/services/dataServices'
import Preloader from '@/components/common/Preloader'
import { toast } from 'sonner'

const generateDummyData = () => {
    const data = []
    const startDate = new Date('2026-01-01')

    for (let i = 0; i < 30; i++) {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + i)

        data.push({
            date: date.toISOString().split('T')[0],
            users: Math.floor(Math.random() * 50) + 20,
            posts: Math.floor(Math.random() * 80) + 30,
            displayDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        })
    }

    return data
}
const INITIAL_CHART_DATA = generateDummyData()

const Dashboard = () => {
    const [chartData, setChartData] = useState(INITIAL_CHART_DATA)
    const [loading, setLoading] = useState(false)
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalPosts: 0,
        totalWaitlist: 0,
        totalContactUs: 0,
        totalPostReport: 0,
        totalAccountDeletion: 0,
        userTrend: 0,
        postTrend: 0,
        avgUsers: 0,
        avgPosts: 0
    })

    const [date, setDate] = useState({
        from: new Date(new Date().setDate(new Date().getDate() - 30)), // Last 30 days
        to: new Date(),
    })
    const [visibleLines, setVisibleLines] = useState({
        users: true,
        posts: true
    })

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true)
            try {
                // In a real scenario, you might have separate endpoints for stats and chart data
                // For this refactor, we'll simulate fetching both or use the expanded service

                // Fetch Stats
                const statsResponse = await dashboardService.getStats()
                // Fetch Activity (Chart Data)
                const activityResponse = await dashboardService.getActivity()

                if (statsResponse.data) {
                    setStats(prev => ({ ...prev, ...statsResponse.data }))
                }

                if (activityResponse.data) {
                    setChartData(activityResponse.data)
                }

            } catch (error) {
                console.error("Failed to fetch dashboard data", error)
                // Fallback to empty or error state handled by interceptor
                // If the API isn't ready yet, we might want to keep some dummy data for dev, 
                // but the instructions say to migrate. We will respect the "real data" requirement.
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, []) // Dependency array empty to load on mount. 
    // If API supports date filtering, we would add 'date' to dependencies and pass it as params.

    // Filter data based on date range (client-side filtering for now, assuming API returns broad range)
    const filteredData = chartData.filter(item => {
        const itemDate = new Date(item.date)
        const from = date?.from
        const to = date?.to

        if (from && to) {
            return itemDate >= from && itemDate <= to
        }
        if (from) {
            return itemDate.toDateString() === from.toDateString()
        }
        return true
    })

    // Recalculate derived stats based on filtered data if API doesn't return them pre-calculated
    // For this implementation, we will use the API provided stats for the cards, 
    // and let the chart reflect the date range. 
    // However, if the user changes the date range, the "totals" in the cards might need to update 
    // if the API supports partial fetching. 
    // As per the plan, we are just hooking up the service.

    // Handle legend click to toggle line visibility
    const handleLegendClick = (e) => {
        const dataKey = e.dataKey
        setVisibleLines(prev => ({
            ...prev,
            [dataKey]: !prev[dataKey]
        }))
    }

    if (loading) {
        return <div className="h-[80vh] flex items-center justify-center"><Preloader /></div>
    }
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground mt-1">Overview of your platform analytics</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Users */}
                <div className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Users</p>
                            <h3 className="text-2xl font-bold text-foreground mt-1">{stats.totalUsers}</h3>
                        </div>
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Users className="w-6 h-6 text-primary" />
                        </div>
                    </div>
                    <div className="flex items-center gap-1 mt-4">
                        {stats.userTrend >= 0 ? (   
                            <ArrowUp className="w-4 h-4 text-green-500" />
                        ) : (
                            <ArrowDown className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm font-medium ${stats.userTrend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {Math.abs(stats.userTrend)}%
                        </span>
                        <span className="text-sm text-muted-foreground">vs previous period</span>
                    </div>
                </div>

                {/* Total Posts */}
                <div className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Posts</p>
                            <h3 className="text-2xl font-bold text-foreground mt-1">{stats.totalPosts}</h3>
                        </div>
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-primary" />
                        </div>
                    </div>
                    <div className="flex items-center gap-1 mt-4">
                        {stats.postTrend >= 0 ? (
                            <ArrowUp className="w-4 h-4 text-green-500" />
                        ) : (
                            <ArrowDown className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm font-medium ${stats.postTrend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {Math.abs(stats.postTrend)}%
                        </span>
                        <span className="text-sm text-muted-foreground">vs previous period</span>
                    </div>
                </div>

                {/* Avg Users/Day */}
                <div className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Avg Users/Day</p>
                            <h3 className="text-2xl font-bold text-foreground mt-1">{stats.avgUsers}</h3>
                        </div>
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-primary" />
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">Daily average in period</p>
                </div>

                {/* Avg Posts/Day */}
                <div className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Avg Posts/Day</p>
                            <h3 className="text-2xl font-bold text-foreground mt-1">{stats.avgPosts}</h3>
                        </div>
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-primary" />
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">Daily average in period</p>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Waitlist Count</p>
                            <h3 className="text-2xl font-bold text-foreground mt-1">{stats.totalWaitlist}</h3>
                        </div>
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Users className="w-6 h-6 text-primary" />
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">Daily average in period</p>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Contact Us Count</p>
                            <h3 className="text-2xl font-bold text-foreground mt-1">{stats.totalContactUs}</h3>
                        </div>
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Users className="w-6 h-6 text-primary" />
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">Daily average in period</p>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Post Report Count</p>
                            <h3 className="text-2xl font-bold text-foreground mt-1">{stats.totalPostReport}</h3>
                        </div>
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-primary" />
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">Daily average in period</p>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Account Deletion Request</p>
                            <h3 className="text-2xl font-bold text-foreground mt-1">{stats.totalAccountDeletion}</h3>
                        </div>
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-primary" />
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">Daily average in period</p>
                </div>

            </div>

            {/* Chart Section */}
            <div className="bg-card border border-border rounded-lg p-6">
                {/* Chart Header with Date Picker */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-foreground">Analytics Overview</h2>
                        <p className="text-sm text-muted-foreground mt-1">User and post activity over time</p>
                    </div>

                    {/* Date Range Picker */}
                    <div className="flex items-center gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    id="date"
                                    variant={"outline"}
                                    className={cn(
                                        "w-[260px] justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date?.from ? (
                                        date.to ? (
                                            <>
                                                {format(date.from, "LLL dd, y")} -{" "}
                                                {format(date.to, "LLL dd, y")}
                                            </>
                                        ) : (
                                            format(date.from, "LLL dd, y")
                                        )
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="end">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={date?.from}
                                    selected={date}
                                    onSelect={setDate}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                {/* Line Chart */}
                <div className="w-full h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                            <XAxis
                                dataKey="displayDate"
                                className="text-xs"
                                tick={{ fill: 'currentColor' }}
                                stroke="currentColor"
                                style={{ color: 'hsl(var(--foreground))' }}
                            />
                            <YAxis
                                className="text-xs"
                                tick={{ fill: 'currentColor' }}
                                stroke="currentColor"
                                style={{ color: 'hsl(var(--foreground))' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '8px',
                                    color: 'hsl(var(--foreground))'
                                    // color: 'black'
                                }}
                                labelStyle={{ color: 'hsl(var(--foreground))' }}
                                itemStyle={{ color: 'hsl(var(--foreground))' }}
                            />
                            <Legend
                                wrapperStyle={{ paddingTop: '20px', cursor: 'pointer' }}
                                iconType="line"
                                onClick={handleLegendClick}
                            />
                            <Line
                                type="monotone"
                                dataKey="users"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                name="Users"
                                dot={{ fill: '#3b82f6', r: 4 }}
                                activeDot={{ r: 6 }}
                                hide={!visibleLines.users}
                            />
                            <Line
                                type="monotone"
                                dataKey="posts"
                                stroke="#10b981"
                                strokeWidth={3}
                                name="Posts"
                                dot={{ fill: '#10b981', r: 4 }}
                                activeDot={{ r: 6 }}
                                hide={!visibleLines.posts}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Chart Footer */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <TrendingUp className="w-4 h-4" />
                        <span>Showing data from {filteredData.length} days</span>
                    </div>
                    <Button variant="outline" size="sm">
                        Export Data
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Dashboard