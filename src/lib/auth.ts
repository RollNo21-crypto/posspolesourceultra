// import React from 'react'
// import { supabase } from './supabase/client'
// import { toast } from 'react-hot-toast'

// // Admin credentials - in a real app, this would be handled by environment variables
// const ADMINS = [
//   { email: 'admin@rfqmarket.com', password: 'admin123' },
//   { email: 'kiran@posspole.com', password: 'kiran@123' },
// ];


// export async function signIn(email: string, password: string) {
//   try {
//     // First check if credentials match admin
//     if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
//       throw new Error('Invalid credentials')
//     }

//     // Try to sign in with Supabase
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password
//     })
    
//     if (error) {
//       // If user doesn't exist, create it
//       if (error.message.includes('Invalid login credentials')) {
//         const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
//           email,
//           password,
//           options: {
//             data: {
//               role: 'admin'
//             }
//           }
//         })
        
//         if (signUpError) throw signUpError
//         return signUpData
//       }
//       throw error
//     }
    
//     return data
//   } catch (error) {
//     console.error('Sign in error:', error)
//     throw error
//   }
// }

// export async function signOut() {
//   try {
//     const { error } = await supabase.auth.signOut()
//     if (error) throw error
//   } catch (error) {
//     console.error('Sign out error:', error)
//     throw error
//   }
// }

// export async function checkIsAdmin() {
//   try {
//     const { data: { user } } = await supabase.auth.getUser()
//     return user?.email === ADMIN_EMAIL
//   } catch {
//     return false
//   }
// }

// export function useIsAdmin() {
//   const [isAdmin, setIsAdmin] = React.useState(false)

//   React.useEffect(() => {
//     checkIsAdmin().then(setIsAdmin)

//     // Subscribe to auth state changes
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
//       checkIsAdmin().then(setIsAdmin)
//     })

//     return () => {
//       subscription.unsubscribe()
//     }
//   }, [])

//   return isAdmin
// }

import React from 'react'
import { supabase } from './supabase/client'
import { toast } from 'react-hot-toast'

// Admin credentials - ideally, this should be in environment variables
const ADMINS = [
  { email: 'admin@rfqmarket.com', password: 'admin123' },
  { email: 'kiran@posspole.com', password: 'kiran@123' },
];

export async function signIn(email: string, password: string) {
  try {
    // Validate admin credentials
    const isAdmin = ADMINS.some(admin => admin.email === email && admin.password === password);
    if (!isAdmin) {
      throw new Error('Invalid credentials');
    }

    // Try to sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      // If user doesn't exist, create it
      if (error.message.includes('Invalid login credentials')) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { role: 'admin' } },
        });
        
        if (signUpError) throw signUpError;
        return signUpData;
      }
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

export async function checkIsAdmin() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user ? ADMINS.some(admin => admin.email === user.email) : false;
  } catch {
    return false;
  }
}

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    checkIsAdmin().then(setIsAdmin);

    // Subscribe to auth state changes
    const { data } = supabase.auth.onAuthStateChange(() => {
      checkIsAdmin().then(setIsAdmin);
    });

    // Fix: Properly unsubscribe from auth state changes
    return () => {
      data?.subscription?.unsubscribe();
    };
  }, []);

  return isAdmin;
}