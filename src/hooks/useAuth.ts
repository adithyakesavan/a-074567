
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService, LoginCredentials, SignupCredentials } from '@/services/authService';

export function useAuth() {
  const queryClient = useQueryClient();
  
  const userQuery = useQuery({
    queryKey: ['currentUser'],
    queryFn: authService.getCurrentUser,
  });
  
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
  
  const signupMutation = useMutation({
    mutationFn: (credentials: SignupCredentials) => authService.signup(credentials),
  });
  
  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
  
  return {
    user: userQuery.data,
    isLoading: userQuery.isLoading,
    isAuthenticated: !!userQuery.data,
    login: loginMutation.mutate,
    signup: signupMutation.mutate,
    logout: logoutMutation.mutate,
  };
}
