import { useState, useEffect } from 'react'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { dashboardAPI } from '../services/api'
import { formatCurrency, getRandomColor } from '../utils/helpers'
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react'

const Dashboard = () => {
  const [period, setPeriod] = useState('month')
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [period])

  const fetchStats = async () => {
    setLoading(true)
    try {
      const response = await dashboardAPI.getStats({ period })
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // Prepare chart data
  const categoryData = Object.entries(stats?.categoryBreakdown || {}).map(([name, data]) => ({
    name,
    income: data.income,
    expense: data.expense
  }))

  const divisionData = [
    { name: 'Office Income', value: stats?.divisionBreakdown?.office?.income || 0 },
    { name: 'Office Expense', value: stats?.divisionBreakdown?.office?.expense || 0 },
    { name: 'Personal Income', value: stats?.divisionBreakdown?.personal?.income || 0 },
    { name: 'Personal Expense', value: stats?.divisionBreakdown?.personal?.expense || 0 },
  ].filter(item => item.value > 0)

  const COLORS = ['#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444']

  return (
    <div className="space-y-6">
      {/* Header with Period Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Financial overview and analytics</p>
        </div>
        
        <div className="flex items-center space-x-2 bg-white rounded-lg shadow-sm p-1">
          {['week', 'month', 'year'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                period === p
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-1" />
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 mb-1">Total Income</p>
              <p className="text-3xl font-bold text-green-700">
                {formatCurrency(stats?.summary?.totalIncome || 0)}
              </p>
              <p className="text-xs text-green-600 mt-2">
                {stats?.transactionCount || 0} transactions
              </p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600 mb-1">Total Expense</p>
              <p className="text-3xl font-bold text-red-700">
                {formatCurrency(stats?.summary?.totalExpense || 0)}
              </p>
              <p className="text-xs text-red-600 mt-2">
                This {period}
              </p>
            </div>
            <TrendingDown className="w-12 h-12 text-red-500" />
          </div>
        </div>

        <div className={`card bg-gradient-to-br ${
          (stats?.summary?.balance || 0) >= 0 
            ? 'from-blue-50 to-blue-100 border-blue-200' 
            : 'from-red-50 to-red-100 border-red-200'
        } border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium mb-1 ${
                (stats?.summary?.balance || 0) >= 0 ? 'text-blue-600' : 'text-red-600'
              }`}>
                Net Balance
              </p>
              <p className={`text-3xl font-bold ${
                (stats?.summary?.balance || 0) >= 0 ? 'text-blue-700' : 'text-red-700'
              }`}>
                {formatCurrency(stats?.summary?.balance || 0)}
              </p>
              <p className={`text-xs mt-2 ${
                (stats?.summary?.balance || 0) >= 0 ? 'text-blue-600' : 'text-red-600'
              }`}>
                {(stats?.summary?.balance || 0) >= 0 ? 'Surplus' : 'Deficit'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category-wise Bar Chart */}
        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Category-wise Breakdown</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="income" fill="#10b981" name="Income" />
                <Bar dataKey="expense" fill="#ef4444" name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-12">No data available</p>
          )}
        </div>

        {/* Division Pie Chart */}
        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Division-wise Distribution</h3>
          {divisionData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={divisionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {divisionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-12">No data available</p>
          )}
        </div>
      </div>

      {/* Division Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Office Transactions</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Income</span>
              <span className="font-semibold text-green-600">
                {formatCurrency(stats?.divisionBreakdown?.office?.income || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Expense</span>
              <span className="font-semibold text-red-600">
                {formatCurrency(stats?.divisionBreakdown?.office?.expense || 0)}
              </span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">Net</span>
                <span className={`font-bold ${
                  ((stats?.divisionBreakdown?.office?.income || 0) - (stats?.divisionBreakdown?.office?.expense || 0)) >= 0
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {formatCurrency(
                    (stats?.divisionBreakdown?.office?.income || 0) - (stats?.divisionBreakdown?.office?.expense || 0)
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Personal Transactions</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Income</span>
              <span className="font-semibold text-green-600">
                {formatCurrency(stats?.divisionBreakdown?.personal?.income || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Expense</span>
              <span className="font-semibold text-red-600">
                {formatCurrency(stats?.divisionBreakdown?.personal?.expense || 0)}
              </span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">Net</span>
                <span className={`font-bold ${
                  ((stats?.divisionBreakdown?.personal?.income || 0) - (stats?.divisionBreakdown?.personal?.expense || 0)) >= 0
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {formatCurrency(
                    (stats?.divisionBreakdown?.personal?.income || 0) - (stats?.divisionBreakdown?.personal?.expense || 0)
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
