  import { NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';

const CLOVER_API_KEY = process.env.CLOVER_API_KEY!;
const CLOVER_API_SECRET = process.env.CLOVER_API_SECRET!;
const CLOVER_API_BASE_URL = process.env.CLOVER_API_BASE_URL!;

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: 'clover',
      name: 'Clover',
      type: 'oauth',
      wellKnown: `${CLOVER_API_BASE_URL}/.well-known/openid-configuration`,
      authorization: {
        params: {
          scope: 'merchant:write merchant:read orders:write orders:read inventory:write inventory:read customers:write customers:read'
        }
      },
      clientId: CLOVER_API_KEY,
      clientSecret: CLOVER_API_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          merchantId: profile.merchant_id
        };
      },
    },
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token as string,
          refreshToken: account.refresh_token as string,
          merchantId: account.merchantId as string,
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          accessToken: token.accessToken as string | undefined,
          refreshToken: token.refreshToken as string | undefined,
          merchantId: token.merchantId as string | undefined,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
};

declare module 'next-auth' {
  interface Session {
    user: {
      accessToken?: string;
      refreshToken?: string;
      merchantId?: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
    };
  }
}