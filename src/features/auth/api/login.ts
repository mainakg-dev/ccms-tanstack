import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { useAuthStore } from '@/store/useAuthStore';
import type { LoginCredentials, AuthResponse } from '../types';

export const loginFn = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  return apiClient.post('/loginRoute', credentials);
};

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: loginFn,
    onSuccess: (data) => {
      setAuth(data.user);
      // We could also store token in cookies or state if needed
    },
  });
};
