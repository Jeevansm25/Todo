import { type NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import * as bcrypt from 'bcrypt';

import { db } from '~/lib/db';

import { PAGES } from '~/lib/constants';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: PAGES.SIGN_IN
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: 'Credentials provider',
      credentials: {
        username: { label: 'username', type: 'text', required: true },
        password: { label: 'password', type: 'password', required: true }
      },
      async authorize(credentials, req) {
        if (!credentials) return null;

        try {
          const user = await db.user.findUnique({
            where: {
              username: credentials.username
            }
          });

          if (!user) {
            console.log('User not found:', credentials.username);
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isPasswordValid) {
            console.log('User authenticated successfully:', user.username);
            return {
              id: user.id,
              username: user.username
            };
          } else {
            console.log('Invalid password for user:', credentials.username);
            return null;
          }
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    }
  },
  debug: process.env.NODE_ENV === 'development',
} satisfies NextAuthOptions;
