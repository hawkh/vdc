# Missing Dependencies Installation

## Required Packages

Run the following command to install missing dependencies:

```bash
npm install @next-auth/mongodb-adapter mongodb bcryptjs
```

## Package Details

- **@next-auth/mongodb-adapter**: NextAuth MongoDB adapter for session storage
- **mongodb**: MongoDB driver for Node.js
- **bcryptjs**: Password hashing library

## Alternative Installation

If npm is not available in PATH, you can:

1. Open Command Prompt/PowerShell as Administrator
2. Navigate to project directory: `cd "c:\Users\kommi\Downloads\studio-master\studio-master"`
3. Run: `npm install @next-auth/mongodb-adapter mongodb bcryptjs`

## Fallback Behavior

The application includes fallback demo credentials that work without database:
- **Email**: admin@vasavi.com
- **Password**: admin123

The system will attempt database authentication first, then fall back to demo credentials if database is unavailable.

## Environment Variables

Add to `.env.local`:
```
MONGODB_URI=mongodb://localhost:27017/vasavi-dental
NEXTAUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```