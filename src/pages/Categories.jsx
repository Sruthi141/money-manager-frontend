import { useState, useEffect } from 'react'
import { categoryAPI } from '../services/api'
import { formatCurrency } from '../utils/helpers'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { 
  Wallet, Briefcase, TrendingUp, PlusCircle, Fuel, Utensils, 
  Film, Heart, CreditCard, ShoppingBag, Zap, Home, Car, 
  ArrowRight, MoreHorizontal, Circle, TrendingDown, DollarSign,
  Filter, Grid, List
} from 'lucide-react'

const Categories = () => {
  const [categorySummary, setCategorySummary] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    fetchCategorySummary()
  }, [])

  const fetchCategorySummary = async () => {
    try {
      const response = await categoryAPI.getSummary()
      setCategorySummary(response.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const getIcon = (iconName) => {
    const iconMap = {
      'wallet': Wallet,
      'briefcase': Briefcase,
      'trending-up': TrendingUp,
      'plus-circle': PlusCircle,
      'fuel': Fuel,
      'utensils': Utensils,
      'film': Film,
      'heart': Heart,
      'credit-card': CreditCard,
      'shopping-bag': ShoppingBag,
      'zap': Zap,
      'home': Home,
      'car': Car,
      'arrow-right': ArrowRight,
      'more-horizontal': MoreHorizontal
    }
    return iconMap[iconName] || Circle
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mb-4"></div>
        <p className="text-gray-500 animate-pulse">Loading categories...</p>
      </div>
    )
  }

  const incomeCategories = categorySummary.filter(cat => cat.type === 'income')
  const expenseCategories = categorySummary.filter(cat => cat.type === 'expense')

  const totalIncome = incomeCategories.reduce((sum, cat) => sum + cat.totalAmount, 0)
  const totalExpense = expenseCategories.reduce((sum, cat) => sum + cat.totalAmount, 0)
  const totalTransactions = categorySummary.reduce((sum, cat) => sum + cat.transactionCount, 0)

  const expenseChartData = expenseCategories.filter(cat => cat.totalAmount > 0)
  const incomeChartData = incomeCategories.filter(cat => cat.totalAmount > 0)
  
  const barChartData = categorySummary
    .filter(cat => cat.totalAmount > 0)
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, 10)

  const EXPENSE_COLORS = ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1']
  const INCOME_COLORS = ['#10b981', '#14b8a6', '#06b6d4', '#0ea5e9']

  const filteredCategories = filterType === 'all' 
    ? categorySummary 
    : categorySummary.filter(cat => cat.type === filterType)

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Category Analysis</h1>
            <p className="text-primary-100">Track your spending across different categories</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white text-primary-600' : 'bg-primary-700 text-white hover:bg-primary-600'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-white text-primary-600' : 'bg-primary-700 text-white hover:bg-primary-600'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-100 text-sm mb-1">Total Income</p>
                <p className="text-2xl font-bold">{formatCurrency(totalIncome)}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-green-300" />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-100 text-sm mb-1">Total Expense</p>
                <p className="text-2xl font-bold">{formatCurrency(totalExpense)}</p>
              </div>
              <TrendingDown className="w-10 h-10 text-red-300" />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-100 text-sm mb-1">Total Transactions</p>
                <p className="text-2xl font-bold">{totalTransactions}</p>
              </div>
              <DollarSign className="w-10 h-10 text-yellow-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filter by Type</h3>
        </div>
        <div className="flex gap-2">
          {['all', 'income', 'expense'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-6 py-2 rounded-lg font-medium transition-all capitalize ${
                filterType === type
                  ? 'bg-primary-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {expenseChartData.length > 0 && (
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
              Expense Distribution
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={expenseChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={110}
                  fill="#8884d8"
                  dataKey="totalAmount"
                >
                  {expenseChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {incomeChartData.length > 0 && (
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              Income Distribution
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={incomeChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={110}
                  fill="#8884d8"
                  dataKey="totalAmount"
                >
                  {incomeChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={INCOME_COLORS[index % INCOME_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {barChartData.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Top 10 Categories by Amount</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={barChartData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="totalAmount" fill="#0ea5e9" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Category Cards */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCategories.map((category) => {
            const IconComponent = getIcon(category.icon)
            const isIncome = category.type === 'income'
            
            return (
              <div
                key={category._id}
                className={`card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${
                  isIncome
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200'
                    : 'bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-md ${
                    isIncome ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    isIncome ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {category.type}
                  </span>
                </div>
                
                <h4 className="font-bold text-gray-900 mb-2 text-lg">{category.name}</h4>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Amount</span>
                    <span className={`text-xl font-bold ${
                      isIncome ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {formatCurrency(category.totalAmount)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Transactions</span>
                    <span className="text-lg font-semibold text-gray-800">
                      {category.transactionCount}
                    </span>
                  </div>
                  
                  {category.totalAmount > 0 && (
                    <div className="pt-2">
                      <span className="text-xs text-gray-500">Avg per transaction</span>
                      <div className={`text-sm font-semibold ${
                        isIncome ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(category.totalAmount / category.transactionCount)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Type</th>
                  <th className="px-4 py-3 text-right text-sm font-bold text-gray-700">Total Amount</th>
                  <th className="px-4 py-3 text-right text-sm font-bold text-gray-700">Transactions</th>
                  <th className="px-4 py-3 text-right text-sm font-bold text-gray-700">Average</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => {
                  const IconComponent = getIcon(category.icon)
                  const isIncome = category.type === 'income'
                  
                  return (
                    <tr key={category._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            isIncome ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            <IconComponent className={`w-5 h-5 ${
                              isIncome ? 'text-green-600' : 'text-red-600'
                            }`} />
                          </div>
                          <span className="font-semibold text-gray-900">{category.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                          isIncome ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {category.type}
                        </span>
                      </td>
                      <td className={`px-4 py-4 text-right font-bold text-lg ${
                        isIncome ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {formatCurrency(category.totalAmount)}
                      </td>
                      <td className="px-4 py-4 text-right font-semibold text-gray-800">
                        {category.transactionCount}
                      </td>
                      <td className="px-4 py-4 text-right text-gray-600 font-medium">
                        {category.transactionCount > 0
                          ? formatCurrency(category.totalAmount / category.transactionCount)
                          : '₹0'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredCategories.length === 0 && (
        <div className="card text-center py-16">
          <Circle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No categories found</h3>
          <p className="text-gray-500">Add some transactions to see category data</p>
        </div>
      )}
    </div>
  )
}

export default Categories
