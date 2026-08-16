// ============================================================
// SIGNAVERSE — Custom Hook: useAuth
// ============================================================

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api/authApi';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import type { LoginPayload, RegisterPayload } from '../types/auth';

export function useAuth() {
  const { user, token, isAuthenticated, setAuth, clearAuth } = useAuthStore();
  const addToast = useUIStore((s) => s.addToast);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      queryClient.invalidateQueries({ queryKey: ['me'] });
      addToast({ type: 'success', title: `Welcome back, ${data.user.profile.displayName}!` });
      if (data.user.role === 'TEACHER' || data.user.role === 'ADMIN') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/app/home');
      }
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      addToast({
        type: 'error',
        title: 'Login failed',
        message: error.response?.data?.error ?? 'Invalid credentials',
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      addToast({ type: 'success', title: `Welcome to SignaVerse, ${data.user.profile.displayName}! 🎉` });
      if (data.user.role === 'TEACHER' || data.user.role === 'ADMIN') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/app/home');
      }
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      addToast({
        type: 'error',
        title: 'Registration failed',
        message: error.response?.data?.error ?? 'Something went wrong',
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      clearAuth();
      queryClient.clear();
      navigate('/login');
    },
  });

  const { data: currentUser, isLoading: isLoadingUser } = useQuery({
    queryKey: ['me'],
    queryFn: authApi.me,
    enabled: !!token,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const login = (payload: LoginPayload) => loginMutation.mutate(payload);
  const register = (payload: RegisterPayload) => registerMutation.mutate(payload);
  const logout = () => logoutMutation.mutate();

  return {
    user: currentUser ?? user,
    isAuthenticated,
    isLoading: loginMutation.isPending || registerMutation.isPending || isLoadingUser,
    login,
    register,
    logout,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
}
