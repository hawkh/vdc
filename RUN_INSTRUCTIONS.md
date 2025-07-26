# How to Run Vasavi Dental Care Platform

## Quick Start Instructions

1. **Open Command Prompt or PowerShell as Administrator**
   - Press `Win + X` and select "Command Prompt (Admin)" or "PowerShell (Admin)"

2. **Navigate to the project directory**
   ```cmd
   cd "c:\Users\kommi\Downloads\studio-master\studio-master"
   ```

3. **Install dependencies** (first time only)
   ```cmd
   npm install
   ```

4. **Start the development server**
   ```cmd
   npm run dev
   ```

5. **Open your browser**
   - Go to: http://localhost:3000

## Alternative Setup Methods

### Method 1: Use the setup script
```cmd
setup-env.bat
```

### Method 2: Manual setup
```cmd
npm install
copy .env.local.example .env.local
npm run dev
```

## Environment Configuration

Before running, update `.env.local` with your actual values:
- MongoDB connection string
- Stripe API keys
- Google API credentials
- NextAuth secret

## Troubleshooting

If you encounter issues:
1. Ensure Node.js is installed and in PATH
2. Run as Administrator
3. Check firewall settings for port 3000
4. Verify all environment variables are set

## Features Available

- **Homepage**: Patient booking interface
- **Admin Dashboard**: `/admin` (requires login)
- **Patient Portal**: `/patient` (requires login)
- **API Health Check**: `/api/health`

The application is now ready with professional images and optimized configuration!