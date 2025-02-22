import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut,
  User 
} from 'firebase/auth';

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user?.email);
      setIsAdmin(user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Debug için email karşılaştırmasını kontrol edelim
      console.log('Giriş yapan kullanıcı:', userCredential.user.email);
      console.log('Beklenen admin email:', process.env.NEXT_PUBLIC_ADMIN_EMAIL);
      console.log('Eşleşiyor mu:', userCredential.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL);
      
      if (userCredential.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        setIsAdmin(true);
        return true;
      } else {
        await signOut(auth); // Yetkisiz kullanıcıyı çıkış yaptır
        throw new Error('Yetkisiz erişim');
      }
    } catch (err) {
      console.error('Giriş hatası:', err);
      setError(err instanceof Error ? err.message : 'Giriş başarısız');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setIsAdmin(false);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Çıkış başarısız');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { isAdmin, loading, error, login, logout };
} 