// src/pages/profile.tsx
import { useEffect, useState } from 'react';
import { getProfile } from '../api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

interface UserProfile {
  id: number;
  username: string;
  email: string;
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const accessToken = Cookies.get('accessToken');
      if (!accessToken) {
        router.push('/auth');
        return;
      }

      try {
        const userProfile = await getProfile(accessToken);
        setProfile(userProfile);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch profile');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <p><strong>Username:</strong> {profile?.username}</p>
        <p><strong>Email:</strong> {profile?.email}</p>
      </div>
    </div>
  );
};

export default ProfilePage;
