import { getMe } from '@/modules/auth/auth.service';
import { UserModel } from '@/modules/user/models/user.model';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, signIn, signOut, auth } = NextAuth({
  return null
});
