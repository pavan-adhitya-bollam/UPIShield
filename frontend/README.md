# UPI Fraud Detection System - Frontend

A modern, production-ready fintech frontend for the Intelligent UPI Risk Assessment and Fraud Detection System.

## 🚀 Tech Stack

- **React 19** - Latest React features and performance improvements
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **React Router** - Client-side routing for navigation
- **Framer Motion** - Smooth animations and transitions
- **React Icons** - Beautiful icon library (Lucide icons)
- **Recharts** - Responsive charting library for data visualization
- **Axios** - HTTP client for API integration

## 🎨 Design Features

- **Dark Theme** - Premium dark background with purple/blue gradient accents
- **Glassmorphism** - Modern glass-like card effects with backdrop blur
- **Responsive Design** - Mobile-first approach for all screen sizes
- **Smooth Animations** - Framer Motion powered transitions
- **Professional Typography** - Clean, readable fonts
- **Rounded Corners** - Modern UI with consistent border radius

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   ├── Navbar.jsx
│   │   └── StatCard.jsx
│   ├── pages/               # Page components
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── UserDashboard.jsx
│   │   ├── SendMoney.jsx
│   │   ├── FraudResult.jsx
│   │   ├── TransactionHistory.jsx
│   │   ├── UserProfile.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── MerchantDashboard.jsx
│   ├── data/                # Dummy data
│   │   └── dummyData.js
│   ├── App.jsx              # Main app component with routing
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
└── postcss.config.js        # PostCSS configuration
```

## 🛠️ Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## 📦 Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 🌐 Pages

### Public Pages
- **Landing Page** - Hero section, features, how it works, CTA
- **Login** - User authentication
- **Register** - New user registration

### User Dashboard
- **Dashboard** - Overview with stats, charts, recent transactions
- **Send Money** - UPI transfer with fraud protection
- **Fraud Result** - Detailed fraud analysis and recommendations
- **Transaction History** - Complete transaction list with filters
- **Profile** - User settings and account management

### Admin Dashboard
- **Admin Dashboard** - System monitoring, user management, alerts
- **Merchant Dashboard** - Business analytics, order management

## 🎨 Components

### Reusable Components

- **Button** - Primary, secondary, danger, and ghost variants
- **Card** - Glassmorphism cards with hover effects
- **Input** - Form inputs with icons and labels
- **Modal** - Reusable modal component
- **Navbar** - Responsive navigation with mobile menu
- **StatCard** - Statistics display with trends

## 📊 Features

### User Dashboard
- Real-time balance and spending overview
- Fraud detection statistics
- Interactive charts (Line, Pie, Bar)
- Recent transactions table
- Quick actions
- Search and filter functionality

### Fraud Detection
- Real-time fraud probability calculation
- Risk level assessment (Low, Medium, High)
- Feature importance analysis
- Suggested actions
- Transaction details
- Confidence scores

### Admin Dashboard
- System-wide statistics
- Fraud trend analysis
- Real-time alerts
- System health monitoring
- User management
- Quick actions

### Merchant Dashboard
- Revenue tracking
- Order management
- Product analytics
- Customer satisfaction metrics
- Fraud rate monitoring

## 🔐 Security Features

- Two-factor authentication UI
- Login notifications
- Transaction alerts
- Device verification indicators
- Security settings panel

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:
- Primary colors (blue shades)
- Accent colors (purple shades)
- Dark theme colors
- Gradient definitions

### Components
All components are modular and can be customized in `src/components/`

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🚀 Deployment

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Deploy the dist folder
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 📝 API Integration

The frontend is ready for backend integration. Update the API calls in:
- `src/pages/` - Replace dummy data with API calls
- Use Axios for HTTP requests
- Add loading states and error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is part of a Final Year Project for academic purposes.

## 👨‍💻 Author

Final Year Project - Intelligent UPI Risk Assessment and Fraud Detection System
