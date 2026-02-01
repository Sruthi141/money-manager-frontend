import { useState, useEffect } from 'react'
import { Plus, Wallet, ArrowRight } from 'lucide-react'
import { accountAPI } from '../services/api'
import { formatCurrency } from '../utils/helpers'

const Accounts = () => {
  const [accounts, setAccounts] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      const response = await accountAPI.getAll()
      setAccounts(response.data)
    } catch (error) {
      console.error('Error fetching accounts:', error)
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

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Accounts</h1>
          <p className="text-gray-500 mt-1">{accounts.length} accounts • Total: {formatCurrency(totalBalance)}</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => setShowTransferModal(true)} className="btn-secondary flex items-center space-x-2">
            <ArrowRight className="w-5 h-5" />
            <span>Transfer</span>
          </button>
          <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Add Account</span>
          </button>
        </div>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <div key={account._id} className="card bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <span className="px-3 py-1 bg-white text-primary-700 text-xs font-medium rounded-full capitalize">
                {account.type}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{account.name}</h3>
            <p className="text-3xl font-bold text-primary-700">{formatCurrency(account.balance)}</p>
          </div>
        ))}

        {accounts.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No accounts found. Create one to get started!
          </div>
        )}
      </div>

      {/* Add Account Modal */}
      {showAddModal && (
        <AddAccountModal 
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            fetchAccounts()
            setShowAddModal(false)
          }}
        />
      )}

      {/* Transfer Modal */}
      {showTransferModal && (
        <TransferModal
          accounts={accounts}
          onClose={() => setShowTransferModal(false)}
          onSuccess={() => {
            fetchAccounts()
            setShowTransferModal(false)
          }}
        />
      )}
    </div>
  )
}

// Add Account Modal Component
const AddAccountModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    balance: '',
    type: 'bank'
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await accountAPI.create({
        ...formData,
        balance: parseFloat(formData.balance)
      })
      onSuccess()
    } catch (error) {
      alert('Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Account Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              placeholder="e.g., Main Bank Account"
            />
          </div>

          <div>
            <label className="label">Initial Balance (₹)</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.balance}
              onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
              className="input-field"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="label">Account Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="input-field"
            >
              <option value="bank">Bank</option>
              <option value="cash">Cash</option>
              <option value="credit_card">Credit Card</option>
              <option value="wallet">Wallet</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="flex-1 btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Transfer Modal Component
const TransferModal = ({ accounts, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    fromAccountId: '',
    toAccountId: '',
    amount: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.fromAccountId === formData.toAccountId) {
      alert('Cannot transfer to the same account')
      return
    }

    setLoading(true)

    try {
      await accountAPI.transfer({
        ...formData,
        amount: parseFloat(formData.amount)
      })
      onSuccess()
    } catch (error) {
      alert(error.response?.data?.message || 'Transfer failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Transfer Money</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">From Account</label>
            <select
              required
              value={formData.fromAccountId}
              onChange={(e) => setFormData({ ...formData, fromAccountId: e.target.value })}
              className="input-field"
            >
              <option value="">Select account</option>
              {accounts.map((acc) => (
                <option key={acc._id} value={acc._id}>
                  {acc.name} (₹{acc.balance.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div className="text-center">
            <ArrowRight className="w-6 h-6 mx-auto text-gray-400" />
          </div>

          <div>
            <label className="label">To Account</label>
            <select
              required
              value={formData.toAccountId}
              onChange={(e) => setFormData({ ...formData, toAccountId: e.target.value })}
              className="input-field"
            >
              <option value="">Select account</option>
              {accounts.map((acc) => (
                <option key={acc._id} value={acc._id}>
                  {acc.name} (₹{acc.balance.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Amount (₹)</label>
            <input
              type="number"
              required
              min="0.01"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="input-field"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="label">Description (Optional)</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
              placeholder="Enter description"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="flex-1 btn-primary" disabled={loading}>
              {loading ? 'Transferring...' : 'Transfer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Accounts
