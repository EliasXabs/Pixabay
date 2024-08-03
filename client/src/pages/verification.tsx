import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { checkVerificationStatus } from '../api'; // Import the API function

const VerificationPage = () => {
  const router = useRouter();
  const { email } = router.query;
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      if (email) {
        try {
          const { verified } = await checkVerificationStatus(email as string);
          setIsVerified(verified);

          if (verified) {
            router.push('/home');
          }
        } catch (error) {
          console.error('Error checking verification status:', error);
        }
      }
    };

    const intervalId = setInterval(checkStatus, 10000); // Check every 10 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [email, router]);

  const handleCheckVerification = async () => {
    if (email) {
      try {
        const { verified } = await checkVerificationStatus(email as string);
        setIsVerified(verified);

        if (verified) {
          router.push('/home');
        }
      } catch (error) {
        console.error('Error checking verification status:', error);
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
