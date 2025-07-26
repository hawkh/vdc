# Vasavi Dental Care - Healthcare Booking Platform

A modern healthcare booking and management platform built with Next.js, designed specifically for Vasavi Dental Care in Kamareddy, Telangana.

## Features

- **Patient Booking System**: Easy online appointment booking with real-time availability
- **Admin Dashboard**: Comprehensive appointment management for healthcare providers
- **Treatment Plans**: Patient treatment tracking and progress monitoring
- **Payment Integration**: Secure payment processing with Stripe and UPI options
- **Google Calendar Integration**: Automatic calendar synchronization
- **WhatsApp Integration**: Automated reminders and communication
- **Responsive Design**: Mobile-first design for all devices

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Authentication**: NextAuth.js
- **Database**: MongoDB with Mongoose
- **Payment**: Stripe, UPI integration
- **APIs**: Google Calendar, Google Sheets
- **Deployment**: Vercel, Firebase Hosting

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd studio-master
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.local.example .env.local
   ```
   Update the environment variables with your actual values.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

Required environment variables (see `.env.local.example`):

- `NEXTAUTH_URL` - Your application URL
- `NEXTAUTH_SECRET` - NextAuth secret key
- `MONGODB_URI` - MongoDB connection string
- `STRIPE_SECRET_KEY` - Stripe secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `GOOGLE_SERVICE_ACCOUNT_CREDENTIALS` - Google service account JSON
- `GOOGLE_SHEET_ID` - Google Sheets ID for appointments
- `CALENDAR_ID` - Google Calendar ID

## Project Structure

```
src/
├── app/                 # Next.js app router
│   ├── admin/          # Admin dashboard pages
│   ├── patient/        # Patient portal pages
│   ├── booking/        # Booking system
│   └── api/            # API routes
├── components/         # Reusable UI components
│   └── ui/            # Base UI components
├── lib/               # Utility functions and data
├── hooks/             # Custom React hooks
├── services/          # External service integrations
└── types/             # TypeScript type definitions
```

## Key Features

### For Patients
- Online appointment booking
- Treatment plan viewing
- Appointment history
- Secure payment processing

### For Administrators
- Appointment management
- Patient records
- Calendar integration
- Payment tracking
- WhatsApp reminders

## Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Firebase Hosting
```bash
npm run build
firebase deploy
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is proprietary software for Vasavi Dental Care.

## Support

For technical support, contact the development team or visit [Vasavi Dental Care](https://vasavidentalcare.com).

## Contact

**Vasavi Dental Care**  
Nizamsagar Chowrasta, Kamareddy, Telangana  
Phone: 9676118880