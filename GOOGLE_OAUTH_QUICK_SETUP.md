# Quick Google OAuth Setup

## Step 1: Google Cloud Console
1. Go to https://console.cloud.google.com/
2. Create new project or select existing
3. Enable Google+ API (APIs & Services > Library)

## Step 2: Create OAuth Credentials
1. Go to APIs & Services > Credentials
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Application type: Web application
4. Name: Vasavi Dental Care
5. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

## Step 3: Update Environment Variables
Replace in `.env.local`:
```
GOOGLE_CLIENT_ID=your-actual-client-id-from-step-2
GOOGLE_CLIENT_SECRET=your-actual-client-secret-from-step-2
NEXTAUTH_SECRET=vasavi-dental-secret-key-2024
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED=true
```

## Step 4: Test
1. Restart server: `npm run dev`
2. Go to `/admin/login`
3. Click "Continue with Google"
4. Sign in with `kommi.avanthi@gmail.com`

## Quick Test Credentials
If you want to test immediately without OAuth setup:
- Email: `admin@vasavi.com`
- Password: `admin123`

Your Gmail `kommi.avanthi@gmail.com` is pre-authorized for admin access via Google OAuth.