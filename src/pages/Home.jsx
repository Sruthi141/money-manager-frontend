import { useState, useEffect } from 'react'
import { Plus, TrendingUp, TrendingDown, Wallet, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import AddTransactionModal from '../components/AddTransactionModal'
import { dashboardAPI, accountAPI } from '../services/api'
import { formatCurrency } from '../utils/helpers'

const Home = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [stats, setStats] = useState(null)
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [statsRes, accountsRes] = await Promise.all([
        dashboardAPI.getStats({ period: 'month' }),
        accountAPI.getAll()
      ])
      setStats(statsRes.data)
      setAccounts(accountsRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleModalSuccess = () => {
    fetchData()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome Back!</h1>
        <p className="text-primary-100 text-lg">Here's your financial overview for this month</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Income */}
        <div className="card bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 mb-1">Total Income</p>
              <p className="text-3xl font-bold text-green-700">
                {formatCurrency(stats?.summary?.totalIncome || 0)}
              </p>
            </div>
            <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        {/* Total Expense */}
        <div className="card bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600 mb-1">Total Expense</p>
              <p className="text-3xl font-bold text-red-700">
                {formatCurrency(stats?.summary?.totalExpense || 0)}
              </p>
            </div>
            <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center">
              <TrendingDown className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        {/* Balance */}
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">Net Balance</p>
              <p className="text-3xl font-bold text-blue-700">
                {formatCurrency(stats?.summary?.balance || 0)}
              </p>
            </div>
            <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center">
              <Wallet className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Accounts Overview */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Accounts</h2>
          <Link
            to="/accounts"
            className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        {accounts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No accounts found. Create one to get started!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((account) => (
              <div
                key={account._id}
                className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{account.name}</h3>
                    <p className="text-xs text-gray-500 capitalize">{account.type}</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-800 mt-2">
                  {formatCurrency(account.balance)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/dashboard" className="card hover:shadow-lg transition-shadow text-center">
          <div className="text-primary-600 mb-2">
            <TrendingUp className="w-8 h-8 mx-auto" />
          </div>
          <h3 className="font-semibold text-gray-900">Dashboard</h3>
          <p className="text-xs text-gray-500 mt-1">View analytics</p>
        </Link>

        <Link to="/transactions" className="card hover:shadow-lg transition-shadow text-center">
          <div className="text-purple-600 mb-2">
            <Wallet className="w-8 h-8 mx-auto" />
          </div>
          <h3 className="font-semibold text-gray-900">Transactions</h3>
          <p className="text-xs text-gray-500 mt-1">View all transactions</p>
        </Link>

        <Link to="/categories" className="card hover:shadow-lg transition-shadow text-center">
          <div className="text-orange-600 mb-2">
            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900">Categories</h3>
          <p className="text-xs text-gray-500 mt-1">Manage categories</p>
        </Link>

        <Link to="/accounts" className="card hover:shadow-lg transition-shadow text-center">
          <div className="text-green-600 mb-2">
            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900">Accounts</h3>
          <p className="text-xs text-gray-500 mt-1">Manage accounts</p>
        </Link>
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setModalOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-200 flex items-center justify-center z-40"
        aria-label="Add Transaction"
      >
        <Plus className="w-8 h-8" />
      </button>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  )
}

export default Home
