# PromoHive - Global Promo Network Platform

![PromoHive Logo](https://via.placeholder.com/200x80/00d4ff/ffffff?text=PromoHive)

A modern, interactive platform for earning money through promotional tasks, referrals, and multi-level marketing.

## 🚀 Features

- **Interactive UI/UX**: Modern animations, responsive design, brand colors
- **Authentication**: Secure JWT-based auth with magic links
- **Task Management**: Manual tasks, AdGem, Adsterra, CPAlead integrations
- **Referral System**: Multi-level referral rewards
- **Admin Panel**: Complete management dashboard
- **Supabase Integration**: Modern database with real-time capabilities
- **Mobile-First**: Responsive design for all devices

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT, bcrypt, magic links
- **State Management**: Zustand, React Query
- **UI Components**: Custom components with animations
- **Deployment**: Netlify (Frontend), Supabase (Backend)

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Netlify account

## 🔧 Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/nyttynt96-art/1.git
cd promohive
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Supabase Setup

#### A. Create Supabase Project
1. Go to [Supabase](https://supabase.com)
2. Create new project
3. Note your project URL and API keys

#### B. Run Database Schema
1. Open Supabase SQL Editor
2. Copy and run `supabase-schema.sql`
3. Copy and run `supabase-data.sql`

#### C. Get Database Password
1. Go to Settings → Database
2. Copy the database password
3. Update `env.supabase` with your password

### 4. Environment Configuration
```bash
cp env.supabase .env
# Edit .env with your actual values
```

### 5. Generate Prisma Client
```bash
npm run prisma:generate
```

## 🚀 Development

### Start Development Server
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:5173
- Backend: http://localhost:3002

### Build for Production
```bash
npm run build
```

## 📊 Database Schema

The application uses the following main tables:
- `users` - User accounts and profiles
- `wallets` - User balances and transactions
- `tasks` - Available tasks and offers
- `user_tasks` - User task assignments
- `proofs` - Task completion proofs
- `referrals` - Referral relationships
- `withdrawals` - Withdrawal requests
- `admin_actions` - Admin activity logs

## 🔐 Authentication

- **Signup**: Full name, username, email, password, gender, birthdate
- **Admin Approval**: All users require admin approval
- **Magic Links**: Passwordless login option
- **Roles**: USER, ADMIN, SUPER_ADMIN
- **JWT Tokens**: Access + refresh token system

## 💰 Earning System

### Tasks
- **Manual Tasks**: Social media, downloads, surveys
- **AdGem Integration**: Automated offer imports
- **Adsterra Integration**: Revenue tracking
- **CPAlead Integration**: CPA offers

### Referrals
- **Multi-level**: 3 levels of referral rewards
- **Bonuses**: Referrer and referee bonuses
- **Level System**: L0, L1, L2, L3 with upgrade costs

### Withdrawals
- **USDT Only**: Cryptocurrency withdrawals
- **Minimum**: $10 balance required
- **Admin Approval**: All withdrawals require approval

## 🎨 UI/UX Features

### Interactive Animations
- **5 Levels**: Interactive → Advanced → Quantum → Ultra → Ultra-Advanced
- **Hover Effects**: Smooth transitions and glows
- **Scroll Animations**: Intersection Observer triggers
- **Particle Systems**: Background effects
- **Custom Cursor**: Interactive cursor effects

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Breakpoints**: sm, md, lg, xl, 2xl
- **Touch-Friendly**: Mobile-optimized interactions
- **Performance**: 60fps animations

### Brand Colors
- **Primary**: #00d4ff (Brand Blue)
- **Secondary**: #ff0080 (Brand Pink)
- **Gradients**: Smooth color transitions
- **Status Colors**: Success, warning, error

## 🚀 Deployment to Netlify

### Step 1: Prepare Repository
```bash
# Add all files to git
git add .
git commit -m "Initial PromoHive setup with Supabase"
git push origin main
```

### Step 2: Netlify Setup
1. Go to [Netlify](https://netlify.com)
2. Click "New site from Git"
3. Connect your GitHub account
4. Select repository: `nyttynt96-art/1`

### Step 3: Build Settings
- **Build Command**: `npm run build:client`
- **Publish Directory**: `dist`
- **Node Version**: `18`

### Step 4: Environment Variables
Add these in Netlify Site Settings → Environment Variables:
```
NODE_ENV=production
VITE_SUPABASE_URL=https://jxtutquvxmkrajfvdbab.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4dHV0cXV2eG1rcmFqZnZkYmFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0NDA5MjcsImV4cCI6MjA3NzAxNjkyN30.jLMQWJqwj6Amja-bsBmLwZjmTHgusL_1q2n_ZThbRrM
```

### Step 5: Deploy
1. Click "Deploy site"
2. Wait for build to complete
3. Your site will be available at: `https://your-site-name.netlify.app`

## 🔧 Backend Deployment (Optional)

For production backend, you can deploy to:
- **Vercel**: Serverless functions
- **Railway**: Full-stack hosting
- **Heroku**: Traditional hosting
- **DigitalOcean**: VPS hosting

## 📱 Mobile App (Future)

The platform is designed to support mobile apps:
- React Native compatibility
- API-first architecture
- Responsive web app works on mobile

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 📈 Analytics

The admin panel includes:
- **7-day Charts**: Revenue, users, tasks
- **Real-time Stats**: Live data updates
- **Export Features**: CSV/PDF reports
- **User Analytics**: Behavior tracking

## 🔒 Security Features

- **bcrypt**: Password hashing
- **JWT**: Secure token system
- **Helmet**: Security headers
- **CORS**: Cross-origin protection
- **Rate Limiting**: API protection
- **Input Validation**: Zod schemas
- **SQL Injection**: Prisma protection

## 📞 Support

- **Email**: support@promohive.com
- **Telegram**: @PromoHiveSupport
- **Discord**: https://discord.gg/promohive

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 🎯 Roadmap

- [ ] Mobile app development
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] API documentation
- [ ] Webhook integrations
- [ ] Advanced admin features

---

**PromoHive** - Where promotions meet innovation! 🚀
