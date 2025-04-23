import { getMe } from '@/modules/auth/auth.service';
import { UserModel } from '@/modules/user/models/user.model';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: '/auth/sign-in',
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const response = await apiFetch<{
            user: UserModel;
            access_token: string;
          }>(`${process.env.API_ENDPOINT}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({
              username: credentials?.email,
              password: credentials?.password,
            }),
          });

          if (!response) {
            return null;
          }

          return {
            ...(response.user as any),
            name: response.user.userProfile.name,
            jwt: response.access_token,
          };
        } catch (e) {
          console.error(e);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (trigger === 'update') {
        const updatedUser = await getMe();
        token.user = {
          ...(updatedUser as any),
          email: updatedUser.email,
          name: updatedUser.userProfile.name,
          image: updatedUser.userProfile.avatar,
          jwt: token.jwt,
        };
      } else if (user) {
        token.user = user;
        token.jwt = user.jwt;
      }

      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user = token.user as any;
        session.jwt = token.jwt;
      }

      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
});
