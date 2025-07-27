import NextAuth, { DefaultSession, NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
    } & DefaultSession['user'];
  }

  interface User {
    role: string;
  }
}

// Pre-authorized admin emails
const ADMIN_EMAILS = [
  'kommi.avanthi@gmail.com',
  'admin@vasavi.com'
];

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
          scope: 'openid email profile https://www.googleapis.com/auth/calendar',
        },
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Demo admin credentials
        if (credentials.email === 'admin@vasavi.com' && credentials.password === 'admin123') {
          return {
            id: '1',
            name: 'Dr. Rakesh Gupta',
            email: 'admin@vasavi.com',
            role: 'admin',
          };
        }

        // Your Gmail access
        if (credentials.email === 'kommi.avanthi@gmail.com') {
          return {
            id: '2',
            name: 'Kommi Avanthi',
            email: 'kommi.avanthi@gmail.com',
            role: 'admin',
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/admin/login', 
    error: '/admin/login', 
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Always allow credentials provider (email/password)
      if (account?.provider === 'credentials') {
        return true;
      }

      // Handle Google OAuth sign in
      if (account?.provider === 'google') {
        const email = user.email || profile?.email;
        
        if (!email) {
          return false;
        }

        // Only allow pre-authorized admin emails for Google OAuth
        if (ADMIN_EMAILS.includes(email)) {
          return true;
        }
        
        return false;
      }

      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role;
      }
      
      // Handle Google OAuth for authorized emails
      if (account?.provider === 'google' && ADMIN_EMAILS.includes(token.email as string)) {
        token.role = 'admin';
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      
      return token;
    },
    
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Redirect to admin dashboard after successful login
      if (url === baseUrl || url === `${baseUrl}/`) {
        return `${baseUrl}/admin`;
      }
      
      if (url.startsWith(baseUrl)) {
        return url;
      }
      
      return `${baseUrl}/admin`;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };