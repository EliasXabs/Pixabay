import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { checkVerificationStatus } from '../api'; // Import the API function
import Cookies from 'js-cookie';

const VerificationPage = () => {
  const router = useRouter();
  const { email } = router.query;
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      if (email) {
        try {
          const response = await checkVerificationStatus(email as string);
          const { verified, accessToken, refreshToken } = response;

          if (verified) {
            setIsVerified(true);
            Cookies.set('accessToken', accessToken);
            Cookies.set('refreshToken', refreshToken);
            router.push('/home');
          }
        } catch (error) {
          console.error('Error checking verification status:', error);
          setError('Failed to verify email. Please try again.');
        }
      }
    };

    const intervalId = setInterval(checkStatus, 10000); // Check every 10 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [email, router]);

  const handleCheckVerification = async () => {
    if (email) {
      try {
        const response = await checkVerificationStatus(email as string);
        const { verified, accessToken, refreshToken } = response;

        if (verified) {
          setIsVerified(true);
          Cookies.set('accessToken', accessToken);
          Cookies.set('refreshToken', refreshToken);
          router.push('/home');
        }
      } catch (error) {
        console.error('Error checking verification status:', error);
        setError('Failed to verify email. Please try again.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Please Verify Your Email</h2>
        <p className="mb-4">
          We have sent a verification link to your email:
          <span className="block font-semibold text-blue-500 mt-2">
            {email || 'your-email@example.com'}
          </span>
        </p>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          className="mt-4 bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600 transition-colors"
          onClick={handleCheckVerification}
        >
          I have already verified
        </button>
      </div>
    </div>
  );
};

export default VerificationPage;
