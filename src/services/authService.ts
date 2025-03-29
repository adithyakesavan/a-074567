
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface User {
  id: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  email: string;
  password: string;
}

export const authService = {
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async login({ email, password }: LoginCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      throw error;
    }

    return data.user;
  },

  async signup({ email, password }: SignupCredentials) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      throw error;
    }

    toast.success('Account created! Check your email for verification instructions.');
    return data.user;
  },

  async logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error(error.message);
      throw error;
    }

    return true;
  },
};
