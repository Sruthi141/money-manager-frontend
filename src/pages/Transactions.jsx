import { useState, useEffect } from 'react'
import { Plus, Filter, Edit2, Trash2, Clock } from 'lucide-react'
import AddTransactionModal from '../components/AddTransactionModal'
import { transactionAPI, categoryAPI } from '../services/api'
import { formatCurrency, formatDateTime, canEditTransaction } from '../utils/helpers'

const Transactions = () => {
  const [transactions, setTransactions] = useState([])
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editTransaction, setEditTransaction] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Filters
  const [filters, setFilters] = useState({
    type: '',
    division: '',
    category: '',
    startDate: '',
    endDate: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [transactions, filters])

  const fetchData = async () => {
    try {
      const [transRes, catRes] = await Promise.all([
        transactionAPI.getAll(),
        categoryAPI.getAll()
      ])
      setTransactions(transRes.data)
      setCategories(catRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...transactions]

    if (filters.type) {
      filtered = filtered.filter(t => t.type === filters.type)
    }
    if (filters.division) {
      filtered = filtered.filter(t => t.division === filters.division)
    }
    if (filters.category) {
      filtered = filtered.filter(t => t.category === filters.category)
    }
    if (filters.startDate) {
      filtered = filtered.filter(t => new Date(t.date) >= new Date(filters.startDate))
    }
    if (filters.endDate) {
      filtered = filtered.filter(t => new Date(t.date) <= new Date(filters.endDate))
    }

    setFilteredTransactions(filtered)
  }

  const handleEdit = (transaction) => {
    if (!canEditTransaction(transaction.createdAt)) {
      alert('Cannot edit transaction. Edit window (12 hours) has expired.')
      return
    }
    setEditTransaction(transaction)
    setModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return

    try {
      await transactionAPI.delete(id)
      fetchData()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete transaction')
    }
  }

  const handleModalSuccess = () => {
    fetchData()
    setEditTransaction(null)
  }

  const clearFilters = () => {
    setFilters({
      type: '',
      division: '',
      category: '',
      startDate: '',
      endDate: ''
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-500 mt-1">{filteredTransactions.length} transactions found</p>
        </div>
        <button onClick={() => { setEditTransaction(null); setModalOpen(true); }} className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })} className="input-field">
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select value={filters.division} onChange={(e) => setFilters({ ...filters, division: e.target.value })} className="input-field">
            <option value="">All Divisions</option>
            <option value="office">Office</option>
            <option value="personal">Personal</option>
          </select>

          <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} className="input-field">
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>{cat.name}</option>
            ))}
          </select>

          <input type="date" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} className="input-field" placeholder="Start Date" />

          <input type="date" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} className="input-field" placeholder="End Date" />
        </div>

        <button onClick={clearFilters} className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium">
          Clear All Filters
        </button>
      </div>

      {/* Transactions List */}
      <div className="card">
        {filteredTransactions.length === 0 ? (
          <p className="text-gray-500 text-center py-12">No transactions found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Division</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => {
                  const canEdit = canEditTransaction(transaction.createdAt)
                  return (
                    <tr key={transaction._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm text-gray-600">{formatDateTime(transaction.date)}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          transaction.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">{transaction.description}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">{transaction.category}</td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full capitalize">
                          {transaction.division}
                        </span>
                      </td>
                      <td className={`px-4 py-4 text-right font-semibold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(transaction)}
                            disabled={!canEdit}
                            className={`p-1 rounded ${
                              canEdit ? 'text-blue-600 hover:bg-blue-50' : 'text-gray-300 cursor-not-allowed'
                            }`}
                            title={canEdit ? 'Edit' : 'Edit window (12 hours) expired'}
                          >
                            {canEdit ? <Edit2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDelete(transaction._id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddTransactionModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditTransaction(null); }}
        onSuccess={handleModalSuccess}
        editTransaction={editTransaction}
      />
    </div>
  )
}

export default Transactions
