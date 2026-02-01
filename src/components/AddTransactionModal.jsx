import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { transactionAPI, categoryAPI, accountAPI } from '../services/api'

const AddTransactionModal = ({ isOpen, onClose, onSuccess, editTransaction = null }) => {
  const [activeTab, setActiveTab] = useState('expense')
  const [categories, setCategories] = useState([])
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    description: '',
    category: '',
    division: 'personal',
    date: new Date().toISOString().slice(0, 16),
    accountId: ''
  })

  useEffect(() => {
    if (isOpen) {
      fetchCategories()
      fetchAccounts()
      
      if (editTransaction) {
        setFormData({
          ...editTransaction,
          date: new Date(editTransaction.date).toISOString().slice(0, 16),
          accountId: editTransaction.accountId?._id || editTransaction.accountId || ''
        })
        setActiveTab(editTransaction.type)
      } else {
        setActiveTab('expense')
        setFormData({
          type: 'expense',
          amount: '',
          description: '',
          category: '',
          division: 'personal',
          date: new Date().toISOString().slice(0, 16),
          accountId: ''
        })
      }
    }
  }, [isOpen, editTransaction])

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll()
      setCategories(response.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchAccounts = async () => {
    try {
      const response = await accountAPI.getAll()
      setAccounts(response.data)
    } catch (error) {
      console.error('Error fetching accounts:', error)
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setFormData({ ...formData, type: tab, category: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date).toISOString()
      }

      if (editTransaction) {
        await transactionAPI.update(editTransaction._id, data)
      } else {
        await transactionAPI.create(data)
      }

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error saving transaction:', error)
      alert(error.response?.data?.message || 'Failed to save transaction')
    } finally {
      setLoading(false)
    }
  }

  const filteredCategories = categories.filter(cat => cat.type === activeTab)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {editTransaction ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => handleTabChange('income')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-all ${
              activeTab === 'income'
                ? 'border-b-2 border-green-500 text-green-600 bg-green-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Income
          </button>
          <button
            onClick={() => handleTabChange('expense')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-all ${
              activeTab === 'expense'
                ? 'border-b-2 border-red-500 text-red-600 bg-red-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Expense
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Amount */}
          <div>
            <label className="label">Amount (₹)</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="input-field text-lg font-semibold"
              placeholder="0.00"
            />
          </div>

          {/* Description */}
          <div>
            <label className="label">Description</label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
              placeholder="Enter description"
            />
          </div>

          {/* Category */}
          <div>
            <label className="label">Category</label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="input-field"
            >
              <option value="">Select category</option>
              {filteredCategories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Division */}
          <div>
            <label className="label">Division</label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="office"
                  checked={formData.division === 'office'}
                  onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">Office</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="personal"
                  checked={formData.division === 'personal'}
                  onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">Personal</span>
              </label>
            </div>
          </div>

          {/* Account */}
          <div>
            <label className="label">Account</label>
            <select
              value={formData.accountId}
              onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
              className="input-field"
            >
              <option value="">No account</option>
              {accounts.map((acc) => (
                <option key={acc._id} value={acc._id}>
                  {acc.name} (₹{acc.balance.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          {/* Date & Time */}
          <div>
            <label className="label">Date & Time</label>
            <input
              type="datetime-local"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="input-field"
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 ${
                activeTab === 'income' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
              } text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50`}
              disabled={loading}
            >
              {loading ? 'Saving...' : editTransaction ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddTransactionModal
