import React, { useState, useEffect } from 'react';
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
  Filter,
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
  AreaChart,
} from 'recharts';
import { useGetReportsQuery } from '@/store/api/reportsSlice';
import { useSelector } from 'react-redux';

const COLORS = ['#1f3b6e', '#fbbf24', '#ef4444'];
const REVENUE_COLOR = '#1f3b6e';

const Dashboard = () => {
  const { user } = useSelector((state) => state.user);
  const roleLabel = user?.role === 'admin' ? 'admin' : 'employee';

  console.log("User in dashboard", roleLabel);


  const [selectedRange, setSelectedRange] = useState('7d');
  const [selectedEmployee, setSelectedEmployee] = useState('all');

  const rangeLabels = {
    '1d': '1 Day',
    '7d': '7 Days',
    '1m': '1 Month',
    '3m': '3 Months',
    '6m': '6 Months',
    '1y': '1 Year',
    life: 'Lifetime',
  };

  const { data: reportResponse, isLoading, isError, refetch } = useGetReportsQuery(
    { range: selectedRange, employee: selectedEmployee },
    { refetchOnMountOrArgChange: true }
  );

  console.log("select employee", selectedEmployee);


  useEffect(() => {
    refetch();
  }, [selectedRange, selectedEmployee, refetch]);


  const reportData = reportResponse?.data || {};
  const serviceStats =
    reportData.serviceStats?.map((s) => ({
      name: s.serviceStatus,
      value: s.count,
    })) || [];
  const employeeStats = reportData.employeeStats || [];
  const overallStats = reportData.overallStats || {};
  const revenueTrend = reportData.revenueTrend || [];

  const filteredData = { overallStats, serviceStats, employeeStats, revenueTrend };

  if (user?.role !== 'admin') {
    return (
      <div className="space-y-6">
        <div className="bg-[#f9f9fa] border-gray-200 border rounded-lg p-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="text-[#6b7280]">Here's your employee dashboard overview.</p>
        </div>
        <Card>
          <CardContent className="p-6 text-center text-[#6b7280]">
            Admin reports are only accessible to administrators.
          </CardContent>
        </Card>
      </div>
    );
  }

  const ranges = ['1d', '7d', '1m', '3m', '6m', '1y', 'life'];


  if (isLoading) return <p className="text-center text-gray-500 py-4">Loading dashboard...</p>;
  if (isError) return <p className="text-center text-red-500 py-4">Error fetching dashboard data.</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#f9f9fa] border-gray-200 border rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-black mb-2">{roleLabel} Dashboard</h1>
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
              <Calendar className="h-4 w-4 text-black" />
              <span className="font-semibold text-gray-700">Date Range</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              {ranges.map((range) => (
                <Button
                  key={range}
                  onClick={() => setSelectedRange(range)}
                  size="sm"
                  className={`px-3 py-1 text-sm font-medium rounded ${selectedRange === range
                    ? 'bg-black text-white border-none'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
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
              <Filter className="h-4 w-4 text-[#F59E0B]" />
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
                {employeeStats.map((e) => (
                  <SelectItem key={e._id} value={e._id} className="hover:bg-[#E0E7FF]">
                    {e.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Summary Info */}
      <Card className="bg-[#f9f9fa] border-gray-200 border rounded-lg p-6">
        <CardContent className="p-4">
          <p className="text-sm text-[#6b7280]">
            Showing performance for{' '}
            <span className="font-semibold text-foreground">
              {selectedEmployee === 'all'
                ? 'All Employees'
                : employeeStats.find((e) => e._id === selectedEmployee)?.name || 'Employee'}
            </span>{' '}
            in the last{' '}
            <span className="font-semibold text-foreground">
              {rangeLabels[selectedRange]}
            </span>
          </p>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Customers"
          value={filteredData.overallStats.totalCustomers}
          icon={Users}
          description="Registered customers"
        />

        <StatCard
          title="Total Revenue"
          value={`₹${filteredData.overallStats.totalRevenue?.toLocaleString() || 0}`}
          icon={DollarSign}
          description="Total earnings"
        />

        <StatCard
          title="Total Paid"
          value={`₹${filteredData.overallStats.totalPaid?.toLocaleString() || 0}`}
          icon={CreditCard}
          description="Collected payments"
        />

        <StatCard
          title="Total Due"
          value={`₹${filteredData.overallStats.totalDue?.toLocaleString() || 0}`}
          icon={AlertCircle}
          description="Outstanding payments"
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
                <Tooltip />
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
                    <stop offset="5%" stopColor="#0B1220" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0B1220" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.3} />
                <XAxis dataKey="date" stroke="#374151" fontSize={12} />
                <YAxis stroke="#374151" fontSize={12} />
                <Tooltip
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                  cursor={{ stroke: '#0B1220', strokeWidth: 1.5, strokeDasharray: '5 5' }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0B1220"
                  strokeWidth={3}
                  fill="url(#colorRevenue)"
                  name="Revenue (₹)"
                  dot={{ r: 3, fill: '#0B1220' }}
                  activeDot={{ r: 6, fill: '#0B1220' }}
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Employee Performance (only for 3m+) */}
        {['3m', '6m', '1y', 'life'].includes(selectedRange) && (
          <Card className="shadow-md lg:col-span-2">
            <CardHeader>
              <CardTitle>Employee Performance by Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filteredData.employeeStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.3} />
                  <XAxis dataKey="name" stroke="#374151" fontSize={12} />
                  <YAxis stroke="#374151" fontSize={12} />
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
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
