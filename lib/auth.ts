import { NextAuthOptions, User as NextAuthUser } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions['adapter'],
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ''
    })
  ],
  session: { strategy: 'database' },
  callbacks: {
    async session({ session, user }) {
      if (session?.user) {
        session.user.id = user.id;
      }
      return session;
    }
  }
};

export type SessionUser = NextAuthUser & { id: string };
