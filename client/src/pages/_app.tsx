// pages/_app.tsx
import '../app/globals.css';
import type { AppProps } from 'next/app';
import Navbar from '../components/navbar';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const noNavbarRoutes = ['/auth', '/verification', '/forgot-password', '/reset-password'];

  const isNavbarVisible = !noNavbarRoutes.includes(router.pathname);

  return (
    <>
      {isNavbarVisible && <Navbar />}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
