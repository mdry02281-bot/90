# PromoHive - Interactive Earning Platform 🚀

A modern, interactive, and mobile-first earning platform built with React, Node.js, and Prisma. Features dynamic animations, responsive design, and a comprehensive earning system.

## ✨ New Interactive Features

### 🎨 Enhanced UI/UX Design
- **Brand Colors**: Custom color scheme matching PromoHive logo (Blue #00d4ff to Pink #ff0080)
- **Glass Morphism**: Modern glass effects with backdrop blur
- **Gradient Backgrounds**: Dynamic gradient animations
- **Floating Elements**: Animated floating background elements
- **Smooth Transitions**: 300ms ease-out transitions throughout

### 📱 Mobile-First Responsive Design
- **Touch-Friendly**: 44px minimum touch targets for mobile
- **Responsive Grid**: Adaptive layouts for all screen sizes
- **Mobile Navigation**: Bottom navigation for mobile devices
- **Gesture Support**: Swipe and touch interactions

### 🎭 Interactive Animations
- **Fade In**: Smooth fade-in animations for content
- **Slide Up/Down**: Directional slide animations
- **Scale In**: Zoom-in effects for cards and buttons
- **Bounce In**: Playful bounce animations
- **Float**: Continuous floating animations
- **Glow**: Pulsing glow effects
- **Hover Effects**: Lift and glow on hover

### 🎯 Enhanced Components
- **Interactive Cards**: Hover effects with shadows and transforms
- **Animated Buttons**: Scale and glow effects
- **Loading States**: Shimmer animations and spinners
- **Progress Bars**: Smooth progress animations
- **Status Indicators**: Color-coded with animations
- **Toast Notifications**: Glass morphism styled notifications

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd promohive
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Setup database**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🎨 Design System

### Color Palette
```css
/* Brand Colors */
--brand-blue: #00d4ff;
--brand-pink: #ff0080;
--brand-gradient: linear-gradient(135deg, #00d4ff 0%, #ff0080 100%);

/* Status Colors */
--success: #22c55e;
--warning: #f59e0b;
--error: #ef4444;
--info: #3b82f6;
```

### Animation Classes
```css
/* Entrance Animations */
.animate-fade-in
.animate-slide-up
.animate-slide-down
.animate-scale-in
.animate-bounce-in

/* Continuous Animations */
.float-animation
.glow-effect
.hover-lift
.hover-glow
```

### Interactive Elements
```css
/* Buttons */
.btn-primary
.btn-secondary
.btn-touch

/* Cards */
.card-interactive
.card-glass
.dashboard-card
.task-card
```

## 📱 Mobile Optimization

### Touch Targets
- Minimum 44px touch targets
- Adequate spacing between interactive elements
- Touch-friendly form inputs

### Responsive Breakpoints
```css
/* Mobile First */
xs: 475px
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
3xl: 1600px
```

### Mobile Navigation
- Bottom navigation bar for mobile
- Collapsible sidebar for desktop
- Touch-optimized menu interactions

## 🎭 Animation System

### CSS Animations
- **Fade In**: 0.5s ease-in-out
- **Slide Up**: 0.3s ease-out
- **Scale In**: 0.2s ease-out
- **Bounce In**: 0.6s ease-out
- **Float**: 6s ease-in-out infinite
- **Glow**: 2s ease-in-out infinite alternate

### JavaScript Interactions
- Intersection Observer for scroll animations
- Custom cursor effects
- Smooth scrolling behavior
- Dynamic toast notifications

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run tests
npm run lint         # Run ESLint
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:seed      # Seed database
```

### Project Structure
```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── hooks/         # Custom React hooks
├── contexts/      # React contexts
├── lib/          # Utility libraries
├── services/     # API services
├── utils/        # Helper functions
└── styles/       # CSS and styling
```

## 🎯 Key Features

### Authentication
- Secure JWT-based authentication
- Magic link login support
- Admin approval system
- Role-based access control

### Earning System
- Multiple task types (Manual, AdGem, Adsterra, CPAlead)
- Multi-level referral system
- Level-based earning bonuses
- Instant USDT withdrawals

### Admin Panel
- User management
- Task creation and management
- Withdrawal approval system
- Analytics dashboard
- Platform settings

### Interactive Elements
- Real-time notifications
- Dynamic form validation
- Smooth page transitions
- Responsive data tables
- Interactive charts and graphs

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
JWT_ACCESS_SECRET="your-secret"
JWT_REFRESH_SECRET="your-refresh-secret"

# Email
EMAIL_HOST="smtp.gmail.com"
EMAIL_USER="your-email"
EMAIL_PASS="your-password"

# External APIs
ADGEM_APP_ID="your-app-id"
ADGEM_JWT_SECRET="your-jwt-secret"
ADSTERRA_API_KEY="your-api-key"
CPALEAD_API_KEY="your-api-key"

# Platform
PLATFORM_URL="https://your-domain.com"
```

## 🎨 Customization

### Brand Colors
Update the color scheme in `tailwind.config.js`:
```javascript
colors: {
  brand: {
    blue: '#00d4ff',
    pink: '#ff0080',
    gradient: 'linear-gradient(135deg, #00d4ff 0%, #ff0080 100%)',
  },
}
```

### Animations
Customize animations in `src/index.css`:
```css
@keyframes customAnimation {
  0% { /* start state */ }
  100% { /* end state */ }
}
```

### Components
All components are built with Tailwind CSS and can be easily customized by modifying the className props.

## 📊 Performance

### Optimization Features
- Lazy loading for images
- Code splitting for routes
- Optimized bundle size
- Efficient re-renders
- Smooth 60fps animations

### Mobile Performance
- Touch-optimized interactions
- Reduced motion support
- Efficient scrolling
- Battery-friendly animations

## 🔒 Security

### Security Features
- HTTPS enforcement
- Secure cookie settings
- Input validation with Zod
- SQL injection prevention
- XSS protection
- CSRF protection

## 📱 Browser Support

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Mobile Support
- iOS Safari 14+
- Chrome Mobile 90+
- Samsung Internet 13+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information
4. Contact support at support@promohive.com

---

**PromoHive** - Where earning meets innovation! 🚀💰