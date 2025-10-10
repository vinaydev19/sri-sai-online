import React, { useState, useMemo } from 'react';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users,
  DollarSign,
  CreditCard,
  AlertCircle,
  Calendar,
  Filter
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useGetReportsQuery } from '@/store/api/reportsSlice';
import { useSelector } from 'react-redux';


const COLORS = ['#1f3b6e', '#fbbf24', '#ef4444'];
const REVENUE_COLOR = '#1f3b6e';

const Dashboard = () => {
  // Assuming useAuth is a custom hook to get auth info
  const { user } = useSelector((state) => state.user);

  const roleLabel = user?.role === 'admin' ? 'Admin' : 'Employee';

  const [selectedRange, setSelectedRange] = useState("7d");
  const [selectedEmployee, setSelectedEmployee] = useState("all");

  const rangeLabels = {
    "1d": "1 Day",
    "7d": "7 Days",
    "1m": "1 Month",
    "3m": "3 Months",
    "6m": "6 Months",
    "1y": "1 Year",
    "life": "Lifetime",
  };


  const { data: reportResponse, isLoading, isError } = useGetReportsQuery({
    range: selectedRange,
    employee: selectedEmployee,
  });
  const serviceStats = reportResponse?.data?.serviceStats.map(s => ({
    name: s.serviceStatus,
    value: s.count,
  })) || [];

  const employeeStats = reportResponse?.data?.employeeStats || [];
  const overallStats = reportResponse?.data?.overallStats || {};
  const revenueTrend = reportResponse?.data?.revenueTrend || [];

  const filteredData = {
    overallStats: reportResponse?.data?.overallStats || {},
    serviceStats: reportResponse?.data?.serviceStats.map(s => ({
      name: s.serviceStatus,
      value: s.count,
    })) || [],
    employeeStats: reportResponse?.data?.employeeStats || [],
    revenueTrend: reportResponse?.data?.revenueTrend || [],
  };


  if (isLoading) return <p>Loading dashboard...</p>;
  if (isError) return <p>Error fetching dashboard data.</p>;

  if (user?.role !== 'admin') {
    return (
      <div className="space-y-6">
        <div className="bg-[#f9f9fa] border-gray-200 border-1 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="text-[#6b7280]">
            Here's your employee dashboard overview.
          </p>
        </div>
        <Card>
          <CardContent className="p-6 text-center text-[#6b7280]">
            Admin reports are only accessible to administrators.
          </CardContent>
        </Card>
      </div>
    );
  }

  const ranges = ["1d", "7d", "1m", "3m", "6m", "1y", "life"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#f9f9fa] border-gray-200 border-1 rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-black mb-2">
            {roleLabel} Dashboard
            </h1>
            <p className="text-[#6b7280]">
              Comprehensive overview of business metrics and performance
            </p>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col lg:flex-row gap-4 mt-6 pt-6 border-t border-gray-300">
          {/* Date Range */}
          <div className="flex flex-col gap-2 flex-1">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4 text-black" /> {/* Custom icon color */}
              <span className="font-semibold text-gray-700">Date Range</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              {ranges.map((range) => (
                <Button
                  key={range}
                  onClick={() => setSelectedRange(range)}
                  size="sm"
                  className={`px-3 py-1 text-sm font-medium rounded ${selectedRange === range
                    ? "bg-black text-white border-none" // Selected custom color
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                    }`}
                >
                  {rangeLabels[range]}
                </Button>
              ))}
            </div>
          </div>

          {/* Employee Filter */}
          <div className="flex flex-col gap-2 lg:w-[250px] mt-4 lg:mt-0">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Filter className="h-4 w-4 text-[#F59E0B]" /> {/* Custom icon color */}
              <span className="font-semibold text-gray-700">Employee Filter</span>
            </div>
            <Select onValueChange={setSelectedEmployee} defaultValue="all">
              <SelectTrigger className="border border-gray-300 rounded-md bg-white text-gray-700 hover:border-[#4F46E5]">
                <SelectValue placeholder="Filter by Employee" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300 rounded-md shadow-md">
                <SelectItem value="all" className="hover:bg-[#E0E7FF]">
                  All Employees
                </SelectItem>
                {filteredData.employeeStats.map((e) => (
                  <SelectItem key={e.name} value={e.name} className="hover:bg-[#E0E7FF]">
                    {e.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Summary Info */}
      <Card className="bg-[#f9f9fa] border-gray-200 border-1 rounded-lg p-6">
        <CardContent className="p-4">
          <p className="text-sm text-[#6b7280]">
            Showing performance for <span className="font-semibold text-foreground">{selectedEmployee === "all" ? "All Employees" : selectedEmployee}</span> in the last <span className="font-semibold text-foreground">{rangeLabels[selectedRange]}</span>
          </p>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Customers"
          value={filteredData.overallStats.totalCustomers}
          icon={Users}
          description={selectedEmployee === "all" ? "All registered customers" : "Customers completed"}
          trend={{ value: 12.5, isPositive: true }}
        />

        <StatCard
          title="Total Revenue"
          value={`₹${filteredData.overallStats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          description="Total earnings"
          trend={{ value: 8.3, isPositive: true }}
        />

        <StatCard
          title="Total Paid"
          value={`₹${filteredData.overallStats.totalPaid.toLocaleString()}`}
          icon={CreditCard}
          description="Collected payments"
          trend={{ value: 5.7, isPositive: true }}
        />

        <StatCard
          title="Total Due"
          value={`₹${filteredData.overallStats.totalDue.toLocaleString()}`}
          icon={AlertCircle}
          description="Outstanding payments"
          className="border-destructive/30"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Status Pie Chart */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Service Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={filteredData.serviceStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill={REVENUE_COLOR}
                  dataKey="value"
                  animationDuration={800}
                >
                  {filteredData.serviceStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Trend Area Chart */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Revenue Trend - {rangeLabels[selectedRange]}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={filteredData.revenueTrend}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    {/* Dark navy gradient like your other chart */}
                    <stop offset="5%" stopColor="#0B1220" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0B1220" stopOpacity={0} />
                  </linearGradient>
                </defs>

                {/* Grid and Axes */}
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.3} />
                <XAxis
                  dataKey="date"
                  stroke="#374151" // dark gray axis color
                  fontSize={12}
                />
                <YAxis
                  stroke="#374151"
                  fontSize={12}
                />

                {/* Tooltip */}
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF', // white background
                    border: '1px solid #D1D5DB', // light gray border
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                  cursor={{ stroke: '#0B1220', strokeWidth: 1.5, strokeDasharray: '5 5' }}
                />

                <Legend />

                {/* Area */}
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0B1220"           // dark navy line
                  strokeWidth={3}
                  fill="url(#colorRevenue)"   // matching gradient
                  name="Revenue (₹)"
                  dot={{ r: 3, fill: '#0B1220' }}
                  activeDot={{ r: 6, fill: '#0B1220' }}
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Employee Performance Bar Chart - Show only for 3m+ ranges */}
        {["3m", "6m", "1y", "life"].includes(selectedRange) && (
          <Card className="shadow-md lg:col-span-2">
            <CardHeader>
              <CardTitle>Employee Performance by Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filteredData.employeeStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis
                    dataKey="name"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                    formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                    cursor={{ fill: 'hsl(var(--muted) / 0.1)' }}
                  />
                  <Legend />
                  <Bar
                    dataKey="revenue"
                    fill={REVENUE_COLOR}
                    name="Revenue (₹)"
                    radius={[8, 8, 0, 0]}
                    animationDuration={800}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;