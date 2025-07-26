# Google OAuth Setup

## Quick Setup Instructions

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** or select existing one
3. **Enable Google+ API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. **Create OAuth 2.0 credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

## Environment Variables

Add to `.env.local`:
```
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000
```

## Demo Mode

The Google sign-in button is now available on the admin login page. Without proper credentials, it will show an error, but the demo credentials still work:

- **Email**: admin@vasavi.com
- **Password**: admin123

## Production Setup

For production deployment:
1. Update redirect URI to your production domain
2. Add production domain to authorized origins
3. Use secure NEXTAUTH_SECRET (generate with: `openssl rand -base64 32`)

The Google sign-in button is now visible on `/admin/login` with proper Google branding and styling.