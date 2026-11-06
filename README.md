# UPI Fraud Detection System

A comprehensive fintech application with AI-powered fraud detection for UPI transactions. Built with React, featuring a premium dark-themed UI with glassmorphism effects, real-time analytics, and advanced security features.

## 🚀 Project Overview

This is a full-stack UPI fraud detection system that uses machine learning to identify and prevent fraudulent transactions in real-time. The system includes user authentication, transaction processing, AI fraud analysis, admin dashboard, and comprehensive transaction history management.

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Modules](#modules)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [API Integration](#api-integration)
- [Data Flow](#data-flow)
- [Security Features](#security-features)
- [Analytics & Reporting](#analytics--reporting)
- [Future Enhancements](#future-enhancements)

## 🛠 Tech Stack

### Frontend
- **React 18.3.1** - UI framework
- **Vite 5.1.0** - Build tool and dev server
- **React Router DOM 6.22.0** - Client-side routing
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Framer Motion 11.0.0** - Animation library
- **Recharts 2.12.0** - Charting library
- **Lucide React 0.344.0** - Icon library
- **Axios 1.6.7** - HTTP client (API placeholder)

### UI/UX Design
- Premium dark theme with glassmorphism effects
- Purple-blue gradient accents
- Responsive design for all screen sizes
- Smooth animations and transitions
- Professional fintech UI components

## 📁 Project Structure

```
UPI FRAUD DETECTION/
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Admin/          # Admin dashboard components
│   │   │   ├── Analytics/      # Analytics charts
│   │   │   ├── Auth/           # Authentication components
│   │   │   ├── Dashboard/      # User dashboard components
│   │   │   ├── Payment/        # Payment processing components
│   │   │   ├── TransactionTable/ # Transaction table
│   │   │   ├── TransactionDetails/ # Transaction details drawer
│   │   │   ├── Receipt/        # Receipt preview
│   │   │   ├── Timeline/       # Transaction timeline
│   │   │   ├── Filters/        # Search and filter components
│   │   │   ├── Pagination/     # Pagination components
│   │   │   ├── Charts/         # Admin charts
│   │   │   ├── Risk/           # Risk assessment components
│   │   │   ├── Recommendation/ # AI recommendations
│   │   │   ├── Widgets/        # Dashboard widgets
│   │   │   └── ...             # Other shared components
│   │   ├── pages/              # Page components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Auth/           # Authentication pages
│   │   │   ├── Dashboard/      # User dashboard
│   │   │   ├── SendMoney/      # Send money page
│   │   │   ├── FraudResult/    # Fraud detection result
│   │   │   ├── Transactions/   # Transaction history
│   │   │   ├── Admin/          # Admin dashboard
│   │   │   └── UserProfile.jsx
│   │   ├── data/               # Mock data files
│   │   ├── context/            # React context providers
│   │   ├── services/           # API service layer
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx            # Entry point
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

## ✨ Features

### 🔐 Authentication System
- User registration with email verification
- Login with email/password
- OTP verification for secure access
- Forgot password functionality
- Protected routes with authentication guards
- Session management with React Context

### 💳 Payment & Transactions
- Send money to beneficiaries
- UPI ID-based transactions
- Real-time fraud detection
- Transaction summary before confirmation
- Payment processing with status tracking
- Receipt generation and download

### 🤖 AI Fraud Detection
- Real-time fraud probability analysis
- Risk level assessment (LOW, MEDIUM, HIGH, CRITICAL)
- Feature importance analysis
- AI-powered recommendations
- Suggested security actions
- Confidence scoring

### 📊 Analytics Dashboard
- Daily transaction trends
- Monthly spending analysis
- Transaction category breakdown
- Risk distribution visualization
- Fraud trend analysis
- Success vs failed payment ratios
- Feature importance charts
- Fraud heatmap by time/day

### 📋 Transaction History
- Comprehensive transaction listing
- Advanced search and filtering
- Date range selection
- Amount range filtering
- Multi-criteria sorting
- Detailed transaction view (side drawer)
- AI fraud analysis per transaction
- Transaction timeline with stages
- Receipt preview and download
- Print functionality
- Export to CSV
- Download reports
- Pagination support (10/25/50/100 rows)

### 👨‍💼 Admin Dashboard
- System overview with key metrics
- User management with search/filter
- Transaction monitoring
- Fraud detection statistics
- ML model performance metrics
- Feature importance analysis
- Fraud heatmap visualization
- Live activity feed
- Notifications panel
- Report generation and scheduling

### 🎨 UI/UX Features
- Premium dark theme
- Glassmorphism effects
- Smooth animations (Framer Motion)
- Responsive design
- Loading states with skeleton loaders
- Empty states with illustrations
- Professional tables with sorting
- Interactive charts with tooltips
- Modal dialogs
- Side drawers
- Toast notifications

## 📦 Modules

### 1. Landing Page (`/`)
- Hero section with call-to-action
- Feature highlights
- Security badges
- Responsive design
- Navigation to authentication

### 2. Authentication Pages
- **Login** (`/login`) - User login form
- **Register** (`/register`) - New user registration
- **OTP Verification** (`/verify-otp`) - Email verification
- **Forgot Password** (`/forgot-password`) - Password recovery

### 3. User Dashboard (`/dashboard`)
- Account overview
- Quick actions
- Recent transactions
- Balance summary
- Quick send money
- Fraud alerts
- Navigation to other features

### 4. Send Money (`/send-money`)
- Beneficiary selection
- Amount input
- Purpose selection
- Transaction summary
- Fraud risk preview
- OTP verification
- Payment confirmation
- Receipt generation

### 5. Fraud Detection Result (`/fraud-result`)
- Transaction outcome display
- Fraud probability gauge
- Risk level indicator
- Feature importance breakdown
- AI recommendations
- Suggested actions
- Transaction details
- Receipt options

### 6. Transaction History (`/transactions`)
- Page header with actions
- 8 statistics cards
- Advanced search and filter panel
- Professional transaction table (14 columns)
- Action buttons per row
- Transaction details side drawer
- AI fraud analysis card
- Transaction timeline
- Receipt preview modal
- 6 analytics charts
- Pagination
- Empty and loading states

### 7. Admin Dashboard (`/admin`)
- Admin sidebar navigation
- Top navbar with notifications
- Statistics cards (8 metrics)
- User management table
- Transaction management table
- ML performance panel
- Feature importance chart
- Fraud heatmap
- Live activity panel
- Notifications panel
- Report section
- Analytics charts (6 charts)

### 8. Merchant Dashboard (`/merchant`)
- Merchant-specific features
- Transaction monitoring
- Revenue analytics
- Customer insights

### 9. User Profile (`/profile`)
- User information management
- Security settings
- Transaction preferences
- Notification settings

## 🚀 Installation

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd UPI-FRAUD-DETECTION
```

2. **Install dependencies**
```bash
cd frontend
npm install
```

3. **Configure environment variables**
Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:8000/api
VITE_API_KEY=your-api-key-here
```

4. **Start development server**
```bash
npm run dev
```

5. **Build for production**
```bash
npm run build
```

## 🏃 Running the Project

### Development Mode
```bash
cd frontend
npm run dev
```
The application will be available at `http://localhost:5173`

### Production Build
```bash
cd frontend
npm run build
npm run preview
```

## 🔌 API Integration

### Current Status
- **Mock Data**: All data is currently using mock JSON files
- **Axios Placeholders**: API service layer is set up with Axios
- **No Backend**: Backend integration is not yet implemented

### API Endpoints (Planned)
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/verify-otp
POST   /api/auth/forgot-password
POST   /api/transactions/send
GET    /api/transactions/history
GET    /api/transactions/:id
POST   /api/fraud/analyze
GET    /api/analytics/daily
GET    /api/analytics/monthly
GET    /api/admin/users
GET    /api/admin/transactions
GET    /api/admin/stats
```

### Service Layer
The `services/` directory contains placeholder API service functions that can be easily connected to real backend endpoints.

## 📊 Data Flow

### Transaction Flow
1. User initiates transaction from Send Money page
2. Transaction data is collected and validated
3. Fraud detection API is called (mocked)
4. Risk analysis is performed
5. User is shown fraud risk preview
6. OTP verification is required
7. Payment is processed
8. Result is displayed with recommendations
9. Transaction is saved to history
10. Receipt is generated

### Authentication Flow
1. User registers with email/password
2. OTP is sent to email (mocked)
3. User verifies OTP
4. Account is created
5. User can login with credentials
6. Session is established
7. Protected routes are accessible

## 🔒 Security Features

### Implemented
- Protected routes with authentication guards
- OTP verification for transactions
- Password encryption (placeholder)
- Session management
- Fraud probability analysis
- Risk level assessment
- Transaction monitoring

### Planned
- Two-factor authentication (2FA)
- Biometric authentication
- Device fingerprinting
- IP-based restrictions
- Rate limiting
- Transaction limits
- Real-time alerts

## 📈 Analytics & Reporting

### User Analytics
- Daily transaction trends
- Monthly spending patterns
- Category-wise spending
- Risk distribution
- Success/failure ratios

### Admin Analytics
- System-wide transaction volume
- Fraud detection statistics
- User activity metrics
- ML model performance
- Feature importance
- Temporal fraud patterns
- Geographic distribution

### Reports
- Transaction reports (PDF)
- CSV export
- Custom report generation
- Scheduled reports
- Analytics download

## 🎯 Working Features

### ✅ Fully Functional
1. **Landing Page** - Complete with all sections
2. **Authentication System** - Login, Register, OTP, Forgot Password
3. **User Dashboard** - Overview, quick actions, recent transactions
4. **Send Money** - Complete payment flow with fraud preview
5. **Fraud Detection Result** - Full analysis with recommendations
6. **Transaction History** - Complete module with all features
7. **Admin Dashboard** - Comprehensive admin panel
8. **Merchant Dashboard** - Merchant-specific features
9. **User Profile** - Profile management
10. **All UI Components** - Reusable components library
11. **Analytics Charts** - 6 different chart types
12. **Pagination** - Full pagination support
13. **Search & Filter** - Advanced filtering capabilities
14. **Responsive Design** - Mobile-friendly layout
15. **Animations** - Smooth transitions and effects

### 🔄 Using Mock Data
- All data is currently using mock JSON files
- No real backend connection
- API calls are simulated with timeouts
- Data persistence is not implemented

### 📝 Code Quality
- Modular component structure
- Reusable components
- Clean code practices
- Consistent naming conventions
- Proper file organization
- Commented code where necessary

## 🔮 Future Enhancements

### Backend Integration
- Connect to real API endpoints
- Implement database (PostgreSQL/MongoDB)
- Add authentication middleware
- Implement real fraud detection ML model
- Add transaction processing
- Implement email services

### Advanced Features
- Real-time notifications (WebSocket)
- Push notifications
- Biometric authentication
- Voice authentication
- Multi-language support
- Currency conversion
- International transfers
- QR code payments
- NFC payments

### Security Enhancements
- Two-factor authentication
- Device management
- Login history
- Security alerts
- Transaction limits
- Anti-phishing measures
- Behavioral analysis

### Analytics Enhancements
- Real-time analytics
- Predictive analytics
- Custom dashboards
- Advanced filters
- Data export in multiple formats
- Scheduled reports
- API for third-party integrations

### Performance
- Code splitting
- Lazy loading
- Image optimization
- Caching strategy
- Service worker for PWA
- Offline support

## 📞 Support

For issues, questions, or contributions, please contact the development team.

## 📄 License

This project is proprietary and confidential.

---

**Version**: 1.0.0  
**Last Updated**: July 2026  
**Status**: Development Phase (Frontend Complete, Backend Pending)
