import { useMutation } from '@tanstack/react-query';
import { authService, type SignupInput } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';

export function useLogin() {
  const signIn = useAuthStore((state) => state.signIn);
  return useMutation({ mutationFn: authService.login, onSuccess: signIn });
}

export function useSignup() {
  const signIn = useAuthStore((state) => state.signIn);
  const setFavoriteGenres = useUserStore((state) => state.setFavoriteGenres);
  return useMutation({
    mutationFn: (input: SignupInput) => authService.signup(input),
    onSuccess: (session, input) => {
      setFavoriteGenres(input.genres);
      signIn(session);
    },
  });
}

export function useSocialLogin() {
  const signIn = useAuthStore((state) => state.signIn);
  return useMutation({ mutationFn: authService.socialLogin, onSuccess: signIn });
}

export function usePasswordReset() {
  return useMutation({ mutationFn: authService.requestPasswordReset });
}
