import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/lib/validations";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Validate input
          const validatedFields = loginSchema.safeParse(credentials);
          
          if (!validatedFields.success) {
            return null;
          }

          const { email, password } = validatedFields.data;

          // Get user from database
          const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

          if (error || !user) {
            return null;
          }

          // Verify password
          const isValidPassword = await bcrypt.compare(password, user.password_hash);

          if (!isValidPassword) {
            return null;
          }

          // Return user object
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    authorized: async ({ auth, request }) => {
      const { pathname } = request.nextUrl;
      
      // Allow access to login page and API routes
      if (pathname === '/admin/login' || pathname.startsWith('/api/')) {
        return true;
      }
      
      // Protect /admin routes
      if (pathname.startsWith('/admin')) {
        return !!auth?.user && auth.user.role === 'admin';
      }
      
      // Allow all other routes
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
});
