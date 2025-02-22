import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import dotenv from 'dotenv';

// .env.local dosyasını yükle
dotenv.config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function createAdminUser() {
  try {
    const email = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const password = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error('Email ve şifre .env.local dosyasında tanımlanmalıdır');
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('Admin kullanıcısı başarıyla oluşturuldu:', userCredential.user.email);
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('Bu email adresi zaten kullanımda');
    } else {
      console.error('Hata:', error);
    }
  }
}

createAdminUser(); 