import { format, parseISO, differenceInHours } from 'date-fns';

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date
export const formatDate = (date) => {
  if (!date) return '';
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, 'dd MMM yyyy');
  } catch (error) {
    return '';
  }
};

// Format datetime
export const formatDateTime = (date) => {
  if (!date) return '';
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, 'dd MMM yyyy, hh:mm a');
  } catch (error) {
    return '';
  }
};

// Check if transaction can be edited (within 12 hours)
export const canEditTransaction = (createdAt) => {
  if (!createdAt) return false;
  try {
    const created = typeof createdAt === 'string' ? parseISO(createdAt) : createdAt;
    const hoursDiff = differenceInHours(new Date(), created);
    return hoursDiff < 12;
  } catch (error) {
    return false;
  }
};

// Get category icon (maps to lucide-react icons)
export const getCategoryIcon = (categoryName) => {
  const iconMap = {
    'Salary': 'Wallet',
    'Business': 'Briefcase',
    'Investment': 'TrendingUp',
    'Other Income': 'PlusCircle',
    'Fuel': 'Fuel',
    'Food': 'Utensils',
    'Movie': 'Film',
    'Medical': 'Heart',
    'Loan': 'CreditCard',
    'Shopping': 'ShoppingBag',
    'Utilities': 'Zap',
    'Rent': 'Home',
    'Transport': 'Car',
    'Transfer': 'ArrowRight',
    'Other Expense': 'MoreHorizontal',
  };
  return iconMap[categoryName] || 'Circle';
};

// Get random color for charts
export const getRandomColor = (index) => {
  const colors = [
    '#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', 
    '#10b981', '#ef4444', '#6366f1', '#14b8a6',
    '#f97316', '#84cc16', '#06b6d4', '#a855f7'
  ];
  return colors[index % colors.length];
};
