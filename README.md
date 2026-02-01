# Money Manager Frontend

A modern React application for managing personal and business finances with a beautiful UI built using Tailwind CSS.

## Features

- 💰 **Dashboard** - Month/Week/Year analytics with interactive charts
- 📊 **Transaction Management** - Add, edit (12-hour window), delete, and filter transactions
- 🏷️ **Categories** - Track spending by categories with visual pie charts
- 🏦 **Account Management** - Multiple accounts with transfer functionality
- 🎨 **Beautiful UI** - Modern, responsive design with Tailwind CSS
- ⚡ **Fast** - Built with Vite for lightning-fast development

## Tech Stack

- **React 18** - Latest version with hooks
- **Vite** - Next-generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Recharts** - Composable charting library
- **Lucide React** - Beautiful icon library
- **Axios** - HTTP client
- **date-fns** - Date utility library

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- Backend API running (see money-manager-backend)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm run dev
```

The application will start on `http://localhost:3000`

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Pages

### Home
- Overview of income, expenses, and balance
- Account summary
- Quick action cards
- Floating "Add Transaction" button

### Dashboard
- Switch between Week/Month/Year views
- Income vs Expense bar charts
- Division-wise pie charts
- Office and Personal breakdowns

### Transactions
- Complete transaction list with all details
- Filter by type, division, category, date range
- Edit transactions (within 12 hours)
- Delete transactions
- Visual indicators for transaction type

### Categories
- Expense distribution pie chart
- Income category cards with totals
- Expense category cards with totals
- Transaction count for each category

### Accounts
- View all accounts with balances
- Create new accounts
- Transfer money between accounts
- Beautiful gradient cards

## Key Features

### Add Transaction Modal
- Tabbed interface for Income/Expense
- Real-time category filtering
- Division selection (Office/Personal)
- Account selection
- Date & Time picker
- Form validation

### 12-Hour Edit Window
- Transactions can only be edited within 12 hours of creation
- Visual indicators (clock icon) for expired edit windows
- Automatic enforcement

### Filters
- Multi-dimensional filtering
- Filter by type, division, category
- Date range filtering
- Clear all filters option

### Account Transfers
- Transfer between any accounts
- Automatic balance updates
- Creates transaction records
- Transfer history tracking

## UI Components

All components are built with:
- Responsive design (mobile-first)
- Beautiful gradients and shadows
- Smooth transitions and animations
- Consistent color scheme
- Accessible form controls

## Deployment

### Build for Production

```bash
npm run build
```

The build files will be in the `dist/` directory.

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

### Environment Variables

Make sure to set `VITE_API_URL` in your deployment platform to point to your production API.

## Project Structure

```
money-manager-frontend/
├── src/
│   ├── components/      # Reusable components
│   │   ├── Layout.jsx
│   │   └── AddTransactionModal.jsx
│   ├── pages/          # Page components
│   │   ├── Home.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Transactions.jsx
│   │   ├── Categories.jsx
│   │   └── Accounts.jsx
│   ├── services/       # API services
│   │   └── api.js
│   ├── utils/          # Utility functions
│   │   └── helpers.js
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── public/             # Static assets
├── index.html          # HTML template
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind configuration
└── package.json        # Dependencies and scripts
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

ISC

## Screenshots

The application features:
- Clean, modern design
- Intuitive navigation
- Beautiful data visualizations
- Responsive layout for all screen sizes
- Smooth animations and transitions

Enjoy tracking your finances! 💰
