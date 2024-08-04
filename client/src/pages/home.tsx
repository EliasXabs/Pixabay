// pages/home.tsx
import { GetServerSideProps } from 'next';
import { withAuth } from '../lib/authhelpers';

const HomePage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="text-3xl font-bold">
      Home
    </div>
  </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return withAuth(context);
};

export default HomePage;
