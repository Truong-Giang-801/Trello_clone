'use server';

import { apiFetch } from '@/common/utils/fetch.util';
import { signIn, signOut } from '@/config/auth.config';
import { UserModel } from '../user/models/user.model';
import { SignInDto } from './sign-in/dto/sign-in.dto';

export const signInHandler = async (input: SignInDto) => {
  await signIn('credentials', {
    ...input,
    redirectTo: '/dashboard',
    redirect: true,
  });
};

export const signOutHandler = async () => {
  await signOut({
    redirect: true,
    redirectTo: '/auth/sign-in',
  });
};

export const getMe = async () => {
  return apiFetch<UserModel>(`${process.env.API_ENDPOINT}/auth/me`);
};
