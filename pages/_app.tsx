import * as React from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useAuthState, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth, db } from '../config/firebase';
import Login from './login';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

export default function App({ Component, pageProps }: AppProps) {
  const [user, loading, error] = useAuthState(auth);

  React.useEffect(() => {
    const setUserInfomation = async () => {
      try {
        await setDoc(
          doc(db, 'users', user?.email as string),
          {
            email: user?.email,
            photoURL: user?.photoURL,
            lastSeen: serverTimestamp(),
          },
          {
            merge: true,
          },
        );
      } catch (error) {
        console.log('Error setUserInfomation: ', error);
      }
    };
    if (user) setUserInfomation();
  }, [user]);

  if (!user) return <Login />;

  return <Component {...pageProps} />;
}
