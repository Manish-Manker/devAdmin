import React, { useState } from 'react'
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

// Dummy data for the chart - date-wise user and post counts
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

const Dashboard = () => {
    const [chartData] = useState(generateDummyData())
    const [date, setDate] = useState({
        from: new Date('2026-01-01'),
        to: new Date('2026-01-10'),
    })
    const [visibleLines, setVisibleLines] = useState({
        users: true,
        posts: true
    })

    // Filter data based on date range
    const filteredData = chartData.filter(item => {
        const itemDate = new Date(item.date)
        const from = date?.from
        const to = date?.to

        if (from && to) {
            return itemDate >= from && itemDate <= to
        }
        if (from) {
            return itemDate.getTime() === from.getTime()
        }
        return true
    })

    // Calculate totals and trends
    const totalUsers = filteredData.reduce((sum, item) => sum + item.users, 0)
    const totalPosts = filteredData.reduce((sum, item) => sum + item.posts, 0)
    const avgUsers = Math.round(totalUsers / filteredData.length)
    const avgPosts = Math.round(totalPosts / filteredData.length)
    const totalWaitlist = Math.round(totalUsers - 5 / filteredData.length)
    const totalContactUs = Math.round(totalUsers + 20 / filteredData.length)
    const totalPostReport = Math.round(totalUsers + 42 / filteredData.length)
    const totalAccountDeletion = Math.round(totalUsers + 2 / filteredData.length)

    // Calculate trend (comparing first half vs second half)
    const midPoint = Math.floor(filteredData.length / 2)
    const firstHalfUsers = filteredData.slice(0, midPoint).reduce((sum, item) => sum + item.users, 0) / midPoint
    const secondHalfUsers = filteredData.slice(midPoint).reduce((sum, item) => sum + item.users, 0) / (filteredData.length - midPoint)
    const userTrend = ((secondHalfUsers - firstHalfUsers) / firstHalfUsers * 100).toFixed(1)

    const firstHalfPosts = filteredData.slice(0, midPoint).reduce((sum, item) => sum + item.posts, 0) / midPoint
    const secondHalfPosts = filteredData.slice(midPoint).reduce((sum, item) => sum + item.posts, 0) / (filteredData.length - midPoint)
    const postTrend = ((secondHalfPosts - firstHalfPosts) / firstHalfPosts * 100).toFixed(1)

    // Handle legend click to toggle line visibility
    const handleLegendClick = (e) => {
        const dataKey = e.dataKey
        setVisibleLines(prev => ({
            ...prev,
            [dataKey]: !prev[dataKey]
        }))
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
                            <h3 className="text-2xl font-bold text-foreground mt-1">{totalUsers}</h3>
                        </div>
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Users className="w-6 h-6 text-primary" />
                        </div>
                    </div>
                    <div className="flex items-center gap-1 mt-4">
                        {userTrend >= 0 ? (
                            <ArrowUp className="w-4 h-4 text-green-500" />
                        ) : (
                            <ArrowDown className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm font-medium ${userTrend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {Math.abs(userTrend)}%
                        </span>
                        <span className="text-sm text-muted-foreground">vs previous period</span>
                    </div>
                </div>

                {/* Total Posts */}
                <div className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Posts</p>
                            <h3 className="text-2xl font-bold text-foreground mt-1">{totalPosts}</h3>
                        </div>
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-primary" />
                        </div>
                    </div>
                    <div className="flex items-center gap-1 mt-4">
                        {postTrend >= 0 ? (
                            <ArrowUp className="w-4 h-4 text-green-500" />
                        ) : (
                            <ArrowDown className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm font-medium ${postTrend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {Math.abs(postTrend)}%
                        </span>
                        <span className="text-sm text-muted-foreground">vs previous period</span>
                    </div>
                </div>

                {/* Avg Users/Day */}
                <div className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Avg Users/Day</p>
                            <h3 className="text-2xl font-bold text-foreground mt-1">{avgUsers}</h3>
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
                            <h3 className="text-2xl font-bold text-foreground mt-1">{avgPosts}</h3>
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
                            <h3 className="text-2xl font-bold text-foreground mt-1">{totalWaitlist}</h3>
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
                            <h3 className="text-2xl font-bold text-foreground mt-1">{totalContactUs}</h3>
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
                            <h3 className="text-2xl font-bold text-foreground mt-1">{totalPostReport}</h3>
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
                            <h3 className="text-2xl font-bold text-foreground mt-1">{totalAccountDeletion}</h3>
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